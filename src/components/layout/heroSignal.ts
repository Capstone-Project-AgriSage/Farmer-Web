import { useSyncExternalStore } from 'react'

// The homepage hero tells the header whether it is still in view, so the header can switch from
// transparent to solid. Defaults to visible: on every other page the header ignores it.
let heroVisible = true
const listeners = new Set<() => void>()

export function setHeroVisible(value: boolean) {
  if (value === heroVisible) return
  heroVisible = value
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const useHeroVisible = () =>
  useSyncExternalStore(
    subscribe,
    () => heroVisible,
    () => true,
  )
