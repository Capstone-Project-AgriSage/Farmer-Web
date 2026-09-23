const commitments = [
  {
    icon: 'verified',
    title: '100% Chính Hãng',
    desc: 'Vật tư Syngenta, Bình Điền, Cà Mau có tem VAT và mã QR truy xuất.',
  },
  {
    icon: 'credit_score',
    title: 'Bảo Lãnh Nợ Mùa Vụ',
    desc: 'Hỗ trợ hạn mức 0% lãi suất, thu hoạch lúa mới hoàn trả công nợ.',
  },
  {
    icon: 'local_shipping',
    title: 'Giao Nhanh Tận Ruộng',
    desc: 'Đội xe giao nhanh 2 giờ tại Thới Lai, Cần Thơ và vùng lân cận.',
  },
  {
    icon: 'support_agent',
    title: 'Kỹ Sư Nông Học 24/7',
    desc: 'Tư vấn phác đồ phun thuốc và đồng hành trọn vẹn từng vụ mùa.',
  },
]

export default function CommitmentSection() {
  return (
    <section className="w-full py-16 md:py-20 bg-brand-light border-t border-brand-dark/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-10 md:mb-12">
          <p className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-2 font-helvetica-neue">
            Cam kết dịch vụ
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-brand-dark tracking-tight font-helvetica-neue leading-[1.15]">
            Đồng hành toàn diện cùng nhà nông
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {commitments.map((item, index) => (
            <div
              key={item.title}
              className="bg-brand-green rounded-lg p-6 flex flex-col items-start"
            >
              <div className="text-xs tracking-[0.2em] text-white/60 font-helvetica-neue mb-4">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="w-12 h-12 rounded-full bg-white/15 border border-white/25 text-white flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
              </div>
              <h3 className="text-base font-medium text-white mb-2">{item.title}</h3>
              <p className="text-sm text-white/75 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
