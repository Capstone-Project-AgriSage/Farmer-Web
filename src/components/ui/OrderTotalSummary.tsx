import { formatVnd } from '../../data/format'

interface OrderTotalSummaryProps {
  total: number
  discount: number
}

export default function OrderTotalSummary({ total, discount }: OrderTotalSummaryProps) {
  return (
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
  )
}
