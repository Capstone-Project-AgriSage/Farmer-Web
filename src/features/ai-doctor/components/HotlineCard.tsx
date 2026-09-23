export default function HotlineCard() {
  return (
    <div className="bg-brand-green border border-brand-green p-5 flex items-center gap-3.5">
      <div className="w-11 h-11 rounded-full bg-white/15 text-white flex items-center justify-center flex-shrink-0 border border-white/25">
        <span className="material-symbols-outlined text-[22px]">support_agent</span>
      </div>
      <div className="flex-1">
        <div className="text-sm font-helvetica-neue tracking-tight text-white">Cần kỹ sư xác nhận trực tiếp?</div>
        <div className="text-xs text-white/70">Hỗ trợ miễn phí 7:00 - 20:00</div>
      </div>
      <a href="tel:19006828" className="px-3.5 py-1.5 rounded-full bg-white text-brand-green hover:bg-brand-light text-sm tracking-wide transition-colors flex-shrink-0">
        1900 6828
      </a>
    </div>
  )
}
