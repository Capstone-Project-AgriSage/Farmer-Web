import { useState } from 'react'
import { formatVnd } from '../../data/format'
import { debtApi } from '../../api/debtApi'
import { describeApiError } from '../../api/client'
import type { DebtEntryListItem } from '../../api/types'
import Modal from '../../components/ui/Modal'

interface DisputeModalProps {
  entry: DebtEntryListItem
  onClose: () => void
  /** Called after the server accepted the dispute, so the page can reload. */
  onDisputed: (entry: DebtEntryListItem) => void
}

export default function DisputeModal({ entry, onClose, onDisputed }: DisputeModalProps) {
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async () => {
    if (!reason.trim()) {
      setError('Vui lòng nhập nội dung phản hồi / lý do khiếu nại.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await debtApi.dispute(entry.id, reason.trim())
      onDisputed(entry)
    } catch (err) {
      setError(describeApiError(err, 'Không gửi được khiếu nại. Bác vui lòng thử lại.'))
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title="Khiếu nại sai lệch"
      icon="report_problem"
      iconClassName="text-status-error"
      onClose={onClose}
      busy={submitting}
      footer={
        <>
          <button type="button" onClick={onClose} disabled={submitting} className="focus-ring min-h-[44px] px-6 rounded-full border border-brand-dark/30 text-[15px] text-text-primary hover:bg-brand-light disabled:opacity-45 transition-colors">
            Hủy
          </button>
          <button type="button" onClick={submit} disabled={submitting} className="focus-ring min-h-[44px] px-6 rounded-full bg-status-error hover:opacity-90 disabled:opacity-60 text-white text-[15px] transition-opacity">
            {submitting ? "Đang gửi…" : "Gửi khiếu nại"}
          </button>
        </>
      }
    >
      <div className="space-y-5 text-[15px]">
        <div className="p-4 bg-white border border-brand-dark/15 rounded-[var(--radius-surface)] flex justify-between items-center gap-3">
          <span className="text-text-secondary">
            Khoản nợ: <strong className="text-text-primary font-medium">{entry.orderNumber ?? entry.entryNumber}</strong>
          </span>
          <strong className="text-lg font-medium text-text-primary whitespace-nowrap">{formatVnd(entry.outstandingAmount)}</strong>
        </div>
        <div>
          <label htmlFor="dispute-reason" className="block text-text-primary mb-2">Chi tiết vấn đề bác gặp phải</label>
          <textarea
            id="dispute-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="VD: Thiếu 2 bao phân, giá ghi sai..."
            rows={4}
            maxLength={1000}
            aria-invalid={Boolean(error) && !reason.trim()}
            aria-describedby="dispute-help"
            className="focus-ring w-full rounded-[var(--radius-input)] border border-brand-dark/25 bg-white px-4 py-3 text-base text-text-primary placeholder:text-text-muted hover:border-brand-dark/60 focus:border-brand-dark transition-colors resize-none"
          />
          <p id="dispute-help" className="mt-2 text-text-secondary leading-relaxed">
            Đại lý sẽ xem xét và giữ nguyên, điều chỉnh hoặc hủy khoản nợ. Trong lúc chờ, bác vẫn trả nợ bình thường.
          </p>
        </div>
        {error && (
          <p role="alert" className="text-status-error">
            {error}
          </p>
        )}
      </div>
    </Modal>
  )
}
