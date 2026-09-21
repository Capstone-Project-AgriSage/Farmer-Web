export default function AgronomistCard() {
  return (
    <div className="bg-brand-dark border border-brand-dark p-6 text-white">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20">
          <span className="material-symbols-outlined text-2xl text-white/80">support_agent</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs tracking-[0.25em] uppercase text-white/50">
            Kỹ sư nông học phụ trách đơn
          </span>
          <h3 className="text-base font-helvetica-neue tracking-tight mt-0.5">
            Kỹ sư Trương Minh Trí (Trạm Hai Thắng)
          </h3>
          <p className="text-xs text-white/60 mt-1 leading-relaxed">
            Đã thẩm định toa vật tư của Bác Hùng: Phối hợp Beam 75WP &amp; Map Lotus 125WP kiểm soát đạo ôn lá và cháy bìa lá vi khuẩn cho ruộng lúa ST25. Cần hỗ trợ kỹ thuật pha thuốc:
          </p>
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <a
              href="tel:19006828"
              className="px-5 py-2 rounded-full bg-white text-brand-dark hover:bg-brand-light tracking-wide uppercase text-xs flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">call</span>
              <span>1900 6828 (Phím 1)</span>
            </a>
            <span className="text-xs text-white/50">Tư vấn trực tiếp 24/7</span>
          </div>
        </div>
      </div>
    </div>
  )
}
