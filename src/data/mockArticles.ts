export interface Article {
  badge: { label: string; icon: string; className: string }
  title: string
  summary: string
  date: string
}

export const articles: Article[] = [
  {
    badge: {
      label: 'Cảnh báo dịch hại',
      icon: 'warning',
      className: 'bg-status-warning-surface text-status-warning',
    },
    title: 'Cảnh báo bùng phát bệnh thán thư sầu riêng mùa mưa dầm tại Tây Nguyên',
    summary:
      'Độ ẩm trên 85% là điều kiện nấm Colletotrichum phát triển mạnh. Kỹ sư khuyến cáo bà con cắt tỉa cành thông thoáng và luân phiên hoạt chất Azoxystrobin.',
    date: '12/10/2024 · 5 phút đọc',
  },
  {
    badge: { label: 'Kỹ thuật canh tác', icon: 'eco', className: 'bg-primary-light text-primary' },
    title: 'Quy trình bón thúc đón hoa & tăng tỷ lệ đậu trái cho cây sầu riêng 5 năm tuổi',
    summary:
      'Thời điểm tạo mầm hoa quyết định 70% sản lượng. Hướng dẫn phối hợp phân lân nung chảy kết hợp Kali Sunfat để cây ra hoa đồng loạt, cuống hoa mập.',
    date: '10/10/2024 · 7 phút đọc',
  },
  {
    badge: { label: 'Dành cho đại lý', icon: 'store', className: 'bg-blue-50 text-status-info' },
    title: 'Giải pháp quản lý sổ nợ gối vụ & xuất kho tự động không lo thất thoát',
    summary:
      'Phần mềm AgriSage POS giúp chủ cửa hàng theo dõi hạn mức tín dụng của từng nông hộ, gửi SMS nhắc nợ thân thiện và kiểm soát hạn sử dụng thuốc theo lô.',
    date: '08/10/2024 · 4 phút đọc',
  },
  {
    badge: { label: 'Kỹ thuật canh tác', icon: 'eco', className: 'bg-primary-light text-primary' },
    title: 'Bí quyết phòng trừ rỉ sắt cà phê mùa mưa Tây Nguyên bằng luân phiên hoạt chất',
    summary:
      'Phun luân phiên Hexaconazole và Trifloxystrobin theo chu kỳ 15-20 ngày giúp hạn chế nấm kháng thuốc, giữ vườn cà phê xanh lá đến cuối vụ.',
    date: '05/10/2024 · 6 phút đọc',
  },
  {
    badge: {
      label: 'Cảnh báo dịch hại',
      icon: 'warning',
      className: 'bg-status-warning-surface text-status-warning',
    },
    title: 'Tuyến trùng rễ cà phê đầu mùa mưa: dấu hiệu nhận biết sớm và cách xử lý',
    summary:
      'Rễ tơ bị sần sùi, cây còi cọc dù bón phân đầy đủ là dấu hiệu điển hình. Kỹ sư AgriSage hướng dẫn quy trình xử lý đất kết hợp phân hữu cơ vi sinh.',
    date: '02/10/2024 · 5 phút đọc',
  },
  {
    badge: { label: 'Kỹ thuật canh tác', icon: 'eco', className: 'bg-primary-light text-primary' },
    title: 'Hướng dẫn phối trộn phân bón lá & thuốc BVTV đúng cách, tránh cháy lá',
    summary:
      'Không phải hoạt chất nào cũng pha chung được. Bảng tra nhanh các cặp phân bón lá - thuốc BVTV tương thích, giúp bà con tiết kiệm công phun hai lần.',
    date: '28/09/2024 · 8 phút đọc',
  },
]
