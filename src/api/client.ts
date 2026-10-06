export class ApiError extends Error {
  status: number
  title: string
  detail?: string
  errors?: Record<string, string[]>
  traceId?: string

  constructor(
    status: number,
    title: string,
    detail?: string,
    errors?: Record<string, string[]>,
    traceId?: string
  ) {
    super(detail ?? title)
    this.status = status
    this.title = title
    this.detail = detail
    this.errors = errors
    this.traceId = traceId
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('agrisage.farmer_token') || localStorage.getItem('agrisage_token')
  const baseUrl = import.meta.env.VITE_API_URL || ''
  const isJwt = Boolean(token && token !== '0' && token !== '1' && token.includes('.'))

  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(isJwt ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })
  
  if (res.status === 401) {
    localStorage.removeItem('agrisage.farmer_token')
    localStorage.removeItem('agrisage_token')
    localStorage.setItem('agrisage.farmer_auth.v1', '0')
    window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    throw new ApiError(401, 'Unauthorized', 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ.')
  }
  
  if (res.ok) {
    if (res.status === 204) return undefined as T
    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json') || contentType.includes('application/problem+json')) {
      return (await res.json()) as T
    }
    const text = await res.text()
    try {
      return JSON.parse(text) as T
    } catch {
      return text as unknown as T
    }
  }
  
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json') || contentType.includes('application/problem+json')) {
    const p = await res.json().catch(() => ({}))
    throw new ApiError(res.status, p.title ?? res.statusText, p.detail || p.message, p.errors, p.traceId)
  }
  const errorText = await res.text().catch(() => '')
  throw new ApiError(res.status, res.statusText, errorText)
}

/**
 * Turns any thrown error into a message the farmer can act on (FE_GUIDE_FLOW_2 §7):
 * 422 carries the business-rule `detail`, 409/503 are "try again" situations.
 */
export function describeApiError(err: unknown, fallback = 'Có lỗi xảy ra, vui lòng thử lại.'): string {
  if (!(err instanceof ApiError)) return fallback
  switch (err.status) {
    case 401:
      return 'Phiên đăng nhập đã hết hạn. Bác vui lòng đăng nhập lại.'
    case 404:
      return 'Không tìm thấy dữ liệu, có thể đã bị xoá. Vui lòng tải lại trang.'
    case 409:
      return 'Dữ liệu vừa được cập nhật ở nơi khác. Vui lòng tải lại rồi thử lại.'
    case 503:
      return 'Dịch vụ tạm gián đoạn, vui lòng thử lại sau.'
    default:
      return err.detail || fallback
  }
}
