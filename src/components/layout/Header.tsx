import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../hooks/useNotifications'
import { useHeroVisible } from './heroSignal'

interface HeaderProps {
  cartCount: number
}

const navLinks = [
  { to: '/', label: 'Trang chủ' },
  { to: '/products', label: 'Vật tư lúa' },
  { to: '/ai-doctor', label: 'Chẩn đoán AI' },
  { to: '/orders', label: 'Đơn hàng' },
  { to: '/debt', label: 'Sổ nợ' },
  { to: '/about', label: 'Giới thiệu' },
]

const MENU_ID = 'site-menu'

export default function Header({ cartCount }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()
  const heroVisible = useHeroVisible()
  const { unreadCount } = useNotifications()
  const [lastPathname, setLastPathname] = useState(location.pathname)
  const headerRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const isHome = location.pathname === '/'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (location.pathname !== lastPathname) {
    setLastPathname(location.pathname)
    setIsMenuOpen(false)
  }

  // The desktop navigation takes over at 1024px, so a menu left open must not trap the page.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    const close = () => desktop.matches && setIsMenuOpen(false)
    desktop.addEventListener('change', close)
    return () => desktop.removeEventListener('change', close)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return
    document.body.style.overflow = 'hidden'
    // Wait a tick: the panel is still visibility:hidden on the first frame of its fade-in and cannot take focus yet.
    const focusTimer = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus(), 60)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        toggleRef.current?.focus()
        return
      }
      if (event.key !== 'Tab' || !headerRef.current) return
      // Keep Tab inside the header bar and the open menu.
      const items = Array.from(headerRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')).filter(
        (el) => el.offsetParent !== null,
      )
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isMenuOpen])

  // Transparent only while the homepage hero is on screen; solid everywhere else. It never hides or shrinks.
  const transparent = isHome && heroVisible && !isMenuOpen

  const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
    `focus-ring relative text-sm tracking-wide py-1 transition-colors after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-brand-green after:rounded-full ${
      isActive
        ? 'text-brand-dark font-medium'
        : 'text-brand-dark/75 hover:text-brand-dark after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left'
    }`

  const utilityLinkClass = 'focus-ring text-sm text-brand-dark/80 tracking-wide hover:text-brand-dark transition-colors'
  const authButtonClass =
    'focus-ring inline-flex items-center justify-center min-h-[44px] px-5 bg-brand-dark text-white text-sm tracking-wide rounded-full hover:bg-brand-green transition-colors'

  return (
    <header
      ref={headerRef}
      className={`${isHome ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-50 border-b transition-colors duration-200 ${
        transparent ? 'bg-transparent border-transparent' : 'bg-brand-cream border-brand-dark/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative z-50 flex items-center h-16 md:h-20">
          <Link to="/" className="focus-ring flex items-center gap-2 lg:mr-10 min-h-[44px]">
            <span className="text-xl text-brand-dark tracking-tight font-helvetica-neue">AgriSage</span>
          </Link>

          <nav aria-label="Điều hướng chính" className="hidden lg:flex items-center gap-7">
            {navLinks.slice(1).map((link) => (
              <NavLink key={link.label} to={link.to} className={desktopLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4 ml-auto">
            <Link to="/cart" className={utilityLinkClass}>
              Giỏ ({cartCount})
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/notifications"
                  aria-label={unreadCount > 0 ? `Thông báo, ${unreadCount} chưa đọc` : 'Thông báo'}
                  className="focus-ring relative inline-flex items-center justify-center w-11 h-11 text-brand-dark/80 hover:text-brand-dark transition-colors"
                >
                  <span className="material-symbols-outlined text-[24px]" aria-hidden="true">
                    notifications
                  </span>
                  {unreadCount > 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute top-1 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-xs leading-[18px] text-center"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link to="/account" className={utilityLinkClass}>
                  Tài khoản
                </Link>
              </>
            )}
            {isAuthenticated ? (
              <button type="button" onClick={handleLogout} className={authButtonClass}>
                Đăng xuất
              </button>
            ) : (
              <Link to="/login" className={authButtonClass}>
                Đăng nhập
              </Link>
            )}
          </div>

          <div className="lg:hidden ml-auto flex items-center gap-1">
            <Link
              to="/cart"
              aria-label={`Giỏ hàng, ${cartCount} sản phẩm`}
              className="focus-ring relative inline-flex items-center justify-center w-11 h-11 text-brand-dark"
            >
              <span className="material-symbols-outlined text-[24px]" aria-hidden="true">
                shopping_cart
              </span>
              {cartCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-1 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-dark text-white text-xs leading-[18px] text-center"
                >
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls={MENU_ID}
              aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
              className="focus-ring relative w-11 h-11"
            >
              <span
                className={`absolute left-2.5 w-6 h-[2px] bg-brand-dark rounded transition-transform duration-300 ease-[var(--motion-ease-out)] top-[16px] ${
                  isMenuOpen ? 'rotate-45 translate-y-[6px]' : ''
                }`}
              />
              <span
                className={`absolute left-2.5 w-6 h-[2px] bg-brand-dark rounded transition-transform duration-300 ease-[var(--motion-ease-out)] top-[28px] ${
                  isMenuOpen ? '-rotate-45 -translate-y-[6px]' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div
        id={MENU_ID}
        ref={panelRef}
        data-lenis-prevent
        inert={!isMenuOpen}
        className={`lg:hidden fixed inset-0 z-40 bg-brand-cream overflow-y-auto overscroll-contain pt-20 pb-10 px-6 transition-[opacity,visibility] duration-300 ease-[var(--motion-ease-out)] ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div
          className="max-w-xl mx-auto"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest('a, button')) setIsMenuOpen(false)
          }}
        >
          <nav aria-label="Điều hướng chính (di động)">
            <ul>
              {navLinks.map((link) => (
                <li key={link.label} className="border-b border-brand-dark/10">
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `focus-ring flex items-center min-h-[56px] text-2xl tracking-tight transition-colors ${
                        isActive ? 'text-brand-green font-medium' : 'text-brand-dark'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="mt-6">
            <li>
              <Link to="/cart" className="focus-ring flex items-center min-h-[48px] text-lg text-brand-dark">
                Giỏ hàng ({cartCount})
              </Link>
            </li>
            {isAuthenticated && (
              <>
                <li>
                  <Link to="/notifications" className="focus-ring flex items-center min-h-[48px] text-lg text-brand-dark">
                    Thông báo{unreadCount > 0 ? ` (${unreadCount > 99 ? '99+' : unreadCount})` : ''}
                  </Link>
                </li>
                <li>
                  <Link to="/account" className="focus-ring flex items-center min-h-[48px] text-lg text-brand-dark">
                    Tài khoản
                  </Link>
                </li>
              </>
            )}
          </ul>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false)
                handleLogout()
              }}
              className="focus-ring mt-6 w-full inline-flex items-center justify-center min-h-[52px] bg-brand-dark text-white text-base tracking-wide rounded-full"
            >
              Đăng xuất
            </button>
          ) : (
            <Link
              to="/login"
              className="focus-ring mt-6 w-full inline-flex items-center justify-center min-h-[52px] bg-brand-dark text-white text-base tracking-wide rounded-full"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
