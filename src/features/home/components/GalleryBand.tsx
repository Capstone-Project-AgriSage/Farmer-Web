import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import Reveal from '../../../components/ui/Reveal'
import SectionHeader from '../../../components/ui/SectionHeader'
import { useMediaQuery } from '../../../motion/useMediaQuery'
import { useMotionPolicy } from '../../../motion/useMotionPolicy'
import '../../../shaders/threeui.css'

// The Three.js scene is large (about 110 KB gzipped) and costly to start: download, script evaluation, WebGL context,
// shaders, picture uploads. Doing all of it when the section came near the screen froze the scroll for up to half a
// second. Now the module is fetched and the scene built while the page is idle, a few seconds after it opened; the
// render loop itself still only runs while the section is on screen.
const loadGallery = () => import('../../../shaders/gallery/Gallery')
const Gallery = lazy(() => loadGallery().then((module) => ({ default: module.Gallery })))

/** Runs `task` when the browser is idle (or after a short wait where requestIdleCallback is missing). */
function whenIdle(task: () => void, timeout: number) {
  // Safari has no requestIdleCallback.
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(task, { timeout })
    return () => window.cancelIdleCallback(id)
  }
  const id = setTimeout(task, 200)
  return () => clearTimeout(id)
}

// Wait this long after the home page opens before preparing the gallery, so the hero entrance has the CPU to itself.
const WARM_UP_DELAY_MS = 2500
// Each warm-up step blocks the main thread for a moment (up to ~0.5 s on a slow computer). It only starts once the visitor
// has not scrolled or pressed a key for this long, so it never lands in the middle of a scroll.
const CALM_MS = 1200

/**
 * Prepares the gallery ahead of time on desktop with full motion (smooth scrolling runs on the main thread there, so a
 * long task would freeze the page). Phones, Save-Data and reduced motion keep loading it when it comes near the screen:
 * they scroll natively, which keeps moving during a long task, and they should not download it if they never get there.
 */
function useIdleWarmUp(enabled: boolean) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!enabled) return
    let lastActivity = performance.now()
    const onActivity = () => {
      lastActivity = performance.now()
    }
    const events = ['wheel', 'scroll', 'touchmove', 'keydown'] as const
    events.forEach((name) => window.addEventListener(name, onActivity, { passive: true }))

    let cancelled = false
    let cancelPending = () => {}
    // Runs `step` in an idle slot after the page has been calm for CALM_MS; retries until then.
    const whenCalm = (step: () => void) => {
      cancelPending = whenIdle(() => {
        if (cancelled) return
        const quiet = performance.now() - lastActivity
        if (quiet < CALM_MS) {
          const timer = window.setTimeout(() => whenCalm(step), CALM_MS - quiet)
          cancelPending = () => window.clearTimeout(timer)
          return
        }
        step()
      }, 4000)
    }

    const timer = window.setTimeout(() => {
      // First calm moment: download and evaluate the module. Second: build the scene.
      whenCalm(() => {
        loadGallery()
          .then(() => whenCalm(() => setReady(true)))
          .catch(() => {
            // Offline or blocked: the scene simply loads when the section comes into view, as before.
          })
      })
    }, WARM_UP_DELAY_MS)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      cancelPending()
      events.forEach((name) => window.removeEventListener(name, onActivity))
    }
  }, [enabled])
  return ready
}

export default function GalleryBand() {
  const frameRef = useRef<HTMLDivElement>(null)
  const nearScreen = useInView(frameRef, { once: true, margin: '400px 0px' })
  const warmedUp = useIdleWarmUp(useMotionPolicy() === 'full')
  // Pictures as large as the frame allows: near the component's maximum scale, smaller on a phone so the spiral still
  // fits across the screen.
  const narrow = useMediaQuery('(max-width: 639px)')

  return (
    <section className="w-full py-20 md:py-28 bg-brand-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-5">
          <SectionHeader eyebrow="Khung hình đồng ruộng" title="Đồng hành cùng bà con từng vụ mùa" />
        </div>

        <Reveal className="lg:col-span-7" y={24}>
          <div
            ref={frameRef}
            role="img"
            aria-label="Dải ảnh đồng ruộng xoay tròn từ trên xuống"
            className="relative h-[400px] sm:h-[480px] lg:h-[560px] border border-brand-dark/15 rounded-[var(--radius-surface)] overflow-hidden bg-[#f1f1ef]"
          >
            {(warmedUp || nearScreen) && (
              <Suspense fallback={null}>
                <Gallery scale={narrow ? 0.8 : 1.2} speed={0.6} />
              </Suspense>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
