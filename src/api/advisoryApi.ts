import { ApiError, api, describeApiError } from './client'
import type { DiagnosisTreatment, PagedResult } from './types'

/**
 * Input consultation, farmer side (docs/reference/api-flows/ADVISORY.md section 5): from a problem on the rice field to the
 * products the store approved, the quantity for the farmer's area and the cart. Prices, quantities and stock status come
 * from the server; this app only shows them.
 */

export type ProblemType = 'DISEASE' | 'PEST' | 'WEED' | 'NUTRITION' | 'GROWTH'

export type GrowthStage = 'SEEDLING' | 'TILLERING' | 'BOOTING' | 'HEADING' | 'RIPENING'

export type AdvisoryStock = 'ENOUGH' | 'NOT_ENOUGH' | 'OUT_OF_STOCK'

export type EmptyReason = 'NO_APPROVED_PRODUCT' | 'NO_PRODUCT_FOR_STAGE' | 'NOTHING_IN_STORE'

/** The most a farmer can enter: the server refuses a larger area. */
export const MAX_AREA_SQM = 1_000_000

export interface AdvisoryProblem {
  id: string
  code: string
  name: string
  problemType: ProblemType
  summary: string | null
  /** NAME, KEYWORD or SYMPTOM: what the typed text matched. */
  matchedBy: string | null
}

export interface AdvisoryProblemDetail {
  id: string
  code: string
  name: string
  problemType: ProblemType
  description: string | null
  symptoms: string | null
  causes: string | null
  prevention: string | null
}

export interface AdvisoryPlanLine {
  productPackagingId: string
  packagingName: string
  quantity: number
  unitPrice: number
  lineAmount: number
}

/** What to buy for the entered area: split into the store's packagings and rounded up. */
export interface AdvisoryPlan {
  baseQuantity: number
  totalAmount: number
  lines: AdvisoryPlanLine[]
}

export interface AdvisoryProduct {
  /** The catalog id: /products/:id, and what the cart takes. */
  storeProductId: string
  productId: string
  name: string
  sku: string
  imageUrl: string | null
  group: 'PROTECTION' | 'NUTRITION'
  rankOrder: number
  reason: string
  /** The legal document and page that registers a pesticide for this problem; none for fertilizers. */
  registrationSource: string | null
  doseText: string
  applications: number
  preHarvestDays: number | null
  growthStages: GrowthStage[]
  stockStatus: AdvisoryStock
  /** Null until the farmer enters an area, or when the store has not recorded a dose per hectare. */
  plan: AdvisoryPlan | null
}

export interface AdvisoryRecommendation {
  sessionId: string
  problem: AdvisoryProblemDetail
  careGuidance: DiagnosisTreatment[]
  areaSqm: number | null
  growthStage: GrowthStage | null
  protection: AdvisoryProduct[]
  nutrition: AdvisoryProduct[]
  emptyReason: EmptyReason | null
  safetyNote: string
}

export interface AdvisoryQuery {
  diseaseId: string
  areaSqm?: number
  growthStage?: GrowthStage
  /** The AI case the farmer came from, so the store knows where the advice started. */
  diagnosisCaseId?: string
}

export interface ProblemsQuery {
  search?: string
  type?: ProblemType
  page?: number
  pageSize?: number
}

export const advisoryApi = {
  /** Accent-insensitive search over the active problems; an empty search lists all of them. */
  problems: (params: ProblemsQuery = {}) => {
    const q = new URLSearchParams()
    if (params.search?.trim()) q.set('search', params.search.trim())
    if (params.type) q.set('type', params.type)
    q.set('page', String(params.page ?? 1))
    q.set('pageSize', String(params.pageSize ?? 50))
    return api<PagedResult<AdvisoryProblem>>(`/api/me/advisory/problems?${q.toString()}`)
  },

  /** Products for the problem, priced for this farmer; each call is logged by the server as an advice session. */
  recommend: (query: AdvisoryQuery) =>
    api<AdvisoryRecommendation>('/api/me/advisory/recommendations', {
      method: 'POST',
      body: JSON.stringify(query),
    }),
}

export type AdvisoryAction = 'problems' | 'recommend'

/** Turns an advisory call error into a sentence the farmer can act on. */
export function describeAdvisoryError(err: unknown, action: AdvisoryAction): string {
  if (err instanceof TypeError) return 'Không kết nối được máy chủ. Bác kiểm tra mạng rồi thử lại.'
  if (err instanceof ApiError) {
    if (err.status === 400) return action === 'problems' ? 'Từ khoá tìm kiếm chưa hợp lệ.' : 'Diện tích hoặc giai đoạn chưa hợp lệ.'
    if (err.status === 403) return 'Chỉ tài khoản nông dân mới dùng được tư vấn vật tư.'
    if (err.status === 404) return 'Không tìm thấy vấn đề này. Bác chọn lại trong danh sách.'
  }
  return describeApiError(err, 'Có lỗi xảy ra, bác vui lòng thử lại.')
}
