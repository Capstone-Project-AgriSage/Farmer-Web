import { useSyncExternalStore } from 'react'
import { REDUCED_MOTION_MAX_WIDTH } from './tokens'

/**
 * none:    prefers-reduced-motion. No decorative motion, only instant state changes or fades up to 150ms.
 * reduced: Save Data, or a viewport under 768px. A single short fade-up at most: no parallax, sticky effects or long staggers.
 * full:    everything else.
 *
 * The policy only gates effects. It must never change layout or content.
 * deviceMemory / hardwareConcurrency are deliberately not read; if a heavy effect ever needs them,
 * use them only to downgrade full to reduced for that effect.
 */
export type MotionPolicy = 'none' | 'reduced' | 'full'

const REDUCE_QUERY = '(prefers-reduced-motion: reduce)'
const NARROW_QUERY = `(max-width: ${REDUCED_MOTION_MAX_WIDTH}px)`

// navigator.connection is Chromium only and not in lib.dom.
interface NetworkInformationLike extends EventTarget {
  saveData?: boolean
}

const getConnection = (): NetworkInformationLike | undefined =>
  (navigator as Navigator & { connection?: NetworkInformationLike }).connection

export function getMotionPolicy(): MotionPolicy {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'reduced'
  if (window.matchMedia(REDUCE_QUERY).matches) return 'none'
  if (getConnection()?.saveData) return 'reduced'
  if (window.matchMedia(NARROW_QUERY).matches) return 'reduced'
  return 'full'
}

function subscribe(onChange: () => void) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {}
  // Listening to the 768px media query covers resizing across the breakpoint without a resize handler.
  const queries = [window.matchMedia(REDUCE_QUERY), window.matchMedia(NARROW_QUERY)]
  queries.forEach((query) => query.addEventListener('change', onChange))
  const connection = getConnection()
  connection?.addEventListener('change', onChange)
  return () => {
    queries.forEach((query) => query.removeEventListener('change', onChange))
    connection?.removeEventListener('change', onChange)
  }
}

// Server render (not used today) takes the conservative value so heavy effects never flash.
const getServerSnapshot = (): MotionPolicy => 'reduced'

export function useMotionPolicy(): MotionPolicy {
  return useSyncExternalStore(subscribe, getMotionPolicy, getServerSnapshot)
}
