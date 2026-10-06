import { formatVnd } from '../../data/format'
import type { PaymentListItem } from '../../api/types'
import { METHOD_LABEL, REPAYMENT_STATUS, TONE_CLASSES, formatDate } from './debtLabels'

interface RepaymentHistoryProps {
  /** Debt repayments only (paymentContext DEBT_REPAYMENT), newest first. */
  payments: PaymentListItem[]
}

export default function RepaymentHistory({ payments }: RepaymentHistoryProps) {
  return (
    <div className="bg-white rounded-[24px] border border-brand-dark/10 p-6 md:p-8 shadow-sm sticky top-28">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-dark/10">
        <h3 className="text-lg font-medium font-helvetica-neue text-brand-dark flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-brand-green">history</span>
          Lịch sử trả nợ
        </h3>
        <span className="text-sm font-medium text-brand-dark/60 bg-brand-light px-3 py-1 rounded-full">{payments.length} gd</span>
      </div>

      {payments.length === 0 ? (
        <p className="text-sm text-brand-dark/50">Bác chưa có lần trả nợ nào.</p>
      ) : (
        <div className="space-y-4">
          {payments.map((p) => {
            const status = REPAYMENT_STATUS[p.status] ?? { label: p.status, tone: 'neutral' as const }
            const paid = p.status === 'PAID'

            return (
              <div key={p.id} className="group flex gap-4 relative">
                <div className="absolute left-6 top-10 bottom-[-16px] w-[1px] bg-brand-dark/10 group-last:hidden" />
                <div className="w-12 h-12 rounded-full bg-brand-light border border-brand-dark/10 flex items-center justify-center shrink-0 z-10">
                  <span className={`material-symbols-outlined text-[22px] ${paid ? 'text-brand-green' : 'text-brand-dark/40'}`}>
                    {p.paymentMethod === 'CASH' ? 'local_atm' : 'qr_code_2'}
                  </span>
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <div className={`font-helvetica-neue text-lg font-medium tracking-tight ${paid ? 'text-brand-green' : 'text-brand-dark/60'}`}>
                      {paid ? '+' : ''}
                      {formatVnd(p.amount)}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 border ${TONE_CLASSES[status.tone]}`}>{status.label}</span>
                  </div>
                  <div className="text-xs text-brand-dark/50 flex items-center gap-1.5 font-medium flex-wrap">
                    <span>{p.paymentNumber}</span>
                    <span>•</span>
                    <span>{METHOD_LABEL[p.paymentMethod] ?? p.paymentMethod}</span>
                    <span>•</span>
                    <span>{formatDate(p.confirmedAt ?? p.initiatedAt)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
