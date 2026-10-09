import { Fragment, useRef } from 'react'
import { m, useInView } from 'framer-motion'
import { useMotionPolicy } from '../../motion/useMotionPolicy'
import { EASE } from '../../motion/tokens'

interface WordRevealProps {
  text: string
  /** Wait for the text to scroll into view (once). Without it the words play on mount. */
  inView?: boolean
  /** Seconds before the first word. */
  baseDelay?: number
  /** Position of the first word within a heading that is split across several WordReveals. */
  startIndex?: number
  /** Seconds between two words. */
  stagger?: number
  duration?: number
  className?: string
}

/**
 * Heading text that rises word by word out of a mask (translateY + a 4deg tilt).
 * Only with the "full" motion policy; reduced and none render the plain text.
 * Must be rendered inside a <LazyMotion> provider.
 */
export default function WordReveal({ text, inView = false, baseDelay = 0, startIndex = 0, stagger = 0.045, duration = 0.9, className }: WordRevealProps) {
  const policy = useMotionPolicy()
  const ref = useRef<HTMLSpanElement>(null)
  const seen = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  if (policy !== 'full') return <>{text}</>

  const visible = !inView || seen
  return (
    <span ref={ref} className={className}>
      {text.split(' ').map((word, index) => (
        <Fragment key={index}>
          {index > 0 && ' '}
          {/* The mask clips the rise; its padding and negative margin keep accents and italic overhang from being cut. */}
          <span className="inline-block overflow-hidden align-top pt-[0.14em] pb-[0.1em] -mt-[0.14em] -mb-[0.1em] pr-[0.06em]">
            <m.span
              className="inline-block origin-bottom-left"
              initial={{ transform: 'translateY(115%) rotate(4deg)' }}
              animate={visible ? { transform: 'translateY(0%) rotate(0deg)' } : undefined}
              transition={{ duration, delay: baseDelay + (startIndex + index) * stagger, ease: [...EASE.out] }}
            >
              {word}
            </m.span>
          </span>
        </Fragment>
      ))}
    </span>
  )
}
