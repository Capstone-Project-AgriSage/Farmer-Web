import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

interface HeaderProps {
  cartCount: number
}

const navLinks = [
  { to: '/', label: 'Trang chủ' },
  { to: '/products', label: 'Vật tư lúa' },
  { to: '/ai-doctor', label: 'Chẩn đoán AI' },
  { to: '/account?tab=credit', label: 'Sổ nợ mùa vụ' },
  { to: '/about', label: 'Giới thiệu' },
]

export default function Header({ cartCount }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()
  const [lastPathname, setLastPathname] = useState(location.pathname)
  const isHome = location.pathname === '/'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (location.pathname !== lastPathname) {
    setLastPathname(location.pathname)
    setIsMenuOpen(false)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const solidBar = !isHome || scrolled || isMenuOpen

  return (
    <header
      className={`${isHome ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-50 transition duration-300 ${
        solidBar ? 'bg-brand-cream/95 backdrop-blur-md shadow-sm border-b border-brand-dark/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative flex items-center h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 lg:mr-10">
            <span className="text-xl text-brand-dark tracking-tight font-helvetica-neue">AgriSage</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.slice(1).map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `relative text-sm tracking-wide uppercase transition-colors py-1 ${
                    isActive
                      ? 'text-brand-dark font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-brand-green after:rounded-full'
                      : 'text-brand-dark/70 hover:text-brand-dark after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-brand-green after:rounded-full after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3 ml-auto">
            <Link
              to="/cart"
              className="text-sm text-brand-dark/80 tracking-wide uppercase hover:text-brand-dark transition-colors"
            >
              Giỏ ({cartCount})
            </Link>
            {isAuthenticated && (
              <Link
                to="/account"
                className="text-sm text-brand-dark/80 tracking-wide uppercase hover:text-brand-dark transition-colors"
              >
                Tài khoản
              </Link>
            )}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center px-5 py-2.5 bg-brand-dark text-white text-sm tracking-wide uppercase rounded-full hover:bg-brand-green transition-colors"
              >
                Đăng xuất
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-5 py-2.5 bg-brand-dark text-white text-sm tracking-wide uppercase rounded-full hover:bg-brand-green transition-colors"
              >
                Đăng nhập
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="md:hidden ml-auto z-50 relative w-10 h-10"
          >
            <span
              className={`absolute left-2 w-6 h-[2px] bg-brand-dark rounded transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] top-[14px] ${
                isMenuOpen ? 'rotate-45 translate-y-[5px]' : ''
              }`}
            />
            <span
              className={`absolute left-2 w-6 h-[2px] bg-brand-dark rounded transition-all duration-300 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] top-[21px] ${
                isMenuOpen ? '-rotate-45 -translate-y-[2px]' : ''
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`md:hidden fixed inset-0 bg-brand-cream z-40 transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`flex flex-col items-center justify-center h-full gap-8 transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] delay-100 ${
            isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
          }`}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `text-3xl tracking-tight transition-colors ${
                  isActive ? 'text-brand-green font-bold' : 'text-brand-dark'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/cart"
            onClick={() => setIsMenuOpen(false)}
            className="text-3xl text-brand-dark tracking-tight"
          >
            Giỏ hàng ({cartCount})
          </Link>
          {isAuthenticated && (
            <Link
              to="/account"
              onClick={() => setIsMenuOpen(false)}
              className="text-3xl text-brand-dark tracking-tight"
            >
              Tài khoản
            </Link>
          )}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false)
                handleLogout()
              }}
              className="mt-4 inline-flex items-center px-8 py-3.5 bg-brand-dark text-white text-lg tracking-wide rounded-full"
            >
              Đăng xuất
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="mt-4 inline-flex items-center px-8 py-3.5 bg-brand-dark text-white text-lg tracking-wide rounded-full"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
