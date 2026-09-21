import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { handleImageError } from '../../utils/image'
import type { ProductGroup } from '../../types'

const stats = [
  { label: 'Nhà vườn & đại lý liên kết', value: '3.200+' },
  { label: 'Sản phẩm vật tư chính hãng', value: '320+' },
  { label: 'Lượt chẩn đoán AI thành công', value: '48.000+' },
  { label: 'Chi nhánh kho vận', value: '2' },
]

const values = [
  {
    icon: 'verified',
    title: 'Chính hãng tuyệt đối',
    desc: '100% vật tư có tem chống giả, hóa đơn VAT điện tử, nguồn gốc truy xuất rõ ràng qua mã QR.',
  },
  {
    icon: 'psychology',
    title: 'Công nghệ AI đồng hành',
    desc: 'Bác sĩ cây trồng AI chẩn đoán bệnh hại qua ảnh chụp trong 3 giây, hỗ trợ miễn phí trọn đời cho nông hộ.',
  },
  {
    icon: 'credit_score',
    title: 'Đồng hành tài chính mùa vụ',
    desc: 'Sổ nợ mùa vụ AgriCredit 0% lãi suất, thanh toán linh hoạt sau thu hoạch, giảm áp lực vốn đầu năm.',
  },
  {
    icon: 'local_shipping',
    title: 'Giao tận vườn nhanh chóng',
    desc: 'Mạng lưới kho vận Lâm Đồng & ĐBSCL, giao vật tư tận vườn trong 2-4 giờ với đơn hỏa tốc.',
  },
]

const timeline = [
  {
    year: '2019',
    title: 'Khởi nguồn từ một đại lý vật tư ở Di Linh',
    desc: 'AgriSage bắt đầu là đại lý phân bón - thuốc BVTV nhỏ tại Lâm Đồng, ghi sổ nợ mùa vụ bằng tay cho hơn 200 nhà vườn cà phê, sầu riêng quen thuộc.',
  },
  {
    year: '2021',
    title: 'Số hóa sổ nợ & mở gian hàng trực tuyến',
    desc: 'Ra mắt nền tảng đặt vật tư trực tuyến đầu tiên, chuyển toàn bộ sổ nợ giấy sang hệ thống AgriCredit minh bạch, tra cứu được mọi lúc.',
  },
  {
    year: '2023',
    title: 'Bác sĩ cây trồng AI ra đời',
    desc: 'Hợp tác cùng kỹ sư nông học huấn luyện mô hình chẩn đoán bệnh hại qua ảnh chụp, mở đầu bằng các bệnh phổ biến trên cà phê và sầu riêng.',
  },
  {
    year: '2024',
    title: 'Mở rộng xuống Đồng bằng Sông Cửu Long',
    desc: 'Thêm chi nhánh kho vận tại Cần Thơ, mở rộng AI chẩn đoán sang cây lúa, phục vụ thêm hàng nghìn nông hộ trồng lúa vùng ĐBSCL.',
  },
]

const categories: { name: string; group: ProductGroup; image: string }[] = [
  { name: 'Phân bón NPK & Vi lượng', group: 'Phân bón NPK & Vi lượng', image: '/images/categories/npk.jpg' },
  { name: 'Thuốc BVTV & Trừ nấm', group: 'Thuốc BVTV & Trừ nấm', image: '/images/categories/bvtv.jpg' },
  { name: 'Phân hữu cơ vi sinh', group: 'Phân hữu cơ vi sinh', image: '/images/categories/huu-co.jpg' },
  { name: 'Hạt giống & Cây giống', group: 'Hạt giống & Cây giống', image: '/images/categories/hat-giong.jpg' },
  { name: 'Tưới nhỏ giọt & Thiết bị', group: 'Tưới nhỏ giọt & Thiết bị', image: '/images/categories/tuoi-nho-giot.jpg' },
  { name: 'Thuốc trừ sâu sinh học', group: 'Thuốc trừ sâu sinh học', image: '/images/categories/sinh-hoc.jpg' },
]

const branches = [
  {
    icon: 'apartment',
    title: 'Trung tâm điều hành',
    address: 'Tòa nhà AgriTech, Khu Công nghệ cao, TP. Hồ Chí Minh',
    note: 'Đội ngũ kỹ sư nông học & vận hành AI',
  },
  {
    icon: 'storefront',
    title: 'Chi nhánh Lâm Đồng',
    address: '142 Hùng Vương, TT. Di Linh, Tỉnh Lâm Đồng',
    note: 'Kho vật tư cà phê, sầu riêng, rau màu',
  },
  {
    icon: 'storefront',
    title: 'Chi nhánh Cần Thơ',
    address: 'Khu vực Ô Môn, TP. Cần Thơ',
    note: 'Kho vật tư lúa gạo & thủy sản Đồng bằng Sông Cửu Long',
  },
]

