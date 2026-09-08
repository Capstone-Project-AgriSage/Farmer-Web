import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import ProductCard from '../../components/ui/ProductCard'
import { products } from '../../data/mockProducts'

const categoryFilters = [
  { label: 'Thuốc BVTV & Trừ nấm', count: 124, checked: true },
  { label: 'Phân bón NPK & Vi lượng', count: 86, checked: false },
  { label: 'Phân hữu cơ vi sinh', count: 45, checked: false },
  { label: 'Hạt giống & Cây giống', count: 38, checked: false },
  { label: 'Thuốc trừ sâu sinh học', count: 52, checked: false },
  { label: 'Tưới nhỏ giọt & Thiết bị', count: 25, checked: false },
]

const brandFilters = [
  { label: 'Syngenta Thụy Sĩ', count: 32, checked: true },
  { label: 'Bayer CropScience', count: 28, checked: true },
  { label: 'Bình Điền - Đầu Trâu', count: 40, checked: false },
  { label: 'Tập đoàn Lộc Trời', count: 35, checked: false },
  { label: 'Đạm Phú Mỹ', count: 18, checked: false },
]

const diseaseFilters = [
  'Thán thư, xì mủ sầu riêng',
  'Rỉ sắt, nấm hồng cà phê',
  'Rệp sáp & Tuyến trùng rễ',
  'Vàng lá, thối rễ mùa mưa',
]

