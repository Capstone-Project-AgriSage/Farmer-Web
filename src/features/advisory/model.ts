// Labels, units and rules the advisory screens share (docs/reference/api-flows/ADVISORY.md section 5).
import type { EmptyReason, GrowthStage, ProblemType } from '../../api/advisoryApi'
import { MAX_AREA_SQM } from '../../api/advisoryApi'

export const PROBLEM_FILTERS: { value: ProblemType | ''; label: string }[] = [
  { value: '', label: 'Tất cả' },
  { value: 'DISEASE', label: 'Bệnh' },
  { value: 'PEST', label: 'Sâu rầy' },
  { value: 'WEED', label: 'Cỏ dại' },
  { value: 'NUTRITION', label: 'Dinh dưỡng' },
  { value: 'GROWTH', label: 'Sinh trưởng, đất' },
]

export const problemTypeLabel = (type: ProblemType | string) => PROBLEM_FILTERS.find((f) => f.value === type)?.label ?? type

export const GROWTH_STAGES: { value: GrowthStage; label: string }[] = [
  { value: 'SEEDLING', label: 'Mạ, sau sạ' },
  { value: 'TILLERING', label: 'Đẻ nhánh' },
  { value: 'BOOTING', label: 'Làm đòng' },
  { value: 'HEADING', label: 'Trổ bông' },
  { value: 'RIPENING', label: 'Chín' },
]

/** The area units a rice farmer quotes. The server only takes square metres: 1 công = 1.000 m², 1 sào = 360 m². */
export const AREA_UNITS = [
  { value: 'cong', label: 'công', sqm: 1000 },
  { value: 'sao', label: 'sào', sqm: 360 },
  { value: 'ha', label: 'ha', sqm: 10000 },
  { value: 'm2', label: 'm²', sqm: 1 },
] as const

export type AreaUnit = (typeof AREA_UNITS)[number]['value']

export const unitSqm = (unit: AreaUnit) => AREA_UNITS.find((u) => u.value === unit)!.sqm

/** Reads the area box: empty is valid (no quantity is worked out); otherwise a number above 0 that the server accepts. */
export function parseArea(text: string, unit: AreaUnit): { ok: true; sqm: number | undefined } | { ok: false } {
  const trimmed = text.trim().replace(',', '.')
  if (trimmed === '') return { ok: true, sqm: undefined }
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return { ok: false }
  const value = Number(trimmed)
  const sqm = value * unitSqm(unit)
  if (!(value > 0) || sqm > MAX_AREA_SQM) return { ok: false }
  return { ok: true, sqm: Math.round(sqm * 1000) / 1000 }
}

export const AREA_ERROR = 'Bác nhập diện tích là số lớn hơn 0 (tối đa 1.000 ha).'

const AREA_KEY = 'agrisage.advisory_area'

export interface RememberedArea {
  text: string
  unit: AreaUnit
}

/** The area the farmer entered last time, kept on this browser only. */
export function readRememberedArea(): RememberedArea | null {
  try {
    const raw = localStorage.getItem(AREA_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<RememberedArea>
    const unit = AREA_UNITS.find((u) => u.value === parsed.unit)?.value
    if (!unit || typeof parsed.text !== 'string' || !parseArea(parsed.text, unit).ok) return null
    return { text: parsed.text, unit }
  } catch {
    return null
  }
}

export function rememberArea(area: RememberedArea | null) {
  try {
    if (area === null) localStorage.removeItem(AREA_KEY)
    else localStorage.setItem(AREA_KEY, JSON.stringify(area))
  } catch {
    // private mode or blocked storage: the area is just not remembered
  }
}

export function emptyReasonText(reason: EmptyReason | string | null): string | null {
  switch (reason) {
    case null: return null
    case 'NO_APPROVED_PRODUCT': return 'Cửa hàng chưa có sản phẩm gợi ý cho vấn đề này. Bác hỏi cửa hàng để được tư vấn.'
    case 'NO_PRODUCT_FOR_STAGE': return 'Chưa có sản phẩm hợp với giai đoạn lúa bác chọn. Bác thử chọn giai đoạn khác hoặc bỏ chọn giai đoạn.'
    case 'NOTHING_IN_STORE': return 'Các sản phẩm phù hợp hiện chưa bán hoặc chưa có giá. Bác hỏi cửa hàng.'
    default: return 'Chưa có sản phẩm gợi ý. Bác hỏi cửa hàng để được tư vấn.'
  }
}

export function stockLabel(status: string) {
  switch (status) {
    case 'ENOUGH': return 'Còn hàng'
    case 'NOT_ENOUGH': return 'Không đủ số lượng'
    case 'OUT_OF_STOCK': return 'Hết hàng'
    default: return status
  }
}

export function stockBadgeClass(status: string) {
  switch (status) {
    case 'ENOUGH': return 'bg-status-success-surface text-status-success'
    case 'NOT_ENOUGH': return 'bg-status-warning-surface text-status-warning'
    default: return 'bg-status-error-surface text-status-error'
  }
}
