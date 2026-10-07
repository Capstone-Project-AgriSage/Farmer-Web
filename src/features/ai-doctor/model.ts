// Types and constants the diagnosis screens share. No sample data lives here.
export interface DiagnosisCandidate {
  name: string
  confidence: number
}

export interface ConfidenceTone {
  bar: string
  text: string
  badgeBg: string
  label: string
}

export function confidenceTone(confidence: number): ConfidenceTone {
  if (confidence >= 85) {
    return {
      bar: 'bg-status-success',
      text: 'text-status-success',
      badgeBg: 'bg-status-success-surface',
      label: 'Độ tin cậy cao (≥85%)',
    }
  }
  if (confidence >= 70) {
    return {
      bar: 'bg-status-warning',
      text: 'text-status-warning',
      badgeBg: 'bg-status-warning-surface',
      label: 'Độ tin cậy trung bình (70-84%)',
    }
  }
  return {
    bar: 'bg-status-error',
    text: 'text-status-error',
    badgeBg: 'bg-status-error-surface',
    label: 'Chưa đủ chắc chắn (<70%)',
  }
}

export interface DiagnosisScenario {
  diseaseId: 'leaf_blast' | 'bacterial_leaf_blight' | 'brown_spot' | 'sheath_blight' | 'healthy'
  diseaseName: string
  pathogen: string
  confidence: number
  severity: 'Nhẹ' | 'Trung bình' | 'Nặng' | 'Bình thường'
  symptomsDetected: string[]
  treatmentSteps: string[]
  alternatives: DiagnosisCandidate[]
  diseaseTag: string
}

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
