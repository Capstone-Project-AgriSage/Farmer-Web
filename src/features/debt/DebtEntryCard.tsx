import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatVnd } from '../../data/format'
import { debtApi } from '../../api/debtApi'
import { describeApiError } from '../../api/client'
import type { DebtEntryDetail, DebtEntryListItem } from '../../api/types'
import { ACTION_LABEL, ENTRY_STATUS, SOURCE_LABEL, TONE_CLASSES, TRANSACTION_LABEL, canDispute, formatDate } from './debtLabels'

interface DebtEntryCardProps {
  entry: DebtEntryListItem
  onDispute: (entry: DebtEntryListItem) => void
}

export default function DebtEntryCard({ entry, onDispute }: DebtEntryCardProps) {
  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState<DebtEntryDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const status = ENTRY_STATUS[entry.status] ?? { label: entry.status, tone: 'neutral' as const }
  const isDisputed = entry.status === 'DISPUTED'
  const isClosed = entry.status === 'PAID' || entry.status === 'CANCELLED'

  const toggle = async () => {
    const next = !open
    setOpen(next)
    if (!next || detail) return
    setLoading(true)
    setError(null)
    try {
      setDetail(await debtApi.getEntry(entry.id))
    } catch (err) {
      setError(describeApiError(err, 'Không tải được chi tiết khoản nợ.'))
    } finally {
      setLoading(false)
    }
  }

  const detailFigures: [string, number][] = detail
    ? [
        ['Giá trị hàng đã giao', detail.fulfillmentValue],
        ['Trừ vào tiền đã trả trước', detail.prepaymentAppliedAmount],
        ['Số nợ ban đầu', detail.originalAmount],
      ]
    : []

  return (
    <article
      className={`border rounded-[var(--radius-surface)] ${
        isDisputed ? 'border-status-error/50 bg-status-error-surface' : isClosed ? 'border-brand-dark/10 bg-brand-light' : 'border-brand-dark/15 bg-white'
      }`}
    >
      <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-start justify-between gap-5">
        <div className="space-y-3 min-w-0">
          <div className="flex items-center gap-x-3 gap-y-2 flex-wrap">
            <h3 className="text-xl font-medium tracking-tight text-text-primary">{entry.orderNumber ?? entry.entryNumber}</h3>
            {entry.orderNumber && <span className="text-[15px] text-text-secondary">({entry.entryNumber})</span>}
            <span className={`px-3 py-0.5 rounded-full border text-[13px] font-medium ${TONE_CLASSES[status.tone]}`}>{status.label}</span>
            {entry.isOverdue && !isClosed && (
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full border border-status-error/50 bg-status-error-surface text-status-error text-[13px] font-medium">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden="true">
                  schedule
                </span>
                Quá hạn {entry.overdueDays} ngày
              </span>
            )}
          </div>
          <p className="text-[15px] text-text-secondary leading-relaxed">
            Hạn trả: <strong className="text-text-primary font-medium">{formatDate(entry.dueDate)}</strong> · Ngày ghi nợ: {formatDate(entry.createdAt)} · {SOURCE_LABEL[entry.sourceType] ?? entry.sourceType}
          </p>
        </div>

        <div className="shrink-0 md:text-right">
          <p className="text-[13px] uppercase tracking-[0.16em] text-text-secondary">Còn nợ</p>
          <p className="mt-1 text-2xl font-light tracking-tight text-text-primary">{formatVnd(entry.outstandingAmount)}</p>
          {entry.totalPaid > 0 && <p className="mt-1 text-[15px] text-primary-dark">Đã trả: {formatVnd(entry.totalPaid)}</p>}
        </div>
      </div>

      <div className="px-5 md:px-6 py-3 border-t border-brand-dark/10 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={`entry-${entry.id}`}
          className="focus-ring inline-flex items-center gap-1.5 min-h-[44px] text-[15px] text-text-primary hover:underline underline-offset-4"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 22 }} aria-hidden="true">
            {open ? 'expand_less' : 'expand_more'}
          </span>
          {open ? 'Ẩn chi tiết' : 'Xem chi tiết'}
        </button>
        {canDispute(entry.status) && (
          <button
            type="button"
            onClick={() => onDispute(entry)}
            className="focus-ring min-h-[44px] px-5 rounded-full border border-status-error/50 text-[15px] text-status-error hover:bg-status-error-surface transition-colors"
          >
            Khiếu nại
          </button>
        )}
      </div>

      {open && (
        <div id={`entry-${entry.id}`} className="px-5 md:px-6 pb-6 pt-5 border-t border-brand-dark/10 space-y-6 text-[15px]">
          {loading && (
            <p className="text-text-secondary" role="status">
              Đang tải chi tiết…
            </p>
          )}
          {error && (
            <p role="alert" className="text-status-error">
              {error}
            </p>
          )}
          {detail && (
            <>
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {detailFigures.map(([label, value]) => (
                  <div key={label} className="p-4 bg-brand-light border border-brand-dark/10 rounded-[var(--radius-surface)]">
                    <dt className="text-text-secondary">{label}</dt>
                    <dd className="mt-1 text-lg font-medium text-text-primary">{formatVnd(value)}</dd>
                  </div>
                ))}
              </dl>

              {detail.orderId && (
                <Link to={`/orders/${detail.orderId}`} className="focus-ring inline-flex items-center gap-1.5 min-h-[44px] text-text-primary hover:underline underline-offset-4">
                  Xem đơn hàng {detail.orderNumber}
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden="true">
                    arrow_forward
                  </span>
                </Link>
              )}

              {detail.actions.length > 0 && (
                <div>
                  <h4 className="text-[13px] uppercase tracking-[0.16em] text-text-secondary mb-3">Phản hồi và xử lý</h4>
                  <ul className="space-y-3">
                    {detail.actions.map((action) => (
                      <li key={action.id} className="p-4 border border-brand-dark/15 bg-white rounded-[var(--radius-surface)]">
                        <div className="flex justify-between gap-3 flex-wrap">
                          <strong className="font-medium text-text-primary">{ACTION_LABEL[action.actionType] ?? action.actionType}</strong>
                          <span className="text-text-secondary">{formatDate(action.createdAt)}</span>
                        </div>
                        {action.reason && <p className="mt-1 text-text-secondary">{action.reason}</p>}
                        {action.adjustmentAmount != null && <p className="mt-1 text-text-secondary">Giảm: {formatVnd(action.adjustmentAmount)}</p>}
                        {action.newDueDate && (
                          <p className="mt-1 text-text-secondary">
                            Hạn trả mới: {formatDate(action.newDueDate)}
                            {action.oldDueDate ? ` (trước đó ${formatDate(action.oldDueDate)})` : ''}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="text-[13px] uppercase tracking-[0.16em] text-text-secondary mb-3">Biến động của khoản nợ</h4>
                {detail.transactions.length === 0 ? (
                  <p className="text-text-secondary">Chưa có biến động.</p>
                ) : (
                  <ul className="divide-y divide-brand-dark/10 border border-brand-dark/15 bg-white rounded-[var(--radius-surface)]">
                    {detail.transactions.map((tx) => (
                      <li key={tx.id} className="p-4 flex justify-between items-center gap-4">
                        <div>
                          <p className="text-text-primary">{TRANSACTION_LABEL[tx.transactionType] ?? tx.transactionType}</p>
                          <p className="text-text-secondary">
                            {formatDate(tx.occurredAt)}
                            {tx.note ? ` · ${tx.note}` : ''}
                          </p>
                        </div>
                        <strong className={`text-lg font-medium whitespace-nowrap ${tx.amountDelta < 0 ? 'text-primary-dark' : 'text-text-primary'}`}>
                          {tx.amountDelta > 0 ? '+' : ''}
                          {formatVnd(tx.amountDelta)}
                        </strong>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </article>
  )
}
