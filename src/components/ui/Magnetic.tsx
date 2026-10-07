import type { ReactNode } from 'react'
import { m, useMotionValue, useSpring } from 'framer-motion'
import { useMotionPolicy } from '../../motion/useMotionPolicy'
import { useMediaQuery } from '../../motion/useMediaQuery'

/**
 * Pulls its child a few pixels toward the pointer, then lets it spring back. Mouse devices with full motion only;
 * otherwise it renders the child untouched. Must be rendered inside a <LazyMotion> provider.
 */
export default function Magnetic({ children }: { children: ReactNode }) {
  const full = useMotionPolicy() === 'full'
  const hasHover = useMediaQuery('(hover: hover)')
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 220, damping: 16 })
  const springY = useSpring(y, { stiffness: 220, damping: 16 })

  if (!full || !hasHover) return <>{children}</>

  return (
    <m.div
      className="inline-block"
      style={{ x: springX, y: springY }}
      onMouseMove={(event) => {
        const box = event.currentTarget.getBoundingClientRect()
        x.set((event.clientX - box.left - box.width / 2) * 0.25)
        y.set((event.clientY - box.top - box.height / 2) * 0.35)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </m.div>
  )
}
