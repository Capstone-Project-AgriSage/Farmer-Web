import { Link, useNavigate } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { formatVnd } from '../../data/format'
import { useCart } from '../../context/CartContext'

const VOUCHER_DISCOUNT = 50000
const FREE_SHIPPING_THRESHOLD = 2000000

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeFromCart, clearCart } = useCart()
  const navigate = useNavigate()

  const discount = items.length > 0 ? VOUCHER_DISCOUNT : 0
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 30000
  const total = subtotal - discount + shippingFee

  if (items.length === 0) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Danh mục vật tư', to: '/products' }, { label: 'Giỏ hàng của tôi' }]} />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <span className="material-symbols-outlined text-primary text-6xl">shopping_basket</span>
          <h1 className="text-xl font-bold text-text-primary mt-4">Giỏ hàng của bạn đang trống</h1>
          <Link to="/products" className="inline-block mt-4 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold text-sm rounded-lg">
            Tiếp tục mua vật tư
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Danh mục vật tư', to: '/products' }, { label: 'Giỏ hàng của tôi' }]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[28px]">shopping_basket</span>
              Giỏ hàng của bạn
              <span className="text-sm font-semibold text-text-muted bg-surface-secondary px-2.5 py-0.5 rounded-full border border-border-subtle">
                ({items.length} sản phẩm)
              </span>
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-status-error hover:underline flex items-center gap-1 font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
            <span>Xóa tất cả</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-3.5 bg-surface-subtle border-b border-border-subtle text-xs font-bold text-text-secondary uppercase tracking-wider">
                <div className="col-span-6">Sản phẩm vật tư</div>
                <div className="col-span-2 text-center">Đơn giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-right">Thành tiền</div>
              </div>
              <div className="divide-y divide-border-subtle">
                {items.map((item, idx) => (
                  <div
                    key={item.product.slug}
                    className={`p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center ${idx % 2 === 1 ? 'bg-surface-subtle/30' : ''}`}
                  >
                    <div className="sm:col-span-6 flex items-center gap-3.5">
                      <div className="w-20 h-20 rounded-xl border border-border-subtle bg-surface-subtle p-1.5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <img
                          alt={item.product.name}
                          className="w-full h-full object-contain hover:scale-105 transition-transform"
                          src={item.product.image}
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-primary font-bold text-[10px]">
                            {item.product.brand}
                          </span>
                          <span className="text-[10px] text-status-success font-medium flex items-center gap-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-status-success"></span> {item.product.stockLabel}
                          </span>
                        </div>
                        <Link to={`/products/${item.product.slug}`}>
                          <h3 className="text-sm font-bold text-text-primary leading-snug hover:text-primary transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        <div className="text-xs text-text-muted">
                          Quy cách: <span className="font-medium text-text-secondary">{item.product.packaging}</span>
                        </div>
                      </div>
                    </div>
                    <div className="sm:col-span-2 text-left sm:text-center">
                      <span className="sm:hidden text-xs text-text-muted mr-1">Đơn giá:</span>
                      <span className="text-xs sm:text-sm font-bold text-text-primary">{formatVnd(item.product.price)}</span>
                    </div>
                    <div className="sm:col-span-2 flex items-center sm:justify-center gap-2">
                      <div className="flex items-center border border-border-subtle rounded-lg bg-white overflow-hidden shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.product.slug, item.quantity - 1)}
                          className="px-2.5 py-1 text-text-secondary hover:bg-surface-subtle font-bold text-xs transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-text-primary">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.slug, item.quantity + 1)}
                          className="px-2.5 py-1 text-text-secondary hover:bg-surface-subtle font-bold text-xs transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-2">
                      <span className="sm:hidden text-xs text-text-muted">Thành tiền:</span>
                      <div className="text-sm font-extrabold text-primary whitespace-nowrap">
                        {formatVnd(item.product.price * item.quantity)}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.slug)}
                        className="text-text-muted hover:text-status-error p-1 rounded transition-colors ml-1"
                        title="Xóa sản phẩm"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border-subtle p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
                  Mã ưu đãi mùa vụ / Voucher AgriSage
                </label>
                <div className="flex items-center gap-2 max-w-md">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-text-muted">
                      confirmation_number
                    </span>
                    <input
                      className="w-full pl-9 pr-3 py-2 text-xs font-bold font-mono uppercase bg-surface-subtle border border-border-subtle rounded-lg focus:outline-none focus:ring-0 text-primary"
                      type="text"
                      defaultValue="VUMUA2024"
                    />
                  </div>
                  <button className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-colors shadow-sm flex-shrink-0">
                    Áp dụng
                  </button>
                </div>
                <div className="text-[11px] text-status-success font-medium mt-1.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Mã "VUMUA2024" đã áp dụng: Giảm {formatVnd(VOUCHER_DISCOUNT)} cho đơn hàng mùa mưa
                </div>
              </div>
              <div className="pt-2 sm:pt-0 sm:border-l sm:border-border-subtle sm:pl-6 flex items-center">
                <Link to="/products" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Tiếp tục chọn mua vật tư nông nghiệp</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {[
                ['local_shipping', 'Giao xe tải tận vườn', 'Miễn phí cho đơn từ 2.000.000 đ'],
                ['assignment_return', 'Đổi trả miễn phí 7 ngày', 'Bao đổi bao bể vỡ do vận chuyển'],
                ['inventory_2', 'Hỗ trợ bốc dỡ kho bãi', 'Nhân viên khiêng xếp vào kho vườn'],
              ].map(([icon, title, desc]) => (
                <div key={title} className="p-3.5 rounded-xl bg-surface-secondary border border-border-subtle flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-status-success-surface text-status-success flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-text-primary">{title}</div>
                    <div className="text-text-muted text-[11px]">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-sm space-y-5">
              <h2 className="text-base font-bold text-text-primary pb-3 border-b border-border-subtle flex items-center justify-between">
                <span>Tóm tắt đơn hàng</span>
                <span className="text-xs font-normal text-text-muted">Mã đơn tạm: #AGR-8842</span>
              </h2>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-text-secondary">
                  <span>Tạm tính ({items.length} sản phẩm):</span>
                  <span className="font-semibold text-text-primary text-sm">{formatVnd(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-text-secondary">
                  <span className="flex items-center gap-1">
                    <span>Giảm giá Voucher mùa vụ:</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-status-success font-bold">
                      VUMUA2024
                    </span>
                  </span>
                  <span className="font-bold text-status-success">-{formatVnd(discount)}</span>
                </div>
                <div className="flex items-center justify-between text-text-secondary">
                  <span>Phí vận chuyển xe tải tận vườn:</span>
                  <span className="font-bold text-status-success uppercase">
                    {shippingFee === 0 ? 'Miễn phí' : formatVnd(shippingFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-text-secondary">
                  <span>Thuế VAT (Hóa đơn đỏ điện tử):</span>
                  <span className="text-text-muted font-medium">Đã bao gồm</span>
                </div>
              </div>
              <div className="pt-4 border-t border-border-subtle">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm font-bold text-text-primary">Tổng tiền thanh toán:</span>
                  <span className="text-2xl font-extrabold text-primary tracking-tight">{formatVnd(total)}</span>
                </div>
                <div className="text-right text-[11px] text-status-success font-medium flex items-center justify-end gap-1">
                  <span className="material-symbols-outlined text-[13px]">trending_down</span>
                  Tiết kiệm {formatVnd(discount)} cho mùa vụ này
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3.5 px-4 bg-primary hover:bg-primary-hover text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-floating flex items-center justify-center gap-2 group"
              >
                <span>TIẾN HÀNH ĐẶT HÀNG &amp; THANH TOÁN</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
              <div className="p-3.5 rounded-xl bg-surface-secondary/70 border border-border-subtle space-y-2 text-xs">
                <div className="flex items-center gap-2 text-text-primary font-semibold">
                  <span className="material-symbols-outlined text-primary text-[18px]">credit_score</span>
                  <span>Hỗ trợ Sổ nợ mùa vụ AgriCredit</span>
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed pl-6.5">
                  Hạn mức thanh toán sau vụ thu hoạch 0% lãi suất dành cho đại lý và nông hộ liên kết.
                </p>
                <div className="flex items-center gap-2 pt-1 border-t border-border-subtle text-[11px] text-text-muted">
                  <span className="material-symbols-outlined text-[15px] text-status-success">verified</span>
                  <span>Thanh toán VietQR / Thẻ ATM / Tiền mặt COD khi nhận hàng</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-border-subtle p-4 shadow-sm text-xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-status-info-surface text-status-info flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[20px]">support_agent</span>
              </div>
              <div className="flex-1">
                <div className="font-bold text-text-primary">Kỹ sư tư vấn liều lượng &amp; phối trộn</div>
                <div className="text-text-muted text-[11px]">Kiểm tra đơn thuốc bảo vệ thực vật trước khi giao</div>
              </div>
              <a className="font-extrabold text-primary text-sm hover:underline flex-shrink-0" href="tel:19006828">
                1900 6828
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
