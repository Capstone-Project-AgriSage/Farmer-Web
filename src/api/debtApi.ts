import { api } from './client'
import type { AllocationPreview, DebtAccount, DebtEntryDetail, DebtEntryListItem, DebtEntryStatus, PagedResult } from './types'

export interface MyDebtEntriesQuery {
  status?: DebtEntryStatus
  page?: number
  pageSize?: number
}

// FLOW_3 §6-7. Everything here is the farmer's own debt; the server never accepts another farmer's id.
export const debtApi = {
  // 404 when the farmer has no credit profile and so no debt account: callers treat that as "no debt book".
  getAccount: () => api<DebtAccount>('/api/me/debt'),

  getEntries: (params: MyDebtEntriesQuery = {}) => {
    const search = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') search.append(key, String(value))
    })
    const qs = search.toString()
    return api<PagedResult<DebtEntryListItem>>(`/api/me/debt-entries${qs ? `?${qs}` : ''}`)
  },

  getEntry: (id: string) => api<DebtEntryDetail>(`/api/me/debt-entries/${id}`),

  // The store reviews it and either keeps the amount, adjusts it, or cancels the entry; payments are not blocked meanwhile.
  dispute: (id: string, reason: string) => api<DebtEntryDetail>(`/api/me/debt-entries/${id}/dispute`, {
    method: 'POST',
    body: JSON.stringify({ reason })
  }),

  // Which entries an online repayment of `amount` would settle, oldest due date first.
  previewAllocation: (amount: number) => api<AllocationPreview>(`/api/me/debt/allocation-preview?amount=${amount}`)
}
