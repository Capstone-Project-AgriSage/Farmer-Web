export default function AgronomistCard() {
  return (
    <div className="bg-gradient-to-br from-[#1B5E20] to-[#0d631b] rounded-xl p-6 text-white shadow-md">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20">
          <span className="material-symbols-outlined text-2xl text-green-200">support_agent</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-green-200 uppercase tracking-wider">
            Kỹ sư nông học phụ trách đơn
          </span>
          <h3 className="text-base font-bold mt-0.5">Kỹ sư Lâm Văn Thành (Lâm Đồng)</h3>
          <p className="text-xs text-green-100 mt-1 leading-relaxed">
            Đã kiểm tra toa thuốc của Bác Hùng: Phối hợp Ridomil Gold &amp; Humic theo tỷ lệ
            chuẩn cho vườn sầu riêng sau mưa. Cần hỗ trợ pha chế, vui lòng gọi miễn cước:
          </p>
          <div className="mt-4 flex items-center gap-3">
            <a
              href="tel:19006828"
              className="px-4 py-2 rounded-lg bg-white text-[#1B5E20] font-extrabold text-sm flex items-center gap-1.5 hover:bg-green-50 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">call</span>
              <span>1900 6828 (Phím 1)</span>
            </a>
            <span className="text-xs text-green-200">Tư vấn trực tiếp 24/7</span>
          </div>
        </div>
      </div>
    </div>
  )
}
