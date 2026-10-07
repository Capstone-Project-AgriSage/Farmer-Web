import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../../../components/ui/Reveal'
import SectionHeader from '../../../components/ui/SectionHeader'

// Each row is a page that already exists in the app.
const useCases = [
  {
    to: '/products',
    title: 'Mua vật tư chính hãng',
    desc: 'Phân bón, thuốc BVTV và lúa giống: xem chi tiết, thêm vào giỏ và đặt hàng ngay trên điện thoại.',
  },
  {
    to: '/ai-doctor',
    title: 'Chẩn đoán bệnh lúa qua ảnh',
    desc: 'Gửi ảnh lá lúa để nhận gợi ý chẩn đoán. Phác đồ thương mại được đại lý thẩm định trước khi áp dụng.',
  },
  {
    to: '/debt',
    title: 'Theo dõi Sổ nợ',
    desc: 'Xem hạn mức, các khoản nợ và lịch sử trả nợ khi đại lý đã cấp hạn mức mua chịu.',
  },
  {
    to: '/orders',
    title: 'Theo dõi đơn hàng',
    desc: 'Xem trạng thái đơn, các lần giao hàng và thanh toán của từng đơn.',
  },
]

export default function UseCasesSection() {
  return (
    <section className="w-full py-20 md:py-28 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader eyebrow="AgriSage dùng để làm gì" title="Những việc bà con làm được trên AgriSage" />

        <ul className="mt-10 md:mt-14 border-t border-brand-dark/15">
          {useCases.map((item, index) => (
            <Reveal as="li" key={item.to} delay={index * 0.08} y={20} className="border-b border-brand-dark/15">
              <Link
                to={item.to}
                className="focus-ring group grid grid-cols-[3rem_1fr_auto] md:grid-cols-[5rem_minmax(0,22rem)_1fr_auto] items-center gap-x-4 md:gap-x-8 gap-y-1 py-7 md:py-9 hover:bg-white/60 transition-colors duration-[var(--dur-standard)]"
              >
                <span className="text-[length:var(--type-h3)] font-light text-text-muted pl-1">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="text-xl md:text-2xl font-normal tracking-tight text-text-primary transition-transform duration-[var(--dur-standard)] ease-[var(--motion-ease-out)] group-hover:translate-x-1.5">
                  {item.title}
                </h3>
                <p className="col-start-2 md:col-start-auto row-start-2 md:row-start-auto col-span-2 md:col-span-1 text-[15px] md:text-base text-text-secondary leading-relaxed max-w-xl">
                  {item.desc}
                </p>
                <ArrowRight
                  className="col-start-3 row-start-1 md:col-start-auto md:row-start-auto w-6 h-6 text-text-primary transition-transform duration-[var(--dur-standard)] ease-[var(--motion-ease-out)] group-hover:translate-x-1.5"
                  aria-hidden="true"
                />
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
