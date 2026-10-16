import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { authApi } from '../../api/authApi'
import { ApiError, describeApiError } from '../../api/client'
import { isVietnameseMobile } from '../../utils/validation'
import AuthLayout from './components/AuthLayout'
import FieldError from '../../components/ui/FieldError'
import Spinner from '../../components/ui/Spinner'

const SMS_CODE = /^[0-9]{6}$/
const EMAIL_TOKEN = /^[a-fA-F0-9]{32}\.[A-Za-z0-9_-]{43}$/
const RESEND_SECONDS = 60
const BAD_CODE = 'Mã không đúng hoặc đã hết hạn. Mỗi mã chỉ được thử tối đa 5 lần, nếu hết lượt hãy gửi mã mới.'

type Step = 'code' | 'password'

interface FormErrors {
  identifier?: string
  code?: string
  password?: string
  confirm?: string
  general?: string
}

function describeNetworkError(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    if (err.status === 429) return 'Bạn thao tác quá nhanh. Vui lòng đợi một phút rồi thử lại.'
    if (err.status === 503) return 'Hiện chưa gửi được mã xác nhận. Vui lòng thử lại sau ít phút.'
    return describeApiError(err, fallback)
  }
  return 'Không kết nối được máy chủ. Vui lòng kiểm tra đường truyền rồi thử lại.'
}

/**
 * Password reset, two steps (backend: POST /api/auth/reset-password/verify-code, then /api/auth/reset-password).
 * Step 1 confirms the code: a 6-digit SMS code is checked at once together with the phone number, so a wrong code is
 * shown here and the password fields never appear. The long token an email carries cannot be checked ahead of the save,
 * so it goes straight to step 2. Step 2 asks for the new password and sends the same code again, which is what decides.
 */
