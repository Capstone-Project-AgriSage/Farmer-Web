import { Link } from 'react-router-dom'
import { formatVnd } from '../../../data/format'

interface VoucherBarProps {
  voucherInput: string
  onVoucherInputChange: (value: string) => void
  onApply: () => void
  appliedVoucher: string | null
  voucherError: string
  discount: number
}

export default function VoucherBar({
  voucherInput,
  onVoucherInputChange,
  onApply,
  appliedVoucher,
  voucherError,
  discount,
}: VoucherBarProps) {
  return (
    <div className="bg-white rounded-2xl border border-border-subtle p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      <div className="flex-1">
        <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
          Mã ưu đãi mùa vụ / Voucher AgriSage
        </label>
        <div className="flex items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-text-muted">
              confirmation_number
            </span>
            <input
              className="w-full pl-9 pr-3 py-2 text-xs font-bold font-mono uppercase bg-surface-subtle border border-border-subtle rounded-lg focus:outline-none focus:ring-0 text-primary"
              type="text"
              value={voucherInput}
              onChange={(e) => onVoucherInputChange(e.target.value)}
            />
          </div>
          <button
            onClick={onApply}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-colors shadow-sm flex-shrink-0"
          >
            Áp dụng
          </button>
        </div>
        {appliedVoucher ? (
          <div className="text-[11px] text-status-success font-medium mt-1.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            Mã "{appliedVoucher}" đã áp dụng: Giảm {formatVnd(discount)} cho đơn hàng mùa mưa
          </div>
        ) : voucherError ? (
          <div className="text-[11px] text-status-error font-medium mt-1.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {voucherError}
          </div>
        ) : null}
      </div>
      <div className="pt-2 sm:pt-0 sm:border-l sm:border-border-subtle sm:pl-6 flex items-center">
        <Link to="/products" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Tiếp tục chọn mua vật tư nông nghiệp</span>
        </Link>
      </div>
    </div>
  )
}
