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
    <>
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Giới thiệu' }]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
              VỀ AGRISAGE
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Hệ Sinh Thái Nông Nghiệp Số Đồng Hành Cùng Nhà Nông
            </h1>
            <p className="text-sm text-text-secondary mt-3 leading-relaxed">
              AgriSage là nền tảng quản trị vật tư nông nghiệp toàn diện, kết hợp trợ lý AI nhận diện
              bệnh hại cây trồng qua ảnh chụp. Chúng tôi giúp đại lý quản lý tồn kho, sổ nợ mùa vụ
              minh bạch, đồng thời hỗ trợ nông dân tiếp cận vật tư chính hãng và kỹ thuật canh tác
              hiệu quả — không phải là tốt, mà là tốt nhất.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden shadow-md border border-border-subtle aspect-[4/3]">
              <img
                src="/images/misc/hero-farmer-phone.jpg"
                alt="Nông dân dùng điện thoại chụp ảnh cây trồng để chẩn đoán AI ngoài đồng"
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-border-subtle p-5 text-center shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-primary">{s.value}</div>
              <div className="text-xs text-text-secondary mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
            HÀNH TRÌNH
          </div>
          <h2 className="text-xl font-bold text-text-primary tracking-tight mb-6">
            Từ một đại lý nhỏ ở Di Linh đến hệ sinh thái số
          </h2>
          <div className="relative pl-8 sm:pl-10 space-y-8 before:content-[''] before:absolute before:left-[11px] sm:before:left-[13px] before:top-2 before:bottom-2 before:w-px before:bg-border-subtle">
            {timeline.map((t) => (
              <div key={t.year} className="relative">
                <span className="absolute -left-8 sm:-left-10 top-0.5 w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center ring-4 ring-surface-subtle">
                  {t.year.slice(2)}
                </span>
                <div className="text-xs font-bold text-primary">{t.year}</div>
                <h3 className="text-sm font-bold text-text-primary mt-0.5">{t.title}</h3>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed max-w-2xl">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold text-text-primary tracking-tight mb-6">
            Giá trị cốt lõi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-xl border border-border-subtle p-5 flex items-start gap-4 shadow-sm">
                <div className="w-11 h-11 rounded-lg bg-primary-light text-primary flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[22px]">{v.icon}</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">{v.title}</h3>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                LĨNH VỰC VẬT TƯ
              </div>
              <h2 className="text-xl font-bold text-text-primary tracking-tight">
                6 nhóm vật tư chúng tôi cung ứng chính hãng
              </h2>
            </div>
            <Link
              to="/products"
              className="text-sm font-semibold text-primary hover:text-primary-dark flex items-center gap-1 hover:underline shrink-0"
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
                className="group rounded-xl overflow-hidden border border-border-subtle shadow-sm hover:shadow-md hover:border-primary transition-all bg-white"
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
                  <h3 className="text-[11px] sm:text-xs font-bold text-text-primary group-hover:text-primary transition-colors leading-snug">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
            MẠNG LƯỚI
          </div>
          <h2 className="text-xl font-bold text-text-primary tracking-tight mb-6">
            2 chi nhánh kho vận, 1 trung tâm điều hành
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {branches.map((b) => (
              <div key={b.title} className="bg-white rounded-xl border border-border-subtle p-5 shadow-sm">
                <div className="w-11 h-11 rounded-lg bg-primary-light text-primary flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[22px]">{b.icon}</span>
                </div>
                <h3 className="text-sm font-bold text-text-primary">{b.title}</h3>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed">{b.address}</p>
                <p className="text-[11px] text-text-muted mt-2">{b.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-gradient-to-r from-primary-dark via-[#1a5b22] to-primary text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold">Sẵn sàng số hóa mùa vụ cùng AgriSage?</h3>
            <p className="text-sm text-emerald-100/90 mt-1">
              Đăng ký tài khoản để trải nghiệm mua vật tư chính hãng và chẩn đoán AI miễn phí.
            </p>
          </div>
          <Link
            to="/register"
            className="px-5 py-2.5 bg-white text-primary-dark hover:bg-emerald-50 text-sm font-bold rounded-lg shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <span>Đăng ký ngay</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </>
  )
}
