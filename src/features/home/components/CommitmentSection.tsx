import Reveal from '../../../components/ui/Reveal'
import SectionHeader from '../../../components/ui/SectionHeader'

const commitments = [
  {
    icon: 'verified',
    title: '100% Chính Hãng',
    desc: 'Vật tư Syngenta, Bình Điền, Cà Mau có tem VAT và mã QR truy xuất.',
  },
  {
    icon: 'credit_score',
    title: 'Bảo Lãnh Nợ',
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
    <section className="w-full py-20 md:py-28 bg-brand-green">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader tone="dark" eyebrow="Cam kết dịch vụ" title="Đồng hành toàn diện cùng nhà nông" />

        <ul className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {commitments.map((item, index) => (
            <Reveal as="li" key={item.title} delay={index * 0.07} className="border-t border-white/25 pt-6">
              <div className="flex items-center justify-between text-white/75">
                <span className="text-[13px] tracking-[0.16em]">{String(index + 1).padStart(2, '0')}</span>
                <span className="material-symbols-outlined text-[28px] text-white" aria-hidden="true">
                  {item.icon}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-medium text-white">{item.title}</h3>
              <p className="mt-2 text-[15px] md:text-base text-white/80 leading-relaxed">{item.desc}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
