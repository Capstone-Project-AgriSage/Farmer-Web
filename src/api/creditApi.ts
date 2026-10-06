import { api } from './client'
import type { MyCreditSummary } from './types'

export const creditApi = {
  // 404 when the farmer has no credit profile — callers treat that as "no credit".
  getMyCredit: () => api<MyCreditSummary>('/api/me/credit'),
}
