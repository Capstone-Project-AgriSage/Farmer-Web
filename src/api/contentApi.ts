import { api } from './client'
import type { PagedResult } from './types'

export interface Article {
  id: string; title: string; slug: string; summary: string | null; content: string; thumbnailUrl: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'; authorId: string; authorName: string
  publishedAt: string | null; createdAt: string; updatedAt: string
}
export type ContactStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
export interface ContactRequest {
  id: string; requestNumber: string; contactName: string; contactPhone: string | null; contactEmail: string | null
  subject: string; message: string; status: ContactStatus; resolvedAt: string | null; resolutionNote: string | null
  createdAt: string; updatedAt: string
}
export const contactLabels: Record<ContactStatus, string> = { OPEN: 'Mới', IN_PROGRESS: 'Đang xử lý', RESOLVED: 'Đã giải quyết', CLOSED: 'Đã đóng' }
export const contentApi = {
  articles: (page = 1, search = '', signal?: AbortSignal) => api<PagedResult<Article>>(`/api/articles?page=${page}&pageSize=9&search=${encodeURIComponent(search)}`, { signal, cache: 'no-store' }),
  article: (slug: string, signal?: AbortSignal) => api<Article>(`/api/articles/${encodeURIComponent(slug)}`, { signal, cache: 'no-store' }),
  createContact: (data: { contactName: string; contactPhone?: string; contactEmail?: string; subject: string; message: string }) =>
    api<ContactRequest>('/api/contact-requests', { method: 'POST', body: JSON.stringify(data) }),
  myContacts: (page = 1, signal?: AbortSignal) => api<PagedResult<ContactRequest>>(`/api/me/contact-requests?page=${page}&pageSize=10`, { signal, cache: 'no-store' }),
}
