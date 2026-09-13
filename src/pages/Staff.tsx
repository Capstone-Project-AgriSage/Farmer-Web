import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { SectionPanel } from "./Admin";

type StaffSection = "pos" | "ai" | "stock" | "orders" | "debt" | "vietqr" | "dealer";

const staffMenu: { id: StaffSection; slug: string; label: string; icon: string; badge?: string; badgeTone?: "orange" | "blue" | "green" }[] = [
  { id: "pos", slug: "pos", label: "Bàn làm việc POS", icon: "grid_view" },
  { id: "ai", slug: "ai", label: "Hàng đợi AI", icon: "psychology", badge: "4 ca", badgeTone: "orange" },
  { id: "stock", slug: "stock", label: "Quản lý kho", icon: "warehouse" },
  { id: "orders", slug: "orders", label: "Đơn hàng", icon: "receipt_long" },
  { id: "debt", slug: "debt", label: "Sổ nợ 2 chiều", icon: "account_balance_wallet", badge: "2 chiều", badgeTone: "blue" },
  { id: "vietqr", slug: "vietqr", label: "VietQR cửa hàng", icon: "qr_code_2", badge: "PRO", badgeTone: "green" },
  { id: "dealer", slug: "profile", label: "Hồ sơ đại lý", icon: "storefront" },
];

const staffBySlug = Object.fromEntries(staffMenu.map((item) => [item.slug, item.id])) as Record<string, StaffSection>;