export default function ResetPasswordPage() {
  useDocumentTitle('Đặt lại mật khẩu')
  const location = useLocation()
  const handedOver = location.state as { identifier?: string; requested?: boolean } | null
  const [identifier, setIdentifier] = useState(handedOver?.identifier ?? '')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<Step>('code')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [notice, setNotice] = useState(
    handedOver?.requested
      ? 'Nếu tài khoản tồn tại, mã xác nhận đã được gửi. Mã 6 số nằm trong tin nhắn SMS; email nhận một mã dài.'
      : '',
  )
  const [isBusy, setIsBusy] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [cooldown, setCooldown] = useState(handedOver?.requested ? RESEND_SECONDS : 0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = window.setTimeout(() => setCooldown((s) => s - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [cooldown])

  const value = code.trim()
  const isSmsCode = SMS_CODE.test(value)

  const backToCode = (message: string) => {
    setStep('code')
    setPassword('')
    setConfirm('')
    setErrors(message ? { code: message } : {})
  }

  const handleConfirmCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isBusy) return
    if (isSmsCode) {
      const phone = identifier.trim()
      if (!phone) return setErrors({ identifier: 'Nhập số điện thoại đã nhận mã SMS.' })
      if (phone.includes('@')) {
        return setErrors({ identifier: 'Mã 6 số được gửi qua SMS, hãy nhập số điện thoại nhận mã.' })
      }
      if (!isVietnameseMobile(phone)) return setErrors({ identifier: 'Số điện thoại không hợp lệ.' })
    } else if (!EMAIL_TOKEN.test(value)) {
      return setErrors({ code: 'Mã gồm 6 chữ số trong tin nhắn SMS, hoặc mã dài trong email.' })
    }
    setErrors({})
    setNotice('')
    if (!isSmsCode) {
      setStep('password')
      return
    }
    setIsBusy(true)
    try {
      await authApi.verifyResetCode(identifier.trim(), value)
      setStep('password')
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) setErrors({ code: BAD_CODE })
      else setErrors({ general: describeNetworkError(err, 'Không kiểm tra được mã. Vui lòng thử lại.') })
    } finally {
      setIsBusy(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isBusy) return
    const next: FormErrors = {}
    if (password.length < 8) next.password = 'Mật khẩu cần tối thiểu 8 ký tự'
    else if (password.length > 128) next.password = 'Mật khẩu tối đa 128 ký tự'
    if (confirm !== password) next.confirm = 'Mật khẩu xác nhận không khớp'
    if (Object.keys(next).length > 0) return setErrors(next)
    setErrors({})
    setIsBusy(true)
    try {
      if (isSmsCode) await authApi.resetPasswordWithCode(identifier.trim(), value, password)
      else await authApi.resetPasswordWithToken(value, password)
      setDone(true)
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        // The code was used up or expired between the two steps: ask for it again instead of leaving a dead form.
        backToCode(BAD_CODE)
      } else if (err instanceof ApiError && err.status === 400 && err.errors) {
        setErrors({ password: 'Mật khẩu cần từ 8 đến 128 ký tự.' })
      } else {
        setErrors({ general: describeNetworkError(err, 'Không đặt lại được mật khẩu. Vui lòng thử lại.') })
      }
    } finally {
      setIsBusy(false)
    }
  }

  const handleResend = async () => {
    const target = identifier.trim()
    if (!target || !(target.includes('@') || isVietnameseMobile(target))) {
      setErrors({ identifier: 'Nhập số điện thoại hoặc email đã đăng ký để nhận mã mới.' })
      return
    }
    setIsResending(true)
    setErrors({})
    try {
      await authApi.forgotPassword(target)
      setNotice('Nếu tài khoản tồn tại, mã mới đã được gửi. Mã cũ không còn dùng được.')
      setCode('')
      setCooldown(RESEND_SECONDS)
    } catch (err) {
      setErrors({ general: describeNetworkError(err, 'Không gửi được mã. Vui lòng thử lại.') })
    } finally {
      setIsResending(false)
    }
  }

  const inputBase =
    'w-full pl-9 pr-3 py-2.5 bg-brand-cream border text-brand-dark text-sm placeholder:text-brand-dark/40 focus:outline-none transition-colors'
  const inputOk = 'border-brand-dark/15 focus:border-brand-green'
  const inputErr = 'border-status-error focus:border-status-error'
  const labelClass = 'block text-xs tracking-[0.25em] text-brand-dark/50 mb-1'
  const submitClass =
    'w-full h-11 rounded-full bg-brand-dark text-white hover:bg-brand-green tracking-wide text-sm transition-colors flex items-center justify-center gap-2 focus:outline-none cursor-pointer disabled:opacity-70'

  return (
    <AuthLayout>
      <div className="mb-6 text-left">
        <p className="text-xs tracking-[0.25em] text-brand-dark/50 mb-2">AgriSage</p>
        <h1 className="text-2xl sm:text-3xl font-helvetica-neue tracking-tight text-brand-dark">
          Đặt lại mật khẩu
        </h1>
      </div>

      {done ? (
        <div className="space-y-4 text-left">
          <div
            role="status"
            className="p-4 bg-brand-light border border-brand-dark/10 flex items-start gap-2.5 text-sm text-brand-dark leading-relaxed"
          >
            <span className="material-symbols-outlined text-brand-green text-[20px] shrink-0 mt-0.5">
              check_circle
            </span>
            <span>Đã đặt lại mật khẩu. Bạn có thể đăng nhập bằng mật khẩu mới.</span>
          </div>
          <Link to="/login" className={submitClass}>
            <span>Đăng nhập</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      ) : step === 'code' ? (
        <form className="space-y-4 text-left" onSubmit={handleConfirmCode} noValidate>
          <p className="text-sm text-brand-dark/60 leading-relaxed">
            Bước 1/2: nhập mã xác nhận. Mã 6 chữ số trong tin nhắn SMS đi kèm số điện thoại nhận mã; email nhận một
            mã dài, hãy dán vào ô bên dưới.
          </p>
          {notice && (
            <p role="status" className="text-sm text-brand-green">
              {notice}
            </p>
          )}
          <div>
            <label className={labelClass} htmlFor="resetIdentifier">
              Số điện thoại hoặc email nhận mã
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-dark/40">
                <span className="material-symbols-outlined text-[18px]">call</span>
              </div>
              <input
                id="resetIdentifier"
                name="identifier"
                type="text"
                autoComplete="username"
                maxLength={255}
                placeholder="0912 345 678"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className={`${inputBase} ${errors.identifier ? inputErr : inputOk}`}
              />
            </div>
            <FieldError message={errors.identifier} />
          </div>
          <div>
            <label className={labelClass} htmlFor="resetCode">
              Mã xác nhận
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-dark/40">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </div>
              <input
                id="resetCode"
                name="code"
                type="text"
                autoComplete="one-time-code"
                maxLength={76}
                placeholder="6 chữ số từ SMS, hoặc mã từ email"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`${inputBase} ${errors.code ? inputErr : inputOk}`}
              />
            </div>
            <FieldError message={errors.code} />
          </div>
          {errors.general && (
            <p role="alert" className="text-sm text-status-error">
              {errors.general}
            </p>
          )}
          <button type="submit" disabled={isBusy} className={submitClass}>
            {isBusy && <Spinner />}
            <span>{isBusy ? 'Đang kiểm tra...' : 'Xác nhận mã'}</span>
          </button>
          <div className="flex items-center justify-between text-xs text-brand-dark/60">
            <button
              type="button"
              disabled={isResending || cooldown > 0}
              onClick={() => void handleResend()}
              className="text-brand-green hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
            >
              {isResending ? 'Đang gửi...' : cooldown > 0 ? `Gửi lại mã sau ${cooldown} giây` : 'Gửi lại mã'}
            </button>
            <Link to="/login" className="hover:text-brand-dark hover:underline">
              Quay lại đăng nhập
            </Link>
          </div>
        </form>
      ) : (
        <form className="space-y-4 text-left" onSubmit={handleSave} noValidate>
          <p role="status" className="text-sm text-brand-dark/60 leading-relaxed">
            Bước 2/2:{' '}
            {isSmsCode ? (
              <>
                <span className="text-brand-green">mã đã được xác nhận</span>, hãy đặt mật khẩu mới.
              </>
            ) : (
              'đặt mật khẩu mới. Mã trong email được kiểm tra khi bạn lưu.'
            )}
          </p>
          <div>
            <label className={labelClass} htmlFor="resetPassword">
              Mật khẩu mới
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-dark/40">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </div>
              <input
                id="resetPassword"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Tối thiểu 8 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputBase} pr-8 ${errors.password ? inputErr : inputOk}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-brand-dark/40 cursor-pointer hover:text-brand-dark"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            <FieldError message={errors.password} />
          </div>
          <div>
            <label className={labelClass} htmlFor="resetConfirm">
              Xác nhận mật khẩu mới
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-dark/40">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </div>
              <input
                id="resetConfirm"
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Nhập lại mật khẩu"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`${inputBase} pr-8 ${errors.confirm ? inputErr : inputOk}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-brand-dark/40 cursor-pointer hover:text-brand-dark"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showConfirm ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            <FieldError message={errors.confirm} />
          </div>
          {errors.general && (
            <p role="alert" className="text-sm text-status-error">
              {errors.general}
            </p>
          )}
          <button type="submit" disabled={isBusy} className={submitClass}>
            {isBusy && <Spinner />}
            <span>{isBusy ? 'Đang lưu...' : 'Đặt lại mật khẩu'}</span>
          </button>
          <div className="text-center">
            <button
              type="button"
              disabled={isBusy}
              onClick={() => backToCode('')}
              className="text-xs text-brand-dark/60 hover:text-brand-dark hover:underline disabled:opacity-50 cursor-pointer"
            >
              Nhập lại mã
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  )
}
