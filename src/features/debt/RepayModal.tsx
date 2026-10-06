import { useEffect, useState } from 'react'
import { formatVnd } from '../../data/format'
import { debtApi } from '../../api/debtApi'
import { ApiError, describeApiError } from '../../api/client'
import type { AllocationPreview } from '../../api/types'
import { startDebtRepayment } from '../checkout/payos'
import { formatDate } from './debtLabels'

interface RepayModalProps {
  /** The farmer's whole debt: an online repayment is not tied to one entry, the server settles the oldest due date first. */
  balance: number
  onClose: () => void
}

export default function RepayModal({ balance, onClose }: RepayModalProps) {
  const maxPayable = Math.floor(balance)
  const [amount, setAmount] = useState(String(maxPayable))
  const [preview, setPreview] = useState<AllocationPreview | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const value = Number(amount)
  const valid = Number.isInteger(value) && value > 0 && value <= maxPayable

  // Which entries this amount would settle, oldest due date first; asked after a short pause in typing.
  useEffect(() => {
    if (!valid) {
      setPreview(null)
      return
    }
    let cancelled = false
    const timer = setTimeout(() => {
      debtApi.previewAllocation(value).then((p) => !cancelled && setPreview(p)).catch(() => !cancelled && setPreview(null))
    }, 400)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [value, valid])

  const submit = async () => {
    if (!valid || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      await startDebtRepayment(value) // leaves for payOS; this page is gone after the redirect
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 503
          ? 'Cổng thanh toán payOS đang gián đoạn. Bác vui lòng thử lại sau.'
          : describeApiError(err, 'Không tạo được thanh toán. Bác vui lòng thử lại.'),
      )
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-md flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="bg-brand-cream border border-brand-dark/10 max-w-lg w-full p-5 md:p-6 space-y-4 animate-fade-in rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-brand-dark/10">
          <h3 className="font-helvetica-neue tracking-tight text-base text-brand-dark flex items-center gap-2 font-medium">
            <span className="material-symbols-outlined text-brand-green text-[20px]">payments</span>
            <span>Trả nợ</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Đóng"
            className="w-8 h-8 rounded-full bg-white border border-brand-dark/10 flex items-center justify-center text-brand-dark/50 hover:text-brand-dark hover:bg-brand-light transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div className="p-3 rounded-xl bg-brand-light border border-brand-dark/10 flex justify-between items-center shadow-inner">
            <span className="text-brand-dark/60 font-medium">Tổng dư nợ hiện tại:</span>
            <span className="font-helvetica-neue tracking-tight text-brand-dark text-lg font-medium">{formatVnd(balance)}</span>
          </div>

          <div>
            <label htmlFor="repay-amount" className="block text-brand-dark font-medium mb-1.5">Số tiền muốn trả (₫):</label>
            <input
              id="repay-amount"
              type="number"
              min={1}
              max={maxPayable}
              step={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-brand-dark/15 bg-white p-3 font-helvetica-neue text-base font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
            />
            {amount !== '' && !valid && (
              <p className="mt-1.5 text-[11px] text-rose-600">
                Nhập số tiền là số nguyên, lớn hơn 0 và không vượt quá {formatVnd(maxPayable)}.
              </p>
            )}
          </div>

          {preview && preview.allocations.length > 0 && (
            <div className="rounded-xl border border-brand-dark/10 bg-white p-3">
              <p className="text-xs text-brand-dark/60 mb-2">Khoản trả này sẽ trừ vào các khoản nợ theo hạn trả cũ nhất trước:</p>
              <ul className="space-y-1.5">
                {preview.allocations.map((a) => (
                  <li key={a.debtEntryId} className="flex justify-between gap-3 text-xs">
                    <span className="text-brand-dark/70">
                      {a.entryNumber} · hạn {formatDate(a.dueDate)}
                    </span>
                    <strong className="text-brand-green font-medium">- {formatVnd(a.allocatedAmount)}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-3 rounded-xl border border-brand-dark/10 bg-white flex items-start gap-3">
            <span className="material-symbols-outlined text-brand-green text-[22px]">qr_code_2</span>
            <p className="text-xs text-brand-dark/70">
              Bác sẽ được chuyển sang cổng payOS để quét mã VietQR. Muốn trả tiền mặt, bác đến quầy của đại lý để nhân viên ghi nhận.
            </p>
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-brand-dark/10">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-5 py-2.5 rounded-full bg-brand-light text-brand-dark/70 font-medium hover:bg-brand-dark/10 transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!valid || submitting}
            className="px-5 py-2.5 rounded-full bg-brand-dark hover:bg-brand-green disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors inline-flex items-center gap-1.5 shadow-md"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            <span>{submitting ? 'Đang chuyển sang payOS...' : 'Thanh toán qua payOS'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
