import { createElement, Fragment, useRef, type RefObject } from 'react'
import { m, useInView } from 'framer-motion'
import { useMotionPolicy } from '../../motion/useMotionPolicy'
import { DURATION, EASE } from '../../motion/tokens'

interface LineRevealProps {
  /** The heading, already broken into the lines it should show on wide screens. */
  lines: string[]
  as?: 'h1' | 'h2' | 'p'
  id?: string
  className?: string
  /** Seconds between two lines. */
  stagger?: number
  /** Seconds before the first line. */
  delay?: number
}

/**
 * Display heading whose lines rise one after another out of a mask the first time it scrolls into view.
 * full: masked rise, staggered. reduced: one short fade-up for the whole heading. none: plain text.
 * The lines are joined with spaces, so screen readers read one sentence.
 * Must be rendered inside a <LazyMotion> provider.
 */
export default function LineReveal({ lines, as = 'h2', id, className, stagger = 0.12, delay = 0 }: LineRevealProps) {
  const policy = useMotionPolicy()
  const ref = useRef<HTMLElement>(null)
  const seen = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })

  if (policy === 'none') {
    return createElement(as, { id, className }, lines.join(' '))
  }

  if (policy === 'reduced') {
    const Tag = as === 'h1' ? m.h1 : as === 'p' ? m.p : m.h2
    return (
      <Tag
        id={id}
        className={className}
        initial={{ opacity: 0, transform: 'translateY(12px)' }}
        whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
        viewport={{ once: true, margin: '0px 0px -12% 0px' }}
        transition={{ duration: DURATION.standard, ease: [...EASE.out] }}
      >
        {lines.join(' ')}
      </Tag>
    )
  }

  const Tag = as
  return (
    <Tag id={id} className={className} ref={ref as RefObject<HTMLHeadingElement & HTMLParagraphElement>}>
      {lines.map((line, index) => (
        <Fragment key={index}>
          {index > 0 && ' '}
          {/* Padding and negative margin keep stacked Vietnamese accents (ẵ, ồ), the dot below (ụ) and descenders inside the mask. */}
          <span className="block overflow-hidden pt-[0.18em] pb-[0.22em] -mt-[0.18em] -mb-[0.22em]">
            <m.span
              className="block"
              initial={{ transform: 'translateY(110%)' }}
              animate={seen ? { transform: 'translateY(0%)' } : undefined}
              transition={{ duration: 1.1, delay: delay + index * stagger, ease: [...EASE.out] }}
            >
              {line}
            </m.span>
          </span>
        </Fragment>
      ))}
    </Tag>
  )
}
