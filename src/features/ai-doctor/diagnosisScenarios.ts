export interface DiagnosisCandidate {
  name: string
  confidence: number
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

export const cropOptions = [
  { value: 'durian', label: 'Sầu riêng' },
  { value: 'coffee', label: 'Cà phê & Hồ tiêu' },
  { value: 'other', label: 'Rau màu & Cây có múi / Khác' },
] as const

export type CropValue = (typeof cropOptions)[number]['value']

export const diagnosisScenarios: Record<CropValue, DiagnosisScenario> = {
  durian: {
    diseaseName: 'Thán thư, xì mủ sầu riêng',
    pathogen: 'Nấm Colletotrichum sp. / Phytophthora palmivora',
    confidence: 92,
    severity: 'Trung bình',
    symptomsDetected: [
      'Đốm nâu viền vàng lan rộng trên phiến lá',
      'Vết nứt thân rỉ mủ màu nâu đỏ',
      'Mép lá cháy khô, dễ rụng khi có gió mạnh',
    ],
    treatmentSteps: [
      'Cắt tỉa cành, lá bệnh và tiêu hủy xa vườn để tránh lây lan',
      'Pha Ridomil Gold 68WG 100g cho 40-50L nước, phun ướt đều tán lá',
      'Cạo sạch vết xì mủ trên thân, quét trực tiếp dung dịch đặc',
      'Theo dõi và phun lại sau 7-10 ngày nếu bệnh chưa dứt',
    ],
    alternatives: [
      { name: 'Cháy lá do nắng nóng sinh lý', confidence: 6 },
      { name: 'Thiếu vi lượng Canxi - Bo', confidence: 2 },
    ],
    diseaseTag: 'Thán thư, xì mủ sầu riêng',
  },
  coffee: {
    diseaseName: 'Rỉ sắt, nấm hồng cà phê',
    pathogen: 'Nấm Hemileia vastatrix',
    confidence: 78,
    severity: 'Trung bình',
    symptomsDetected: [
      'Đốm bột màu cam vàng mặt dưới lá',
      'Lá vàng úa và rụng sớm, tán cây thưa',
      'Xuất hiện lớp phấn hồng nhạt trên cành non',
    ],
    treatmentSteps: [
      'Phun Anvil 5SC hoặc Nativo 750WG theo liều khuyến cáo trên bao bì',
      'Luân phiên hoạt chất mỗi 15-20 ngày trong mùa mưa cao điểm để tránh kháng thuốc',
      'Bón cân đối Kali giúp cây tăng sức đề kháng',
      'Tỉa cành tạo tán thông thoáng, giảm ẩm độ trong tán lá',
    ],
    alternatives: [
      { name: 'Thiếu dinh dưỡng đa lượng', confidence: 12 },
      { name: 'Bọ xít muỗi gây hại', confidence: 10 },
    ],
    diseaseTag: 'Rỉ sắt, nấm hồng cà phê',
  },
  other: {
    diseaseName: 'Vàng lá, thối rễ mùa mưa',
    pathogen: 'Phức hợp nấm Fusarium sp. và Phytophthora sp.',
    confidence: 55,
    severity: 'Nặng',
    symptomsDetected: [
      'Lá vàng từ gân chính lan ra mép lá',
      'Rễ tơ thâm đen, dễ tuột vỏ khi kéo nhẹ',
      'Cây còi cọc dù đã bón phân đầy đủ',
    ],
    treatmentSteps: [
      'Đào rãnh thoát nước quanh gốc, tránh đọng nước mùa mưa',
      'Tưới gốc Aliette 800WG pha theo liều khuyến cáo, kết hợp chế phẩm nấm đối kháng Trichoderma',
      'Hạn chế bón đạm trong giai đoạn cây đang suy yếu',
      'Độ tin cậy chẩn đoán dưới 60% — nên gọi kỹ sư nông học kiểm tra trực tiếp trước khi xử lý diện rộng',
    ],
    alternatives: [
      { name: 'Ngộ độc hữu cơ do đất yếm khí', confidence: 24 },
      { name: 'Tuyến trùng gây hại rễ', confidence: 15 },
    ],
    diseaseTag: 'Vàng lá, thối rễ mùa mưa',
  },
}