export default function ProductsPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Trang chủ', to: '/' },
          { label: 'Danh mục sản phẩm', to: '/products' },
          { label: 'Tất cả vật tư nông nghiệp' },
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Vật Tư &amp; Nông Dược Chính Hãng Cho Mùa Vụ
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Hệ thống phân phối phân bón NPK, hữu cơ vi sinh, hạt giống và thuốc BVTV đạt chuẩn,
              hỗ trợ bảo lãnh công nợ và giao tận vườn.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-status-success-surface text-status-success rounded-lg border border-primary/20 text-xs font-semibold">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>100% Chính Hãng &amp; Tem VAT</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border-subtle p-3.5 shadow-sm mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted text-[20px]">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted bg-surface-subtle border border-border-subtle rounded-lg focus:outline-none focus:border-primary"
              placeholder="Tìm theo tên thuốc, hoạt chất (Azoxystrobin, Mancozeb...), thương hiệu (Bayer, Syngenta, Lộc Trời)..."
              type="text"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-secondary font-medium whitespace-nowrap">Sắp xếp:</span>
              <select className="text-xs font-medium text-text-primary bg-surface-subtle border border-border-subtle rounded-lg px-3 py-2 focus:outline-none focus:border-primary">
                <option>Bán chạy nhất</option>
                <option>Mới nhất</option>
                <option>Giá thấp đến cao</option>
                <option>Giá cao đến thấp</option>
              </select>
            </div>
            <div className="text-xs text-text-muted font-medium border-l border-border-subtle pl-3">
              Hiển thị <span className="font-bold text-text-primary">1 - {products.length}</span> trên{' '}
              <span className="font-bold text-text-primary">320</span> sản phẩm
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-xl border border-border-subtle p-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-3">
                <h2 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">filter_alt</span>
                  <span>Bộ lọc tìm kiếm</span>
                </h2>
                <button className="text-[11px] text-primary hover:underline font-semibold">
                  Thiết lập lại
                </button>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    Danh mục sản phẩm
                  </h3>
                  <div className="space-y-1.5 text-xs text-text-secondary">
                    {categoryFilters.map((f) => (
                      <label key={f.label} className="flex items-center justify-between hover:text-primary cursor-pointer">
                        <div className="flex items-center gap-2">
                          <input defaultChecked={f.checked} className="rounded text-primary focus:ring-primary h-3.5 w-3.5" type="checkbox" />
                          <span>{f.label}</span>
                        </div>
                        <span className="text-[11px] text-text-muted">({f.count})</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="pt-3 border-t border-border-subtle space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    Thương hiệu nổi bật
                  </h3>
                  <div className="space-y-1.5 text-xs text-text-secondary">
                    {brandFilters.map((f) => (
                      <label key={f.label} className="flex items-center justify-between hover:text-primary cursor-pointer">
                        <div className="flex items-center gap-2">
                          <input defaultChecked={f.checked} className="rounded text-primary focus:ring-primary h-3.5 w-3.5" type="checkbox" />
                          <span>{f.label}</span>
                        </div>
                        <span className="text-[11px] text-text-muted">({f.count})</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="pt-3 border-t border-border-subtle space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    Phòng trị bệnh cây trồng
                  </h3>
                  <div className="space-y-1.5 text-xs text-text-secondary">
                    {diseaseFilters.map((label) => (
                      <label key={label} className="flex items-center gap-2 hover:text-primary cursor-pointer">
                        <input className="rounded text-primary focus:ring-primary h-3.5 w-3.5" type="checkbox" />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="pt-3 border-t border-border-subtle space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    Khoảng giá (VND)
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input
                      className="w-full px-2 py-1.5 rounded border border-border-subtle bg-surface-subtle text-text-primary focus:outline-none focus:border-primary"
                      placeholder="0 đ"
                      type="text"
                      defaultValue="0"
                    />
                    <input
                      className="w-full px-2 py-1.5 rounded border border-border-subtle bg-surface-subtle text-text-primary focus:outline-none focus:border-primary"
                      placeholder="1.500.000 đ"
                      type="text"
                      defaultValue="1.500.000"
                    />
                  </div>
                </div>
                <div className="pt-3 border-t border-border-subtle space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    Tiện ích &amp; Dịch vụ
                  </h3>
                  <div className="space-y-1.5 text-xs text-text-secondary">
                    <label className="flex items-center gap-2 hover:text-primary cursor-pointer">
                      <input defaultChecked className="rounded text-primary focus:ring-primary h-3.5 w-3.5" type="checkbox" />
                      <span>Sẵn hàng tại kho Di Linh</span>
                    </label>
                    <label className="flex items-center gap-2 hover:text-primary cursor-pointer">
                      <input defaultChecked className="rounded text-primary focus:ring-primary h-3.5 w-3.5" type="checkbox" />
                      <span>Hỗ trợ nợ vụ (AgriCredit)</span>
                    </label>
                    <label className="flex items-center gap-2 hover:text-primary cursor-pointer">
                      <input className="rounded text-primary focus:ring-primary h-3.5 w-3.5" type="checkbox" />
                      <span>Giao hỏa tốc 2-4h</span>
                    </label>
                  </div>
                </div>
                <button className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  <span>Áp dụng bộ lọc</span>
                </button>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>

            <div className="mt-10 bg-white rounded-xl border border-border-subtle p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span>Hiển thị</span>
                <select className="text-xs font-medium text-text-primary bg-surface-subtle border border-border-subtle rounded px-2 py-1 focus:outline-none focus:border-primary">
                  <option>12 sản phẩm / trang</option>
                  <option>24 sản phẩm / trang</option>
                  <option>48 sản phẩm / trang</option>
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  disabled
                  className="w-8 h-8 rounded-lg border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded-lg bg-primary text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  1
                </button>
                {[2, 3, 4].map((p) => (
                  <button
                    key={p}
                    className="w-8 h-8 rounded-lg border border-border-subtle text-text-primary hover:bg-surface-subtle font-medium text-xs flex items-center justify-center transition-colors"
                  >
                    {p}
                  </button>
                ))}
                <span className="px-1 text-xs text-text-muted">...</span>
                <button className="w-8 h-8 rounded-lg border border-border-subtle text-text-primary hover:bg-surface-subtle font-medium text-xs flex items-center justify-center transition-colors">
                  27
                </button>
                <button className="w-8 h-8 rounded-lg border border-border-subtle flex items-center justify-center text-text-primary hover:bg-surface-subtle transition-colors">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-gradient-to-r from-emerald-50 via-surface-secondary to-primary-light border border-primary/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="material-symbols-outlined text-[26px]">psychology</span>
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-text-primary">
                    Chưa rõ cây trồng bị bệnh gì để chọn thuốc?
                  </h4>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Chụp ảnh lá gửi Bác sĩ AI chẩn đoán bệnh tức thì trong 3 giây và nhận ngay đơn
                    thuốc chuẩn xác.
                  </p>
                </div>
              </div>
              <Link
                to="/#ai-diagnosis"
                className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                <span>Quét lá cây với AI</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
