export default function HotlineCard() {
  return (
    <div className="bg-brand-green rounded-[var(--radius-surface)] p-6 flex items-center gap-4">
      <span className="material-symbols-outlined text-white shrink-0" style={{ fontSize: 32 }} aria-hidden="true">
        support_agent
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-base font-medium text-white">Cần kỹ sư xác nhận trực tiếp?</p>
        <p className="text-[15px] text-white/80">Hỗ trợ miễn phí 7:00 - 20:00</p>
      </div>
      <a
        href="tel:19006828"
        className="focus-ring-light shrink-0 inline-flex items-center min-h-[44px] px-5 rounded-full bg-white text-brand-green hover:bg-brand-light text-[15px] tracking-wide transition-colors"
      >
        1900 6828
      </a>
    </div>
  )
}
