import { api } from './client'
import type { MyCreditSummary, MyCurrentSeason } from './types'

export const creditApi = {
  // 404 when the farmer has no credit profile — callers treat that as "no credit".
  getMyCredit: () => api<MyCreditSummary>('/api/me/credit'),

  // The season (and expected due date) a credit order placed today would get. Only an estimate: the real date is set on delivery.
  getCurrentSeason: () => api<MyCurrentSeason>('/api/me/crop-seasons/current'),
}
