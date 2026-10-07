import { useRef, type ReactNode } from 'react'
import { m, useInView } from 'framer-motion'
import { useMotionPolicy } from '../../motion/useMotionPolicy'
import { EASE } from '../../motion/tokens'

interface ImageRevealProps {
  /** Frame size, shape and background, e.g. "aspect-[4/3] rounded-[var(--radius-surface)] bg-surface-secondary". */
  className?: string
  /** Corner radius used while the picture is being uncovered; match the frame's radius. */
  radius?: string
  /** Seconds. Only used with the "full" motion policy. */
  delay?: number
  children: ReactNode
}

/**
 * Uncovers a picture from top to bottom (clip-path) while it settles from 1.25x to 1x.
 * Only with the "full" motion policy; otherwise the picture is simply there.
 * The frame itself is what scrolls into view: a fully clipped element is invisible to IntersectionObserver.
 * Must be rendered inside a <LazyMotion> provider.
 */
export default function ImageReveal({ className = '', radius = '2px', delay = 0, children }: ImageRevealProps) {
  const policy = useMotionPolicy()
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, margin: '0px 0px -12% 0px' })
  const frame = `overflow-hidden ${className}`

  if (policy !== 'full') return <div className={frame}>{children}</div>

  const ease: [number, number, number, number] = [...EASE.out]
  return (
    <div ref={ref} className={frame}>
      <m.div
        className="w-full h-full"
        initial={{ clipPath: `inset(0 0 100% 0 round ${radius})` }}
        animate={seen ? { clipPath: `inset(0 0 0% 0 round ${radius})` } : undefined}
        transition={{ duration: 1.3, delay, ease }}
      >
        <m.div className="w-full h-full" initial={{ scale: 1.25 }} animate={seen ? { scale: 1 } : undefined} transition={{ duration: 1.8, delay, ease }}>
          {children}
        </m.div>
      </m.div>
    </div>
  )
}
