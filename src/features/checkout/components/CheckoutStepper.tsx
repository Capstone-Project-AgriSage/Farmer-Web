import { Link } from 'react-router-dom'

export default function CheckoutStepper() {
  return (
    <>
      <div className="w-full bg-surface-secondary border-b border-border-subtle py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
              <Link className="hover:text-primary transition-colors flex items-center gap-1" to="/">
                <span className="material-symbols-outlined text-[16px]">home</span>
                <span>Trang chủ</span>
              </Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <Link className="hover:text-primary transition-colors" to="/cart">
                Giỏ hàng
              </Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-text-primary font-semibold">Đặt hàng &amp; Thanh toán</span>
            </nav>
            <div className="text-xs text-text-muted flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-status-success">lock</span>
              <span>Thanh toán bảo mật SSL 256-bit</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-white border-b border-border-subtle py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-status-success text-white flex items-center justify-center text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-text-primary">1. Giỏ hàng</span>
            </div>
            <div className="flex-1 h-0.5 bg-status-success mx-3 sm:mx-6"></div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold ring-4 ring-emerald-50">
                2
              </div>
              <span className="text-xs sm:text-sm font-bold text-primary">2. Giao nhận &amp; Thanh toán</span>
            </div>
            <div className="flex-1 h-0.5 bg-border-subtle mx-3 sm:mx-6"></div>
            <div className="flex items-center gap-2 text-text-muted">
              <div className="w-7 h-7 rounded-full bg-surface-secondary border border-border-subtle flex items-center justify-center text-xs font-medium">
                3
              </div>
              <span className="text-xs sm:text-sm font-medium">3. Hoàn tất</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
