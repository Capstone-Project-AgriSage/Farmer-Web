export default function HotlineCard() {
  return (
    <div className="bg-white rounded-xl border border-border-subtle p-5 shadow-sm flex items-center gap-3.5">
      <div className="w-11 h-11 rounded-full bg-status-info-surface text-status-info flex items-center justify-center flex-shrink-0">
        <span className="material-symbols-outlined text-[22px]">support_agent</span>
      </div>
      <div className="flex-1">
        <div className="text-sm font-bold text-text-primary">Cần kỹ sư xác nhận trực tiếp?</div>
        <div className="text-xs text-text-muted">Hỗ trợ miễn phí 7:00 - 20:00</div>
      </div>
      <a href="tel:19006828" className="font-extrabold text-primary text-sm hover:underline flex-shrink-0">
        1900 6828
      </a>
    </div>
  )
}
