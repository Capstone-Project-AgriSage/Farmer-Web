import { useState } from 'react'
import { ApiError, describeApiError } from '../../../api/client'
import type { OrderPaymentSummary, OrderResponse } from '../../../api/types'
import { formatVnd } from '../../../data/format'
import { startPayosPayment } from '../../checkout/payos'
import { PAYMENT_METHOD, PAYMENT_STATUS, TONE_CLASSES, formatDateTime, labelOf } from '../orderLabels'

interface OrderPaymentPanelProps {
  order: Pick<OrderResponse, 'id' | 'status' | 'settlementType' | 'totalAmount'>
  summary: OrderPaymentSummary | null
  /** Called after a 409 so the parent can reload the order and its payments. */
  onStale?: () => void
}

const CLOSED_STATUSES = ['CANCELLED', 'PARTIALLY_CANCELLED']

export default function OrderPaymentPanel({ order, summary, onStale }: OrderPaymentPanelProps) {
  const [isPaying, setIsPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isCredit = order.settlementType === 'CREDIT'
  const remaining = summary?.remainingToPay ?? 0
  const canPay = !isCredit && summary !== null && remaining > 0 && !CLOSED_STATUSES.includes(order.status)

  const handlePay = async () => {
    setIsPaying(true)
    setError(null)
    try {
      await startPayosPayment(order.id)
      // The browser is leaving for payOS; keep the button locked.
    } catch (err) {
      setIsPaying(false)
      if (err instanceof ApiError && err.status === 503) {
        setError('Thanh toán online đang gián đoạn. Bác vui lòng thử lại sau hoặc thanh toán tại cửa hàng.')
      } else {
        setError(describeApiError(err, 'Không tạo được link thanh toán.'))
        if (err instanceof ApiError && err.status === 409) onStale?.()
      }
    }
  }

  const visiblePayments = (summary?.payments ?? []).filter((p) => p.status !== 'CANCELLED')

  return (
    <div className="space-y-4">
      {isCredit ? (
        <p className="text-sm text-brand-dark/70">
          Đơn mua chịu: số tiền được ghi vào công nợ sau khi cửa hàng xác nhận đơn.
        </p>
      ) : summary === null ? (
        <p className="text-sm text-brand-dark/50">Không tải được thông tin thanh toán.</p>
      ) : (
        <dl className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <dt className="text-[11px] text-brand-dark/50">Tổng đơn</dt>
            <dd className="font-medium text-brand-dark">{formatVnd(summary.orderTotal)}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-brand-dark/50">Đã thanh toán</dt>
            <dd className="font-medium text-brand-green">{formatVnd(summary.paidAmount)}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-brand-dark/50">Còn phải trả</dt>
            <dd className={`font-medium ${remaining > 0 ? 'text-amber-700' : 'text-brand-dark'}`}>{formatVnd(remaining)}</dd>
          </div>
        </dl>
      )}

      {visiblePayments.length > 0 && (
        <ul className="divide-y divide-brand-dark/5 border border-brand-dark/5 rounded-xl bg-white text-[13px]">
          {visiblePayments.map((p) => {
            const st = labelOf(PAYMENT_STATUS, p.status)
            return (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5">
                <div>
                  <span className="text-brand-dark font-medium">{p.paymentNumber}</span>
                  <span className="text-brand-dark/50"> · {PAYMENT_METHOD[p.paymentMethod] ?? p.paymentMethod}</span>
                  <div className="text-[11px] text-brand-dark/45">{formatDateTime(p.confirmedAt || p.initiatedAt)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-brand-dark">{formatVnd(p.amount)}</span>
                  <span className={`px-2 py-0.5 rounded-full border text-[10px] ${TONE_CLASSES[st.tone]}`}>{st.label}</span>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {(summary?.refunds.length ?? 0) > 0 && (
        <div className="text-[13px] text-brand-dark/70 bg-brand-cream/60 border border-brand-dark/5 rounded-xl p-3">
          <p className="font-medium text-brand-dark mb-1">Hoàn tiền</p>
          {summary!.refunds.map((r) => (
            <p key={r.id}>
              {r.refundNumber}: {formatVnd(r.amount)} — {r.status === 'COMPLETED' ? 'đã hoàn' : 'cửa hàng sẽ liên hệ hoàn tiền'}
            </p>
          ))}
        </div>
      )}

      {canPay && (
        <button
          type="button"
          onClick={handlePay}
          disabled={isPaying}
          className="w-full sm:w-auto px-6 py-3 rounded-full bg-brand-dark text-white hover:bg-brand-green text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait"
        >
          <span className="material-symbols-outlined text-[18px]">{isPaying ? 'hourglass_empty' : 'qr_code_2'}</span>
          {isPaying ? 'Đang mở cổng thanh toán...' : `Thanh toán ${formatVnd(remaining)} qua payOS`}
        </button>
      )}

      {error && (
        <p role="alert" className="text-[13px] text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">
          {error}
        </p>
      )}
    </div>
  )
}
