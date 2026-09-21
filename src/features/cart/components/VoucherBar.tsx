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
    <div className="bg-white border border-brand-dark/10 p-5 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      <div className="flex-1">
        <label className="block text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-1.5">
          Mã ưu đãi mùa vụ / Voucher AgriSage
        </label>
        <div className="flex items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-brand-dark/40">
              confirmation_number
            </span>
            <input
              className="w-full pl-9 pr-3 py-2 text-xs font-mono uppercase bg-brand-cream border border-brand-dark/15 focus:outline-none focus:border-brand-dark/40 text-brand-dark"
              type="text"
              value={voucherInput}
              onChange={(e) => onVoucherInputChange(e.target.value)}
            />
          </div>
          <button
            onClick={onApply}
            className="px-4 py-2 rounded-full bg-brand-dark text-white hover:bg-brand-green tracking-wide uppercase text-xs transition-colors flex-shrink-0"
          >
            Áp dụng
          </button>
        </div>
        {appliedVoucher ? (
          <div className="text-[11px] text-brand-green mt-1.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            Mã "{appliedVoucher}" đã áp dụng: Giảm {formatVnd(discount)} cho đơn hàng mùa mưa
          </div>
        ) : voucherError ? (
          <div className="text-[11px] text-status-error mt-1.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {voucherError}
          </div>
        ) : null}
      </div>
      <div className="pt-2 sm:pt-0 sm:border-l sm:border-brand-dark/10 sm:pl-6 flex items-center">
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs text-brand-dark/70 hover:text-brand-dark tracking-wide transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Tiếp tục chọn mua vật tư nông nghiệp</span>
        </Link>
      </div>
    </div>
  )
}
