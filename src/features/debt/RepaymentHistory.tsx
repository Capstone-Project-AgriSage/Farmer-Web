import { formatVnd } from '../../data/format'
import type { PaymentListItem } from '../../api/types'
import { METHOD_LABEL, REPAYMENT_STATUS, TONE_CLASSES, formatDate } from './debtLabels'

interface RepaymentHistoryProps {
  /** Debt repayments only (paymentContext DEBT_REPAYMENT), newest first. */
  payments: PaymentListItem[]
}

export default function RepaymentHistory({ payments }: RepaymentHistoryProps) {
  return (
    <section className="bg-white border border-brand-dark/15 rounded-[var(--radius-surface)] p-6 lg:sticky lg:top-28" aria-label="Lịch sử trả nợ">
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-brand-dark/15">
        <h2 className="text-[13px] uppercase tracking-[0.16em] text-text-secondary">Lịch sử trả nợ</h2>
        <span className="text-[15px] text-text-secondary">{payments.length} giao dịch</span>
      </div>

      {payments.length === 0 ? (
        <p className="pt-5 text-[15px] text-text-secondary">Bác chưa có lần trả nợ nào.</p>
      ) : (
        <ul className="divide-y divide-brand-dark/10">
          {payments.map((p) => {
            const status = REPAYMENT_STATUS[p.status] ?? { label: p.status, tone: 'neutral' as const }
            const paid = p.status === 'PAID'
            return (
              <li key={p.id} className="py-4 flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <p className={`text-lg font-medium ${paid ? 'text-primary-dark' : 'text-text-secondary'}`}>
                    {paid ? '+' : ''}
                    {formatVnd(p.amount)}
                  </p>
                  <p className="mt-0.5 text-[15px] text-text-secondary">
                    {p.paymentNumber} · {METHOD_LABEL[p.paymentMethod] ?? p.paymentMethod} · {formatDate(p.confirmedAt ?? p.initiatedAt)}
                  </p>
                </div>
                <span className={`shrink-0 px-3 py-0.5 rounded-full border text-[13px] font-medium ${TONE_CLASSES[status.tone]}`}>{status.label}</span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