function Badge({ label, tone = "orange" }: { label: string; tone?: "orange" | "blue" | "green" }) {
  const toneClass = {
    orange: "bg-orange-100 text-orange-600",
    blue: "bg-sky-100 text-sky-700",
    green: "bg-primary text-white",
  }[tone];
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${toneClass}`}>{label}</span>;
}

function StaffCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-black uppercase tracking-wide text-text-muted">{title}</div>
          <div className="mt-3 text-2xl font-black text-text-primary">{value}</div>
        </div>
        <span className="material-symbols-outlined rounded-lg bg-primary-light p-2 text-[20px] text-primary">{icon}</span>
      </div>
    </div>
  );
}

function StaffPanel({ section }: { section: StaffSection }) {
  if (section === "pos") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          <StaffCard title="Đơn đang mở" value="12" icon="point_of_sale" />
          <StaffCard title="Doanh thu ca" value="18.2tr" icon="payments" />
          <StaffCard title="Khách chờ tư vấn" value="6" icon="support_agent" />
          <StaffCard title="VietQR chờ khớp" value="3" icon="qr_code_2" />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm xl:col-span-2">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-black text-text-primary">Bàn làm việc POS</h1>
                <p className="mt-1 text-sm text-text-muted">Tạo đơn nhanh, quét sản phẩm, kiểm tồn kho và thu tiền tại quầy.</p>
              </div>
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-black text-white">Tạo đơn mới</button>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
              <label className="flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-subtle px-3 py-3">
                <span className="material-symbols-outlined text-[20px] text-primary">barcode_scanner</span>
                <input className="w-full bg-transparent text-sm outline-none" placeholder="Quét mã vạch hoặc tìm sản phẩm..." />
              </label>
              <button className="rounded-lg border border-border-subtle px-4 py-3 text-sm font-black text-primary">Thêm khách hàng</button>
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="border-y border-border-subtle bg-surface-subtle text-xs uppercase text-text-muted">
                  <tr>{["Sản phẩm", "Tồn", "Đơn giá", "SL", "Thành tiền"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {[
                    ["Ridomil Gold 68WG", "860 gói", "48.000 đ", "5", "240.000 đ"],
                    ["Đầu Trâu NPK 20-20-15", "142 bao", "920.000 đ", "2", "1.840.000 đ"],
                    ["King Root Humic 1L", "74 chai", "125.000 đ", "3", "375.000 đ"],
                  ].map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell, index) => <td key={cell} className={`px-4 py-4 ${index === 0 ? "font-black text-primary" : "font-bold text-text-secondary"}`}>{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-text-primary">Thanh toán nhanh</h2>
            <div className="mt-5 rounded-xl bg-primary-light p-4 text-center">
              <div className="text-xs font-black uppercase text-text-muted">Tổng tạm tính</div>
              <div className="mt-2 text-3xl font-black text-primary">2.455.000 đ</div>
              <div className="mt-1 text-xs text-primary">Đã áp dụng voucher mùa vụ</div>
            </div>
            <div className="mt-4 grid gap-2">
              <button className="rounded-lg bg-primary px-4 py-3 text-sm font-black text-white">Thu VietQR</button>
              <button className="rounded-lg border border-border-subtle px-4 py-3 text-sm font-black text-primary">Ghi sổ AgriCredit</button>
              <button className="rounded-lg border border-border-subtle px-4 py-3 text-sm font-black text-text-secondary">In phiếu bán hàng</button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return <SectionPanel section={section === "dealer" ? "dealer" : section} />;
}

export default function Staff() {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { staffPage } = useParams();
  const section = staffPage ? staffBySlug[staffPage] : undefined;
  const current = staffMenu.find((item) => item.id === section);

  if (user?.role !== "staff") {
    return <Navigate to="/dang-nhap" replace />;
  }

  if (!staffPage || !section || !current) {
    return <Navigate to="/staff/pos" replace />;
  }

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-surface-subtle text-text-primary">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border-subtle bg-white lg:block">
        <Link to="/" className="flex h-20 items-center gap-3 border-b border-border-subtle px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
            <span className="material-symbols-outlined">psychiatry</span>
          </div>
          <div>
            <div className="text-lg font-black text-primary-dark">AgriSage</div>
            <div className="text-[11px] font-black uppercase leading-tight tracking-wide text-text-muted">Nhân viên quầy (POS) & bán hàng</div>
          </div>
        </Link>
        <nav className="px-3 py-6">
          <div className="mb-3 px-3 text-xs font-black uppercase tracking-wide text-text-muted">Hệ thống nghiệp vụ</div>
          <div className="space-y-2">
            {staffMenu.map((item) => (
              <Link
                key={item.id}
                to={`/staff/${item.slug}`}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-black transition-colors ${
                  section === item.id ? "bg-primary text-white" : "text-text-secondary hover:bg-primary-light hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge && <Badge label={item.badge} tone={item.badgeTone} />}
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 border-b border-border-subtle bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-subtle px-4 py-2 text-sm font-bold text-text-secondary">
                <span className="material-symbols-outlined text-[18px]">store</span>
                Chi nhánh Lâm Đồng (Trung tâm)
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>
              <label className="hidden flex-1 items-center gap-2 rounded-lg bg-surface-subtle px-3 py-2 md:flex">
                <span className="material-symbols-outlined text-[18px] text-text-muted">search</span>
                <input className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted" placeholder="Tìm thuốc BVTV, phân bón, nông dân, mã đơn..." />
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
                <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
                <div className="hidden text-left sm:block">
                  <div className="text-sm font-black">{user.name}</div>
                  <div className="text-xs text-text-muted">Nhân viên quầy POS</div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-text-muted">expand_more</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-lg border border-border-subtle bg-white py-1 shadow-floating">
                  <Link
                    to="/staff/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-text-secondary hover:bg-primary-light hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-[17px]">account_circle</span>
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
          <div className="flex gap-2 overflow-x-auto pb-1">
            {staffMenu.map((item) => (
              <Link key={item.id} to={`/staff/${item.slug}`} className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold ${section === item.id ? "bg-primary text-white" : "bg-surface-subtle text-text-secondary"}`}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <main className="px-4 py-7 sm:px-6 lg:px-8">
          <StaffPanel section={section} />
        </main>
      </div>
    </div>
  );
}