export default function AboutPage() {
  useDocumentTitle('Giới thiệu')

  return (
    <div className="bg-brand-cream text-brand-dark">
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Giới thiệu' }]} />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <p className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-2 font-helvetica-neue">
              Về AgriSage
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-helvetica-neue tracking-tight text-brand-dark leading-[1.15]">
              Hệ sinh thái nông nghiệp số đồng hành cùng nhà nông
            </h1>
            <p className="text-base text-brand-dark/60 mt-4 leading-relaxed max-w-xl">
              AgriSage là nền tảng quản trị vật tư nông nghiệp toàn diện, kết hợp trợ lý AI nhận diện
              bệnh hại cây trồng qua ảnh chụp. Chúng tôi giúp đại lý quản lý tồn kho, sổ nợ mùa vụ
              minh bạch, đồng thời hỗ trợ nông dân tiếp cận vật tư chính hãng và kỹ thuật canh tác
              hiệu quả — không phải là tốt, mà là tốt nhất.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="overflow-hidden border border-brand-dark/10 aspect-[4/3]">
              <img
                src="/images/misc/hero-farmer-phone.jpg"
                alt="Nông dân dùng điện thoại chụp ảnh cây trồng để chẩn đoán AI ngoài đồng"
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12 md:mt-16 border-t border-brand-dark/10 pt-10">
          {stats.map((s) => (
            <div key={s.label} className="text-center md:text-left">
              <div className="text-2xl sm:text-3xl font-helvetica-neue tracking-tight text-brand-dark">
                {s.value}
              </div>
              <div className="text-xs text-brand-dark/60 mt-1.5 leading-relaxed">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-14 md:mt-16">
          <p className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-2 font-helvetica-neue">
            Hành trình
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-helvetica-neue tracking-tight text-brand-dark mb-8">
            Từ một đại lý nhỏ ở Di Linh đến hệ sinh thái số
          </h2>
          <div className="relative pl-8 sm:pl-10 space-y-8 before:content-[''] before:absolute before:left-[11px] sm:before:left-[13px] before:top-2 before:bottom-2 before:w-px before:bg-brand-dark/15">
            {timeline.map((t) => (
              <div key={t.year} className="relative">
                <span className="absolute -left-8 sm:-left-10 top-0.5 w-6 h-6 rounded-full bg-brand-dark text-white text-[10px] tracking-wide flex items-center justify-center ring-4 ring-brand-cream">
                  {t.year.slice(2)}
                </span>
                <div className="text-xs tracking-[0.2em] text-brand-dark/50 font-helvetica-neue">{t.year}</div>
                <h3 className="text-sm font-helvetica-neue tracking-tight text-brand-dark mt-1">{t.title}</h3>
                <p className="text-sm text-brand-dark/60 mt-1.5 leading-relaxed max-w-2xl">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 md:mt-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-helvetica-neue tracking-tight text-brand-dark mb-8">
            Giá trị cốt lõi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {values.map((v, index) => (
              <div key={v.title} className="border-t border-brand-dark/15 pt-6 flex items-start gap-4">
                <div className="text-xs tracking-[0.2em] text-brand-dark/35 font-helvetica-neue shrink-0 pt-1">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div>
                  <div className="w-10 h-10 flex items-center justify-center text-brand-dark mb-3 -ml-1">
                    <span className="material-symbols-outlined text-[28px]">{v.icon}</span>
                  </div>
                  <h3 className="text-base font-medium text-brand-dark">{v.title}</h3>
                  <p className="text-sm text-brand-dark/60 mt-1.5 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 md:mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-2 font-helvetica-neue">
                Lĩnh vực vật tư
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-helvetica-neue tracking-tight text-brand-dark">
                6 nhóm vật tư chúng tôi cung ứng chính hãng
              </h2>
            </div>
            <Link
              to="/products"
              className="text-sm text-brand-dark/60 hover:text-brand-dark flex items-center gap-1 tracking-wide transition-colors shrink-0"
            >
              <span>Xem toàn bộ sản phẩm</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?group=${encodeURIComponent(cat.group)}`}
                className="group overflow-hidden border border-brand-dark/10 bg-white hover:border-brand-dark/30 transition-colors"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2.5 text-center">
                  <h3 className="text-[11px] sm:text-xs text-brand-dark group-hover:text-brand-green transition-colors leading-snug">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-14 md:mt-16">
          <p className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-2 font-helvetica-neue">
            Mạng lưới
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-helvetica-neue tracking-tight text-brand-dark mb-8">
            2 chi nhánh kho vận, 1 trung tâm điều hành
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {branches.map((b) => (
              <div key={b.title} className="border border-brand-dark/10 bg-white p-6">
                <div className="w-10 h-10 flex items-center justify-center text-brand-dark mb-4">
                  <span className="material-symbols-outlined text-[28px]">{b.icon}</span>
                </div>
                <h3 className="text-base font-medium text-brand-dark">{b.title}</h3>
                <p className="text-sm text-brand-dark/60 mt-1.5 leading-relaxed">{b.address}</p>
                <p className="text-xs text-brand-dark/45 mt-3">{b.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 md:mt-16 border border-brand-dark/10 bg-brand-light p-8 md:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-2 font-helvetica-neue">
              Tham gia
            </p>
            <h3 className="text-xl md:text-2xl font-helvetica-neue tracking-tight text-brand-dark leading-snug">
              Sẵn sàng số hóa mùa vụ cùng AgriSage?
            </h3>
            <p className="text-sm text-brand-dark/60 mt-2 leading-relaxed">
              Đăng ký tài khoản để trải nghiệm mua vật tư chính hãng và chẩn đoán AI miễn phí.
            </p>
          </div>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-7 py-3 bg-brand-dark text-white text-sm tracking-wide uppercase rounded-full hover:bg-brand-green transition-colors whitespace-nowrap shrink-0"
          >
            <span>Đăng ký ngay</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
