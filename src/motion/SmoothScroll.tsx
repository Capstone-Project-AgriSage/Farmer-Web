import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { useMotionPolicy } from './useMotionPolicy'

/**
 * Inertial page scrolling (Lenis) for marketing pages. Render it once inside the page that wants it.
 * Only runs with the "full" motion policy, so reduced-motion, Save Data and phones keep native scrolling.
 * It switches itself off when the page unmounts or the policy changes.
 *
 * Elements that scroll on their own (a menu panel, a modal) need data-lenis-prevent so the wheel scrolls them
 * instead of the page behind. Horizontal carousels do not need it: only vertical gestures are smoothed.
 */
export default function SmoothScroll() {
  const policy = useMotionPolicy()

  useEffect(() => {
    if (policy !== 'full') return
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true, autoRaf: true })
    return () => lenis.destroy()
  }, [policy])

  return null
}
