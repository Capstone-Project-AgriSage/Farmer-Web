import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import AuthLayout from './components/AuthLayout'
import Spinner from '../../components/ui/Spinner'

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
    <AuthLayout>
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
                  <Spinner className="-ml-1 mr-2 h-4 w-4 text-white" />
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
    </AuthLayout>
  )
}
