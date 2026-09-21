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
      <div className="bg-white border border-brand-dark/10 p-6 space-y-5">
        <h2 className="text-base font-helvetica-neue tracking-tight text-brand-dark pb-3 border-b border-brand-dark/10 flex items-center justify-between">
          <span>Tóm tắt đơn hàng</span>
          <span className="text-xs text-brand-dark/45 tracking-wide">Mã đơn tạm: #DH-2024-8842</span>
        </h2>
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between text-brand-dark/60">
            <span>Tạm tính ({itemCount} sản phẩm):</span>
            <span className="text-brand-dark text-sm tracking-tight">{formatVnd(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-brand-dark/60">
            <span className="flex items-center gap-1">
              <span>Giảm giá Voucher mùa vụ:</span>
              {appliedVoucher && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-dark text-white tracking-wide">
                  {appliedVoucher}
                </span>
              )}
            </span>
            <span className="text-brand-green">-{formatVnd(discount)}</span>
          </div>
          <div className="flex items-center justify-between text-brand-dark/60">
            <span>Phí vận chuyển xe tải tận vườn:</span>
            <span className="text-brand-green uppercase tracking-wide">
              {shippingFee === 0 ? 'Miễn phí' : formatVnd(shippingFee)}
            </span>
          </div>
          <div className="flex items-center justify-between text-brand-dark/60">
            <span>Thuế VAT (Hóa đơn đỏ điện tử):</span>
            <span className="text-brand-dark/45">Đã bao gồm</span>
          </div>
        </div>
        <OrderTotalSummary total={total} discount={discount} />
        <button
          onClick={onCheckout}
          className="w-full py-3.5 px-4 rounded-full bg-brand-dark text-white hover:bg-brand-green tracking-wide uppercase text-sm transition-colors flex items-center justify-center gap-2 group"
        >
          <span>Tiến hành đặt hàng &amp; thanh toán</span>
          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
        <div className="p-3.5 bg-brand-light border border-brand-dark/10 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-brand-dark">
            <span className="material-symbols-outlined text-brand-dark/60 text-[18px]">credit_score</span>
            <span>Hỗ trợ Sổ nợ mùa vụ AgriCredit</span>
          </div>
          <p className="text-[11px] text-brand-dark/55 leading-relaxed pl-6.5">
            Hạn mức thanh toán sau vụ thu hoạch 0% lãi suất dành cho đại lý và nông hộ liên kết.
          </p>
          <div className="flex items-center gap-2 pt-1 border-t border-brand-dark/10 text-[11px] text-brand-dark/45">
            <span className="material-symbols-outlined text-[15px] text-brand-green">verified</span>
            <span>Thanh toán VietQR / Thẻ ATM / Tiền mặt COD khi nhận hàng</span>
          </div>
        </div>
      </div>
      <div className="bg-white border border-brand-dark/10 p-4 text-xs flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-full bg-brand-light text-brand-dark/70 flex items-center justify-center flex-shrink-0 border border-brand-dark/10">
          <span className="material-symbols-outlined text-[20px]">support_agent</span>
        </div>
        <div className="flex-1">
          <div className="font-helvetica-neue tracking-tight text-brand-dark">
            Kỹ sư tư vấn liều lượng &amp; phối trộn
          </div>
          <div className="text-brand-dark/45 text-[11px]">
            Kiểm tra đơn thuốc bảo vệ thực vật trước khi giao
          </div>
        </div>
        <a
          className="text-brand-dark hover:text-brand-green text-sm tracking-tight transition-colors flex-shrink-0"
          href="tel:19006828"
        >
          1900 6828
        </a>
      </div>
    </div>
  )
}
