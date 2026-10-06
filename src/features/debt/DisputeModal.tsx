import { useState } from 'react'
import { formatVnd } from '../../data/format'
import { debtApi } from '../../api/debtApi'
import { describeApiError } from '../../api/client'
import type { DebtEntryListItem } from '../../api/types'

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
    <div className="fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-md flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="bg-brand-cream border border-brand-dark/10 max-w-lg w-full p-6 md:p-8 space-y-6 animate-fade-in rounded-[32px] shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-brand-dark/10">
          <h3 className="font-helvetica-neue tracking-tight text-lg text-brand-dark flex items-center gap-2 font-medium">
            <span className="material-symbols-outlined text-rose-600 text-[24px]">report_problem</span>
            <span>Khiếu nại sai lệch</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Đóng"
            className="w-10 h-10 rounded-full bg-white border border-brand-dark/10 flex items-center justify-center text-brand-dark/50 hover:text-brand-dark hover:bg-brand-light transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div className="text-base text-brand-dark/70 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-brand-dark/10 flex justify-between items-center shadow-sm gap-3">
            <span>
              Khoản nợ: <strong className="text-brand-dark">{entry.orderNumber ?? entry.entryNumber}</strong>
            </span>
            <strong className="text-brand-dark font-helvetica-neue text-lg font-medium">{formatVnd(entry.outstandingAmount)}</strong>
          </div>
          <div>
            <label htmlFor="dispute-reason" className="block text-brand-dark font-medium mb-2">Chi tiết vấn đề bác gặp phải:</label>
            <textarea
              id="dispute-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="VD: Thiếu 2 bao phân, giá ghi sai..."
              rows={4}
              maxLength={1000}
              className="w-full rounded-2xl border border-brand-dark/15 bg-white p-4 text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
            />
            <p className="mt-2 text-xs text-brand-dark/50">
              Đại lý sẽ xem xét và giữ nguyên, điều chỉnh hoặc hủy khoản nợ. Trong lúc chờ, bác vẫn trả nợ bình thường.
            </p>
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-6 py-3 rounded-full bg-brand-light text-brand-dark/70 font-medium hover:bg-brand-dark/10 transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-medium transition-colors shadow-md"
          >
            {submitting ? 'Đang gửi...' : 'Gửi khiếu nại'}
          </button>
        </div>
      </div>
    </div>
  )
}
