import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useAuth } from '../../context/AuthContext'
import { isValidEmail, isVietnameseMobile } from '../../utils/validation'
import { ApiError } from '../../api/client'
import FieldError from '../../components/ui/FieldError'
import AuthLayout from './components/AuthLayout'

interface FormErrors {
  fullName?: string
  contact?: string
  password?: string
  confirmPassword?: string
  terms?: string
  general?: string
}

/** Turns what the API answered into messages next to the right field (the server's own text is English). */
function describeRegisterError(err: unknown): FormErrors {
  if (err instanceof ApiError) {
    if (err.status === 409) {
      return {
        contact: 'Số điện thoại hoặc email này đã có tài khoản. Hãy đăng nhập, hoặc chọn "Quên mật khẩu".',
      }
    }
    if (err.status === 400 && err.errors) {
      const keys = Object.keys(err.errors).map((k) => k.toLowerCase())
      const next: FormErrors = {}
      if (keys.some((k) => k.includes('phone') || k.includes('email') || k.includes('contact'))) {
        next.contact = 'Số điện thoại di động hoặc email không hợp lệ.'
      }
      if (keys.some((k) => k.includes('password'))) next.password = 'Mật khẩu cần từ 8 đến 128 ký tự.'
      if (keys.some((k) => k.includes('fullname'))) next.fullName = 'Họ và tên cần từ 1 đến 150 ký tự.'
      if (Object.keys(next).length > 0) return next
    }
    if (err.status === 429) return { general: 'Bạn thao tác quá nhanh. Vui lòng đợi một phút rồi thử lại.' }
    if (err.status === 503) return { general: 'Dịch vụ tạm gián đoạn, vui lòng thử lại sau.' }
    return { general: err.detail || 'Đăng ký không thành công. Vui lòng thử lại.' }
  }
  return { general: 'Không kết nối được máy chủ. Vui lòng kiểm tra đường truyền rồi thử lại.' }
}

