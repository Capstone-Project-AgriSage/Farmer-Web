import { useEffect, useState } from 'react'
import { creditApi } from '../../../api/creditApi'
import type { MyCreditSummary } from '../../../api/types'
import { formatVnd } from '../../../data/format'

export type PaymentMethod = 'payos' | 'credit'
export type CopyField = 'account' | 'memo'

interface PaymentMethodSelectorProps {
  paymentMethod: PaymentMethod
  onPaymentMethodChange: (method: PaymentMethod) => void
  total: number
  copiedField: CopyField | null
  onCopy: (field: CopyField, value: string) => void
}

export default function PaymentMethodSelector({
  paymentMethod,
  onPaymentMethodChange,
  total,
  copiedField: _copiedField,
  onCopy: _onCopy,
}: PaymentMethodSelectorProps) {
  // The credit line comes from the server (GET /api/me/credit); 404 means the farmer has no credit profile. The server checks
  // it again when the order is created, so this only decides what the page offers.
  const [credit, setCredit] = useState<MyCreditSummary | null>(null)
  const [creditState, setCreditState] = useState<'loading' | 'ready' | 'none'>('loading')

  useEffect(() => {
    let cancelled = false
    creditApi.getMyCredit()
      .then((summary) => {
        if (cancelled) return
        setCredit(summary)
        setCreditState('ready')
      })
      .catch(() => {
        if (!cancelled) setCreditState('none')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const creditActive = creditState === 'ready' && credit?.status?.toUpperCase() === 'ACTIVE'
  const availableCredit = creditActive && credit ? credit.availableCredit : 0
  const notEnough = creditActive && total > availableCredit
  const isCreditDisabled = !creditActive || notEnough

  // A credit choice that stopped being possible (smaller limit, bigger cart) goes back to payOS.
  useEffect(() => {
    if (creditState !== 'loading' && paymentMethod === 'credit' && isCreditDisabled) onPaymentMethodChange('payos')
  }, [creditState, paymentMethod, isCreditDisabled, onPaymentMethodChange])

  return (
    <div className="bg-white border border-brand-dark/10 p-5 sm:p-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-brand-dark/10 mb-4">
        <div className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center text-sm">
          3
        </div>
        <h2 className="text-base font-helvetica-neue tracking-tight text-brand-dark">
          Phương thức thanh toán
        </h2>
      </div>
      <div className="space-y-4">
        <div
          className={`p-4 bg-white ${
            paymentMethod === 'payos' ? 'border border-brand-dark' : 'border border-brand-dark/10'
          }`}
        >
          <label onClick={() => onPaymentMethodChange('payos')} className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <input
                readOnly
                checked={paymentMethod === 'payos'}
                className="text-brand-dark focus:ring-0 w-4 h-4 accent-brand-dark"
                name="payment_method"
                type="radio"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-brand-dark">Thanh toán trực tuyến (payOS)</span>
                  <span className="px-2 py-0.5 rounded-full bg-brand-light text-brand-green text-[10px] tracking-wide ">
                    Khuyên dùng
                  </span>
                </div>
                <p className="text-[11px] text-brand-dark/50 mt-0.5">
                  Chuyển hướng an toàn đến cổng thanh toán payOS (VietQR / Napas 247).
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-brand-green text-[22px]">qr_code_2</span>
          </label>
          {paymentMethod === 'payos' && (
            <div className="mt-4 pt-4 border-t border-brand-dark/10 bg-brand-cream p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5">
              <div className="flex-1 space-y-2 text-xs w-full text-center sm:text-left">
                <p className="text-brand-dark/80 text-sm font-medium">Bác sẽ được chuyển hướng sang cổng thanh toán an toàn của payOS.</p>
                <p className="text-brand-dark/60 mt-1">Hệ thống sẽ tự động tạo mã QR chính xác số tiền {formatVnd(total)} và tự động đối soát ngay lập tức.</p>
              </div>
            </div>
          )}
        </div>
        <div
          onClick={() => !isCreditDisabled && onPaymentMethodChange('credit')}
          className={`p-4 transition-colors ${isCreditDisabled ? 'opacity-60 cursor-not-allowed bg-brand-light/30' : 'cursor-pointer bg-brand-light/60 hover:bg-brand-cream'} ${
            paymentMethod === 'credit'
              ? 'border border-brand-dark'
              : 'border border-brand-dark/10'
          }`}
        >
          <label className={`flex items-start justify-between ${isCreditDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            <div className="flex items-start gap-3">
              <input
                readOnly
                checked={paymentMethod === 'credit'}
                disabled={isCreditDisabled}
                className="text-brand-dark focus:ring-0 mt-0.5 w-4 h-4 accent-brand-dark disabled:opacity-50"
                name="payment_method"
                type="radio"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-brand-dark">Ghi vào Sổ nợ (đại lý Hai Thắng)</span>
                  <span className="px-2 py-0.5 rounded-full bg-brand-dark text-white text-[10px] tracking-wide ">
                    0% Lãi suất
                  </span>
                </div>
                <p className="text-xs text-brand-dark/60 mt-1">
                  Mua trước vật tư trong hạn mức đại lý cấp, trả sau. Hai bên theo dõi minh bạch trên hệ thống.
                </p>
                {creditState === 'loading' && (
                  <p className="mt-2 text-[11px] text-brand-dark/60">Đang tải hạn mức...</p>
                )}
                {creditState !== 'loading' && !creditActive && (
                  <p className="mt-2 text-[11px] text-rose-600">
                    * Bác chưa được cấp hạn mức mua chịu. Liên hệ đại lý Hai Thắng để được cấp.
                  </p>
                )}
                {creditActive && credit && (
                  <>
                    <div className="mt-2 text-[11px] text-brand-dark/60 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span>
                        Hạn mức khả dụng: <strong className="text-brand-dark font-helvetica-neue">{formatVnd(availableCredit)}</strong>
                      </span>
                      {credit.paymentTermDays ? <span>Hạn thanh toán: {credit.paymentTermDays} ngày</span> : null}
                      {notEnough ? (
                        <span className="text-rose-600 font-medium bg-rose-50 px-1.5 py-0.5 border border-rose-200">Không đủ hạn mức</span>
                      ) : (
                        <span className="text-brand-green">• Đủ điều kiện thanh toán</span>
                      )}
                    </div>
                    {notEnough && (
                      <p className="text-[11px] text-rose-600 mt-1.5">
                        * Đơn hàng ({formatVnd(total)}) vượt quá hạn mức công nợ còn lại của bác. Vui lòng thanh toán một phần nợ cũ hoặc chọn hình thức thanh toán khác.
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
            <span className="material-symbols-outlined text-brand-green text-[22px]">credit_score</span>
          </label>
        </div>
      </div>
    </div>
  )
}
