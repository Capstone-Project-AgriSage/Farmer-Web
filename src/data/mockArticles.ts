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
    slug: 'canh-bao-than-thu-sau-rieng-mua-mua',
    badge: {
      label: 'Cảnh báo dịch hại',
      icon: 'warning',
      className: 'bg-status-warning-surface text-status-warning',
    },
    title: 'Cảnh báo bùng phát bệnh thán thư sầu riêng mùa mưa dầm tại Tây Nguyên',
    summary:
      'Độ ẩm trên 85% là điều kiện nấm Colletotrichum phát triển mạnh. Kỹ sư khuyến cáo bà con cắt tỉa cành thông thoáng và luân phiên hoạt chất Azoxystrobin.',
    date: '12/10/2024 · 5 phút đọc',
    content: [
      'Theo ghi nhận của đội ngũ kỹ sư nông học AgriSage tại các vùng trồng sầu riêng trọng điểm Tây Nguyên, độ ẩm không khí liên tục trên 85% trong đợt mưa dầm vừa qua đã tạo điều kiện lý tưởng cho nấm Colletotrichum gloeosporioides - tác nhân gây bệnh thán thư - phát triển và lây lan nhanh trên diện rộng.',
      'Biểu hiện ban đầu là các đốm nâu nhỏ trên lá non và chóp lá, sau đó lan rộng thành mảng cháy khô có viền vàng đặc trưng. Trên trái non, bệnh gây thối đầu trái và xì mủ, ảnh hưởng trực tiếp đến năng suất và chất lượng thương phẩm nếu không được xử lý kịp thời.',
      'Kỹ sư AgriSage khuyến cáo bà con thực hiện đồng thời hai biện pháp: cắt tỉa cành tăm, cành khuất tán để vườn thông thoáng, giảm ẩm độ trong tán lá; đồng thời luân phiên phun các hoạt chất Azoxystrobin, Difenoconazole hoặc Metalaxyl-M + Mancozeb theo chu kỳ 7-10 ngày trong suốt mùa mưa để hạn chế nấm bệnh kháng thuốc.',
      'Đối với vườn đã nhiễm bệnh, cần thu gom và tiêu hủy lá, trái rụng mang mầm bệnh, tránh để tồn lưu qua các vụ sau. Bà con có thể chụp ảnh vùng lá/trái nghi nhiễm và gửi qua tính năng Bác sĩ cây trồng AI để được chẩn đoán nhanh và tư vấn phác đồ phù hợp với mức độ bệnh thực tế của vườn.',
    ],
  },
  {
    slug: 'quy-trinh-bon-thuc-don-hoa-sau-rieng',
    badge: { label: 'Kỹ thuật canh tác', icon: 'eco', className: 'bg-primary-light text-primary' },
    title: 'Quy trình bón thúc đón hoa & tăng tỷ lệ đậu trái cho cây sầu riêng 5 năm tuổi',
    summary:
      'Thời điểm tạo mầm hoa quyết định 70% sản lượng. Hướng dẫn phối hợp phân lân nung chảy kết hợp Kali Sunfat để cây ra hoa đồng loạt, cuống hoa mập.',
    date: '10/10/2024 · 7 phút đọc',
    content: [
      'Với cây sầu riêng 5 năm tuổi bước vào giai đoạn kinh doanh, thời điểm xử lý ra hoa quyết định tới 70% sản lượng cả vụ. Việc bón thúc đúng loại phân, đúng liều lượng và đúng thời điểm giúp cây phân hóa mầm hoa đồng loạt, hạn chế ra hoa rải rác gây khó khăn cho việc chăm sóc và thu hoạch.',
      'Giai đoạn tạo mầm hoa (sau khi lá đã già, cây ngừng sinh trưởng dinh dưỡng), bà con nên bón phân lân nung chảy kết hợp Kali Sunfat theo tỷ lệ khuyến cáo 2:1, giúp hạn chế đạm dư thừa - nguyên nhân chính khiến cây ra đọt non thay vì ra hoa.',
      'Khi mắt cua xuất hiện đồng loạt, chuyển sang bón nhẹ Kali trắng kết hợp phun qua lá Bo và Canxi để cuống hoa mập, hạn chế rụng hoa sinh lý. Duy trì độ ẩm đất ổn định ở mức 30-40% trong giai đoạn này, tránh tưới đẫm đột ngột gây sốc nước làm rụng hoa hàng loạt.',
      'Sau khi đậu trái 3-4 tuần, tiến hành bón thúc nuôi trái với tỷ lệ NPK cân đối, bổ sung trung vi lượng qua lá định kỳ 15 ngày/lần để trái phát triển đều, hạn chế hiện tượng sượng cơm và cháy múi thường gặp ở giai đoạn trái lớn.',
    ],
  },
  {
    slug: 'giai-phap-quan-ly-so-no-goi-vu-dai-ly',
    badge: { label: 'Dành cho đại lý', icon: 'store', className: 'bg-blue-50 text-status-info' },
    title: 'Giải pháp quản lý sổ nợ gối vụ & xuất kho tự động không lo thất thoát',
    summary:
      'Phần mềm AgriSage POS giúp chủ cửa hàng theo dõi hạn mức tín dụng của từng nông hộ, gửi SMS nhắc nợ thân thiện và kiểm soát hạn sử dụng thuốc theo lô.',
    date: '08/10/2024 · 4 phút đọc',
    content: [
      'Một trong những khó khăn lớn nhất của các đại lý vật tư nông nghiệp là quản lý công nợ gối vụ - khi hàng trăm nông hộ mua chịu vật tư đầu vụ và trả nợ sau thu hoạch, thường kéo dài 4-6 tháng. Sổ sách giấy truyền thống rất dễ thất lạc, nhầm lẫn số dư và bỏ sót hạn thanh toán.',
      'Nền tảng AgriSage POS dành cho đại lý cho phép chủ cửa hàng thiết lập hạn mức tín dụng riêng cho từng nông hộ dựa trên lịch sử giao dịch và diện tích canh tác, tự động cộng dồn công nợ mỗi lần xuất kho và cảnh báo khi nông hộ sắp chạm hạn mức.',
      'Hệ thống tự động gửi SMS/Zalo nhắc nợ thân thiện theo lịch trình đã cấu hình (ví dụ 7 ngày và 1 ngày trước hạn), giúp giảm đáng kể tỷ lệ nợ quá hạn mà không cần nhân viên gọi điện thủ công từng trường hợp.',
      'Ngoài ra, mỗi lô hàng xuất kho được gắn số lô và hạn sử dụng ngay từ khi nhập, giúp đại lý kiểm soát nguyên tắc "nhập trước xuất trước", tránh xuất nhầm lô cận hạn và giảm thiểu rủi ro tồn kho thuốc bảo vệ thực vật quá hạn sử dụng.',
    ],
  },
  {
    slug: 'phong-tru-ri-sat-ca-phe-mua-mua',
    badge: { label: 'Kỹ thuật canh tác', icon: 'eco', className: 'bg-primary-light text-primary' },
    title: 'Bí quyết phòng trừ rỉ sắt cà phê mùa mưa Tây Nguyên bằng luân phiên hoạt chất',
    summary:
      'Phun luân phiên Hexaconazole và Trifloxystrobin theo chu kỳ 15-20 ngày giúp hạn chế nấm kháng thuốc, giữ vườn cà phê xanh lá đến cuối vụ.',
    date: '05/10/2024 · 6 phút đọc',
    content: [
      'Bệnh rỉ sắt do nấm Hemileia vastatrix gây ra là mối lo hàng đầu của bà con trồng cà phê tại Tây Nguyên mỗi mùa mưa. Bệnh xuất hiện dưới dạng các đốm bột màu cam ở mặt dưới lá, khiến lá vàng và rụng sớm, làm giảm khả năng quang hợp và ảnh hưởng trực tiếp đến năng suất vụ sau.',
      'Nguyên nhân khiến bệnh khó kiểm soát ở nhiều vườn là do bà con sử dụng lặp lại một loại hoạt chất qua nhiều vụ liên tiếp, khiến nấm bệnh dần kháng thuốc và hiệu quả phòng trừ giảm rõ rệt theo thời gian.',
      'Giải pháp được kỹ sư AgriSage khuyến nghị là luân phiên hai nhóm hoạt chất có cơ chế tác động khác nhau: Hexaconazole (nhóm triazole nội hấp) và Trifloxystrobin (nhóm strobilurin tiếp xúc - lưu dẫn), phun cách nhau theo chu kỳ 15-20 ngày trong suốt mùa mưa.',
      'Song song với biện pháp hóa học, cần chú trọng cắt tỉa cành tăm, cành sát mặt đất để vườn thông thoáng, bón phân cân đối tránh dư đạm, giúp cây khỏe và tăng sức đề kháng tự nhiên trước nấm bệnh, giữ vườn xanh lá ổn định đến cuối vụ thu hoạch.',
    ],
  },
  {
    slug: 'tuyen-trung-re-ca-phe-dau-mua-mua',
    badge: {
      label: 'Cảnh báo dịch hại',
      icon: 'warning',
      className: 'bg-status-warning-surface text-status-warning',
    },
    title: 'Tuyến trùng rễ cà phê đầu mùa mưa: dấu hiệu nhận biết sớm và cách xử lý',
    summary:
      'Rễ tơ bị sần sùi, cây còi cọc dù bón phân đầy đủ là dấu hiệu điển hình. Kỹ sư AgriSage hướng dẫn quy trình xử lý đất kết hợp phân hữu cơ vi sinh.',
    date: '02/10/2024 · 5 phút đọc',
    content: [
      'Tuyến trùng rễ là loại dịch hại âm thầm nhưng gây thiệt hại nghiêm trọng cho vườn cà phê, đặc biệt vào đầu mùa mưa khi đất ẩm tạo điều kiện thuận lợi cho tuyến trùng sinh sôi và tấn công bộ rễ tơ.',
      'Dấu hiệu nhận biết sớm thường bị bà con nhầm lẫn với thiếu dinh dưỡng: cây còi cọc, lá vàng nhạt dù đã bón phân đầy đủ theo quy trình. Khi đào kiểm tra, rễ tơ xuất hiện các nốt sần sùi, rễ ngắn, ít lông hút - hậu quả trực tiếp của tuyến trùng chích hút gây tổn thương mô rễ.',
      'Nếu không xử lý kịp thời, cây sẽ suy yếu dần qua nhiều vụ, tạo điều kiện cho nấm bệnh thứ cấp như Fusarium tấn công gây vàng lá thối rễ, dẫn đến chết cây hàng loạt vào các năm sau.',
      'Quy trình xử lý được khuyến nghị: kết hợp thuốc trừ tuyến trùng gốc sinh học hoặc hóa học chuyên dụng bón quanh gốc theo liều lượng khuyến cáo, đồng thời bổ sung phân hữu cơ vi sinh chứa nấm đối kháng Trichoderma để cải tạo hệ vi sinh đất, giúp bộ rễ phục hồi và tăng sức đề kháng tự nhiên trước tuyến trùng trong các mùa vụ tiếp theo.',
    ],
  },
  {
    slug: 'phoi-tron-phan-bon-la-thuoc-bvtv-dung-cach',
    badge: { label: 'Kỹ thuật canh tác', icon: 'eco', className: 'bg-primary-light text-primary' },
    title: 'Hướng dẫn phối trộn phân bón lá & thuốc BVTV đúng cách, tránh cháy lá',
    summary:
      'Không phải hoạt chất nào cũng pha chung được. Bảng tra nhanh các cặp phân bón lá - thuốc BVTV tương thích, giúp bà con tiết kiệm công phun hai lần.',
    date: '28/09/2024 · 8 phút đọc',
    content: [
      'Để tiết kiệm công phun và chi phí nhân công, nhiều bà con có thói quen pha chung phân bón lá với thuốc bảo vệ thực vật trong cùng một lần phun. Tuy nhiên, không phải hoạt chất nào cũng tương thích - việc phối trộn sai cách có thể gây kết tủa, giảm hiệu lực thuốc, hoặc nghiêm trọng hơn là cháy lá, rụng hoa do phản ứng hóa học giữa các thành phần.',
      'Nguyên tắc chung khi phối trộn: tránh pha chung phân bón lá có chứa Canxi, Magie với thuốc trừ sâu/nấm có tính axit hoặc kiềm mạnh, vì dễ gây kết tủa làm tắc béc phun và giảm khả năng hấp thu qua lá.',
      'Trước khi phối trộn số lượng lớn, bà con nên thử pha một lượng nhỏ trong ca nhựa trong, để 15-20 phút quan sát nếu có hiện tượng kết tủa, sủi bọt bất thường hoặc đổi màu thì tuyệt đối không nên phun đại trà.',
      'Thứ tự pha cũng rất quan trọng: nên hòa tan thuốc BVTV dạng bột trước, sau đó mới thêm phân bón lá dạng nước, khuấy đều tay và phun ngay trong ngày, không để dung dịch đã pha qua đêm vì hiệu lực và độ ổn định sẽ giảm đáng kể, đồng thời nên phun vào sáng sớm hoặc chiều mát để tránh cháy lá do nắng gắt kết hợp hoạt chất.',
    ],
  },
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}
