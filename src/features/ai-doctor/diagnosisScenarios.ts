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
  { value: 'tillering', label: 'Giai đoạn Đẻ nhánh (20-35 ngày sau sạ)' },
  { value: 'panicle', label: 'Giai đoạn Làm đòng (40-55 ngày sau sạ)' },
  { value: 'ripening', label: 'Giai đoạn Trổ chín (60-90 ngày sau sạ)' },
  { value: 'seedling', label: 'Giai đoạn Mạ non (10-20 ngày sau sạ)' },
] as const

export type RiceStageValue = (typeof riceStageOptions)[number]['value']

export const diagnosisScenarios: Record<RiceStageValue, DiagnosisScenario> = {
  tillering: {
    diseaseId: 'leaf_blast',
    diseaseName: 'Bệnh đạo ôn lá lúa',
    pathogen: 'Nấm Pyricularia oryzae (Magnaporthe oryzae)',
    confidence: 94,
    severity: 'Trung bình',
    symptomsDetected: [
      'Chấm bệnh hình mắt én (hình thoi) màu xám tro viền nâu xuất hiện rải rác trên phiến lá',
      'Đầu lá có dấu hiệu co rút và sém khô khi thời tiết se lạnh nhiều sương mù',
      'Mật độ đẻ nhánh rậm rạp làm tăng độ ẩm ứ đọng',
    ],
    treatmentSteps: [
      'Giữ mực nước ruộng 3-5cm, tuyệt đối ngưng bón đạm (Urê) và phân bón lá có đạm',
      'Rút bớt sương mù đọng bằng cách khua giọt sương vào sáng sớm',
      'Đợi thẩm định viên / Đại lý duyệt thuốc đặc trị (Tricyclazole / Isoprothiolane) trước khi phun',
      'Phun khi trời ráo sương và kiểm tra lại sau 5 ngày',
    ],
    alternatives: [
      { name: 'Đốm nâu nhẹ sinh lý', confidence: 4 },
      { name: 'Vết chích rầy lưng trắng', confidence: 2 },
    ],
    diseaseTag: 'leaf_blast',
  },
  panicle: {
    diseaseId: 'bacterial_leaf_blight',
    diseaseName: 'Bệnh bạc lá vi khuẩn (cháy bìa lá)',
    pathogen: 'Vi khuẩn Xanthomonas oryzae pv. oryzae',
    confidence: 91,
    severity: 'Nặng',
    symptomsDetected: [
      'Vệt cháy màu vàng rơm chạy dọc mép lá từ chóp lá lúa lan dần vào phiến lá',
      'Mép lá lượn sóng và khô giòn vào buổi trưa nắng gắt',
      'Sáng sớm xuất hiện giọt dịch nhờn vi khuẩn màu vàng đục trên mép vết bệnh',
    ],
    treatmentSteps: [
      'Tháo bớt nước trong ruộng nếu có giông gió làm rách dập lá',
      'Tuyệt đối không bón đón đòng thừa đạm, tăng cường bón Kali để tăng tính kháng',
      'Đại lý phụ trách khu vực sẽ kiểm tra và cấp phác đồ kháng sinh thực vật (Bismerthiazol / Oxolinic acid)',
      'Phun thuốc sát khuẩn phổ rộng vào chiều mát',
    ],
    alternatives: [
      { name: 'Khô chóp lá do gió mặn / thời tiết', confidence: 6 },
      { name: 'Bạc lá do nhện gié cắn phá', confidence: 3 },
    ],
    diseaseTag: 'bacterial_leaf_blight',
  },
  ripening: {
    diseaseId: 'sheath_blight',
    diseaseName: 'Bệnh khô vằn (đốm vằn bẹ lá)',
    pathogen: 'Nấm Rhizoctonia solani',
    confidence: 86,
    severity: 'Trung bình',
    symptomsDetected: [
      'Vết đốm loang lổ dạng da hổ viền nâu sẫm, tâm xám trắng ở bẹ lá sát mặt nước',
      'Sợi nấm trắng và hạch nấm nâu tròn bám chặt vào bẹ thân lúa',
      'Bệnh có chiều hướng bò leo lên lá đòng gây lem lép hạt',
    ],
    treatmentSteps: [
      'Thực hiện tưới ướt - khô xen kẽ, làm cỏ bờ tạo độ thông thoáng gốc lúa',
      'Đại lý Hai Thắng sẽ xác nhận hoạt chất phù hợp (Hexaconazole / Validamycin A)',
      'Phun rà sát phần bẹ gốc lúa vào buổi chiều ráo nắng',
      'Theo dõi sát sao giai đoạn trổ đều để tránh nấm xâm nhập vỏ trấu',
    ],
    alternatives: [
      { name: 'Vết thối bẹ do ngập úng hữu cơ', confidence: 9 },
      { name: 'Vết bầm sinh lý do va quẹt', confidence: 5 },
    ],
    diseaseTag: 'sheath_blight',
  },
  seedling: {
    diseaseId: 'healthy',
    diseaseName: 'Lúa sinh trưởng khỏe mạnh',
    pathogen: 'Không phát hiện mầm bệnh dịch hại nguy hiểm',
    confidence: 98,
    severity: 'Bình thường',
    symptomsDetected: [
      'Phiến lá thẳng đứng, sắc xanh tươi đồng đều không có đốm nấm',
      'Gốc mạ mập mạp, bẹ lá sạch sẽ',
      'Rễ trắng tơ bám đều mặt đất ruộng',
    ],
    treatmentSteps: [
      'Duy trì mực nước 1-2cm giúp giữ ấm và chống cỏ dại',
      'Thăm đồng thường xuyên 2 lần/tuần theo bảng so màu lá lúa LCC',
      'Không lạm dụng phun thuốc phòng ngừa khi cây đang hoàn toàn khỏe mạnh',
    ],
    alternatives: [
      { name: 'Bệnh đốm nâu nhẹ', confidence: 2 },
    ],
    diseaseTag: 'healthy',
  },
}
