import { formatVnd } from '../../data/format'

interface OrderTotalSummaryProps {
  total: number
  discount: number
}

export default function OrderTotalSummary({ total, discount }: OrderTotalSummaryProps) {
  return (
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
  )
}
