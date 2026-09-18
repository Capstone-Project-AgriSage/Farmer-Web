export interface Article {
  slug: string
  badge: { label: string; icon: string; className: string }
  title: string
  summary: string
  date: string
  content: string[]
}

export const articles: Article[] = [
  {
    slug: 'canh-bao-dao-on-la-lua-dong-xuan',
    badge: {
      label: 'Cảnh báo dịch hại',
      icon: 'warning',
      className: 'bg-status-warning-surface text-status-warning',
    },
    title: 'Cảnh báo bùng phát bệnh đạo ôn lá (cháy lá) trên lúa Đông Xuân tại ĐBSCL',
    summary:
      'Độ ẩm cao, sương mù sáng sớm và thừa đạm là điều kiện nấm Magnaporthe oryzae phát tán mạnh. Khuyến cáo bà con phun Beam 75WP hoặc Map Lotus 125WP ngay khi vết chấm kim xuất hiện.',
    date: '12/10/2024 · 5 phút đọc',
    content: [
      'Theo khuyến cáo từ trạm BVTV Thới Lai và đội ngũ kỹ sư nông học AgriSage tại các vùng trọng điểm lúa Thới Lai, Cờ Đỏ (Cần Thơ), thời tiết se lạnh có sương mù kéo dài kèm độ ẩm trên 90% là điều kiện tối ưu để nấm Magnaporthe oryzae gây bệnh đạo ôn lá bùng phát mạnh trên các giống lúa OM5451, Đài Thơm 8, ST25.',
      'Biểu hiện ban đầu là các chấm kim màu nâu nhỏ, sau phát triển thành hình thoi đặc trưng với tâm màu xám trắng và viền nâu đỏ. Nếu không can thiệp kịp thời trong 3-5 ngày, các vết bệnh liên kết làm cháy khô toàn bộ chóp lá và lá đòng, dẫn đến suy kiệt năng suất vụ lúa.',
      'Kỹ sư AgriSage khuyến cáo bà con: tạm ngưng bón phân đạm urê và phân bón lá có hàm lượng đạm cao; giữ mực nước ruộng ổn định 3-5cm; đồng thời tiến hành phun ngay hoạt chất Tricyclazole (Beam 75WP) hoặc Isoprothiolane theo liều lượng 25-30g cho bình 25 lít nước.',
      'Bà con có thể chụp ảnh triệu chứng lá lúa gửi qua tính năng Bác sĩ cây trồng AI trên ứng dụng để được chẩn đoán chính xác mức độ nhiễm bệnh và được kỹ sư đại lý Hai Thắng kiểm duyệt phác đồ phun xịt.',
    ],
  },
  {
    slug: 'quy-trinh-bon-phan-don-dong-lua-dbscl',
    badge: { label: 'Kỹ thuật canh tác', icon: 'eco', className: 'bg-primary-light text-primary' },
    title: 'Quy trình bón phân đón đòng (40 - 45 ngày) giúp bông lúa to hạt chắc mẩy',
    summary:
      'Giai đoạn tim đèn 1 - 2mm quyết định trực tiếp số hạt trên bông lúa. Hướng dẫn kỹ thuật "nhìn trời, nhìn đất, nhìn cây" để bón NPK Đầu Trâu 20-20-15+TE đúng lượng.',
    date: '10/10/2024 · 7 phút đọc',
    content: [
      'Bón phân đón đòng là khâu kỹ thuật mang tính quyết định đến 60-70% năng suất thu hoạch của ruộng lúa. Thời điểm bón chuẩn xác nhất là khi kiểm tra ngẫu nhiên chồi chính thấy xuất hiện "tim đèn" (búp hoa non) dài 1-2mm ở đốt thân gốc (thường từ 40-45 ngày sau sạ tùy giống).',
      'Áp dụng nguyên tắc "nhìn trời, nhìn đất, nhìn cây": nếu ruộng lúa có màu vàng chanh hoặc vàng tranh nhẹ thì tiến hành bón đón đòng ngay; nếu lúa còn xanh đậm thì cần lùi ngày bón và giảm bớt đạm để tránh nguy cơ rầy nâu và đạo ôn cổ bông.',
      'Công thức bón đón đòng chuẩn cho giống lúa OM5451 và Đài Thơm 8: 10 - 12 kg NPK Đầu Trâu 20-20-15+TE kết hợp 2 - 3 kg Kali Clorua/công (1.000m²). Tỷ lệ Kali cao giúp thân rạ cứng cáp, chống đổ ngã mùa mưa lũ và kích thích đòng to hạt sáng.',
      'Sau khi bón phân 3-5 ngày, bà con cần kiểm tra ruộng kết hợp phun phòng trừ bệnh khô vằn và đạo ôn cổ bông bằng Tilt Super 300EC hoặc Anvil 5SC trước khi lúa trổ lẹt xẹt.',
    ],
  },
  {
    slug: 'giai-phap-quan-ly-so-no-goi-vu-dai-ly',
    badge: { label: 'Dành cho đại lý', icon: 'store', className: 'bg-blue-50 text-status-info' },
    title: 'Giải pháp quản lý sổ nợ gối vụ & đối soát VietQR minh bạch hai chiều',
    summary:
      'Quy trình quản lý tín dụng mùa vụ AgriSage giúp đại lý Hai Thắng theo dõi hạn mức từng nông hộ, xác thực hai chiều biên bản giao nhận và gạch nợ minh bạch.',
    date: '08/10/2024 · 4 phút đọc',
    content: [
      'Tập quán mua bán vật tư nông nghiệp gối vụ tại ĐBSCL là cầu nối tín dụng sống còn giữa đại lý và bà con nông dân. Tuy nhiên, việc ghi chép sổ tay thủ công thường tiềm ẩn nguy cơ sai lệch số dư, nhầm lẫn đơn giá và tranh chấp khi đối soát cuối vụ lúa.',
      'Hệ thống quản lý công nợ hai chiều AgriSage tạo lập quy trình đối soát minh bạch: Mỗi khi đại lý giao vật tư và xuất hóa đơn nợ, phiếu ghi nợ được gửi đến ứng dụng của bà con để nông dân kiểm tra, bấm "Xác nhận nợ" hoặc gửi "Khiếu nại sai lệch" nếu có khác biệt về chủng loại hoặc số lượng.',
      'Khi nông dân gặt lúa và thực hiện trả nợ qua chuyển khoản VietQR hoặc tiền mặt tại quầy, trạng thái được cập nhật "Chờ đại lý đối soát" và gạch nợ ngay lập tức khi thủ quỹ ký nhận, bảo vệ quyền lợi đôi bên tuyệt đối.',
      'Chính sách hạn mức tín dụng theo diện tích canh tác (ví dụ 50.000.000 đ/vụ cho hộ 3.5 hecta) giúp đại lý kiểm soát rủi ro nợ xấu mà vẫn hỗ trợ bà con kịp thời mùa vụ.',
    ],
  },
  {
    slug: 'phong-tru-chay-bia-la-vi-khuan-lua',
    badge: { label: 'Kỹ thuật canh tác', icon: 'eco', className: 'bg-primary-light text-primary' },
    title: 'Phòng trừ bệnh cháy bìa lá vi khuẩn (bạc lá) trên lúa vụ Hè Thu và Thu Đông',
    summary:
      'Vi khuẩn Xanthomonas oryzae lây lan qua vết thương cơ học sau mưa bão. Phác đồ sử dụng Starner hoặc Kasumin kết hợp hạ mực nước ruộng.',
    date: '05/10/2024 · 6 phút đọc',
    content: [
      'Bệnh cháy bìa lá vi khuẩn do vi khuẩn Xanthomonas oryzae pv. oryzae gây ra là một trong những dịch hại nghiêm trọng nhất trên trà lúa ĐBSCL vào mùa mưa bão. Vi khuẩn xâm nhập qua lỗ khí khổng và các vết rách mép lá do gió cọ xát.',
      'Triệu chứng đặc trưng: vết bệnh xuất phát từ mép lá rồi lan dần vào trong thành những sọc dài gợn sóng màu xanh tái, sau chuyển sang vàng và khô bạc trắng. Buổi sáng sớm trên vết bệnh ứa ra các giọt dịch vi khuẩn màu vàng đục như sáp.',
      'Biện pháp xử lý: khi phát hiện chớm bệnh, tuyệt đối không bón thêm đạm hoặc phun phân bón qua lá; rút cạn nước ruộng để ráo bùn 2-3 ngày nhằm hạn chế sự sinh sôi của vi khuẩn.',
      'Phun trừ bằng các dòng thuốc đặc trị vi khuẩn như Bronopol, Oxolinic acid hoặc Kasugamycin (Kasumin 2SL) với liều lượng khuyến cáo. Nên phun vào buổi chiều ráo sương và phun nhắc lại sau 5 ngày nếu điều kiện mưa dầm kéo dài.',
    ],
  },
  {
    slug: 'quan-ly-benh-kho-van-va-lem-lep-hat',
    badge: {
      label: 'Cảnh báo dịch hại',
      icon: 'warning',
      className: 'bg-status-warning-surface text-status-warning',
    },
    title: 'Quản lý bệnh khô vằn và lem lép hạt giai đoạn trổ đều đến chín sáp',
    summary:
      'Nấm Rhizoctonia solani tấn công bẹ lá gây khô vằn ăn lên cổ bông. Hướng dẫn kỹ thuật phòng ngừa lem lép hạt bảo vệ năng suất lúa hạt sáng đẹp.',
    date: '02/10/2024 · 5 phút đọc',
    content: [
      'Bệnh khô vằn do nấm Rhizoctonia solani phát triển từ hạch nấm tồn dư trong rơm rạ vụ trước nổi trên mặt nước. Khi mật độ sạ dày và bón thừa đạm, nấm bám vào bẹ lá sát gốc tạo nên các vết loang lổ như da hổ rồi leo dần lên bẹ lá đòng.',
      'Giai đoạn trổ lẹt xẹt (5% bông trổ) và trổ đều (sau đó 5-7 ngày) là thời điểm xung yếu nhất quyết định hạt lúa có bị lem lép hay không. Việc phòng trừ kép bệnh khô vằn và nấm gây lem lép hạt bằng Hexaconazole (Anvil 5SC) hoặc Validamycin (Validacin 5SL) là bắt buộc.',
      'Khi phun, bà con lưu ý hạ béc phun thấp hướng vào gốc bẹ lúa nơi tập trung ổ bệnh khô vằn để dung dịch thuốc tiếp xúc trực tiếp với sợi nấm.',
      'Giữ ruộng thông thoáng và tuân thủ thời gian cách ly để sản phẩm lúa thương phẩm đạt chuẩn xuất khẩu chất lượng cao theo đề án 1 triệu hecta lúa ĐBSCL.',
    ],
  },
  {
    slug: 'phoi-tron-phan-bon-la-thuoc-bvtv-lua',
    badge: { label: 'Kỹ thuật canh tác', icon: 'eco', className: 'bg-primary-light text-primary' },
    title: 'Hướng dẫn phối trộn thuốc BVTV và dinh dưỡng lá cho lúa tránh phản ứng kết tủa',
    summary:
      'Nguyên tắc phối thuốc BVTV trên đồng lúa: WP trước, SC/EC sau, dinh dưỡng hòa tan sau cùng. Tránh phối Canxi với lân hữu cơ gây nghẹt béc phun.',
    date: '28/09/2024 · 8 phút đọc',
    content: [
      'Để tiết kiệm công lao động và chi phí máy bay phun thuốc (drone), bà con canh tác lúa tại Cần Thơ và miền Tây thường pha chung nhiều loại thuốc BVTV và phân bón lá trong cùng một bình phun. Tuy nhiên, việc phối sai thứ tự có thể gây kết tủa, đóng váng làm nghẹt béc hoặc giảm hiệu lực trừ dịch hại.',
      'Thứ tự hòa tan thuốc chuẩn: Nước sạch (1/2 bình) -> Thuốc bột hòa tan (WP, WG) -> Dạng sữa/nhũ dầu (SC, EC) -> Phân bón lá vi lượng -> Thêm nước đủ dung tích bình -> Khuấy đều nhẹ nhàng.',
      'Quy tắc cấm kỵ: Không pha chung thuốc có tính kiềm mạnh (vôi, Booc-đô) với thuốc lân hữu cơ hoặc Carbamate; không pha phân bón lá có Canxi với phân có gốc Phosphat hoặc Sunfat vì sẽ kết tủa thành thạch cao không tan.',
      'Nên thử nghiệm trước một ca nhỏ (1-2 lít), quan sát trong 15 phút nếu dung dịch đồng nhất, không phân lớp, không tỏa nhiệt thì mới tiến hành pha cho toàn bộ diện tích ruộng.',
    ],
  },
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}
