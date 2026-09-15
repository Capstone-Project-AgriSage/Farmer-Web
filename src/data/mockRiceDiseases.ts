import type { RiceDiseaseClass } from '../types'

export const riceDiseases: RiceDiseaseClass[] = [
  {
    id: 'leaf_blast',
    name: 'Bệnh đạo ôn lá (cháy lá)',
    scientificName: 'Magnaporthe oryzae (Pyricularia oryzae)',
    vietnameseAliases: ['Đạo ôn lá', 'Cháy lá lúa', 'Bệnh mắt én'],
    symptoms: [
      'Vết bệnh ban đầu là chấm nhỏ màu xám xanh, sau lan rộng hình mắt én (hình thoi)',
      'Tâm vết bệnh màu xám tro, viền ngoài màu nâu đậm hoặc quầng vàng',
      'Thời tiết sương mù, ẩm độ cao khiến vết bệnh liên kết làm cháy khô toàn bộ phiến lá',
    ],
    activeIngredients: ['Tricyclazole', 'Isoprothiolane', 'Fenoxanil'],
    preventionSteps: [
      'Giữ mực nước ruộng ổn định 3-5cm, tránh để ruộng khô hạn nứt nẻ',
      'Ngưng bón thừa đạm (Ure), không phun phân bón lá chứa đạm khi chớm bệnh',
      'Tăng cường bón Kali và Silic giúp vách tế bào lá dày chắc kháng nấm',
      'Phun phòng trị sớm bằng thuốc đặc trị lưu dẫn lúc sáng sớm khi ráo sương',
    ],
  },
  {
    id: 'bacterial_leaf_blight',
    name: 'Bệnh bạc lá vi khuẩn (cháy bìa lá)',
    scientificName: 'Xanthomonas oryzae pv. oryzae',
    vietnameseAliases: ['Bạc lá vi khuẩn', 'Cháy bìa lá lúa'],
    symptoms: [
      'Vết bệnh xuất hiện từ chóp lá hoặc mép lá lan dần vào trong thành vệt dài gợn sóng',
      'Mô bệnh ban đầu ủng nước màu xanh tái, sau chuyển vàng rơm rồi bạc trắng',
      'Sáng sớm thường có giọt dịch vi khuẩn màu vàng đục đọng ở mép lá bị bệnh',
    ],
    activeIngredients: ['Bismerthiazol', 'Oxolinic acid', 'Copper Hydroxide'],
    preventionSteps: [
      'Tháo bớt nước trong ruộng nếu có giông lốc làm rách dập lá',
      'Tuyệt đối không bón đạm rước đòng khi ruộng đang nhiễm vi khuẩn',
      'Phun thuốc sát khuẩn gốc đồng hoặc Bismerthiazol kịp thời trước khi vết cháy loang rộng',
    ],
  },
  {
    id: 'brown_spot',
    name: 'Bệnh đốm nâu',
    scientificName: 'Bipolaris oryzae (Cochliobolus miyabeanus)',
    vietnameseAliases: ['Đốm nâu lúa', 'Bệnh tiêm lửa'],
    symptoms: [
      'Vết bệnh hình tròn hoặc bầu dục nhỏ, màu nâu sẫm rải rác khắp mặt lá',
      'Xung quanh vết bệnh thường có quầng vàng nhạt',
      'Bệnh phát sinh nặng trên đất phèn, đất bạc màu, thiếu dinh dưỡng hoặc thiếu nước',
    ],
    activeIngredients: ['Difenoconazole + Propiconazole', 'Azoxystrobin', 'Mancozeb'],
    preventionSteps: [
      'Bón lót vôi khử chua, hạ phèn trước khi gieo sạ',
      'Bón bổ sung phân lân nung chảy và phân hữu cơ vi sinh cải tạo đất',
      'Cung cấp đủ nước và cân đối tỷ lệ N-P-K, đặc biệt là Kali',
    ],
  },
  {
    id: 'sheath_blight',
    name: 'Bệnh khô vằn (đốm vằn)',
    scientificName: 'Rhizoctonia solani',
    vietnameseAliases: ['Khô vằn lúa', 'Đốm vằn bẹ lá'],
    symptoms: [
      'Vết bệnh ban đầu xuất hiện ở bẹ lá sát mặt nước hình bầu dục màu xanh xám',
      'Sau lan rộng thành các vệt da hổ loang lổ viền nâu, tâm xám trắng',
      'Thời tiết nóng ẩm, sạ dày bón thừa đạm khiến bệnh leo nhanh lên lá đòng gây lem lép hạt',
    ],
    activeIngredients: ['Hexaconazole', 'Validamycin A', 'Azoxystrobin'],
    preventionSteps: [
      'Sạ mật độ hợp lý (80-100 kg/ha), làm cỏ bờ thông thoáng ánh sáng',
      'Thực hiện chế độ tưới ngập khô xen kẽ giúp gốc lúa cứng cáp',
      'Phun thuốc vào phần bẹ sát gốc khi tỷ lệ bẹ nhiễm bệnh vượt 5-10%',
    ],
  },
  {
    id: 'healthy',
    name: 'Lúa sinh trưởng khỏe mạnh',
    scientificName: 'Oryza sativa L.',
    vietnameseAliases: ['Lúa khỏe', 'Không phát hiện nấm bệnh'],
    symptoms: [
      'Phiến lá thẳng đứng, màu xanh mạ tươi sáng đồng đều',
      'Bẹ lá sạch, không có vết thâm quầng hay ủng nước',
      'Bộ rễ trắng dài, rễ tơ phát triển mạnh bám sâu vào tầng đất',
    ],
    activeIngredients: [],
    preventionSteps: [
      'Duy trì bón phân theo bảng so màu lá lúa LCC',
      'Thăm đồng định kỳ 2 lần/tuần để phát hiện dịch hại sớm',
      'Bảo vệ thiên địch tự nhiên như bọ rùa, nhện gai, kiến ba khoang trên ruộng lúa',
    ],
  },
]

export function getRiceDiseaseById(id: string): RiceDiseaseClass | undefined {
  return riceDiseases.find((d) => d.id === id)
}
