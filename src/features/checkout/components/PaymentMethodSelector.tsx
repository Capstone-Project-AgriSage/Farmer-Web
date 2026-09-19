import { formatVnd } from '../../../data/format'

export type PaymentMethod = 'vietqr' | 'cod' | 'credit'
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
  copiedField,
  onCopy,
}: PaymentMethodSelectorProps) {
  return (
    <div className="bg-white rounded-2xl border border-border-subtle p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2.5 pb-4 border-b border-border-subtle mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-primary flex items-center justify-center font-bold text-sm">3</div>
        <h2 className="text-base font-bold text-text-primary">Phương thức thanh toán</h2>
      </div>
      <div className="space-y-4">
        <div className={`rounded-xl p-4 bg-white ${paymentMethod === 'vietqr' ? 'border-2 border-primary' : 'border border-border-subtle'}`}>
          <label onClick={() => onPaymentMethodChange('vietqr')} className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <input readOnly checked={paymentMethod === 'vietqr'} className="text-primary focus:ring-0 w-4 h-4" name="payment_method" type="radio" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-text-primary">Chuyển khoản VietQR / Napas 247</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-primary font-bold text-[10px]">Khuyên dùng</span>
                </div>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Quét mã trên app ngân hàng. Đại lý Hai Thắng sẽ đối soát và xác nhận khi nhận được tiền.
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-primary text-[22px]">qr_code_2</span>
          </label>
          {paymentMethod === 'vietqr' && (
            <div className="mt-4 pt-4 border-t border-border-subtle bg-surface-subtle rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5">
              <div className="flex-shrink-0 bg-white p-3 rounded-xl border border-border-subtle shadow-sm flex flex-col items-center">
                <div className="w-36 h-36 bg-white border border-border-subtle rounded-lg flex items-center justify-center relative overflow-hidden p-1">
                  <img
                    alt="VietQR Thanh toán AgriSage"
                    className="w-full h-full object-contain"
                    src="/images/misc/vietqr-demo.png"
                  />
                </div>
                <span className="text-[10px] font-bold text-primary mt-1.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse"></span>
                  Vietcombank Napas247
                </span>
              </div>
              <div className="flex-1 space-y-2 text-xs w-full">
                <div className="flex items-center justify-between py-1 border-b border-border-subtle">
                  <span className="text-text-muted">Ngân hàng:</span>
                  <span className="font-bold text-text-primary">Vietcombank - Chi nhánh Cần Thơ</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border-subtle">
                  <span className="text-text-muted">Chủ tài khoản:</span>
                  <span className="font-bold text-text-primary uppercase">NGUYEN VAN THANG (ĐẠI LÝ HAI THẮNG)</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border-subtle">
                  <span className="text-text-muted">Số tài khoản:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-primary text-sm">19006828999</span>
                    <button
                      type="button"
                      onClick={() => onCopy('account', '19006828999')}
                      className="text-[10px] text-primary hover:underline font-semibold"
                      title="Sao chép số TK"
                    >
                      {copiedField === 'account' ? 'Đã copy' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border-subtle">
                  <span className="text-text-muted">Số tiền:</span>
                  <span className="font-bold text-primary text-sm">{formatVnd(total)}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-text-muted">Nội dung CK:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-text-primary bg-white px-2 py-0.5 rounded border border-border-subtle">
                      AGR8842
                    </span>
                    <button
                      type="button"
                      onClick={() => onCopy('memo', 'AGR8842')}
                      className="text-[10px] text-primary hover:underline font-semibold"
                      title="Sao chép cú pháp"
                    >
                      {copiedField === 'memo' ? 'Đã copy' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium flex items-start gap-1.5 mt-1">
                  <span className="material-symbols-outlined text-[16px] text-amber-700 flex-shrink-0 mt-0.5">info</span>
                  <span>Đại lý Hai Thắng sẽ kiểm tra và xác nhận chuyển khoản trước khi xuất kho giao hàng.</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div
          onClick={() => onPaymentMethodChange('cod')}
          className={`rounded-xl p-4 cursor-pointer transition-colors ${
            paymentMethod === 'cod' ? 'border-2 border-primary' : 'border border-border-subtle hover:bg-surface-subtle'
          }`}
        >
          <label className="flex items-start justify-between cursor-pointer">
            <div className="flex items-start gap-3">
              <input readOnly checked={paymentMethod === 'cod'} className="text-primary focus:ring-0 mt-0.5 w-4 h-4" name="payment_method" type="radio" />
              <div>
                <span className="text-xs font-bold text-text-primary">Tiền mặt khi nhận hàng (COD)</span>
                <p className="text-xs text-text-secondary mt-1">
                  Kiểm tra đúng vật tư và hạn sử dụng trước khi thanh toán cho người giao hàng.
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-text-muted text-[22px]">payments</span>
          </label>
        </div>
        <div
          onClick={() => onPaymentMethodChange('credit')}
          className={`rounded-xl p-4 cursor-pointer transition-colors bg-surface-secondary/40 ${
            paymentMethod === 'credit' ? 'border-2 border-primary' : 'border border-border-subtle hover:bg-surface-subtle'
          }`}
        >
          <label className="flex items-start justify-between cursor-pointer">
            <div className="flex items-start gap-3">
              <input readOnly checked={paymentMethod === 'credit'} className="text-primary focus:ring-0 mt-0.5 w-4 h-4" name="payment_method" type="radio" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-text-primary">Gối nợ mùa vụ (Sổ nợ đại lý)</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px]">
                    Mua chịu vụ mùa
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  Gửi yêu cầu mua chịu vụ mùa để đại lý xét duyệt.
                </p>
                <div className="mt-2 text-[11px] text-text-secondary flex items-center gap-2">
                  <span>
                    Hạn mức khả dụng: <strong className="text-primary font-bold">50.000.000 đ</strong>
                  </span>
                  <span className="text-status-success font-medium">• Đủ điều kiện thanh toán</span>
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined text-primary text-[22px]">credit_score</span>
          </label>
        </div>
      </div>
    </div>
  )
}
