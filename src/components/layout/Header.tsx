import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

interface HeaderProps {
  cartCount: number
}

const navLinks = [
  { to: '/', label: 'Trang chủ', icon: 'home', routed: true },
  { to: '/about', label: 'Giới thiệu', icon: 'info', routed: true },
  { to: '/products', label: 'Sản phẩm', icon: 'inventory_2', routed: true },
  { to: '/ai-doctor', label: 'Bác sĩ AI', icon: 'psychology', routed: true },
  { to: '/knowledge', label: 'Kiến thức', icon: 'menu_book', routed: true },
  { to: '/contact', label: 'Liên hệ', icon: 'mail', routed: true },
]

export default function Header({ cartCount }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  return (
    <header className="w-full bg-primary-dark border-b border-white/10 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden border border-white/20 bg-white p-1 flex items-center justify-center group-hover:border-white transition-colors shadow-sm flex-shrink-0">
            <img
              alt="AgriSage Logo"
              className="w-full h-full object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1UUh_rMaCKAuHaMgW-rlQEybLDC0yLaiBL84lCqf4i75nqLSFCcM7r6LQBPmwpexG33O1HAqBNtf-6Kuq4uo8JRLFBBc7rBCVHQjRNNXid88YHmMN-I_eRlwwwhg4IYza_9zPQQNoCKQFWmkF3lpMBE_qP3eRRDHs6SvsfTutDXagvCKzVz7ohcKlnYNWZUz9o4B9FxP1JGjBLadtPwoHB8oAVVKq2Ywe4vqvFummLb-xtOsuSmo4eTZR8"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-base sm:text-lg tracking-tight leading-none group-hover:text-emerald-200 transition-colors truncate">
                AgriSage
              </span>
            </div>
            <span className="hidden sm:block text-[11px] text-emerald-100/80 mt-0.5 leading-none truncate">
              Nông nghiệp số &amp; Chẩn đoán AI
            </span>
          </div>
        </Link>
        <nav className="hidden xl:flex items-center text-sm font-medium text-emerald-100/90 justify-center flex-1 gap-3 xl:gap-4">
          {navLinks.map((link) =>
            link.routed ? (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-white font-semibold px-2.5 py-1.5 rounded-full bg-white/15 border border-white/20 shadow-sm'
                      : 'hover:text-white'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-300">
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </NavLink>
            ) : (
              <a
                key={link.label}
                href={link.to}
                className="flex items-center gap-1 whitespace-nowrap hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-emerald-300">
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </a>
            ),
          )}
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-4 flex-shrink-0">
          <Link
            to="/account"
            title="Tài khoản của tôi"
            className="inline-flex items-center justify-center p-1.5 sm:px-3 sm:py-1.5 text-xs font-semibold text-emerald-100 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-md transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">account_circle</span>
            <span className="hidden sm:inline xl:hidden ml-1.5">Tài khoản</span>
          </Link>
          <Link
            to="/cart"
            title="Giỏ hàng nông nghiệp"
            className="relative inline-flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-md transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
            <span className="hidden sm:inline xl:hidden">Giỏ hàng</span>
            <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-white text-primary-dark ml-0.5">
              {cartCount}
            </span>
          </Link>
          <Link
            to="/login"
            title="Đăng nhập"
            className="hidden sm:inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-primary-dark bg-white hover:bg-emerald-50 rounded-md transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">login</span>
            <span className="hidden sm:inline">Đăng nhập</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={isMenuOpen}
            className="xl:hidden inline-flex items-center justify-center p-1.5 text-emerald-100 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-md transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="xl:hidden border-t border-white/10 bg-primary-dark px-3 sm:px-6 py-3 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-emerald-100/90 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px] text-emerald-300">
                {link.icon}
              </span>
              <span>{link.label}</span>
            </NavLink>
          ))}
          <Link
            to="/login"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-primary-dark bg-white hover:bg-emerald-50 transition-colors mt-2"
          >
            <span className="material-symbols-outlined text-[20px] text-primary">login</span>
            <span>Đăng nhập</span>
          </Link>
        </nav>
      )}
    </header>
  )
}
