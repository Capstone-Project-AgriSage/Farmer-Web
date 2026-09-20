import { Link } from 'react-router-dom'
import { formatVnd } from '../../../data/format'
import { handleImageError } from '../../../utils/image'
import type { CartItem } from '../../../types'

interface OrderSummarySidebarProps {
  items: CartItem[]
  subtotal: number
  discount: number
  shippingFee: number
  total: number
  onConfirm: () => void
}

export default function OrderSummarySidebar({
  items,
  subtotal,
  discount,
  shippingFee,
  total,
  onConfirm,
}: OrderSummarySidebarProps) {
  return (
    <div className="lg:col-span-5 space-y-5 sticky top-20">
      <div className="bg-white border border-brand-dark/10 p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-brand-dark/10">
          <h2 className="text-base font-helvetica-neue tracking-tight text-brand-dark flex items-center gap-2">
            <span>Đơn hàng của bạn</span>
            <span className="text-xs text-brand-dark/50 bg-brand-light px-2 py-0.5 tracking-wide">
              ({items.length} sản phẩm)
            </span>
          </h2>
          <Link
            to="/cart"
            className="text-xs text-brand-green hover:text-brand-dark transition-colors tracking-wide uppercase flex items-center gap-0.5"
          >
            <span className="material-symbols-outlined text-[14px]">edit</span> Sửa
          </Link>
        </div>
        <div className="divide-y divide-brand-dark/10 max-h-72 overflow-y-auto pr-1 space-y-1">
          {items.map((item) => (
            <div key={item.product.slug} className="py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-12 h-12 border border-brand-dark/10 bg-brand-cream p-1 flex-shrink-0 flex items-center justify-center">
                  <img
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                    src={item.product.image}
                    onError={handleImageError}
                  />
                </div>
                <div>
                  <h4 className="text-xs text-brand-dark line-clamp-1">{item.product.name}</h4>
                  <span className="text-[11px] text-brand-dark/50">
                    Số lượng: <strong className="text-brand-dark/70">x{item.quantity}</strong>
                  </span>
                </div>
              </div>
              <span className="text-xs text-brand-dark flex-shrink-0">
                {formatVnd(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="p-2.5 bg-brand-light border border-brand-dark/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-brand-green">
            <span className="material-symbols-outlined text-[16px]">loyalty</span>
            <span>Voucher &quot;VUMUA2024&quot;</span>
          </div>
          <span className="text-brand-green">-{formatVnd(discount)}</span>
        </div>
        <div className="space-y-2.5 text-xs text-brand-dark/60 pt-2 border-t border-brand-dark/10">
          <div className="flex items-center justify-between">
            <span>Tạm tính ({items.length} sản phẩm):</span>
            <span className="text-brand-dark">{formatVnd(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-brand-green">
            <span>Giảm giá Voucher mùa vụ:</span>
            <span>-{formatVnd(discount)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Phí vận chuyển:</span>
            <span className="text-brand-green uppercase tracking-wide">
              {shippingFee === 0 ? 'Miễn phí' : formatVnd(shippingFee)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Thuế VAT (Hóa đơn đỏ điện tử):</span>
            <span className="text-brand-dark/40">Đã bao gồm</span>
          </div>
        </div>
        <div className="pt-4 border-t border-brand-dark/10">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-sm font-helvetica-neue tracking-tight text-brand-dark">
              Tổng tiền thanh toán:
            </span>
            <span className="text-2xl font-helvetica-neue tracking-tight text-brand-dark">
              {formatVnd(total)}
            </span>
          </div>
          <div className="text-right text-[11px] text-brand-green flex items-center justify-end gap-1">
            <span className="material-symbols-outlined text-[13px]">trending_down</span>
            Tiết kiệm {formatVnd(discount)} cho mùa vụ này
          </div>
        </div>
        <button
          onClick={onConfirm}
          type="button"
          className="w-full py-3.5 px-4 rounded-full bg-brand-dark text-white hover:bg-brand-green tracking-wide uppercase text-sm transition-colors flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">verified_user</span>
          <span>Xác nhận đặt hàng ngay</span>
          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
        <div className="space-y-2 pt-2 border-t border-brand-dark/10 text-[11px] text-brand-dark/60">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[15px] text-brand-green flex-shrink-0 mt-0.5">
              verified
            </span>
            <span>Cam kết 100% vật tư chính hãng, tem quét QR nguồn gốc rõ ràng.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[15px] text-brand-green flex-shrink-0 mt-0.5">
              sync
            </span>
            <span>Đổi trả miễn phí trong 7 ngày nếu bao bể rách do vận chuyển.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[15px] text-brand-green flex-shrink-0 mt-0.5">
              support_agent
            </span>
            <span>
              Kỹ sư nông học hỗ trợ kỹ thuật pha thuốc 24/7 qua <strong className="text-brand-dark">1900 6828</strong>.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
