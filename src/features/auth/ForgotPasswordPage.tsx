import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export default function ForgotPasswordPage() {
  useDocumentTitle('Quên mật khẩu')
  const [identity, setIdentity] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setOtpSent(true)
    }, 1200)
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-card border border-border-subtle overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-10 overflow-hidden bg-primary-dark text-white">
          <img
            alt="Canh tác nông nghiệp công nghệ cao AgriCARE-AI"
            className="absolute inset-0 w-full h-full object-cover object-center transform scale-105 filter brightness-90 transition-transform duration-1000"
            src="https://lh3.googleusercontent.com/aida/AEtjO1XzPDIGa2bO0wTeb-qH9o0xB04yV1sz7MTLvdEDqjZ7PifIKfhiQLdXgaqJN-HpmBP87Fkiuqgch2c5EemEpPU9DwGIVax9vM7PaXEij5b6_jmxLkkWrwm5vckRFsMgg8X4JO9xhjZkTT0Gxytd8zc_ksfCLYT6XB5i34vXYVll4wHKtgwB3VQ4Q9gOUTkKpyUx-ZKzVh2zC3lGDkpEEB2NdrXh1-QhQftGYTijANaudQuHNqGK9B8iOHJv"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/85 to-primary-dark/45 backdrop-blur-[1px]"></div>
          <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>
          <div className="relative z-10 my-auto py-6">
            <h2 className="text-2xl lg:text-3xl font-bold leading-snug tracking-tight text-white mb-4">
              Đồng hành cùng nhà nông &amp; đại lý số hóa mùa vụ.
            </h2>
            <p className="text-emerald-100/80 text-sm leading-relaxed mb-6 font-normal">
              Giải pháp toàn diện quản lý tồn kho, công nợ và chẩn đoán bệnh cây trồng bằng AI.
            </p>
          </div>
        </div>
        <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white">
          <div className="max-w-md w-full mx-auto my-auto py-2">
            <div className="mb-6 text-left">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                Quên mật khẩu?
              </h1>
              <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                Nhập email hoặc số điện thoại đã đăng ký để nhận mã xác thực (OTP) đặt lại mật
                khẩu.
              </p>
            </div>
            {otpSent ? (
              <div className="p-4 rounded-lg bg-status-success-surface border border-status-success/20 flex items-start gap-2.5 text-sm text-status-success leading-relaxed">
                <span className="material-symbols-outlined text-[20px] flex-shrink-0 mt-0.5">check_circle</span>
                <span>
                  Đã gửi mã xác thực OTP đến <strong>{identity || 'liên hệ của bạn'}</strong>. Vui
                  lòng kiểm tra tin nhắn SMS hoặc Email để đặt lại mật khẩu.
                </span>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5"
                    htmlFor="recoveryInput"
                  >
                    EMAIL HOẶC SỐ ĐIỆN THOẠI ĐÃ ĐĂNG KÝ
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                      <span className="material-symbols-outlined text-[20px]">contact_mail</span>
                    </div>
                    <input
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-border-subtle rounded-md text-text-primary text-sm placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                      id="recoveryInput"
                      name="identity"
                      placeholder="Ví dụ: 0912 345 678 hoặc nongdan@agrisage.vn"
                      required
                      type="text"
                      value={identity}
                      onChange={(e) => setIdentity(e.target.value)}
                    />
                  </div>
                </div>
                <div className="p-3.5 rounded-lg bg-surface-secondary border border-border-subtle flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed">
                  <span className="material-symbols-outlined text-primary text-[18px] flex-shrink-0 mt-0.5">
                    info
                  </span>
                  <span>
                    Hệ thống sẽ gửi mã xác thực 6 số qua tin nhắn SMS hoặc Email trong vòng 60
                    giây.
                  </span>
                </div>
                <div className="pt-2">
                  <button
                    className="w-full h-11 bg-primary hover:bg-primary-hover active:bg-primary-dark text-white font-medium text-sm rounded-md shadow-sm transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-primary/40 focus:outline-none disabled:opacity-70"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2 font-medium">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path
                            className="opacity-75"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            fill="currentColor"
                          ></path>
                        </svg>
                        <span>Đang gửi mã...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2 font-semibold">
                        <span>Gửi mã xác thực OTP</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </span>
                    )}
                  </button>
                </div>
              </form>
            )}
            <div className="pt-4 pb-2 text-center">
              <Link
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-surface-secondary"
                to="/login"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>Quay lại Đăng nhập</span>
              </Link>
            </div>
            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-subtle"></div>
              </div>
            </div>
            <div className="text-center text-xs text-text-muted flex items-center justify-center gap-1.5 pt-1">
              <span className="material-symbols-outlined text-[16px] text-primary">support_agent</span>
              <span>
                Cần hỗ trợ khẩn cấp? Gọi kỹ sư trực tuyến:{' '}
                <strong className="text-primary font-bold hover:underline">
                  <a href="tel:19006828">1900 6828</a>
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
