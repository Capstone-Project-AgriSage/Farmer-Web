import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { authApi } from '../../api/authApi'
import { ApiError, describeApiError } from '../../api/client'
import { isValidEmail, isVietnameseMobile } from '../../utils/validation'
import AuthLayout from './components/AuthLayout'
import Spinner from '../../components/ui/Spinner'

/** The server answers the same whether or not the account exists, so every message here is neutral. */
function describeForgotError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 503) return 'Hiện chưa gửi được mã xác nhận. Vui lòng thử lại sau ít phút.'
    if (err.status === 429) return 'Bạn thao tác quá nhanh. Vui lòng đợi một phút rồi thử lại.'
    return describeApiError(err, 'Không gửi được mã xác nhận. Vui lòng thử lại.')
  }
  return 'Không kết nối được máy chủ. Vui lòng kiểm tra đường truyền rồi thử lại.'
}

/**
 * Step 0 of the password reset (backend: POST /api/auth/forgot-password): the farmer gives the phone or the email, a
 * code is sent, and /reset-password confirms the code and then asks for the new password.
 */
export default function ForgotPasswordPage() {
  useDocumentTitle('Quên mật khẩu')
  const navigate = useNavigate()
  const location = useLocation()
  const [identity, setIdentity] = useState(
    (location.state as { identifier?: string } | null)?.identifier ?? '',
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    const value = identity.trim()
    const valid = value.includes('@') ? isValidEmail(value) : isVietnameseMobile(value)
    if (!valid) {
      setError('Nhập số điện thoại di động (10 số) hoặc email đã đăng ký.')
      return
    }
    setError('')
    setIsSubmitting(true)
    try {
      await authApi.forgotPassword(value)
      navigate('/reset-password', { state: { identifier: value, requested: true } })
    } catch (err) {
      setError(describeForgotError(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="mb-6 text-left">
        <p className="text-xs tracking-[0.25em]  text-brand-dark/50 mb-2">AgriSage</p>
        <h1 className="text-2xl sm:text-3xl font-helvetica-neue tracking-tight text-brand-dark">
          Quên mật khẩu?
        </h1>
        <p className="text-sm text-brand-dark/60 mt-2 leading-relaxed">
          Nhập số điện thoại hoặc email đã đăng ký để nhận mã xác nhận đặt lại mật khẩu.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label
            className="block text-xs tracking-[0.25em]  text-brand-dark/50 mb-1.5"
            htmlFor="recoveryInput"
          >
            Email hoặc số điện thoại đã đăng ký
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-dark/40">
              <span className="material-symbols-outlined text-[20px]">contact_mail</span>
            </div>
            <input
              className={`w-full pl-10 pr-4 py-2.5 bg-brand-cream border text-brand-dark text-sm placeholder:text-brand-dark/40 focus:outline-none transition-colors ${
                error ? 'border-status-error focus:border-status-error' : 'border-brand-dark/15 focus:border-brand-green'
              }`}
              id="recoveryInput"
              name="identity"
              placeholder="Ví dụ: 0912 345 678 hoặc nongdan@agrisage.vn"
              type="text"
              autoComplete="username"
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
            />
          </div>
        </div>
        {error ? (
          <div
            role="alert"
            className="flex items-center gap-1.5 px-3 py-2 bg-status-error-surface text-status-error text-xs"
          >
            <span className="material-symbols-outlined text-[16px]">error</span>
            {error}
          </div>
        ) : null}
        <div className="p-3.5 bg-brand-light border border-brand-dark/10 flex items-start gap-2.5 text-xs text-brand-dark/60 leading-relaxed">
          <span className="material-symbols-outlined text-brand-green text-[18px] shrink-0 mt-0.5">
            info
          </span>
          <span>
            Số điện thoại nhận mã gồm 6 chữ số qua tin nhắn SMS; email nhận một mã dài. Mã có hiệu lực trong ít
            phút và chỉ dùng được một lần.
          </span>
        </div>
        <div className="pt-2">
          <button
            className="w-full h-11 rounded-full bg-brand-dark text-white hover:bg-brand-green tracking-wide  text-sm transition-colors flex items-center justify-center gap-2 focus:outline-none disabled:opacity-70"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner className="-ml-1 mr-2 h-4 w-4 text-white" />
                <span>Đang gửi mã...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>Gửi mã xác nhận</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </span>
            )}
          </button>
        </div>
      </form>
      <div className="pt-4 pb-2 flex flex-col items-center gap-1 text-center">
        <Link
          className="text-sm text-brand-green hover:text-brand-dark hover:underline transition-colors py-1"
          to="/reset-password"
          state={{ identifier: identity.trim() }}
        >
          Tôi đã có mã xác nhận
        </Link>
        <Link
          className="inline-flex items-center justify-center gap-2 text-sm text-brand-dark/60 hover:text-brand-dark transition-colors py-2 px-4"
          to="/login"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Quay lại Đăng nhập</span>
        </Link>
      </div>
      <div className="relative my-4 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-brand-dark/10"></div>
        </div>
      </div>
      <div className="text-center text-xs text-brand-dark/50 flex items-center justify-center gap-1.5 pt-1">
        <span className="material-symbols-outlined text-[16px] text-brand-green">support_agent</span>
        <span>
          Cần hỗ trợ khẩn cấp? Gọi kỹ sư trực tuyến:{' '}
          <strong className="text-brand-dark hover:underline">
            <a href="tel:19006828">1900 6828</a>
          </strong>
        </span>
      </div>
    </AuthLayout>
  )
}
