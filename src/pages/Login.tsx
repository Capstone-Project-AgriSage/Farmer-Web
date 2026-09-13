import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

type Tab = "login" | "register";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [tab, setTab] = useState<Tab>("login");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", phone: "", email: "", password: "", confirmPass: "", role: "farmer", agree: false });
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    if (loginForm.email.trim() === "admin" && loginForm.password === "admin") {
      login(
        "admin",
        "Trần Minh Đức",
        "admin",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format",
      );
      navigate("/admin/dashboard");
      return;
    }
    if (loginForm.email.trim() === "staff" && loginForm.password === "staff") {
      login(
        "staff",
        "Nguyễn Thị Mai",
        "staff",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format",
      );
      navigate("/staff/pos");
      return;
    }
    login(loginForm.email);
    navigate("/");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (regForm.password !== regForm.confirmPass) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    if (!regForm.agree) {
      setError("Vui lòng đồng ý với điều khoản sử dụng");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    login(regForm.email, regForm.name || "Bác Ba Đức");
    navigate("/");
  };

  return (
    <div className="bg-surface-subtle min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-2xl border border-border-subtle shadow-floating overflow-hidden">
        {/* Left: Branding */}
        <div className="hidden lg:flex flex-col bg-gradient-to-b from-primary-dark to-primary text-white p-10 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute left-1/4 -bottom-16 w-56 h-56 rounded-full bg-emerald-400/10 blur-3xl" />

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-lg bg-white p-1.5 flex items-center justify-center">
              <img src="https://lh3.googleusercontent.com/aida/AEtjO1UUh_rMaCKAuHaMgW-rlQEybLDC0yLaiBL84lCqf4i75nqLSFCcM7r6LQBPmwpexG33O1HAqBNtf-6Kuq4uo8JRLFBBc7rBCVHQjRNNXid88YHmMN-I_eRlwwwhg4IYza_9zPQQNoCKQFWmkF3lpMBE_qP3eRRDHs6SvsfTutDXagvCKzVz7ohcKlnYNWZUz9o4B9FxP1JGjBLadtPwoHB8oAVVKq2Ywe4vqvFummLb-xtOsuSmo4eTZR8" alt="AgriSage" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="font-bold text-white text-lg tracking-tight">AgriSage</div>
              <div className="text-[11px] text-emerald-200/80">Hệ sinh thái Nông nghiệp Thông minh</div>
            </div>
          </Link>

          <div className="flex-1 flex flex-col justify-center relative z-10">
            <h2 className="text-2xl font-bold mb-4 leading-snug">
              Nền tảng nông nghiệp số<br />hàng đầu Việt Nam
            </h2>
            <p className="text-emerald-100/90 text-sm leading-relaxed mb-8">
              Đăng nhập để truy cập đầy đủ tính năng: Đặt hàng, Quản lý nợ vụ và Bác sĩ cây trồng AI.
            </p>

            <div className="space-y-4">
              {[
                { icon: "shopping_bag", title: "Đặt hàng & Quản lý", desc: "Theo dõi đơn hàng, lịch sử mua và hạn mức tín dụng" },
                { icon: "psychology", title: "Bác sĩ cây trồng AI", desc: "Chẩn đoán bệnh không giới hạn, lưu kết quả lâu dài" },
                { icon: "notifications", title: "Cảnh báo dịch hại vùng", desc: "Nhận thông báo kịp thời về dịch bệnh khu vực của bạn" },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px] text-emerald-300">{f.icon}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{f.title}</div>
                    <div className="text-xs text-emerald-100/80">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs text-emerald-100/70">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
            <span>10.000+ nông hộ đang sử dụng AgriSage</span>
          </div>
        </div>

        {/* Right: Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px] text-primary">eco</span>
            </div>
            <span className="font-bold text-primary-dark text-base">AgriSage</span>
          </Link>

          {/* Tab toggle */}
          <div className="flex rounded-xl bg-surface-subtle p-1 mb-7 border border-border-subtle">
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === t ? "bg-white text-primary shadow-sm border border-border-subtle" : "text-text-muted hover:text-text-secondary"}`}
              >
                {t === "login" ? "Đăng nhập" : "Đăng ký"}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-status-error-surface border border-status-error/20 rounded-lg text-xs text-status-error flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {error}
            </div>
          )}

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1.5">Email hoặc Số điện thoại</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-text-muted">person</span>
                  <input
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 border border-border-subtle rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                    placeholder="email@domain.com hoặc 09xxxxxxxx"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-text-primary">Mật khẩu</label>
                  <Link to="/quen-mat-khau" className="text-xs text-primary hover:underline">Quên mật khẩu?</Link>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-text-muted">lock</span>
                  <input
                    required
                    type={showPass ? "text" : "password"}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full pl-9 pr-10 py-2.5 border border-border-subtle rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
                    placeholder="Mật khẩu của bạn"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                    <span className="material-symbols-outlined text-[18px]">{showPass ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Đang đăng nhập...</span></>
                ) : (
                  <><span className="material-symbols-outlined text-[18px]">login</span><span>Đăng nhập</span></>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-subtle" /></div>
                <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-text-muted">hoặc đăng nhập với</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="py-2.5 border border-border-subtle rounded-lg text-sm font-semibold text-text-secondary hover:bg-surface-subtle flex items-center justify-center gap-2 transition-colors">
                  <span>🇬 Google</span>
                </button>
                <button type="button" className="py-2.5 border border-border-subtle rounded-lg text-sm font-semibold text-text-secondary hover:bg-surface-subtle flex items-center justify-center gap-2 transition-colors">
                  <span>💬 Zalo</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1.5">Bạn là</label>
                <div className="grid grid-cols-2 gap-2">
                  {[{ key: "farmer", label: "Nông dân", icon: "agriculture" }, { key: "dealer", label: "Đại lý / Cửa hàng", icon: "store" }].map((r) => (
                    <label key={r.key} className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${regForm.role === r.key ? "border-primary bg-primary-light/30" : "border-border-subtle"}`}>
                      <input type="radio" name="role" value={r.key} checked={regForm.role === r.key} onChange={() => setRegForm({ ...regForm, role: r.key })} className="accent-primary" />
                      <span className="material-symbols-outlined text-[16px] text-text-muted">{r.icon}</span>
                      <span className="text-xs font-semibold text-text-primary">{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1.5">Họ tên đầy đủ *</label>
                  <input required value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} className="w-full border border-border-subtle rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary" placeholder="Nguyễn Văn An" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1.5">Số điện thoại *</label>
                  <input required type="tel" value={regForm.phone} onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })} className="w-full border border-border-subtle rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary" placeholder="0912 345 678" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1.5">Email *</label>
                <input required type="email" value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} className="w-full border border-border-subtle rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary" placeholder="email@domain.com" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1.5">Mật khẩu *</label>
                  <div className="relative">
                    <input required type={showPass ? "text" : "password"} value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} className="w-full pl-3 pr-10 py-2.5 border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="Tối thiểu 8 ký tự" />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                      <span className="material-symbols-outlined text-[16px]">{showPass ? "visibility_off" : "visibility"}</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1.5">Xác nhận mật khẩu *</label>
                  <input required type={showPass ? "text" : "password"} value={regForm.confirmPass} onChange={(e) => setRegForm({ ...regForm, confirmPass: e.target.value })} className="w-full px-3 py-2.5 border border-border-subtle rounded-lg text-sm focus:outline-none focus:border-primary" placeholder="Nhập lại mật khẩu" />
                </div>
              </div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={regForm.agree} onChange={(e) => setRegForm({ ...regForm, agree: e.target.checked })} className="mt-0.5 accent-primary" />
                <span className="text-xs text-text-secondary">
                  Tôi đồng ý với <button type="button" className="text-primary hover:underline">Điều khoản sử dụng</button> và <button type="button" className="text-primary hover:underline">Chính sách bảo mật</button> của AgriSage
                </span>
              </label>
              <button type="submit" disabled={loading} className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Đang tạo tài khoản...</span></>
                ) : (
                  <><span className="material-symbols-outlined text-[18px]">person_add</span><span>Tạo tài khoản miễn phí</span></>
                )}
              </button>
            </form>
          )}

          <p className="text-center text-xs text-text-muted mt-6">
            {tab === "login" ? (
              <>Chưa có tài khoản? <button onClick={() => setTab("register")} className="text-primary font-semibold hover:underline">Đăng ký ngay</button></>
            ) : (
              <>Đã có tài khoản? <button onClick={() => setTab("login")} className="text-primary font-semibold hover:underline">Đăng nhập</button></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
