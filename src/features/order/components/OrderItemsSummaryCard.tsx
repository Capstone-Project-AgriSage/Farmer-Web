import { formatVnd } from '../../../data/format'
import type { OrderResponse } from '../../../api/types'

export default function OrderItemsSummaryCard({ order }: { order: OrderResponse }) {
  const items = order.items || []

  return (
    <div className="bg-white border border-brand-dark/10 p-6">
      <div className="flex items-center justify-between pb-3 border-b border-brand-dark/10 mb-4">
        <h2 className="font-helvetica-neue tracking-tight text-base text-brand-dark">
          Danh sách vật tư đặt mua ({items.length} sản phẩm)
        </h2>
        <span className="font-helvetica-neue text-xs text-brand-dark/40">Mã: {order.orderNumber}</span>
      </div>
      <div className="divide-y divide-brand-dark/10">
        {items.map((item) => (
          <div key={item.id} className="py-3.5 flex items-start gap-3">
            <div className="w-14 h-14 bg-brand-cream border border-brand-dark/10 flex-shrink-0 flex items-center justify-center text-brand-dark/30">
              <span className="material-symbols-outlined text-[24px]">inventory_2</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm text-brand-dark truncate">{item.productName}</h3>
                <span className="text-sm text-brand-dark whitespace-nowrap">{formatVnd(item.lineTotalAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-brand-dark/50 mt-1">
                <span>Quy cách: {item.packagingName}</span>
                <span className="text-brand-dark/60">
                  Số lượng: <strong className="text-brand-dark">x{item.quantity}</strong>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-brand-dark/10 space-y-2 text-xs">
        <div className="flex justify-between text-brand-dark/60">
          <span>Tạm tính ({items.length} sản phẩm):</span>
          <span className="text-brand-dark">{formatVnd(order.subtotalAmount)}</span>
        </div>
        <div className="pt-3 border-t border-brand-dark/10 flex items-baseline justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-helvetica-neue tracking-tight text-brand-dark">
              Tổng tiền thanh toán:
            </span>
          </div>
          <span className="text-2xl font-helvetica-neue tracking-tight text-brand-dark font-helvetica-neue">
            {formatVnd(order.totalAmount)}
          </span>
        </div>
      </div>
    </div>
  )
}
