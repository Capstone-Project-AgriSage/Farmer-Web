import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { formatVnd } from '../../data/format'
import { getProductBySlug, products } from '../../data/mockProducts'
import { useCart } from '../../context/CartContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { handleImageError } from '../../utils/image'

const specOptions = [
  { label: 'Gói 100g', note: 'Pha 40 - 50L nước', price: 48000 },
  { label: 'Gói 500g', note: 'Pha 1 phuy 200L', price: 225000 },
  { label: 'Thùng 100 gói (10kg)', note: 'Giá sỉ trang trại', price: 4600000 },
]

const tabs = [
  { id: 'specs', label: 'Thông số kỹ thuật & Hoạt chất', icon: 'science' },
  { id: 'dosage', label: 'Phác đồ điều trị & Liều lượng phun xịt', icon: 'spa' },
  { id: 'ai', label: 'Bác sĩ cây trồng AI - Chẩn đoán tích hợp', icon: 'psychology' },
] as const

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const product = getProductBySlug(slug ?? '')
  const [quantity, setQuantity] = useState(5)
  const [activeSpec, setActiveSpec] = useState(0)
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['id']>('specs')

  useDocumentTitle(product ? product.name : 'Không tìm thấy sản phẩm')

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-text-primary">Không tìm thấy sản phẩm</h1>
        <Link to="/products" className="text-primary font-semibold hover:underline mt-2 inline-block">
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    )
  }

  const crossSell = products.filter((p) => p.slug !== product.slug).slice(0, 4)

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Trang chủ', to: '/' },
          { label: 'Danh mục sản phẩm', to: '/products' },
          { label: product.category, to: '/products' },
          { label: product.name },
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-sm relative overflow-hidden flex items-center justify-center min-h-[420px]">
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                <span className="px-2.5 py-1 bg-primary text-white text-[11px] font-bold rounded-md shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span> Chính hãng{' '}
                  {product.brand} 100%
                </span>
                <span className="px-2 py-0.5 bg-emerald-50 text-primary border border-primary/20 text-[10px] font-semibold rounded">
                  Tem chống giả QR
                </span>
              </div>
              <span className="absolute top-16 left-3 sm:top-3 sm:left-auto sm:right-3 px-2 py-1 bg-status-success-surface text-status-success text-xs font-semibold rounded-md flex items-center gap-1 border border-status-success/20">
                <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>{' '}
                {product.stockLabel}
              </span>
              <div className="w-full h-80 flex items-center justify-center p-2">
                <img
                  alt={product.name}
                  className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
                  src={product.image}
                  onError={handleImageError}
                />
              </div>
            </div>
            <div className="bg-surface-secondary border border-border-subtle rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">shield</span>
                <span>Cam kết phân phối từ AgriSage</span>
              </h4>
              <div className="grid grid-cols-2 gap-2.5 text-xs text-text-secondary">
                {[
                  ['check_circle', 'Bảo lãnh mùa vụ chính hãng'],
                  ['assignment_return', 'Đổi trả miễn phí 7 ngày'],
                  ['support_agent', 'Kỹ sư tư vấn nông học 24/7'],
                  ['local_shipping', 'Giao tận vườn hỏa tốc 2-4h'],
                ].map(([icon, label]) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-status-success text-[18px]">{icon}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-primary font-semibold">
                    {product.category}
                  </span>
                  <span className="text-text-muted">|</span>
                  <span className="text-text-secondary">
                    Thương hiệu: <strong className="text-text-primary">{product.brand}</strong>
                  </span>
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight leading-snug">
                  {product.name}
                </h1>
                <p className="text-xs sm:text-sm text-text-secondary mt-1">
                  Hoạt chất: {product.activeIngredient}. Quy cách: {product.packaging}.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                {product.rating && (
                  <div className="flex items-center gap-1.5 bg-surface-subtle px-2.5 py-1 rounded-md border border-border-subtle">
                    <div className="flex items-center text-[#F57C00]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="material-symbols-outlined text-[16px] fill">
                          star
                        </span>
                      ))}
                    </div>
                    <span className="font-bold text-text-primary">{product.rating}</span>
                    <span className="text-text-muted">({product.reviewCount} đánh giá từ nhà vườn)</span>
                  </div>
                )}
                {product.soldCount && (
                  <div className="text-text-secondary">
                    Đã bán: <strong className="text-text-primary font-semibold">{product.soldCount.toLocaleString('vi-VN')}</strong>{' '}
                    mùa này
                  </div>
                )}
                <div className="text-status-success font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">inventory</span> Còn hàng sẵn tại kho
                </div>
              </div>

              <div className="bg-surface-secondary/60 border border-border-subtle rounded-xl p-4 sm:p-5 space-y-3.5 shadow-sm">
                <div className="flex items-baseline flex-wrap gap-2.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                    {formatVnd(specOptions[activeSpec].price)}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-text-secondary">
                    / {specOptions[activeSpec].label}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-sm sm:text-base text-text-muted line-through ml-1">
                        {formatVnd(product.originalPrice)}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-status-error-surface text-status-error border border-status-error/20">
                        <span className="material-symbols-outlined text-[13px]">trending_down</span> Tiết
                        kiệm 13%
                      </span>
                    </>
                  )}
                </div>
                {product.wholesalePrice && (
                  <div className="pt-3 border-t border-border-subtle/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs bg-white/60 p-3 rounded-lg border border-border-subtle">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <span className="material-symbols-outlined text-primary text-[18px]">storefront</span>
                      <span>Giá sỉ đại lý:</span>
                      <strong className="text-primary font-bold text-sm sm:text-base">
                        {formatVnd(product.wholesalePrice)}
                      </strong>
                      <span className="text-text-muted text-xs">/ {product.wholesaleUnit}</span>
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-primary-dark text-white font-semibold text-[11px] shadow-sm">
                    <span className="material-symbols-outlined text-[15px]">payments</span> Áp dụng Sổ Nợ
                    Mùa Vụ
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-primary font-semibold text-[11px] border border-primary/20">
                    <span className="material-symbols-outlined text-[15px]">credit_score</span> Hỗ trợ
                    AgriCredit 0% lãi suất thu hoạch trả
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-text-primary">
                    Chọn quy cách đóng gói:
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {specOptions.map((opt, i) => (
                    <button
                      key={opt.label}
                      onClick={() => setActiveSpec(i)}
                      className={`rounded-lg p-2.5 text-left flex flex-col justify-between transition-colors group ${
                        activeSpec === i
                          ? 'border-2 border-primary bg-white text-primary shadow-sm'
                          : 'border border-border-subtle hover:border-primary bg-white text-text-secondary'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-text-primary group-hover:text-primary">
                          {opt.label}
                        </span>
                        {activeSpec === i && <span className="w-2 h-2 rounded-full bg-primary"></span>}
                      </div>
                      <span className="text-[11px] text-text-muted mt-1">{opt.note}</span>
                      <span className="text-xs font-bold text-primary mt-1.5">{formatVnd(opt.price)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex items-center border border-border-subtle rounded-lg bg-white overflow-hidden w-full sm:w-36 justify-between">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3.5 py-2.5 text-text-secondary hover:bg-surface-subtle font-bold text-sm transition-colors"
                    >
                      -
                    </button>
                    <input
                      className="w-12 text-center text-xs font-bold text-text-primary border-none focus:outline-none focus:ring-0 p-0"
                      min={1}
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                    />
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3.5 py-2.5 text-text-secondary hover:bg-surface-subtle font-bold text-sm transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => addToCart(product, quantity)}
                    className="flex-1 py-3 px-4 border-2 border-primary text-primary hover:bg-emerald-50 font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                    <span>Thêm vào giỏ hàng</span>
                  </button>
                  <button
                    onClick={() => {
                      addToCart(product, quantity)
                      navigate('/cart')
                    }}
                    className="flex-1 py-3 px-4 bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">credit_card</span>
                    <span>Mua ngay / Ghi sổ nợ vụ</span>
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-border-subtle text-xs">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <span className="material-symbols-outlined text-primary text-[18px]">phone_in_talk</span>
                    <span>Hotline kỹ sư tư vấn liều lượng sầu riêng, cà phê:</span>
                  </div>
                  <a className="font-bold text-primary hover:underline flex items-center gap-1" href="tel:19006828">
                    <span>1900 6828</span>
                    <span className="text-[10px] text-text-muted font-normal">(Miễn phí)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
          <div className="flex border-b border-border-subtle bg-surface-subtle overflow-x-auto text-xs sm:text-sm font-semibold">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 px-6 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-white'
                    : 'border-transparent text-text-secondary hover:text-primary hover:bg-white/50'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="p-6 sm:p-8 space-y-8">
            {activeTab === 'specs' && (
              <div>
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">biotech</span>
                  <span>Bảng thành phần hóa học &amp; Đặc tính sinh học</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="border border-border-subtle rounded-xl overflow-hidden">
                    <table className="w-full">
                      <tbody className="divide-y divide-border-subtle text-text-secondary">
                        <tr className="bg-surface-subtle">
                          <td className="py-2.5 px-4 font-semibold text-text-primary w-1/3">Hoạt chất chính</td>
                          <td className="py-2.5 px-4 font-medium text-text-primary">{product.activeIngredient}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-semibold text-text-primary">Cơ chế tác động</td>
                          <td className="py-2.5 px-4">Nội hấp, lưu dẫn 2 chiều (từ rễ lên ngọn và từ lá xuống cành)</td>
                        </tr>
                        <tr className="bg-surface-subtle">
                          <td className="py-2.5 px-4 font-semibold text-text-primary">Dạng thuốc phẩm</td>
                          <td className="py-2.5 px-4">WG (Cốm phân tán trong nước - ít sinh bụi khi pha)</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-semibold text-text-primary">Độ độc GHS</td>
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-status-success font-semibold">
                              Nhóm 5 - Rất ít độc với ong và gia súc
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="border border-border-subtle rounded-xl overflow-hidden">
                    <table className="w-full">
                      <tbody className="divide-y divide-border-subtle text-text-secondary">
                        <tr className="bg-surface-subtle">
                          <td className="py-2.5 px-4 font-semibold text-text-primary w-1/3">Thời gian cách ly (PHI)</td>
                          <td className="py-2.5 px-4 font-medium text-text-primary">7 ngày trước khi thu hoạch</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-semibold text-text-primary">Nhà sản xuất</td>
                          <td className="py-2.5 px-4">{product.brand}</td>
                        </tr>
                        <tr className="bg-surface-subtle">
                          <td className="py-2.5 px-4 font-semibold text-text-primary">Đóng gói &amp; Phân phối</td>
                          <td className="py-2.5 px-4">Hệ thống kho vận AgriSage Logistics Di Linh &amp; Cần Thơ</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-semibold text-text-primary">Hạn sử dụng</td>
                          <td className="py-2.5 px-4 font-medium text-status-success">
                            24 tháng kể từ ngày sản xuất (Lô mới T05/2024)
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'dosage' && (
              <div>
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">water_drop</span>
                  <span>Phác đồ điều trị thực tế theo nhóm cây trồng Tây Nguyên &amp; ĐBSCL</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {[
                    {
                      crop: 'Cây Sầu Riêng',
                      tag: 'Đặc trị Phytophthora',
                      disease: 'Nứt thân xì mủ, thối cổ rễ, cháy lá mùa mưa.',
                      guide: [
                        'Phun lá: Pha 100g cho 40 - 50 lít nước sạch, phun ướt đều tán.',
                        'Quét vết nứt: Cạo sạch vết thối, pha sệt 100g với 0.5L nước quét trực tiếp.',
                      ],
                    },
                    {
                      crop: 'Cà Phê & Hồ Tiêu',
                      tag: 'Chống rụng quả non',
                      disease: 'Rỉ sắt nấm hồng trên cà phê, bệnh chết nhanh tiêu mùa mưa lũ.',
                      guide: [
                        'Tưới gốc: Pha 100g cho 50 lít nước, tưới 3 - 5 lít quanh tán gốc mỗi trụ.',
                        'Phun phòng: Định kỳ 15 - 20 ngày trong mùa mưa cao điểm Lâm Đồng.',
                      ],
                    },
                    {
                      crop: 'Rau Màu & Cây Có Múi',
                      tag: 'Lưu dẫn 2 chiều',
                      disease: 'Mốc sương cà chua, sương mai dưa hấu, vàng lá thối rễ cam quýt.',
                      guide: ['Liều dùng: Pha 40g - 50g cho bình 25 lít nước.', 'Lưu ý: Phun khi tỷ lệ bệnh chớm xuất hiện 5% trên ruộng.'],
                    },
                  ].map((item) => (
                    <div key={item.crop} className="p-4 rounded-xl border border-border-subtle bg-surface-subtle/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-text-primary text-sm">{item.crop}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-primary font-semibold text-[10px]">
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-text-secondary leading-relaxed">
                        <strong>Bệnh hại:</strong> {item.disease}
                      </p>
                      <div className="p-2.5 rounded-lg bg-white border border-border-subtle space-y-1 text-text-primary">
                        {item.guide.map((line) => (
                          <p key={line}>• {line}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'ai' && (
              <div className="rounded-xl bg-gradient-to-r from-emerald-50 via-surface-secondary to-primary-light border border-primary/20 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-md flex-shrink-0">
                    <span className="material-symbols-outlined text-[26px]">psychology</span>
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-text-primary">
                      Vườn của bạn đang có biểu hiện lạ nhưng chưa dám chắc chắn?
                    </h4>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Chụp ảnh lá hoặc vỏ thân rỉ mủ gửi cho Bác sĩ AI chẩn đoán ngay sau 3 giây,
                      nhận hướng dẫn pha kèm bám dính hoặc phân vi lượng thích hợp.
                    </p>
                  </div>
                </div>
                <Link
                  to="/ai-doctor"
                  className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                  <span>Quét lá chẩn đoán ngay</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-text-primary tracking-tight">
                Sản phẩm bổ trợ thường dùng kèm
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Bộ giải pháp phục hồi rễ và tăng cường đề kháng sau khi dập dịch nấm bệnh
              </p>
            </div>
            <Link to="/products" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
              <span>Xem tất cả thuốc BVTV</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {crossSell.map((p) => (
              <div
                key={p.slug}
                className="bg-white rounded-xl border border-border-subtle hover:border-primary hover:shadow-card transition-all p-4 flex flex-col justify-between group"
              >
                <Link to={`/products/${p.slug}`}>
                  <div className="relative mb-3 overflow-hidden rounded-lg">
                    <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-primary-dark text-white text-[10px] font-bold rounded shadow-sm">
                      {p.brand}
                    </span>
                    <img
                      src={p.image}
                      alt={p.name}
                      onError={handleImageError}
                      className="w-full h-40 object-contain p-2 bg-surface-subtle rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider">
                    {p.category}
                  </span>
                  <h4 className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2 mt-0.5">
                    {p.name}
                  </h4>
                </Link>
                <div className="pt-3 border-t border-border-subtle mt-3 flex items-center justify-between">
                  <div>
                    {p.originalPrice && (
                      <div className="text-[10px] text-text-muted line-through">{formatVnd(p.originalPrice)}</div>
                    )}
                    <div className="text-sm font-bold text-primary">{formatVnd(p.price)}</div>
                  </div>
                  <button
                    onClick={() => addToCart(p)}
                    className="p-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white transition-colors"
                    title="Thêm"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
