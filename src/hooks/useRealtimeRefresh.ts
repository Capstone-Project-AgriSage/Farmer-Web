import { useEffect, useEffectEvent } from 'react'

/** Reload the visible view after a change or reconnect, using its latest filters. */
export function useRealtimeRefresh(topics: readonly string[], reload: () => unknown) {
  const refreshCurrent = useEffectEvent(() => { void reload() })
  const key = topics.join('|')
  useEffect(() => {
    const accepted = new Set(key.split('|'))
    const refresh = (event: Event) => {
      if (document.hidden) return
      const topic = (event as CustomEvent<{ topic: string }>).detail?.topic
      if (topic === 'resync' || (topic && accepted.has(topic))) refreshCurrent()
    }
    window.addEventListener('agrisage-realtime-change', refresh)
    return () => window.removeEventListener('agrisage-realtime-change', refresh)
  }, [key])
}
