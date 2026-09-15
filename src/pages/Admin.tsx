import { useState } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router"
import { useAuth } from "../context/AuthContext"
import AiQueueScreen from "./admin/AiQueueScreen"
import CustomersScreen from "./admin/CustomersScreen"
import DealerProfileScreen from "./admin/DealerProfileScreen"
import DebtScreen from "./admin/DebtScreen"
import OrdersScreen from "./admin/OrdersScreen"
import OverviewScreen from "./admin/OverviewScreen"
import StockScreen from "./admin/StockScreen"
import VietQrScreen from "./admin/VietQrScreen"

type AdminSection =
  | "overview"
  | "ai"
  | "stock"
  | "orders"
  | "customers"
  | "debt"
  | "vietqr"
  | "dealer"

const menu: {
  id: AdminSection
  slug: string
  label: string
  icon: string
  badge?: string
}[] = [
  { id: "overview", slug: "dashboard", label: "Tổng quan", icon: "dashboard" },
  { id: "ai", slug: "ai", label: "Hàng đợi AI", icon: "psychology", badge: "4" },
  { id: "stock", slug: "stock", label: "Quản lý kho", icon: "inventory_2" },
  { id: "orders", slug: "orders", label: "Đơn hàng", icon: "shopping_bag" },
  { id: "customers", slug: "customers", label: "Khách hàng", icon: "groups" },
  {
    id: "debt",
    slug: "debt",
    label: "Sổ nợ 2 chiều",
    icon: "account_balance_wallet",
    badge: "2",
  },
  { id: "vietqr", slug: "vietqr", label: "VietQR cửa hàng", icon: "qr_code_2" },
  { id: "dealer", slug: "profile", label: "Hồ sơ đại lý", icon: "storefront" },
]

const sectionBySlug = Object.fromEntries(
  menu.map((item) => [item.slug, item.id]),
) as Record<string, AdminSection>

export function SectionPanel({ section }: { section: AdminSection }) {
  switch (section) {
    case "ai":
      return <AiQueueScreen />
    case "stock":
      return <StockScreen />
    case "orders":
      return <OrdersScreen />
    case "customers":
      return <CustomersScreen />
    case "debt":
      return <DebtScreen />
    case "vietqr":
      return <VietQrScreen />
    case "dealer":
      return <DealerProfileScreen />
    case "overview":
    default:
      return <OverviewScreen />
  }
}

export default function Admin() {
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { adminPage } = useParams()
  const section = adminPage ? sectionBySlug[adminPage] : undefined
  const current = menu.find((item) => item.id === section)

  if (user?.role !== "admin") {
    return <Navigate to="/dang-nhap" replace />
  }

  if (!adminPage || !section || !current) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-surface-subtle text-text-primary">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border-subtle bg-white lg:block">
        <Link
          to="/"
          className="flex h-16 items-center gap-3 border-b border-border-subtle px-5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
            <span className="material-symbols-outlined">psychiatry</span>
          </div>
          <div>
            <div className="text-lg font-black text-primary-dark">AgriSage</div>
            <div className="text-[11px] font-black uppercase tracking-wide text-text-muted">
              Quản trị đại lý
            </div>
          </div>
        </Link>
        <nav className="px-3 py-6">
          <div className="mb-3 px-3 text-xs font-black uppercase tracking-wide text-text-muted">
            Hệ thống nghiệp vụ
          </div>
          <div className="space-y-2">
            {menu.map((item) => (
              <Link
                key={item.id}
                to={`/admin/${item.slug}`}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-black transition-colors ${
                  section === item.id
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:bg-primary-light hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      section === item.id ? "bg-white text-primary" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 border-b border-border-subtle bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <button className="inline-flex min-w-0 items-center gap-2 rounded-lg border border-border-subtle bg-surface-subtle px-4 py-2 text-sm font-bold text-text-secondary">
                <span className="material-symbols-outlined text-[18px]">store</span>
                <span className="truncate">Chi nhánh Lâm Đồng (Trung tâm)</span>
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>
              <label className="hidden flex-1 items-center gap-2 rounded-lg bg-surface-subtle px-3 py-2 md:flex">
                <span className="material-symbols-outlined text-[18px] text-text-muted">
                  search
                </span>
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted"
                  placeholder="Tìm thuốc BVTV, phân bón, nông dân, mã đơn..."
                />
              </label>
            </div>
            <button className="relative rounded-full p-2 text-text-secondary hover:bg-surface-subtle">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="relative border-l border-border-subtle pl-4">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-subtle"
                aria-expanded={profileOpen}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <div className="hidden text-left sm:block">
                  <div className="text-sm font-black">{user.name}</div>
                  <div className="text-xs text-text-muted">
                    Quản trị viên / Chủ đại lý
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-text-muted">
                  expand_more
                </span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-lg border border-border-subtle bg-white py-1 shadow-floating">
                  <Link
                    to="/admin/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-text-secondary hover:bg-primary-light hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-[17px]">
                      account_circle
                    </span>
                    Hồ sơ
                  </Link>
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
          </div>
        </header>

        <div className="border-b border-border-subtle bg-white px-4 py-3 lg:hidden">
          <div className="mb-3 text-xs font-black uppercase text-text-muted">
            Màn hình admin
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {menu.map((item) => (
              <Link
                key={item.id}
                to={`/admin/${item.slug}`}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold ${
                  section === item.id ? "bg-primary text-white" : "bg-surface-subtle text-text-secondary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <main className="px-4 py-7 sm:px-6 lg:px-8">
          <div className="mb-6 rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
            <div className="text-xs font-black uppercase tracking-wide text-primary">
              AgriSage Admin
            </div>
            <h1 className="mt-2 flex items-center gap-2 text-3xl font-black text-text-primary">
              <span className="material-symbols-outlined text-[30px] text-primary">
                {current.icon}
              </span>
              {current.label}
            </h1>
          </div>
          <SectionPanel section={section} />
        </main>
      </div>
    </div>
  )
}
