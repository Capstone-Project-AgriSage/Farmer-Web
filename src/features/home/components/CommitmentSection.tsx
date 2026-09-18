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
    <section className="w-full py-12 bg-surface-subtle border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
            CAM KẾT DỊCH VỤ
          </h2>
          <p className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            Đồng Hành Toàn Diện Cùng Nhà Nông
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {commitments.map((item) => (
            <div
              key={item.title}
              className="bg-white p-6 rounded-2xl border border-border-subtle shadow-2xs hover:border-primary/40 hover:shadow-xs transition-all flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-primary mb-4">
                <span className="material-symbols-outlined text-[26px]">
                  {item.icon}
                </span>
              </div>
              <h3 className="text-sm font-bold text-text-primary mb-1.5">
                {item.title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