export default function RegisterPage() {
  useDocumentTitle('Đăng ký tài khoản')
  const navigate = useNavigate()
  const { register } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fullName, setFullName] = useState('')
  const [contact, setContact] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [terms, setTerms] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = (): FormErrors => {
    const next: FormErrors = {}
    if (!fullName.trim()) next.fullName = 'Vui lòng nhập họ và tên'
    else if (fullName.trim().length > 150) next.fullName = 'Họ và tên tối đa 150 ký tự'

    const value = contact.trim()
    if (!value) {
      next.contact = 'Vui lòng nhập email hoặc số điện thoại'
    } else if (value.includes('@') ? !isValidEmail(value) : !isVietnameseMobile(value)) {
      next.contact = 'Nhập số điện thoại di động Việt Nam (ví dụ 0912 345 678) hoặc email hợp lệ'
    }

    if (password.length < 8) next.password = 'Mật khẩu cần tối thiểu 8 ký tự'
    else if (password.length > 128) next.password = 'Mật khẩu tối đa 128 ký tự'
    if (confirmPassword !== password) next.confirmPassword = 'Mật khẩu xác nhận không khớp'
    if (!terms) next.terms = 'Bạn cần đồng ý với điều khoản để tiếp tục'

    return next
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      setIsSubmitting(true)
      try {
        const value = contact.trim()
        await register(fullName.trim(), value, password)
        // Registration sends no SMS; a farmer who signed up with a phone goes on to confirm it (and may skip).
        navigate(value.includes('@') ? '/' : '/verify-phone')
      } catch (err) {
        setErrors(describeRegisterError(err))
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const inputBase =
    'w-full pl-9 pr-3 py-2.5 bg-brand-cream border text-brand-dark text-sm placeholder:text-brand-dark/40 focus:outline-none transition-colors'
  const inputOk = 'border-brand-dark/15 focus:border-brand-green'
  const inputErr = 'border-status-error focus:border-status-error'

  return (
    <AuthLayout showTags>
      <div className="mb-5 text-left">
        <p className="text-xs tracking-[0.25em]  text-brand-dark/50 mb-2">AgriSage</p>
        <h1 className="text-2xl sm:text-3xl font-helvetica-neue tracking-tight text-brand-dark">
          Đăng ký tài khoản
        </h1>
        <p className="text-sm text-brand-dark/60 mt-1">
          Gia nhập hệ sinh thái nông nghiệp thông minh AgriSage
        </p>
      </div>
      <form className="space-y-3.5" onSubmit={handleSubmit} noValidate>
        <div className="text-left">
          <label className="block text-xs tracking-[0.25em]  text-brand-dark/50 mb-1" htmlFor="fullName">
            Họ và tên
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-dark/40">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <input
              className={`${inputBase} ${errors.fullName ? inputErr : inputOk}`}
              id="fullName"
              name="fullName"
              placeholder="Nguyễn Văn Nông"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <FieldError message={errors.fullName} />
        </div>
        <div className="text-left">
          <div>
            <label className="block text-xs tracking-[0.25em]  text-brand-dark/50 mb-1" htmlFor="regContact">
              Email / Số điện thoại
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-dark/40">
                <span className="material-symbols-outlined text-[18px]">call</span>
              </div>
              <input
                className={`${inputBase} ${errors.contact ? inputErr : inputOk}`}
                id="regContact"
                name="contact"
                placeholder="0912 345 678"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
            <FieldError message={errors.contact} />
            <p className="text-[11px] text-brand-dark/50 mt-1">
              Đăng ký bằng số điện thoại, chúng tôi sẽ gửi mã SMS để xác minh ngay sau khi tạo tài khoản.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div>
            <label className="block text-xs tracking-[0.25em]  text-brand-dark/50 mb-1" htmlFor="regPassword">
              Mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-dark/40">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </div>
              <input
                className={`${inputBase} pr-8 ${errors.password ? inputErr : inputOk}`}
                id="regPassword"
                name="password"
                placeholder="Tối thiểu 8 ký tự"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <label
              className="block text-xs tracking-[0.25em]  text-brand-dark/50 mb-1"
              htmlFor="regConfirmPassword"
            >
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-dark/40">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </div>
              <input
                className={`${inputBase} pr-8 ${errors.confirmPassword ? inputErr : inputOk}`}
                id="regConfirmPassword"
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? 'Ẩn mật khẩu xác nhận' : 'Hiện mật khẩu xác nhận'}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-brand-dark/40 cursor-pointer hover:text-brand-dark"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showConfirmPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            <FieldError message={errors.confirmPassword} />
          </div>
        </div>
        <div className="pt-1">
          <label className="group flex items-start gap-2 cursor-pointer select-none text-left">
            <input
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              id="termsCheck"
              name="terms"
              type="checkbox"
              className="mt-1 accent-brand-dark"
            />
            <span className="text-xs text-brand-dark/60 leading-snug">
              Tôi đồng ý với{' '}
              <a href="#" className="text-brand-green hover:underline">
                Điều khoản dịch vụ
              </a>{' '}
              và{' '}
              <a href="#" className="text-brand-green hover:underline">
                Chính sách bảo mật nông hộ
              </a>{' '}
              của AgriSage.
            </span>
          </label>
          <FieldError message={errors.terms} />
        </div>
        {errors.general && (
          <p role="alert" className="text-sm text-status-error text-left">
            {errors.general}
          </p>
        )}
        <div className="pt-2">
          <button
            className="w-full h-11 rounded-full bg-brand-dark text-white hover:bg-brand-green tracking-wide  text-sm transition-colors flex items-center justify-center gap-2 focus:outline-none cursor-pointer disabled:opacity-70"
            type="submit"
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? 'Đang tạo tài khoản...' : 'Đăng ký tài khoản'}</span>
            {!isSubmitting && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
          </button>
        </div>
      </form>
      <div className="text-center pt-5 text-xs text-brand-dark/60">
        <span>Đã có tài khoản?</span>
        <Link
          className="text-brand-green hover:text-brand-dark hover:underline ml-1 inline-flex items-center gap-0.5 transition-colors"
          to="/login"
        >
          <span>Đăng nhập ngay</span>
          <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
        </Link>
      </div>
    </AuthLayout>
  )
}
