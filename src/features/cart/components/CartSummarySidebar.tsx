import { formatVnd } from '../../../data/format'
import OrderTotalSummary from '../../../components/ui/OrderTotalSummary'

interface CartSummarySidebarProps {
  itemCount: number
  subtotal: number
  discount: number
  appliedVoucher: string | null
  shippingFee: number
  total: number
  onCheckout: () => void
}

export default function CartSummarySidebar({
  itemCount,
  subtotal,
  discount,
  appliedVoucher,
  shippingFee,
  total,
  onCheckout,
}: CartSummarySidebarProps) {
  return (
    <div className="lg:col-span-4 space-y-5">
      <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-sm space-y-5">
        <h2 className="text-base font-bold text-text-primary pb-3 border-b border-border-subtle flex items-center justify-between">
          <span>Tóm tắt đơn hàng</span>
          <span className="text-xs font-normal text-text-muted">Mã đơn tạm: #AGR-8842</span>
        </h2>
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between text-text-secondary">
            <span>Tạm tính ({itemCount} sản phẩm):</span>
            <span className="font-semibold text-text-primary text-sm">{formatVnd(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-text-secondary">
            <span className="flex items-center gap-1">
              <span>Giảm giá Voucher mùa vụ:</span>
              {appliedVoucher && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-status-success font-bold">
                  {appliedVoucher}
                </span>
              )}
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
        <OrderTotalSummary total={total} discount={discount} />
        <button
          onClick={onCheckout}
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
  )
}
