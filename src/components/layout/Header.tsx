import { Link, NavLink } from 'react-router-dom'

interface HeaderProps {
  cartCount: number
}

const navLinks = [
  { to: '/', label: 'Trang chủ', icon: 'home', routed: true },
  { to: '#', label: 'Giới thiệu', icon: 'info', routed: false },
  { to: '/products', label: 'Sản phẩm', icon: 'inventory_2', routed: true },
  { to: '#ai-diagnosis', label: 'Bác sĩ AI', icon: 'psychology', routed: false },
  { to: '#', label: 'Kiến thức', icon: 'menu_book', routed: false },
  { to: '#', label: 'Liên hệ', icon: 'mail', routed: false },
]

export default function Header({ cartCount }: HeaderProps) {
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
        <nav className="hidden lg:flex items-center text-sm font-medium text-emerald-100/90 justify-center flex-1 gap-6">
          {navLinks.map((link) =>
            link.routed ? (
              <NavLink
                key={link.label}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 transition-colors ${
                    isActive
                      ? 'text-white font-semibold px-3 py-1.5 rounded-full bg-white/15 border border-white/20 shadow-sm'
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
                className="flex items-center gap-1.5 hover:text-white transition-colors"
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
            to="/cart"
            title="Giỏ hàng nông nghiệp"
            className="relative inline-flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-md transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
            <span className="hidden sm:inline">Giỏ hàng</span>
            <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-white text-primary-dark ml-0.5">
              {cartCount}
            </span>
          </Link>
          <Link
            to="/login"
            title="Đăng nhập"
            className="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-primary-dark bg-white hover:bg-emerald-50 rounded-md transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">login</span>
            <span className="hidden sm:inline">Đăng nhập</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
