import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useAuth } from '../../context/AuthContext'
import { isValidPhoneOrEmail } from '../../utils/validation'
import AuthLayout from './components/AuthLayout'
import GoogleAuthButton from './components/GoogleAuthButton'
import Spinner from '../../components/ui/Spinner'

export default function LoginPage() {
  useDocumentTitle('Đăng nhập')
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Vui lòng nhập đầy đủ email/số điện thoại và mật khẩu.')
      return
    }
    if (!isValidPhoneOrEmail(email)) {
      setError('Email hoặc số điện thoại không hợp lệ.')
      return
    }
    setError('')
    setIsSubmitting(true)
    try {
      await login(email, password)
      navigate('/')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout showTags>
      <div className="mb-6 text-left">
        <p className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-2">AgriSage</p>
        <h1 className="text-2xl sm:text-3xl font-helvetica-neue tracking-tight text-brand-dark">Đăng nhập</h1>
        <p className="text-sm text-brand-dark/60 mt-1">
          Chào mừng trở lại với hệ sinh thái AgriSage
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            className="block text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-1.5"
            htmlFor="emailInput"
          >
            Email hoặc Số điện thoại
          </label>
          <input
            className="w-full px-4 py-3 border border-brand-dark/15 text-brand-dark text-sm focus:outline-none focus:border-brand-green bg-brand-cream placeholder:text-brand-dark/40"
            id="emailInput"
            name="email"
            placeholder="Nhập email hoặc số điện thoại"
            required
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs tracking-[0.25em] uppercase text-brand-dark/50" htmlFor="passwordInput">
              Mật khẩu
            </label>
            <Link
              className="text-xs text-brand-green hover:text-brand-dark hover:underline transition-colors"
              to="/forgot-password"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brand-dark/40">
              <span className="material-symbols-outlined text-[20px]">lock</span>
            </div>
            <input
              className="w-full pl-10 pr-10 py-2.5 bg-brand-cream border border-brand-dark/15 text-brand-dark text-sm placeholder:text-brand-dark/40 focus:border-brand-green focus:outline-none transition-colors"
              id="passwordInput"
              name="password"
              placeholder="Nhập mật khẩu của bạn"
              required
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              aria-label="Hiện hoặc ẩn mật khẩu"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-dark/40 hover:text-brand-dark transition-colors focus:outline-none"
              onClick={() => setShowPassword((v) => !v)}
              title="Hiện/Ẩn mật khẩu"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>
        {error ? (
          <div className="flex items-center gap-1.5 px-3 py-2 bg-status-error-surface text-status-error text-xs">
            <span className="material-symbols-outlined text-[16px]">error</span>
            {error}
          </div>
        ) : null}
        <div className="flex items-center justify-between pt-1">
          <label className="group flex items-center gap-2 cursor-pointer select-none">
            <input
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              id="rememberMe"
              name="remember"
              type="checkbox"
              className="peer sr-only"
            />
            <span
              className={`w-4 h-4 border flex items-center justify-center transition-all ${
                rememberMe ? 'bg-brand-dark border-brand-dark' : 'bg-brand-cream border-brand-dark/15 group-hover:border-brand-green'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[14px] text-white transition-opacity select-none ${
                  rememberMe ? '' : 'opacity-0'
                }`}
              >
                check
              </span>
            </span>
            <span className="text-xs text-brand-dark/60 group-hover:text-brand-dark transition-colors">
              Ghi nhớ đăng nhập
            </span>
          </label>
        </div>
        <div className="pt-2">
          <button
            className="w-full h-11 rounded-full bg-brand-dark text-white hover:bg-brand-green tracking-wide uppercase text-sm transition-colors flex items-center justify-center gap-2 focus:outline-none disabled:opacity-70"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner className="-ml-1 mr-2 h-4 w-4 text-white" />
                <span>Đang xác thực...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>Đăng nhập hệ thống</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </span>
            )}
          </button>
        </div>
      </form>
      <div className="relative my-5 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-brand-dark/10"></div>
        </div>
        <span className="relative bg-white px-3 text-[11px] text-brand-dark/50 uppercase tracking-[0.25em]">
          Hoặc tiếp tục với
        </span>
      </div>
      <GoogleAuthButton
        label="Đăng nhập bằng Google"
        onClick={() => login('google-oauth', 'google-oauth').then(() => navigate('/'))}
        className="mb-6"
      />
      <div className="text-center pt-1 text-sm text-brand-dark/60">
        <span>Bà con hoặc đại lý mới chưa có tài khoản?</span>
        <Link
          className="text-brand-green hover:text-brand-dark hover:underline ml-1 inline-flex items-center gap-0.5 transition-colors"
          to="/register"
        >
          <span>Đăng ký tài khoản ngay</span>
          <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
        </Link>
      </div>
    </AuthLayout>
  )
}
