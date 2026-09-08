export default function OrderSuccessStepper() {
  return (
    <div className="w-full bg-white border-b border-[#E1E8E2] py-4 -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 mb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">check</span>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#172118]">1. Giỏ hàng</span>
          </div>
          <div className="flex-1 h-0.5 bg-[#2E7D32] mx-3 sm:mx-6"></div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">check</span>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#172118]">2. Giao nhận &amp; Thanh toán</span>
          </div>
          <div className="flex-1 h-0.5 bg-[#2E7D32] mx-3 sm:mx-6"></div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#0d631b] text-white flex items-center justify-center text-xs font-bold ring-4 ring-[#E8F5E9]">
              <span className="material-symbols-outlined text-[16px]">check</span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#0d631b]">3. Hoàn tất</span>
          </div>
        </div>
      </div>
    </div>
  )
}
