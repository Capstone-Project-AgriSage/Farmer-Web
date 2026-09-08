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
      <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <span>Đơn hàng của bạn</span>
            <span className="text-xs font-semibold text-text-muted bg-surface-secondary px-2 py-0.5 rounded-full">
              ({items.length} sản phẩm)
            </span>
          </h2>
          <Link to="/cart" className="text-xs text-primary hover:underline font-semibold flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[14px]">edit</span> Sửa
          </Link>
        </div>
        <div className="divide-y divide-border-subtle max-h-72 overflow-y-auto pr-1 space-y-1">
          {items.map((item) => (
            <div key={item.product.slug} className="py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-12 h-12 rounded-lg border border-border-subtle bg-surface-subtle p-1 flex-shrink-0 flex items-center justify-center">
                  <img
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                    src={item.product.image}
                    onError={handleImageError}
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-primary line-clamp-1">{item.product.name}</h4>
                  <span className="text-[11px] text-text-muted">
                    Số lượng: <strong>x{item.quantity}</strong>
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-text-primary flex-shrink-0">
                {formatVnd(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="p-2.5 rounded-lg bg-emerald-50 border border-status-success/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-status-success font-semibold">
            <span className="material-symbols-outlined text-[16px]">loyalty</span>
            <span>Voucher "VUMUA2024"</span>
          </div>
          <span className="font-bold text-status-success">-{formatVnd(discount)}</span>
        </div>
        <div className="space-y-2.5 text-xs text-text-secondary pt-2 border-t border-border-subtle">
          <div className="flex items-center justify-between">
            <span>Tạm tính ({items.length} sản phẩm):</span>
            <span className="font-semibold text-text-primary">{formatVnd(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-status-success">
            <span>Giảm giá Voucher mùa vụ:</span>
            <span className="font-bold">-{formatVnd(discount)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Phí vận chuyển:</span>
            <span className="font-bold text-status-success uppercase">
              {shippingFee === 0 ? 'Miễn phí' : formatVnd(shippingFee)}
            </span>
          </div>
          <div className="flex items-center justify-between">
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
          onClick={onConfirm}
          type="button"
          className="w-full py-3.5 px-4 bg-primary hover:bg-primary-hover text-white font-bold text-base rounded-xl transition-all shadow-md hover:shadow-floating flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">verified_user</span>
          <span>XÁC NHẬN ĐẶT HÀNG NGAY</span>
          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
            arrow_forward
          </span>
        </button>
        <div className="space-y-2 pt-2 border-t border-border-subtle text-[11px] text-text-secondary">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[15px] text-status-success flex-shrink-0 mt-0.5">verified</span>
            <span>Cam kết 100% vật tư chính hãng, tem quét QR nguồn gốc rõ ràng.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[15px] text-status-success flex-shrink-0 mt-0.5">sync</span>
            <span>Đổi trả miễn phí trong 7 ngày nếu bao bể rách do vận chuyển.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[15px] text-status-success flex-shrink-0 mt-0.5">support_agent</span>
            <span>
              Kỹ sư nông học hỗ trợ kỹ thuật pha thuốc 24/7 qua <strong>1900 6828</strong>.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
