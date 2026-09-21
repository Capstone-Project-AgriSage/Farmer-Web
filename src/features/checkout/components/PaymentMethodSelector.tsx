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
            paymentMethod === 'vietqr' ? 'border border-brand-dark' : 'border border-brand-dark/10'
          }`}
        >
          <label onClick={() => onPaymentMethodChange('vietqr')} className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <input
                readOnly
                checked={paymentMethod === 'vietqr'}
                className="text-brand-dark focus:ring-0 w-4 h-4 accent-brand-dark"
                name="payment_method"
                type="radio"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-brand-dark">Chuyển khoản VietQR / Napas 247</span>
                  <span className="px-2 py-0.5 rounded-full bg-brand-light text-brand-green text-[10px] tracking-wide uppercase">
                    Khuyên dùng
                  </span>
                </div>
                <p className="text-[11px] text-brand-dark/50 mt-0.5">
                  Quét mã trên app ngân hàng, chủ đại lý Hai Thắng đối soát và xác nhận khớp tiền thủ công
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-brand-green text-[22px]">qr_code_2</span>
          </label>
          {paymentMethod === 'vietqr' && (
            <div className="mt-4 pt-4 border-t border-brand-dark/10 bg-brand-cream p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5">
              <div className="flex-shrink-0 bg-white p-3 border border-brand-dark/10 flex flex-col items-center">
                <div className="w-36 h-36 bg-white border border-brand-dark/10 flex items-center justify-center relative overflow-hidden p-1">
                  <img
                    alt="VietQR Thanh toán AgriSage"
                    className="w-full h-full object-contain"
                    src="/images/misc/vietqr-demo.png"
                  />
                </div>
                <span className="text-[10px] text-brand-green mt-1.5 flex items-center gap-1 tracking-wide uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse"></span>
                  Vietcombank Napas247
                </span>
              </div>
              <div className="flex-1 space-y-2 text-xs w-full">
                <div className="flex items-center justify-between py-1 border-b border-brand-dark/10">
                  <span className="text-brand-dark/50">Ngân hàng:</span>
                  <span className="text-brand-dark">Vietcombank - Chi nhánh Cần Thơ</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-brand-dark/10">
                  <span className="text-brand-dark/50">Chủ tài khoản:</span>
                  <span className="text-brand-dark uppercase">NGUYEN VAN THANG (ĐẠI LÝ HAI THẮNG)</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-brand-dark/10">
                  <span className="text-brand-dark/50">Số tài khoản:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-brand-dark text-sm">19006828999</span>
                    <button
                      type="button"
                      onClick={() => onCopy('account', '19006828999')}
                      className="text-[10px] text-brand-green hover:underline tracking-wide uppercase"
                      title="Sao chép số TK"
                    >
                      {copiedField === 'account' ? 'Đã copy' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-brand-dark/10">
                  <span className="text-brand-dark/50">Số tiền:</span>
                  <span className="text-brand-dark text-sm">{formatVnd(total)}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-brand-dark/50">Nội dung CK:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-brand-dark bg-white px-2 py-0.5 border border-brand-dark/15">
                      AGR8842
                    </span>
                    <button
                      type="button"
                      onClick={() => onCopy('memo', 'AGR8842')}
                      className="text-[10px] text-brand-green hover:underline tracking-wide uppercase"
                      title="Sao chép cú pháp"
                    >
                      {copiedField === 'memo' ? 'Đã copy' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="p-2.5 border border-brand-dark/15 bg-brand-light text-brand-dark/70 text-[11px] flex items-start gap-1.5 mt-1">
                  <span className="material-symbols-outlined text-[16px] text-brand-green flex-shrink-0 mt-0.5">
                    info
                  </span>
                  <span>
                    Đại lý Hai Thắng sẽ kiểm tra và đối soát chuyển khoản thủ công trên tài khoản Vietcombank trước khi xuất kho.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div
          onClick={() => onPaymentMethodChange('cod')}
          className={`p-4 cursor-pointer transition-colors ${
            paymentMethod === 'cod'
              ? 'border border-brand-dark'
              : 'border border-brand-dark/10 hover:bg-brand-cream'
          }`}
        >
          <label className="flex items-start justify-between cursor-pointer">
            <div className="flex items-start gap-3">
              <input
                readOnly
                checked={paymentMethod === 'cod'}
                className="text-brand-dark focus:ring-0 mt-0.5 w-4 h-4 accent-brand-dark"
                name="payment_method"
                type="radio"
              />
              <div>
                <span className="text-xs text-brand-dark">
                  Tiền mặt khi nhận hàng (Đại lý giao tận ruộng / nhà)
                </span>
                <p className="text-xs text-brand-dark/60 mt-1">
                  Bác nông dân kiểm tra quy cách bao bì vật tư chính hãng, đúng hạn sử dụng trước khi giao tiền cho nhân viên đại lý Hai Thắng.
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-brand-dark/40 text-[22px]">payments</span>
          </label>
        </div>
        <div
          onClick={() => onPaymentMethodChange('credit')}
          className={`p-4 cursor-pointer transition-colors bg-brand-light/60 ${
            paymentMethod === 'credit'
              ? 'border border-brand-dark'
              : 'border border-brand-dark/10 hover:bg-brand-cream'
          }`}
        >
          <label className="flex items-start justify-between cursor-pointer">
            <div className="flex items-start gap-3">
              <input
                readOnly
                checked={paymentMethod === 'credit'}
                className="text-brand-dark focus:ring-0 mt-0.5 w-4 h-4 accent-brand-dark"
                name="payment_method"
                type="radio"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-brand-dark">Gối nợ mùa vụ (Sổ nợ Hai Thắng)</span>
                  <span className="px-2 py-0.5 rounded-full bg-brand-dark text-white text-[10px] tracking-wide uppercase">
                    0% Lãi suất
                  </span>
                </div>
                <p className="text-xs text-brand-dark/60 mt-1">
                  Được đại lý cấp hạn mức mua trước vật tư trả sau vụ gặt lúa Đông Xuân 2025. Hai bên ký nhận và theo dõi minh bạch trên hệ thống.
                </p>
                <div className="mt-2 text-[11px] text-brand-dark/60 flex items-center gap-2">
                  <span>
                    Hạn mức khả dụng: <strong className="text-brand-dark">50.000.000 đ</strong>
                  </span>
                  <span className="text-brand-green">• Đủ điều kiện thanh toán</span>
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined text-brand-green text-[22px]">credit_score</span>
          </label>
        </div>
      </div>
    </div>
  )
}
