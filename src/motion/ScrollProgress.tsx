import { m, useScroll, useSpring } from 'framer-motion'
import { useMotionPolicy } from './useMotionPolicy'

// Browsers with scroll-driven animations fill the bar themselves (index.css, .scroll-progress-bar): no script per frame.
const cssScrollTimeline = typeof CSS !== 'undefined' && CSS.supports('animation-timeline: scroll()')

const barClass = 'fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left bg-primary pointer-events-none'

/** Thin bar at the top of the window that fills as the page scrolls. Full motion only. */
export default function ScrollProgress() {
  const full = useMotionPolicy() === 'full'
  if (!full) return null
  return cssScrollTimeline ? <div aria-hidden="true" className={`${barClass} scroll-progress-bar`} /> : <MotionBar />
}

/** Fallback for browsers without scroll timelines. */
function MotionBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 })
  return <m.div aria-hidden="true" className={barClass} style={{ scaleX }} />
}
