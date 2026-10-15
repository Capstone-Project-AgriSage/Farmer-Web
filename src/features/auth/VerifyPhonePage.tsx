import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { authApi, type CurrentUserResponse } from '../../api/authApi'
import { ApiError, describeApiError } from '../../api/client'
import AuthLayout from './components/AuthLayout'
import Spinner from '../../components/ui/Spinner'

const RESEND_SECONDS = 60

/**
 * Confirms the account's phone number with a 6-digit code sent by SMS (backend: POST /api/auth/phone-verification/
 * request and /confirm). Reached right after registering with a phone, or later from the account page. It is never
 * forced: the farmer can skip and keep using the shop.
 */
export default function VerifyPhonePage() {
  useDocumentTitle('Xác minh số điện thoại')
  const navigate = useNavigate()
  const [me, setMe] = useState<CurrentUserResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [notice, setNotice] = useState('')
  const [sendError, setSendError] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [done, setDone] = useState(false)
  const requestedOnce = useRef(false)

  const send = async (phone: string) => {
    setIsSending(true)
    setSendError('')
    setNotice('')
    try {
      await authApi.requestPhoneVerification()
      setNotice(`Đã gửi mã gồm 6 chữ số tới ${phone}. Mã có hiệu lực trong 10 phút.`)
      setCooldown(RESEND_SECONDS)
    } catch (err) {
      if (err instanceof ApiError && err.status === 503) {
        setSendError(
          'Hiện chưa gửi được tin nhắn SMS. Bạn có thể thử lại sau ít phút, hoặc bỏ qua và xác minh sau trong mục Tài khoản.',
        )
      } else if (err instanceof ApiError && err.status === 422) {
        setSendError('Tài khoản chưa có số điện thoại để xác minh.')
      } else if (err instanceof ApiError && err.status === 429) {
        setSendError('Bạn thao tác quá nhanh. Vui lòng đợi một phút rồi thử lại.')
      } else {
        setSendError(describeApiError(err, 'Không gửi được mã. Vui lòng thử lại.'))
      }
    } finally {
      setIsSending(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    authApi
      .getMe()
      .then((user) => {
        if (cancelled) return
        setMe(user)
        if (user.phoneVerified) {
          setDone(true)
        } else if (!user.phoneNumber) {
          navigate('/', { replace: true })
        } else if (!requestedOnce.current) {
          requestedOnce.current = true // React StrictMode mounts twice in development
          void send(user.phoneNumber)
        }
      })
      .catch((err) => {
        if (!cancelled) setSendError(describeApiError(err, 'Không tải được thông tin tài khoản.'))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = window.setTimeout(() => setCooldown((s) => s - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [cooldown])

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = code.trim()
    if (!/^[0-9]{6}$/.test(value)) {
      setCodeError('Mã gồm đúng 6 chữ số.')
      return
    }
    setCodeError('')
    setIsConfirming(true)
    try {
      await authApi.confirmPhone(value)
      setDone(true)
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setCodeError('Mã không đúng hoặc đã hết hạn. Hãy kiểm tra lại, hoặc gửi mã mới.')
      } else {
        setCodeError(describeApiError(err, 'Không xác nhận được mã. Vui lòng thử lại.'))
      }
    } finally {
      setIsConfirming(false)
    }
  }

  const inputClass =
    'w-full pl-9 pr-3 py-2.5 bg-brand-cream border text-brand-dark text-sm tracking-[0.4em] placeholder:tracking-normal placeholder:text-brand-dark/40 focus:outline-none transition-colors'

  return (
    <AuthLayout>
      <div className="mb-6 text-left">
        <p className="text-xs tracking-[0.25em] text-brand-dark/50 mb-2">AgriSage</p>
        <h1 className="text-2xl sm:text-3xl font-helvetica-neue tracking-tight text-brand-dark">
          Xác minh số điện thoại
        </h1>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-brand-dark/60" role="status">
          <Spinner className="h-4 w-4 text-brand-dark" />
          <span>Đang tải...</span>
        </div>
      ) : done ? (
        <div className="space-y-4 text-left">
          <div
            role="status"
            className="p-4 bg-brand-light border border-brand-dark/10 flex items-start gap-2.5 text-sm text-brand-dark leading-relaxed"
          >
            <span className="material-symbols-outlined text-brand-green text-[20px] flex-shrink-0 mt-0.5">
              check_circle
            </span>
            <span>
              Số điện thoại {me?.phoneNumber ? <strong>{me.phoneNumber}</strong> : null} đã được xác minh.
            </span>
          </div>
          <Link
            to="/"
            className="w-full h-11 rounded-full bg-brand-dark text-white hover:bg-brand-green tracking-wide text-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>Tiếp tục</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      ) : (
        <form className="space-y-4 text-left" onSubmit={handleConfirm} noValidate>
          <p className="text-sm text-brand-dark/60 leading-relaxed">
            Chúng tôi gửi mã xác minh qua SMS tới <strong className="text-brand-dark">{me?.phoneNumber ?? 'số điện thoại của bạn'}</strong>.
            Nhập mã gồm 6 chữ số để hoàn tất.
          </p>

          {notice && (
            <p role="status" className="text-sm text-brand-green">
              {notice}
            </p>
          )}
          {sendError && (
            <p role="alert" className="text-sm text-status-error">
              {sendError}
            </p>
          )}

          <div>
            <label className="block text-xs tracking-[0.25em] text-brand-dark/50 mb-1" htmlFor="phoneCode">
              Mã xác minh
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-dark/40">
                <span className="material-symbols-outlined text-[18px]">sms</span>
              </div>
              <input
                id="phoneCode"
                name="phoneCode"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="6 chữ số"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className={`${inputClass} ${codeError ? 'border-status-error focus:border-status-error' : 'border-brand-dark/15 focus:border-brand-green'}`}
              />
            </div>
            {codeError && (
              <p role="alert" className="text-[11px] text-status-error mt-1">
                {codeError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isConfirming || isLoading}
            className="w-full h-11 rounded-full bg-brand-dark text-white hover:bg-brand-green tracking-wide text-sm transition-colors flex items-center justify-center gap-2 focus:outline-none cursor-pointer disabled:opacity-70"
          >
            {isConfirming && <Spinner />}
            <span>{isConfirming ? 'Đang xác nhận...' : 'Xác nhận'}</span>
          </button>

          <div className="flex items-center justify-between text-xs text-brand-dark/60">
            <button
              type="button"
              disabled={isSending || cooldown > 0 || !me?.phoneNumber}
              onClick={() => me?.phoneNumber && void send(me.phoneNumber)}
              className="text-brand-green hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
            >
              {isSending ? 'Đang gửi...' : cooldown > 0 ? `Gửi lại mã sau ${cooldown} giây` : 'Gửi lại mã'}
            </button>
            <Link to="/" className="hover:text-brand-dark hover:underline">
              Để sau
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  )
}
