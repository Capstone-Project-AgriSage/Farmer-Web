import { ApiError, api, describeApiError } from './client'
import type { DiagnosisCaseStatus, MyDiagnosisCase, MyDiagnosisCaseListItem, PagedResult } from './types'

/** The AI runs inside the upload (and the retry) request, so give it as long as the mobile app does. */
const AI_TIMEOUT_MS = 90_000

/** What the backend accepts (ImageRules): JPEG, PNG or WebP, at most 5 MB; a note of at most 1000 characters. */
export const DIAGNOSIS_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const DIAGNOSIS_MAX_BYTES = 5 * 1024 * 1024
export const DIAGNOSIS_NOTE_MAX = 1000

export interface MyDiagnosisCasesQuery {
  status?: DiagnosisCaseStatus
  page?: number
  pageSize?: number
}

export const diagnosisApi = {
  /** multipart/form-data: field "image" and an optional "note". Answers with the case after the AI ran. */
  create: (image: File, note?: string) => {
    const form = new FormData()
    form.append('image', image)
    const trimmed = note?.trim()
    if (trimmed) form.append('note', trimmed)
    return api<MyDiagnosisCase>('/api/me/diagnosis-cases', {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(AI_TIMEOUT_MS),
    })
  },

  list: (params: MyDiagnosisCasesQuery = {}) => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') searchParams.append(key, value.toString())
    })
    const qs = searchParams.toString()
    return api<PagedResult<MyDiagnosisCaseListItem>>(`/api/me/diagnosis-cases${qs ? `?${qs}` : ''}`)
  },

  get: (id: string) => api<MyDiagnosisCase>(`/api/me/diagnosis-cases/${id}`),

  /** Only while the case has no result (still analysing, or the AI failed). */
  cancel: (id: string, reason?: string) =>
    api<MyDiagnosisCase>(`/api/me/diagnosis-cases/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason: reason?.trim() || undefined }),
    }),

  /** Runs the AI again on a FAILED case; 503 while the AI service is still down. */
  retry: (id: string) =>
    api<MyDiagnosisCase>(`/api/me/diagnosis-cases/${id}/retry`, {
      method: 'POST',
      signal: AbortSignal.timeout(AI_TIMEOUT_MS),
    }),
}

export type DiagnosisAction = 'create' | 'retry' | 'cancel' | 'load'

/** Turns a diagnosis call error into a sentence the farmer can act on. */
export function describeDiagnosisError(err: unknown, action: DiagnosisAction): string {
  if (err instanceof DOMException && err.name === 'TimeoutError') {
    return action === 'create'
      ? 'AI phân tích lâu hơn bình thường. Bác mở Lịch sử chẩn đoán để xem ca vừa gửi, không cần gửi lại.'
      : 'AI phân tích lâu hơn bình thường. Bác tải lại trang sau ít phút.'
  }
  if (err instanceof TypeError) return 'Không kết nối được máy chủ. Bác kiểm tra mạng rồi thử lại.'
  if (!(err instanceof ApiError)) return 'Có lỗi xảy ra, bác vui lòng thử lại.'
  switch (err.status) {
    case 400:
      return 'Ảnh chưa hợp lệ. Chỉ nhận ảnh JPEG, PNG hoặc WebP, tối đa 5 MB; ghi chú tối đa 1000 ký tự.'
    case 403:
      return 'Chỉ tài khoản nông dân mới gửi được ảnh chẩn đoán.'
    case 404:
      return 'Không tìm thấy ca chẩn đoán.'
    case 413:
      return 'Ảnh quá lớn. Bác chọn ảnh tối đa 5 MB.'
    case 422:
      return action === 'retry'
        ? 'Ca này đã có kết quả hoặc đã huỷ nên không cần phân tích lại.'
        : action === 'cancel'
          ? 'Ca đã có kết quả hoặc đã huỷ nên không thể huỷ nữa.'
          : describeApiError(err)
    case 429:
      return 'Bác gửi hơi nhanh. Vui lòng đợi một chút rồi thử lại.'
    case 503:
      return 'Dịch vụ AI đang bận. Bác thử lại sau ít phút.'
    default:
      return describeApiError(err)
  }
}
