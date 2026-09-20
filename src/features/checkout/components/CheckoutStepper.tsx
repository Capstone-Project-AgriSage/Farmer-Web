import { Link } from 'react-router-dom'

export default function CheckoutStepper() {
  return (
    <>
      <div className="w-full bg-brand-light border-b border-brand-dark/10 py-3.5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-brand-dark/50">
              <Link className="hover:text-brand-dark transition-colors flex items-center gap-1" to="/">
                <span className="material-symbols-outlined text-[16px]">home</span>
                <span>Trang chủ</span>
              </Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <Link className="hover:text-brand-dark transition-colors" to="/cart">
                Giỏ hàng
              </Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-brand-dark tracking-wide">Đặt hàng &amp; Thanh toán</span>
            </nav>
            <div className="text-xs text-brand-dark/50 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-brand-green">lock</span>
              <span>Thanh toán bảo mật SSL 256-bit</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-white border-b border-brand-dark/10 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-center max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-dark text-white flex items-center justify-center text-xs">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <span className="text-xs sm:text-sm text-brand-dark tracking-wide">1. Giỏ hàng</span>
            </div>
            <div className="flex-1 h-px bg-brand-dark/30 mx-3 sm:mx-6"></div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-dark text-white flex items-center justify-center text-xs">
                2
              </div>
              <span className="text-xs sm:text-sm text-brand-dark tracking-wide">2. Giao nhận &amp; Thanh toán</span>
            </div>
            <div className="flex-1 h-px bg-brand-dark/15 mx-3 sm:mx-6"></div>
            <div className="flex items-center gap-2 text-brand-dark/40">
              <div className="w-7 h-7 rounded-full border border-brand-dark/20 bg-brand-cream flex items-center justify-center text-xs">
                3
              </div>
              <span className="text-xs sm:text-sm tracking-wide">3. Hoàn tất</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
