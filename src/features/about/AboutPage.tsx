import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

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

export default function AboutPage() {
  useDocumentTitle('Giới thiệu')

  return (
    <>
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Giới thiệu' }]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl">
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-border-subtle p-5 text-center shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-primary">{s.value}</div>
              <div className="text-xs text-text-secondary mt-1">{s.label}</div>
            </div>
          ))}
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
