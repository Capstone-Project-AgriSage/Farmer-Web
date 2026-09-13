export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categoryColor: string;
  categoryIcon: string;
  image: string;
  date: string;
  readTime: number;
  author: string;
  tags: string[];
}

export const articles: Article[] = [
  {
    id: "a1",
    slug: "canh-bao-than-thu-sau-rieng-tay-nguyen",
    title: "Cảnh báo bùng phát bệnh thán thư sầu riêng mùa mưa dầm tại Tây Nguyên",
    excerpt: "Độ ẩm trên 85% là điều kiện nấm Colletotrichum phát triển mạnh. Kỹ sư khuyến cáo bà con cắt tỉa cành thông thoáng và luân phiên hoạt chất Azoxystrobin.",
    content: `
Trong những tuần gần đây, tình trạng bệnh thán thư trên cây sầu riêng tại khu vực Tây Nguyên (Lâm Đồng, Đắk Lắk, Đắk Nông) đang có xu hướng bùng phát mạnh do điều kiện thời tiết mưa nhiều, độ ẩm không khí cao liên tục trên 85%.

## Nguyên nhân bùng phát

Bệnh thán thư do nấm **Colletotrichum gloeosporioides** gây ra. Nấm này phát triển mạnh trong điều kiện:
- Nhiệt độ từ 25-30°C
- Độ ẩm không khí > 80%
- Mưa liên tục nhiều ngày
- Vườn cây rậm rạp, ít thông thoáng

## Triệu chứng nhận biết

- **Trên lá**: Vết bệnh ban đầu nhỏ, màu vàng nhạt, sau lan rộng thành màu nâu xỉn, viền vết bệnh có quầng vàng
- **Trên cành**: Vỏ cành có màu nâu đen, khô và nứt dọc
- **Trên trái**: Vết đốm nâu, lõm xuống, trái dễ thối và rụng

## Biện pháp phòng trị

### Biện pháp canh tác
1. Cắt tỉa cành tạo thông thoáng vườn cây
2. Thu gom và tiêu hủy lá, trái, cành bệnh
3. Tránh tưới nước lên tán lá vào buổi tối

### Biện pháp hóa học
Luân phiên sử dụng các hoạt chất sau để tránh kháng thuốc:
- **Azoxystrobin** (Amistar 250SC): Phun 1,5ml/lít nước
- **Propiconazole** (Tilt 250EC): Phun 0,5ml/lít nước
- **Difenoconazole** (Score 250EC): Phun 0,5ml/lít nước
- **Mancozeb** (Dithane M45): Phun phòng định kỳ

Phun 2-3 lần liên tiếp, mỗi lần cách nhau 7-10 ngày.
    `,
    category: "Cảnh báo dịch hại",
    categoryColor: "warning",
    categoryIcon: "warning",
    image: "https://lh3.googleusercontent.com/aida/AEtjO1X4PNGtFdGdTKuP_q5b4AxicP1QuZ5rEfbRjSKcjG2Cau2keKYL7yK6vxf3bWj4B7RBcVkEYhAnX19LtgqmiRIJnkcPEYgL6UjJDWzBVEqxCesa9A3M6R-zplqVJ_ZSgDC1N3HrzfOouUsYU6BOv43eC6pPG6ldp0OYrMnWWA2AdI2Z83DoW7pyWDjoBjC9KQ7GJ4jBuJC8_nyE9ElFzykX9Pj4_KAJ5qTFPXbPpvFNMQFrvw934RML9tGd",
    date: "12/10/2024",
    readTime: 5,
    author: "KS. Nguyễn Văn Minh",
    tags: ["thán thư", "sầu riêng", "Tây Nguyên", "nấm bệnh", "phòng trị"],
  },
  {
    id: "a2",
    slug: "quy-trinh-bon-thuc-sau-rieng-5-tuoi",
    title: "Quy trình bón thúc đón hoa & tăng tỷ lệ đậu trái cho cây sầu riêng 5 năm tuổi",
    excerpt: "Thời điểm tạo mầm hoa quyết định 70% sản lượng. Hướng dẫn phối hợp phân lân nung chảy kết hợp Kali Sunfat để cây ra hoa đồng loạt, cuống hoa mập.",
    content: `
Giai đoạn ra hoa và đậu trái là quyết định nhất trong chu kỳ sản xuất sầu riêng. Với cây sầu riêng 5 năm tuổi, quản lý dinh dưỡng đúng cách có thể giúp tăng năng suất lên 40-60%.

## Giai đoạn 1: Tạo mầm hoa (Tháng 11 - 12)

Sau thu hoạch khoảng 2-3 tháng, tiến hành xiết nước và bón phân kích thích ra hoa.

**Công thức phân bón**:
- Phân lân nung chảy: 500g/gốc
- Kali Sunfat (SOP): 300g/gốc
- MKP (0-52-34): 150g/gốc (phun lá)

**Lưu ý quan trọng**: Xiết nước hoàn toàn trong 20-25 ngày, chỉ tưới khi thấy lá héo nhẹ vào buổi chiều.

## Giai đoạn 2: Nuôi nụ hoa (Tháng 1 - 2)

Khi nụ hoa xuất hiện và đạt 3-5cm, bắt đầu bón phân nuôi hoa.

**Công thức phân bón**:
- NPK 12-24-12: 400g/gốc
- Calcium Nitrate: 200g/gốc
- Bo lỏng (Boron 11%): Phun lá 2ml/lít

## Giai đoạn 3: Đậu trái và nuôi trái non

Sau khi hoa nở và thụ phấn thành công (3-4 tuần), chuyển sang giai đoạn nuôi trái.

**Công thức phân bón**:
- NPK 20-20-15+TE Đầu Trâu: 500g/gốc
- Phun bổ sung: Canxi + Bo mỗi 10 ngày
    `,
    category: "Kỹ thuật canh tác",
    categoryColor: "success",
    categoryIcon: "eco",
    image: "https://lh3.googleusercontent.com/aida/AEtjO1XgMdBKYJhsBAjdgb9NiGSR9AC4gK7W2hUT-LS4MbKbXOeIZYX-j0uZiFtKiWTbQXu0qCNA2Kc16HESCijed47dy7CgQEBbFhwH2yOpSx-37zLiXfEkUEFK1vcQ_q7IPS7lkY8CfAlfP7e8d1B-R8Tf56aMqd1ZCUQbBM88UQrhhdmjRmLFVRV2LCf7ZCnllvCFNukpoyanY0YJbQnHqmlpYEX3P3vt9TTmFgTm_azXjr51tJGjBcrFUMPI",
    date: "10/10/2024",
    readTime: 7,
    author: "TS. Lê Thị Hương",
    tags: ["sầu riêng", "phân bón", "kỹ thuật canh tác", "ra hoa", "đậu trái"],
  },
  {
    id: "a3",
    slug: "quan-ly-so-no-goi-vu-agrisage",
    title: "Giải pháp quản lý sổ nợ gối vụ & xuất kho tự động không lo thất thoát",
    excerpt: "Phần mềm AgriSage POS giúp chủ cửa hàng theo dõi hạn mức tín dụng của từng nông hộ, gửi SMS nhắc nợ thân thiện và kiểm soát hạn sử dụng thuốc theo lô.",
    content: `
Quản lý công nợ mùa vụ luôn là bài toán khó của các đại lý vật tư nông nghiệp. AgriSage POS ra đời để giải quyết triệt để vấn đề này với công nghệ hiện đại.

## Tính năng quản lý công nợ thông minh

### Theo dõi hạn mức tín dụng theo nông hộ
- Thiết lập hạn mức tín dụng cá nhân hóa cho từng khách hàng
- Cảnh báo tự động khi hạn mức đạt 80%, 90% và 100%
- Lịch sử giao dịch đầy đủ, minh bạch

### Nhắc nợ tự động qua SMS & Zalo
Hệ thống tự động gửi thông báo nhắc nhở thân thiện đến khách hàng trước ngày đến hạn 3-7 ngày, giúp giảm tỷ lệ nợ khó đòi xuống còn 2-3%.

## Quản lý kho hàng thông minh

- Cảnh báo hạn sử dụng thuốc BVTV theo từng lô
- Xuất kho tự động theo nguyên tắc FIFO (nhập trước xuất trước)
- Báo cáo tồn kho real-time trên điện thoại
    `,
    category: "Dành cho đại lý",
    categoryColor: "info",
    categoryIcon: "store",
    image: "https://lh3.googleusercontent.com/aida/AEtjO1UcasajcWUG5lt9IMzzkZCfizSzonIKrqFlpjVjdhn9JRbKHdnb3gO8h7UdmBrBwCuw5z47VUQ9F-7nCFZaKqgmFpWLV0TtvPwVEVKe6wJ6lPNKUL2XMMsWsbS7BtNm6zwNhPfh0ijguD7fArU0o6SIzm2aooI4JY4dLT0BX25HHA-S6NwiKtFK2a_SoOkdgO-zG37LfUUEtCsumjl3Q311AIKijaYTOr3oAhFGvPZQ01DbZ-Rd1kMJtFOj",
    date: "08/10/2024",
    readTime: 4,
    author: "Đội ngũ AgriSage",
    tags: ["quản lý đại lý", "POS", "công nợ", "tồn kho", "AgriSage"],
  },
  {
    id: "a4",
    slug: "phong-tri-tuyen-trung-ca-phe",
    title: "Phòng trị tuyến trùng hại rễ cà phê - Giải pháp toàn diện từ sinh học đến hóa học",
    excerpt: "Tuyến trùng Meloidogyne sp. là nguyên nhân hàng đầu gây vàng lá, còi cọc và chết dần trên cà phê. Hướng dẫn phòng trị kết hợp bền vững.",
    content: `
Tuyến trùng hại rễ (Nematoda) đang trở thành mối đe dọa nghiêm trọng cho vườn cà phê tại Tây Nguyên. Ước tính có tới 60% diện tích cà phê bị nhiễm tuyến trùng ở các mức độ khác nhau.

## Nhận biết vườn cà phê bị tuyến trùng

**Triệu chứng trên mặt đất**:
- Lá vàng từng nhánh rồi lan ra toàn cây
- Cây sinh trưởng kém, ít hoa, trái nhỏ
- Chết dần từng cây theo dạng "chết đứng"

**Kiểm tra bộ rễ**:
- Rễ có u bướu (gall) đặc trưng
- Rễ thối đen, ít rễ tơ
- Rễ bị cắt ngang khi kéo nhẹ

## Biện pháp phòng trị

### Biện pháp sinh học (Ưu tiên)
- **Nấm Trichoderma**: Bón 50g/gốc mỗi 3 tháng
- **Vi khuẩn Bacillus subtilis**: Tưới gốc hàng tháng
- **Phân hữu cơ hoai mục**: Bón 20-30kg/gốc/năm

### Biện pháp hóa học
- **Mocap 10G** (Ethoprophos): Rải gốc 100g/gốc
- **Rugby 10G** (Cadusafos): Rải gốc 80g/gốc
    `,
    category: "Kỹ thuật canh tác",
    categoryColor: "success",
    categoryIcon: "eco",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&h=480&fit=crop&auto=format",
    date: "05/10/2024",
    readTime: 8,
    author: "KS. Trần Minh Khoa",
    tags: ["tuyến trùng", "cà phê", "sinh học", "bảo vệ thực vật"],
  },
  {
    id: "a5",
    slug: "canh-tac-lua-huu-co-vung-dbscl",
    title: "Canh tác lúa hữu cơ vùng ĐBSCL - Cơ hội xuất khẩu giá cao sang EU",
    excerpt: "Tiêu chuẩn hữu cơ EU mở ra cơ hội xuất khẩu lúa gạo Việt Nam với giá gấp 3-5 lần lúa thường. Hướng dẫn quy trình chuyển đổi 3 năm.",
    content: `
Thị trường lúa gạo hữu cơ thế giới đang tăng trưởng 12% mỗi năm, trong đó EU là thị trường tiêu thụ lớn nhất với nhu cầu ngày càng cao.

## Tiêu chuẩn hữu cơ EU cho lúa gạo

Để xuất khẩu vào EU, sản phẩm cần đáp ứng tiêu chuẩn **EC 834/2007** và **EC 889/2008**:

1. Không sử dụng phân bón hóa học tổng hợp trong ít nhất 3 năm
2. Không dùng thuốc BVTV hóa học
3. Hạt giống phải có nguồn gốc hữu cơ
4. Đất phải có chứng nhận chuyển đổi

## Lộ trình chuyển đổi 3 năm

### Năm 1: Giai đoạn chuẩn bị
- Kiểm tra đất và nước
- Ngừng toàn bộ hóa chất
- Bắt đầu bón phân hữu cơ

### Năm 2: Giai đoạn thích nghi
- Xây dựng hệ sinh thái ruộng lúa
- Áp dụng IPM triệt để
- Ghi nhật ký canh tác đầy đủ

### Năm 3: Cấp chứng nhận
- Kiểm định của tổ chức quốc tế
- Xuất khẩu chính thức
    `,
    category: "Nông nghiệp hữu cơ",
    categoryColor: "success",
    categoryIcon: "spa",
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=480&fit=crop&auto=format",
    date: "02/10/2024",
    readTime: 10,
    author: "TS. Phạm Thị Lan",
    tags: ["lúa hữu cơ", "ĐBSCL", "xuất khẩu", "tiêu chuẩn EU"],
  },
  {
    id: "a6",
    slug: "tieu-ho-tieu-bia-lap",
    title: "Kỹ thuật phục hồi vườn tiêu bị hồ tiêu chết nhanh, chết chậm",
    excerpt: "Bệnh chết nhanh do Phytophthora capsici và chết chậm do Fusarium solani là hai bệnh nguy hiểm nhất trên hồ tiêu. Quy trình cứu vườn khẩn cấp.",
    content: `
Bệnh chết nhanh và chết chậm đang tàn phá hàng nghìn hecta tiêu tại Gia Lai, Đắk Lắk và Bình Phước. Nắm vững quy trình điều trị là điều kiện sống còn của vườn tiêu.

## Phân biệt chết nhanh và chết chậm

### Chết nhanh (Phytophthora capsici)
- Cây héo đột ngột sau mưa lớn
- Lá không rụng, vẫn xanh nhưng héo rũ
- Rễ và gốc thân thối đen
- Chết toàn bộ trong 3-7 ngày

### Chết chậm (Fusarium solani)
- Lá vàng dần từ dưới lên
- Rễ thối từ đầu rễ, có màu đen nâu
- Chết dần trong 1-3 tháng

## Quy trình cứu vườn khẩn cấp

1. **Cách ly khu vực bệnh**: Ngăn nước chảy lan sang khu lành
2. **Tưới phòng**: Metalaxyl + Fosetyl-Al vào khu chưa bệnh
3. **Xử lý cây bệnh**: Đào bỏ, vôi + chế phẩm sinh học
4. **Tái canh**: Sau ít nhất 6 tháng, xử lý đất kỹ
    `,
    category: "Cảnh báo dịch hại",
    categoryColor: "warning",
    categoryIcon: "warning",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=480&fit=crop&auto=format",
    date: "28/09/2024",
    readTime: 6,
    author: "KS. Hoàng Văn Thắng",
    tags: ["hồ tiêu", "Phytophthora", "Fusarium", "phục hồi vườn"],
  },
];

export const articleCategories = [
  { label: "Tất cả", value: "" },
  { label: "Cảnh báo dịch hại", value: "Cảnh báo dịch hại" },
  { label: "Kỹ thuật canh tác", value: "Kỹ thuật canh tác" },
  { label: "Dành cho đại lý", value: "Dành cho đại lý" },
  { label: "Nông nghiệp hữu cơ", value: "Nông nghiệp hữu cơ" },
];
