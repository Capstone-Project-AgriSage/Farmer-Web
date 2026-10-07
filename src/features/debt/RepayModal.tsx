import { useEffect, useState } from 'react'
import { formatVnd } from '../../data/format'
import { debtApi } from '../../api/debtApi'
import { ApiError, describeApiError } from '../../api/client'
import type { AllocationPreview } from '../../api/types'
import { startDebtRepayment } from '../checkout/payos'
import Modal from '../../components/ui/Modal'
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
    <Modal
      title="Trả nợ"
      icon="payments"
      onClose={onClose}
      busy={submitting}
      footer={
        <>
          <button type="button" onClick={onClose} disabled={submitting} className="focus-ring min-h-[44px] px-6 rounded-full border border-brand-dark/30 text-[15px] text-text-primary hover:bg-brand-light disabled:opacity-45 transition-colors">
            Hủy
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!valid || submitting}
            className="focus-ring min-h-[44px] px-6 rounded-full bg-brand-dark hover:bg-brand-green disabled:opacity-45 disabled:cursor-not-allowed text-white text-[15px] transition-colors inline-flex items-center gap-2"
          >
            <span className={`material-symbols-outlined ${submitting ? "animate-spin" : ""}`} style={{ fontSize: 20 }} aria-hidden="true">
              {submitting ? "progress_activity" : "send"}
            </span>
            {submitting ? "Đang chuyển sang payOS…" : "Thanh toán qua payOS"}
          </button>
        </>
      }
    >
      <div className="space-y-5 text-[15px]">
        <div className="p-4 bg-brand-light border border-brand-dark/15 rounded-[var(--radius-surface)] flex justify-between items-center">
          <span className="text-text-secondary">Tổng dư nợ hiện tại</span>
          <span className="text-xl font-medium text-text-primary">{formatVnd(balance)}</span>
        </div>

        <div>
          <label htmlFor="repay-amount" className="block text-text-primary mb-2">Số tiền muốn trả (₫)</label>
          <input
            id="repay-amount"
            type="number"
            min={1}
            max={maxPayable}
            step={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-invalid={amount !== "" && !valid}
            aria-describedby={amount !== "" && !valid ? "repay-error" : undefined}
            className="focus-ring w-full min-h-[52px] rounded-[var(--radius-input)] border border-brand-dark/25 bg-white px-4 text-lg text-text-primary hover:border-brand-dark/60 focus:border-brand-dark transition-colors"
          />
          {amount !== "" && !valid && (
            <p id="repay-error" role="alert" className="mt-2 text-[15px] text-status-error">
              Nhập số tiền là số nguyên, lớn hơn 0 và không vượt quá {formatVnd(maxPayable)}.
            </p>
          )}
        </div>

        {preview && preview.allocations.length > 0 && (
          <div className="border border-brand-dark/15 bg-white rounded-[var(--radius-surface)] p-4">
            <p className="text-text-secondary mb-3">Khoản trả này sẽ trừ vào các khoản nợ theo hạn trả cũ nhất trước:</p>
            <ul className="space-y-2">
              {preview.allocations.map((a) => (
                <li key={a.debtEntryId} className="flex justify-between gap-3">
                  <span className="text-text-primary">
                    {a.entryNumber} · hạn {formatDate(a.dueDate)}
                  </span>
                  <strong className="text-primary-dark font-medium whitespace-nowrap">- {formatVnd(a.allocatedAmount)}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="flex items-start gap-3 text-text-secondary leading-relaxed">
          <span className="material-symbols-outlined text-primary-dark shrink-0" style={{ fontSize: 24 }} aria-hidden="true">
            qr_code_2
          </span>
          Bác sẽ được chuyển sang cổng payOS để quét mã VietQR. Muốn trả tiền mặt, bác đến quầy của đại lý để nhân viên ghi nhận.
        </p>

        {error && (
          <p role="alert" className="text-status-error">
            {error}
          </p>
        )}
      </div>
    </Modal>
  )
}
