import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import AuthLayout from './components/AuthLayout'
import GoogleAuthButton from './components/GoogleAuthButton'
import Spinner from '../../components/ui/Spinner'

export default function LoginPage() {
  useDocumentTitle('Đăng nhập')
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('manager.lamdong@agrisage.vn')
  const [password, setPassword] = useState('AgriCare2024@')
  const [rememberMe, setRememberMe] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      navigate('/')
    }, 1200)
  }

  return (
    <AuthLayout showTags>
      <div className="mb-6 text-left">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">Đăng nhập</h1>
        <p className="text-sm text-text-secondary mt-1">
          Chào mừng trở lại với hệ sinh thái AgriSage
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5"
            htmlFor="emailInput"
          >
            Email hoặc Số điện thoại
          </label>
          <input
            className="w-full px-4 py-3 rounded-lg border border-border-subtle text-text-primary text-sm focus:outline-none focus:border-primary font-sans bg-white"
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
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider" htmlFor="passwordInput">
              Mật khẩu
            </label>
            <Link
              className="text-xs font-medium text-primary hover:text-primary-dark hover:underline transition-colors"
              to="/forgot-password"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
              <span className="material-symbols-outlined text-[20px]">lock</span>
            </div>
            <input
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-border-subtle rounded-md text-text-primary text-sm placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
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
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-primary transition-colors focus:outline-none"
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
              className={`w-4 h-4 rounded border flex items-center justify-center transition-all group-hover:border-primary-hover shadow-sm ${
                rememberMe ? 'bg-primary border-primary' : 'bg-white border-border-subtle'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[14px] text-white font-bold transition-opacity select-none ${
                  rememberMe ? '' : 'opacity-0'
                }`}
              >
                check
              </span>
            </span>
            <span className="text-xs text-text-secondary font-medium group-hover:text-text-primary transition-colors">
              Ghi nhớ đăng nhập
            </span>
          </label>
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
                <span>Đang xác thực...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2 font-semibold">
                <span>Đăng nhập hệ thống</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </span>
            )}
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
      <GoogleAuthButton label="Đăng nhập bằng Google" onClick={() => navigate('/')} className="mb-6" />
      <div className="text-center pt-1 text-sm text-text-secondary">
        <span>Bà con hoặc đại lý mới chưa có tài khoản?</span>
        <Link
          className="font-semibold text-primary hover:text-primary-dark hover:underline ml-1 inline-flex items-center gap-0.5"
          to="/register"
        >
          <span>Đăng ký tài khoản ngay</span>
          <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
        </Link>
      </div>
    </AuthLayout>
  )
}
