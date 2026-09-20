export default function OrderSuccessStepper() {
  return (
    <div className="w-full bg-white border border-brand-dark/10 py-4 mb-8 px-4 sm:px-6">
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
            <span className="material-symbols-outlined text-[16px]">check</span>
          </div>
          <span className="text-xs sm:text-sm text-brand-dark tracking-wide">2. Giao nhận &amp; Thanh toán</span>
        </div>
        <div className="flex-1 h-px bg-brand-dark/30 mx-3 sm:mx-6"></div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-brand-dark text-white flex items-center justify-center text-xs">
            <span className="material-symbols-outlined text-[16px]">check</span>
          </div>
          <span className="text-xs sm:text-sm text-brand-dark tracking-wide">3. Hoàn tất</span>
        </div>
      </div>
    </div>
  )
}
