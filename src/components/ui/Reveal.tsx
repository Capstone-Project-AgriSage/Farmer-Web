import { createElement, type ReactNode } from 'react'
import { m } from 'framer-motion'
import { useMotionPolicy } from '../../motion/useMotionPolicy'
import { DURATION, EASE } from '../../motion/tokens'

const motionTags = { div: m.div, li: m.li, p: m.p, section: m.section, figure: m.figure } as const

interface RevealProps {
  as?: keyof typeof motionTags
  /** Seconds. Only used when the motion policy is "full". */
  delay?: number
  /** Start offset in px. Only used when the motion policy is "full". */
  y?: number
  className?: string
  children: ReactNode
}

/**
 * Fades content in the first time it scrolls into view.
 * full: fade + rise, with optional delay for staggering. reduced: one short fade-up. none: renders plain.
 * Must be rendered inside a <LazyMotion> provider.
 */
export default function Reveal({ as = 'div', delay = 0, y = 24, className, children }: RevealProps) {
  const policy = useMotionPolicy()
  if (policy === 'none') return createElement(as, { className }, children)

  const full = policy === 'full'
  const Tag = motionTags[as]
  // `transform` and `opacity` (not `y`) so Motion hands the animation to the browser (WAAPI, compositor thread):
  // it stays smooth while the main thread is busy with layout or scripts. Same for every reveal component.
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, transform: `translateY(${full ? y : 12}px)` }}
      whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: full ? DURATION.reveal : DURATION.standard, delay: full ? delay : 0, ease: [...EASE.out] }}
    >
      {children}
    </Tag>
  )
}
