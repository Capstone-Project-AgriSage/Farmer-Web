import { m, useScroll, useSpring } from 'framer-motion'
import { useMotionPolicy } from './useMotionPolicy'

/** Thin bar at the top of the window that fills as the page scrolls. Full motion only. */
export default function ScrollProgress() {
  const full = useMotionPolicy() === 'full'
  if (!full) return null
  return <Bar />
}

function Bar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 })
  return <m.div aria-hidden="true" className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left bg-primary pointer-events-none" style={{ scaleX }} />
}
