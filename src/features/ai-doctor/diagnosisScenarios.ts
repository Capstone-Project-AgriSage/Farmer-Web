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
      label: 'Độ tin cậy cao',
    }
  }
  if (confidence >= 60) {
    return {
      bar: 'bg-status-warning',
      text: 'text-status-warning',
      badgeBg: 'bg-status-warning-surface',
      label: 'Độ tin cậy trung bình',
    }
  }
  return {
    bar: 'bg-status-error',
    text: 'text-status-error',
    badgeBg: 'bg-status-error-surface',
    label: 'Độ tin cậy thấp',
  }
}

export interface DiagnosisScenario {
  diseaseName: string
  pathogen: string
  confidence: number
  severity: 'Nhẹ' | 'Trung bình' | 'Nặng'
  symptomsDetected: string[]
  treatmentSteps: string[]
  alternatives: DiagnosisCandidate[]
  diseaseTag: string
}

/** AgriSage's AI diagnosis currently supports rice only, matching agent_agrisage's
 * AI-recommendation queue (see mockAiRecommendations.ts case AI-2401, same disease). */
export const cropLabel = 'Lúa (Oryza sativa)'

export const diagnosisScenario: DiagnosisScenario = {
  diseaseName: 'Đạo ôn lá',
  pathogen: 'Nấm Pyricularia oryzae',
  confidence: 94,
  severity: 'Trung bình',
  symptomsDetected: [
    'Vết bệnh hình thoi (mắt én), tâm màu xám tro, viền nâu đậm trên phiến lá',
    'Vết bệnh lan rộng và liên kết nhau khi trời ẩm, mưa nhiều',
    'Chóp lá cháy khô, ruộng lúa ngả màu xám xa trông như bị cháy',
  ],
  treatmentSteps: [
    'Ngừng bón đạm khi phát hiện bệnh, tránh bón thúc đòng khi ruộng đang nhiễm nặng',
    'Phun Fuji-One 40WP (Isoprothiolane 40%) theo liều khuyến cáo trên bao bì, phun ướt đều tán lá',
    'Giữ mực nước ổn định trong ruộng, tránh để ruộng khô hạn xen kẽ ngập nước',
    'Theo dõi và phun lại sau 7 ngày nếu vết bệnh chưa ngừng lây lan',
  ],
  alternatives: [
    { name: 'Cháy bìa lá do vi khuẩn (bạc lá)', confidence: 5 },
    { name: 'Ngộ độc phèn/hữu cơ đầu vụ', confidence: 1 },
  ],
  diseaseTag: 'Đạo ôn lá',
}
