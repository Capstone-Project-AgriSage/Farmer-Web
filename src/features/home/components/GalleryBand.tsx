import { lazy, Suspense, useRef } from 'react'
import { useInView } from 'framer-motion'
import Reveal from '../../../components/ui/Reveal'
import SectionHeader from '../../../components/ui/SectionHeader'
import { useMediaQuery } from '../../../motion/useMediaQuery'
import '../../../shaders/threeui.css'

// The Three.js scene is large, so it is loaded only when the section is about to be on screen.
const Gallery = lazy(() => import('../../../shaders/gallery/Gallery').then((module) => ({ default: module.Gallery })))

export default function GalleryBand() {
  const frameRef = useRef<HTMLDivElement>(null)
  const nearScreen = useInView(frameRef, { once: true, margin: '400px 0px' })
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
            {nearScreen && (
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
