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

const STRIPE: Record<string, string> = {
  PENDING: 'bg-brand-green',
  PROGRESS: 'bg-blue-400',
  SUCCESS: 'bg-brand-dark/20',
  DANGER: 'bg-rose-400',
  NEUTRAL: 'bg-brand-dark/20',
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

  return (
    <div
      className={`p-5 md:p-6 rounded-[24px] border transition-all duration-300 relative overflow-hidden ${
        isDisputed
          ? 'border-rose-200 bg-rose-50/50'
          : isClosed
            ? 'border-brand-dark/5 bg-brand-cream/50'
            : 'border-brand-dark/10 bg-white shadow-sm hover:shadow-md'
      }`}
    >
      <div className={`absolute top-0 left-0 w-1.5 h-full ${STRIPE[status.tone.toUpperCase()] ?? 'bg-brand-dark/20'}`} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-2">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-lg font-medium font-helvetica-neue text-brand-dark tracking-tight">{entry.orderNumber ?? entry.entryNumber}</span>
            {entry.orderNumber && <span className="text-sm text-brand-dark/50">({entry.entryNumber})</span>}
            <span className={`px-3 py-1 rounded-full border text-xs font-medium ${TONE_CLASSES[status.tone]}`}>{status.label}</span>
            {entry.isOverdue && !isClosed && (
              <span className="px-3 py-1 rounded-full border border-rose-200 bg-rose-100/50 text-rose-800 text-xs font-medium">
                Quá hạn {entry.overdueDays} ngày
              </span>
            )}
          </div>
          <div className="text-sm text-brand-dark/60 flex items-center gap-2 flex-wrap">
            <span>
              Hạn trả: <strong className="text-brand-dark font-medium">{formatDate(entry.dueDate)}</strong>
            </span>
            <span className="text-brand-dark/30">|</span>
            <span>Ngày ghi nợ: {formatDate(entry.createdAt)}</span>
            <span className="text-brand-dark/30">|</span>
            <span>{SOURCE_LABEL[entry.sourceType] ?? entry.sourceType}</span>
          </div>
        </div>

        <div className="flex md:flex-col items-baseline md:items-end justify-between gap-1 shrink-0 pt-4 md:pt-0 border-t md:border-0 border-brand-dark/5">
          <div className="flex flex-col items-start md:items-end">
            <span className="text-xs text-brand-dark/50 mb-1 hidden md:block">Còn nợ</span>
            <span className="text-xl md:text-2xl font-medium font-helvetica-neue tracking-tight text-brand-dark">
              {formatVnd(entry.outstandingAmount)}
            </span>
          </div>
          {entry.totalPaid > 0 && (
            <span className="text-sm font-medium text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-md mt-1">
              Đã trả: {formatVnd(entry.totalPaid)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-brand-dark/10 flex flex-wrap items-center sm:justify-end gap-3 pl-2">
        <button
          type="button"
          onClick={toggle}
          className="flex-1 sm:flex-none px-5 py-2.5 rounded-full border border-brand-dark/20 text-brand-dark hover:bg-brand-light text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
          aria-expanded={open}
        >
          <span className="material-symbols-outlined text-[18px]">{open ? 'expand_less' : 'expand_more'}</span>
          <span>{open ? 'Ẩn chi tiết' : 'Xem chi tiết'}</span>
        </button>
        {canDispute(entry.status) && (
          <button
            type="button"
            onClick={() => onDispute(entry)}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-medium transition-colors"
          >
            Khiếu nại
          </button>
        )}
      </div>

      {open && (
        <div className="mt-5 pl-2 space-y-4 text-sm">
          {loading && <p className="text-brand-dark/50">Đang tải chi tiết...</p>}
          {error && <p className="text-rose-600">{error}</p>}
          {detail && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-brand-light border border-brand-dark/5">
                  <div className="text-xs text-brand-dark/50">Giá trị hàng đã giao</div>
                  <div className="font-medium text-brand-dark">{formatVnd(detail.fulfillmentValue)}</div>
                </div>
                <div className="p-3 rounded-xl bg-brand-light border border-brand-dark/5">
                  <div className="text-xs text-brand-dark/50">Trừ vào tiền đã trả trước</div>
                  <div className="font-medium text-brand-dark">{formatVnd(detail.prepaymentAppliedAmount)}</div>
                </div>
                <div className="p-3 rounded-xl bg-brand-light border border-brand-dark/5">
                  <div className="text-xs text-brand-dark/50">Số nợ ban đầu</div>
                  <div className="font-medium text-brand-dark">{formatVnd(detail.originalAmount)}</div>
                </div>
              </div>

              {detail.orderId && (
                <Link to={`/orders/${detail.orderId}`} className="inline-flex items-center gap-1 text-brand-green font-medium hover:underline">
                  Xem đơn hàng {detail.orderNumber}
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              )}

              {detail.actions.length > 0 && (
                <div>
                  <h4 className="font-medium text-brand-dark mb-2">Phản hồi và xử lý</h4>
                  <ul className="space-y-2">
                    {detail.actions.map((action) => (
                      <li key={action.id} className="p-3 rounded-xl border border-brand-dark/10 bg-white">
                        <div className="flex justify-between gap-3 flex-wrap">
                          <strong className="text-brand-dark font-medium">{ACTION_LABEL[action.actionType] ?? action.actionType}</strong>
                          <span className="text-xs text-brand-dark/50">{formatDate(action.createdAt)}</span>
                        </div>
                        {action.reason && <p className="text-brand-dark/70 mt-1">{action.reason}</p>}
                        {action.adjustmentAmount != null && (
                          <p className="text-brand-dark/70 mt-1">Giảm: {formatVnd(action.adjustmentAmount)}</p>
                        )}
                        {action.newDueDate && (
                          <p className="text-brand-dark/70 mt-1">
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
                <h4 className="font-medium text-brand-dark mb-2">Biến động của khoản nợ</h4>
                {detail.transactions.length === 0 ? (
                  <p className="text-brand-dark/50">Chưa có biến động.</p>
                ) : (
                  <ul className="divide-y divide-brand-dark/5 rounded-xl border border-brand-dark/10 bg-white">
                    {detail.transactions.map((tx) => (
                      <li key={tx.id} className="p-3 flex justify-between items-center gap-3">
                        <div>
                          <div className="text-brand-dark">{TRANSACTION_LABEL[tx.transactionType] ?? tx.transactionType}</div>
                          <div className="text-xs text-brand-dark/50">
                            {formatDate(tx.occurredAt)}
                            {tx.note ? ` · ${tx.note}` : ''}
                          </div>
                        </div>
                        <strong className={`font-helvetica-neue ${tx.amountDelta < 0 ? 'text-brand-green' : 'text-brand-dark'}`}>
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
    </div>
  )
}
