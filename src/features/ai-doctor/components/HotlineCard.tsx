export default function HotlineCard() {
  return (
    <div className="bg-white border border-brand-dark/10 p-5 flex items-center gap-3.5">
      <div className="w-11 h-11 rounded-full bg-brand-light text-brand-green flex items-center justify-center flex-shrink-0 border border-brand-dark/10">
        <span className="material-symbols-outlined text-[22px]">support_agent</span>
      </div>
      <div className="flex-1">
        <div className="text-sm font-helvetica-neue tracking-tight text-brand-dark">Cần kỹ sư xác nhận trực tiếp?</div>
        <div className="text-xs text-brand-dark/50">Hỗ trợ miễn phí 7:00 - 20:00</div>
      </div>
      <a href="tel:19006828" className="text-brand-dark hover:text-brand-green text-sm tracking-wide transition-colors flex-shrink-0">
        1900 6828
      </a>
    </div>
  )
}
