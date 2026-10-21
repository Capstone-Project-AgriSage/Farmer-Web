// Labels and rules the diagnosis screens share (AI_DIAGNOSIS.md 2.0). No sample data lives here.
//
// Since 2026-10-21 there is no store review: the AI result shows at once. CONFIDENT has treatments and products,
// UNCERTAIN has neither chemical treatment nor product, and the farmer never sees a probability.
// UNDER_REVIEW, VERIFIED and INCONCLUSIVE remain only on old cases.
import type { DiagnosisCaseStatus, DiagnosisCertainty } from '../../api/types'
import { DIAGNOSIS_NOTE_MAX } from '../../api/diagnosisApi'

export const riceStageOptions = [
  { value: 'seedling', label: 'Giai đoạn Mạ non (10-20 ngày sau sạ)' },
  { value: 'tillering', label: 'Giai đoạn Đẻ nhánh (20-35 ngày sau sạ)' },
  { value: 'panicle', label: 'Giai đoạn Làm đòng (40-55 ngày sau sạ)' },
  { value: 'ripening', label: 'Giai đoạn Trổ chín (60-90 ngày sau sạ)' },
] as const

export type RiceStageValue = (typeof riceStageOptions)[number]['value']

/** Splits "Giai đoạn Mạ non (10-20 ngày sau sạ)" into the stage name and its day range. */
export function parseStageLabel(label: string) {
  const match = /^Giai đoạn (.+?) \((.+)\)$/.exec(label)
  return { name: match?.[1] ?? label, days: match?.[2] ?? '' }
}

/** The note sent with the photo: the store reads it on the case. Kept within the backend limit. */
export function buildDiagnosisNote(stage: RiceStageValue, symptomText: string) {
  const stageLabel = riceStageOptions.find((o) => o.value === stage)?.label ?? ''
  const head = stageLabel.replace(/^Giai đoạn /, 'Giai đoạn: ')
  const symptoms = symptomText.trim()
  if (!symptoms) return head
  const prefix = `${head}. Triệu chứng: `
  return prefix + symptoms.slice(0, DIAGNOSIS_NOTE_MAX - prefix.length)
}

/** Vietnamese names of the five classes the AI knows (the backend names are English). */
export function diseaseDisplayName(code: string | null | undefined, name: string | null | undefined) {
  switch (code) {
    case 'LEAF_BLAST': return 'Đạo ôn lá'
    case 'BACTERIAL_LEAF_BLIGHT': return 'Bạc lá'
    case 'BROWN_SPOT': return 'Đốm nâu'
    case 'SHEATH_BLIGHT': return 'Khô vằn'
    case 'HEALTHY': return 'Lá khoẻ mạnh'
    default: return name ?? ''
  }
}

/** The AI is still analysing (usually a few seconds). */
export const isWaiting = (status: DiagnosisCaseStatus) => status === 'SUBMITTED' || status === 'PROCESSING'

/** A case can be cancelled only while it has no result. */
export const canCancel = (status: DiagnosisCaseStatus) => isWaiting(status) || status === 'FAILED'

export function statusLabel(status: DiagnosisCaseStatus | '') {
  switch (status) {
    case '': return 'Tất cả'
    case 'AI_COMPLETED': case 'UNDER_REVIEW': return 'Đã có kết quả'
    case 'VERIFIED': return 'Đã xác nhận'
    case 'INCONCLUSIVE': return 'Cần chụp lại'
    case 'FAILED': return 'Chưa phân tích được'
    case 'CANCELLED': return 'Đã huỷ'
    default: return 'Đang phân tích'
  }
}

export function statusBadgeClass(status: DiagnosisCaseStatus) {
  if (isWaiting(status)) return 'bg-status-warning-surface text-status-warning'
  switch (status) {
    case 'AI_COMPLETED': case 'UNDER_REVIEW': case 'VERIFIED': return 'bg-status-success-surface text-status-success'
    case 'FAILED': return 'bg-status-error-surface text-status-error'
    case 'INCONCLUSIVE': return 'bg-status-info-surface text-status-info'
    default: return 'bg-brand-light text-text-secondary'
  }
}

/** The history filters (the backend filters on one status). Old reviewed cases are under "Tất cả". */
export const historyFilters: (DiagnosisCaseStatus | '')[] = ['', 'AI_COMPLETED', 'FAILED', 'CANCELLED']

export function certaintyHeading(certainty: DiagnosisCertainty) {
  switch (certainty) {
    case 'CONFIDENT': return 'Kết quả từ AI'
    case 'UNCERTAIN': return 'AI chưa chắc chắn, có thể là'
    default: return 'Cửa hàng đã xác nhận'
  }
}

export function treatmentTypeLabel(type: string) {
  switch (type) {
    case 'CULTURAL': return 'Biện pháp canh tác'
    case 'CHEMICAL': return 'Thuốc / hoá chất'
    case 'PREVENTIVE': return 'Phòng ngừa'
    case 'OTHER': return 'Khác'
    default: return type
  }
}

export const formatDiagnosisTime = (value: string | null) => {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? ''
    : new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh' }).format(date)
}
