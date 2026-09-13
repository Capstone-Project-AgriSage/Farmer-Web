import { useState } from "react";
import { Link } from "react-router";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="bg-surface-subtle min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-white p-8 shadow-floating">
        <Link to="/" className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light">
            <span className="material-symbols-outlined text-[22px] text-primary">eco</span>
          </div>
          <div>
            <div className="text-lg font-bold text-primary-dark">AgriSage</div>
            <div className="text-[11px] font-semibold text-text-muted">Khôi phục quyền truy cập</div>
          </div>
        </Link>

        {sent ? (
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-status-success-surface">
              <span className="material-symbols-outlined text-[30px] text-status-success">mark_email_read</span>
            </div>
            <h1 className="text-xl font-bold text-text-primary">Đã gửi hướng dẫn đặt lại mật khẩu</h1>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Vui lòng kiểm tra email hoặc tin nhắn liên kết với tài khoản của bạn. Liên kết đặt lại mật khẩu sẽ hết hạn sau 15 phút.
            </p>
            <Link
              to="/dang-nhap"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-hover"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              Quay lại đăng nhập
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-text-primary">Quên mật khẩu?</h1>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Nhập email hoặc số điện thoại đã đăng ký, AgriSage sẽ gửi hướng dẫn đặt lại mật khẩu cho bạn.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-text-primary">Email hoặc Số điện thoại</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-text-muted">
                    alternate_email
                  </span>
                  <input
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full rounded-lg border border-border-subtle py-2.5 pl-9 pr-3 text-sm text-text-primary focus:border-primary focus:outline-none"
                    placeholder="email@domain.com hoặc 09xxxxxxxx"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-primary-hover disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    Gửi hướng dẫn
                  </>
                )}
              </button>
            </form>

            <Link to="/dang-nhap" className="mt-5 flex items-center justify-center gap-1 text-sm font-semibold text-primary hover:underline">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Quay lại đăng nhập
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
