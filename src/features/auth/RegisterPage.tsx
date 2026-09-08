import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-100 text-xs font-medium border border-white/15">
                <span className="material-symbols-outlined text-[14px] text-emerald-300">inventory</span>{' '}
                Quản lý kho số
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-100 text-xs font-medium border border-white/15">
                <span className="material-symbols-outlined text-[14px] text-emerald-300">psychology</span>{' '}
                Trợ lý AI nông nghiệp
              </span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white">
          <div className="max-w-md w-full mx-auto my-auto py-2">
            <div className="mb-5 text-left">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                Đăng ký tài khoản
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                Gia nhập hệ sinh thái nông nghiệp thông minh AgriSage
              </p>
            </div>
            <form
              className="space-y-3.5"
              onSubmit={(e) => {
                e.preventDefault()
                navigate('/')
              }}
            >
              <div className="text-left">
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1" htmlFor="fullName">
                  Họ và tên
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                  </div>
                  <input
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-border-subtle rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                    id="fullName"
                    name="fullName"
                    placeholder="Nguyễn Văn Nông"
                    required
                    type="text"
                    defaultValue="Nguyễn Văn Nông"
                  />
                </div>
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
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-border-subtle rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                      id="regContact"
                      name="contact"
                      placeholder="0912 345 678"
                      required
                      type="text"
                      defaultValue="0912 345 678"
                    />
                  </div>
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
                      className="w-full pl-9 pr-8 py-2.5 bg-white border border-border-subtle rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                      id="regPassword"
                      name="password"
                      placeholder="Tối thiểu 8 ký tự"
                      required
                      type={showPassword ? 'text' : 'password'}
                      defaultValue="NongDan@2024"
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
                      className="w-full pl-9 pr-8 py-2.5 bg-white border border-border-subtle rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                      id="regConfirmPassword"
                      name="confirmPassword"
                      placeholder="Nhập lại mật khẩu"
                      required
                      type={showConfirmPassword ? 'text' : 'password'}
                      defaultValue="NongDan@2024"
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
                </div>
              </div>
              <div className="pt-1">
                <label className="group flex items-start gap-2 cursor-pointer select-none text-left">
                  <input defaultChecked id="termsCheck" name="terms" type="checkbox" className="mt-1" />
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
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full h-11 bg-white hover:bg-surface-secondary border border-border-subtle rounded-md text-text-primary text-sm font-medium shadow-sm transition-all flex items-center justify-center gap-3 focus:ring-2 focus:ring-primary/20 focus:outline-none cursor-pointer"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
              <span className="font-medium">Đăng ký bằng Google</span>
            </button>
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
          </div>
        </div>
      </div>
    </div>
  )
}
