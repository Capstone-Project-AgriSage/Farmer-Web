import { useCallback, useEffect, useState } from 'react'
import { ApiError, describeApiError } from '../api/client'

/** Stable loader; abort stale requests and refresh visible content on focus and every 30s. */
export function useContentQuery<T>(loader: (signal: AbortSignal) => Promise<T>) {
  const [result, setResult] = useState<{ loader: typeof loader; data: T } | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [revision, setRevision] = useState(0)
  const reload = useCallback(() => setRevision(value => value + 1), [])
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true); setError('')
    loader(controller.signal).then(value => { if (!controller.signal.aborted) setResult({ loader, data: value }) })
      .catch(err => { if (!controller.signal.aborted) { setResult(null); setError(err instanceof ApiError && err.status === 404 ? 'Không tìm thấy bài viết hoặc bài viết đã ngừng xuất bản.' : describeApiError(err, 'Không thể tải dữ liệu. Vui lòng thử lại.')) } })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [loader, revision])
  useEffect(() => {
    const refresh = () => { if (!document.hidden) reload() }
    window.addEventListener('focus', refresh)
    const timer = window.setInterval(refresh, 30000)
    return () => { window.removeEventListener('focus', refresh); window.clearInterval(timer) }
  }, [reload])
  return { data: result?.loader === loader ? result.data : null, error, loading, reload }
}
