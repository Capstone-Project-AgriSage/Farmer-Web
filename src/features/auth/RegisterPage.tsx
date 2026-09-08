import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import AuthLayout from './components/AuthLayout'
import GoogleAuthButton from './components/GoogleAuthButton'

const PHONE_REGEX = /^(0|\+84)\d{9,10}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface FormErrors {
  fullName?: string
  contact?: string
  password?: string
  confirmPassword?: string
  terms?: string
}

export default function RegisterPage() {
  useDocumentTitle('Đăng ký tài khoản')
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fullName, setFullName] = useState('Nguyễn Văn Nông')
  const [contact, setContact] = useState('0912 345 678')
  const [password, setPassword] = useState('NongDan@2024')
  const [confirmPassword, setConfirmPassword] = useState('NongDan@2024')
  const [terms, setTerms] = useState(true)
  const [errors, setErrors] = useState<FormErrors>({})

  const validate = (): FormErrors => {
    const next: FormErrors = {}
    if (!fullName.trim()) next.fullName = 'Vui lòng nhập họ và tên'

    const normalizedContact = contact.replace(/\s/g, '')
    if (!contact.trim()) {
      next.contact = 'Vui lòng nhập email hoặc số điện thoại'
    } else if (!PHONE_REGEX.test(normalizedContact) && !EMAIL_REGEX.test(contact.trim())) {
      next.contact = 'Email hoặc số điện thoại không hợp lệ'
    }

    if (password.length < 8) next.password = 'Mật khẩu cần tối thiểu 8 ký tự'
    if (confirmPassword !== password) next.confirmPassword = 'Mật khẩu xác nhận không khớp'
    if (!terms) next.terms = 'Bạn cần đồng ý với điều khoản để tiếp tục'

    return next
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      navigate('/')
    }
  }

  return (
    <AuthLayout showTags>
      <div className="mb-5 text-left">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
          Đăng ký tài khoản
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Gia nhập hệ sinh thái nông nghiệp thông minh AgriSage
        </p>
      </div>
      <form className="space-y-3.5" onSubmit={handleSubmit} noValidate>
        <div className="text-left">
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1" htmlFor="fullName">
            Họ và tên
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <input
              className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:ring-2 focus:outline-none transition-all ${
                errors.fullName
                  ? 'border-status-error focus:border-status-error focus:ring-status-error/20'
                  : 'border-border-subtle focus:border-primary focus:ring-primary/20'
              }`}
              id="fullName"
              name="fullName"
              placeholder="Nguyễn Văn Nông"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          {errors.fullName && <p className="text-[11px] text-status-error mt-1">{errors.fullName}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1" htmlFor="regContact">
              Email / Số điện thoại
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <span className="material-symbols-outlined text-[18px]">call</span>
              </div>
              <input
                className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:ring-2 focus:outline-none transition-all ${
                  errors.contact
                    ? 'border-status-error focus:border-status-error focus:ring-status-error/20'
                    : 'border-border-subtle focus:border-primary focus:ring-primary/20'
                }`}
                id="regContact"
                name="contact"
                placeholder="0912 345 678"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
            {errors.contact && <p className="text-[11px] text-status-error mt-1">{errors.contact}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1" htmlFor="farmRegion">
              Khu vực canh tác
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
              </div>
              <select
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-border-subtle rounded-lg text-text-primary text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all cursor-pointer"
                id="farmRegion"
                name="region"
                defaultValue="Lâm Đồng (Đà Lạt, Di Linh...)"
              >
                <option>Lâm Đồng (Đà Lạt, Di Linh...)</option>
                <option>Đắk Lắk (Buôn Ma Thuột...)</option>
                <option>Gia Lai - Kon Tum</option>
                <option>Đồng bằng Sông Cửu Long</option>
                <option>Đông Nam Bộ &amp; khu vực khác</option>
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1" htmlFor="regPassword">
              Mật khẩu
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </div>
              <input
                className={`w-full pl-9 pr-8 py-2.5 bg-white border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:ring-2 focus:outline-none transition-all ${
                  errors.password
                    ? 'border-status-error focus:border-status-error focus:ring-status-error/20'
                    : 'border-border-subtle focus:border-primary focus:ring-primary/20'
                }`}
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
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-text-muted cursor-pointer hover:text-text-primary"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {errors.password && <p className="text-[11px] text-status-error mt-1">{errors.password}</p>}
          </div>
          <div>
            <label
              className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1"
              htmlFor="regConfirmPassword"
            >
              Xác nhận mật khẩu
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </div>
              <input
                className={`w-full pl-9 pr-8 py-2.5 bg-white border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:ring-2 focus:outline-none transition-all ${
                  errors.confirmPassword
                    ? 'border-status-error focus:border-status-error focus:ring-status-error/20'
                    : 'border-border-subtle focus:border-primary focus:ring-primary/20'
                }`}
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
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-text-muted cursor-pointer hover:text-text-primary"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showConfirmPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-status-error mt-1">{errors.confirmPassword}</p>
            )}
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
              className="mt-1"
            />
            <span className="text-xs text-text-secondary leading-snug">
              Tôi đồng ý với{' '}
              <a href="#" className="text-primary font-semibold hover:underline">
                Điều khoản dịch vụ
              </a>{' '}
              và{' '}
              <a href="#" className="text-primary font-semibold hover:underline">
                Chính sách bảo mật nông hộ
              </a>{' '}
              của AgriSage.
            </span>
          </label>
          {errors.terms && <p className="text-[11px] text-status-error mt-1">{errors.terms}</p>}
        </div>
        <div className="pt-2">
          <button
            className="w-full h-11 bg-primary hover:bg-primary-hover active:bg-primary-dark text-white font-semibold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-primary/40 focus:outline-none cursor-pointer"
            type="submit"
          >
            <span>Đăng ký tài khoản</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </form>
      <div className="relative my-5 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-subtle"></div>
        </div>
        <span className="relative bg-white px-3 text-[11px] text-text-muted uppercase tracking-wider">
          Hoặc tiếp tục với
        </span>
      </div>
      <GoogleAuthButton label="Đăng ký bằng Google" onClick={() => navigate('/')} />
      <div className="text-center pt-4 text-xs text-text-secondary">
        <span>Đã có tài khoản?</span>
        <Link
          className="font-semibold text-primary hover:text-primary-dark hover:underline ml-1 inline-flex items-center gap-0.5"
          to="/login"
        >
          <span>Đăng nhập ngay</span>
          <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
        </Link>
      </div>
    </AuthLayout>
  )
}
