import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/san-pham?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Trang chủ", icon: "home", exact: true },
    { to: "/gioi-thieu", label: "Giới thiệu", icon: "info" },
    { to: "/san-pham", label: "Sản phẩm", icon: "inventory_2" },
    { to: "/bac-si-ai", label: "Bác sĩ AI", icon: "psychology" },
    { to: "/kien-thuc", label: "Kiến thức", icon: "menu_book" },
    { to: "/lien-he", label: "Liên hệ", icon: "mail" },
  ];

  return (
    <header className="w-full bg-[#155f22] border-b border-[#0f4d1a] sticky top-0 z-50 shadow-[0_2px_8px_rgba(0,0,0,0.16)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[66px] flex items-center justify-between gap-5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/25 bg-white p-1 flex items-center justify-center group-hover:border-white transition-colors shadow-sm">
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1UUh_rMaCKAuHaMgW-rlQEybLDC0yLaiBL84lCqf4i75nqLSFCcM7r6LQBPmwpexG33O1HAqBNtf-6Kuq4uo8JRLFBBc7rBCVHQjRNNXid88YHmMN-I_eRlwwwhg4IYza_9zPQQNoCKQFWmkF3lpMBE_qP3eRRDHs6SvsfTutDXagvCKzVz7ohcKlnYNWZUz9o4B9FxP1JGjBLadtPwoHB8oAVVKq2Ywe4vqvFummLb-xtOsuSmo4eTZR8"
              alt="AgriSage"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-lg tracking-tight leading-none group-hover:text-emerald-200 transition-colors">
              AgriSage
            </span>
            <span className="text-[11px] font-semibold text-emerald-100/70 mt-0.5 leading-none">
              Nông nghiệp số & Chẩn đoán AI
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden xl:flex items-center text-sm font-semibold text-emerald-100/80 justify-center flex-1 gap-1.5">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-1.5 whitespace-nowrap text-white px-3.5 py-2 rounded-full bg-white/16 border border-white/20 transition-colors shadow-sm"
                  : "flex items-center gap-1.5 whitespace-nowrap hover:text-white transition-colors px-2.5 py-2 rounded-full hover:bg-white/10"
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`material-symbols-outlined text-[18px] ${link.icon === "psychology" || isActive ? "text-emerald-300" : "text-emerald-100/75"}`}
                  >
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <Link
            to="/gio-hang"
            className="relative inline-flex h-8 items-center gap-2 whitespace-nowrap px-3.5 text-xs font-bold text-emerald-50 hover:text-white bg-white/12 hover:bg-white/20 border border-white/16 rounded-md transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
            <span className="hidden sm:inline">Giỏ hàng</span>
            {count > 0 && (
              <span className="inline-flex items-center justify-center rounded-full text-[10px] font-black bg-white text-primary-dark min-w-[18px] h-[18px]">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-lg border border-white/22 bg-white/16 px-3 pr-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-white/22"
                aria-expanded={profileOpen}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-6 w-6 rounded-full border border-white/40 object-cover"
                />
                <span>{user.name}</span>
                <span className="material-symbols-outlined text-[16px] text-emerald-100">expand_more</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-lg border border-border-subtle bg-white py-1 shadow-floating">
                  <Link
                    to="/ho-so"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-text-secondary hover:bg-primary-light hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-[17px]">account_circle</span>
                    Hồ sơ
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-text-secondary hover:bg-primary-light hover:text-primary"
                    >
                      <span className="material-symbols-outlined text-[17px]">admin_panel_settings</span>
                      Quản trị
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-text-secondary hover:bg-status-error-surface hover:text-status-error"
                  >
                    <span className="material-symbols-outlined text-[17px]">logout</span>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/dang-nhap"
              className="inline-flex h-8 items-center justify-center gap-1.5 whitespace-nowrap px-4 text-xs font-bold text-primary-dark bg-white hover:bg-emerald-50 rounded-md transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">login</span>
              <span>Đăng nhập</span>
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="xl:hidden p-1.5 text-white hover:bg-white/10 rounded-md transition-colors"
            aria-label="Mở menu"
          >
            <span className="material-symbols-outlined text-[22px]">{menuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="xl:hidden bg-primary-dark border-t border-white/10 px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-white/15 text-white" : "text-emerald-100/90 hover:bg-white/10 hover:text-white"}`
              }
            >
              <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
          <form onSubmit={handleSearch} className="flex items-center gap-2 mt-2 bg-white/10 rounded-lg px-3 py-2">
            <span className="material-symbols-outlined text-[16px] text-emerald-200">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-white placeholder:text-emerald-200/60 focus:outline-none flex-1"
              placeholder="Tìm sản phẩm..."
            />
          </form>
          {user && (
            <div className="pt-2 mt-2 border-t border-white/10 space-y-1">
              <NavLink
                to="/ho-so"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-100/90 hover:bg-white/10 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">account_circle</span>
                Hồ sơ
              </NavLink>
              {user.role === "admin" && (
                <NavLink
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-100/90 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                  Quản trị
                </NavLink>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-emerald-100/90 hover:bg-white/10 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-[#144d1a] border-t border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Col 1: Brand */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg border border-white/20 bg-white p-1 flex items-center justify-center shadow-sm">
                <img
                  src="https://lh3.googleusercontent.com/aida/AEtjO1UUh_rMaCKAuHaMgW-rlQEybLDC0yLaiBL84lCqf4i75nqLSFCcM7r6LQBPmwpexG33O1HAqBNtf-6Kuq4uo8JRLFBBc7rBCVHQjRNNXid88YHmMN-I_eRlwwwhg4IYza_9zPQQNoCKQFWmkF3lpMBE_qP3eRRDHs6SvsfTutDXagvCKzVz7ohcKlnYNWZUz9o4B9FxP1JGjBLadtPwoHB8oAVVKq2Ywe4vqvFummLb-xtOsuSmo4eTZR8"
                  alt="AgriSage"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-bold text-white text-base tracking-tight leading-none block">AgriSage</span>
                <span className="text-xs text-emerald-200/80">Hệ sinh thái Nông nghiệp Thông minh</span>
              </div>
            </div>
            <p className="text-sm text-emerald-100/80 leading-relaxed">
              Nền tảng quản trị vật tư nông nghiệp toàn diện và trợ lý AI nhận diện bệnh hại cây trồng qua ảnh chụp. Giúp đại lý quản lý tồn kho, sổ nợ mùa vụ minh bạch và hỗ trợ nông dân canh tác hiệu quả.
            </p>
            <div className="space-y-2 text-xs text-emerald-100/90 pt-1">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-emerald-300 mt-0.5 flex-shrink-0">location_on</span>
                <span><strong className="text-white">Trung tâm điều hành:</strong> Tòa nhà AgriTech, Khu Công nghệ cao, TP. Hồ Chí Minh.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-emerald-300 mt-0.5 flex-shrink-0">store</span>
                <span><strong className="text-white">Chi nhánh Lâm Đồng:</strong> 142 Hùng Vương, TT. Di Linh, Tỉnh Lâm Đồng.</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">Danh mục & Giải pháp</h3>
            <ul className="space-y-2.5 text-xs text-emerald-100/80">
              {[
                "Vật tư phân bón NPK & Hữu cơ",
                "Thuốc bảo vệ thực vật sinh học",
                "Chẩn đoán AI bệnh lá cây",
                "Quản lý hạn mức công nợ mùa vụ",
                "Lô hàng & cảnh báo hạn dùng tự động",
              ].map((item, i) => (
                <li key={i}>
                  <Link to="/san-pham" className="hover:text-white transition-colors flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-emerald-300/60">chevron_right</span>
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Support */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">Hỗ trợ khách hàng & Nông dân</h3>
            <ul className="space-y-2.5 text-xs text-emerald-100/80">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-emerald-300">support_agent</span>
                <span>Tổng đài kỹ sư: <strong className="text-white">1900 6828</strong> (7:00-20:00)</span>
              </li>
              {["Quy trình giao nhận vật tư tận vườn", "Chính sách bảo mật dữ liệu nông hộ", "Điều khoản sử dụng nền tảng AgriSage", "Tài liệu hướng dẫn đại lý tích hợp POS"].map((item, i) => (
                <li key={i}>
                  <Link to="/lien-he" className="hover:text-white transition-colors flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-emerald-300/60">chevron_right</span>
                    <span>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-xs text-emerald-100">
                <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
                <span>Hệ thống chi nhánh đang trực tuyến</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-100/70 gap-2">
          <p>© 2024 AgriSage. Bản quyền kỹ thuật.</p>
          <p className="text-emerald-200/60">Phát triển vì nền nông nghiệp số Việt Nam</p>
        </div>
      </div>
    </footer>
  );
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-subtle">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
