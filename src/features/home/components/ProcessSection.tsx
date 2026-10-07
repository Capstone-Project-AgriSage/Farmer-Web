import { useRef } from 'react'
import { m, useInView } from 'framer-motion'
import Reveal from '../../../components/ui/Reveal'
import SectionHeader from '../../../components/ui/SectionHeader'
import { useMotionPolicy } from '../../../motion/useMotionPolicy'
import { EASE } from '../../../motion/tokens'

// The order flow as the app implements it: shop or diagnose, dealer confirms, pay or buy on credit, delivery and tracking.
const steps = [
  { title: 'Chọn vật tư hoặc chụp ảnh lá lúa', desc: 'Xem vật tư chính hãng, hoặc gửi ảnh lá lúa để Bác sĩ cây trồng AI chẩn đoán.' },
  { title: 'Đại lý xác nhận', desc: 'Đại lý thẩm định phác đồ và xác nhận đơn hàng của bà con.' },
  { title: 'Thanh toán hoặc mua chịu', desc: 'Thanh toán qua payOS, hoặc mua chịu theo hạn mức nếu đại lý đã cấp.' },
  { title: 'Nhận hàng và theo dõi', desc: 'Hàng giao tận nơi; xem trạng thái đơn, các lần giao và công nợ ngay trong tài khoản.' },
]

export default function ProcessSection() {
  const full = useMotionPolicy() === 'full'
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, margin: '0px 0px -20% 0px' })

  return (
    <section className="w-full py-20 md:py-28 bg-brand-light border-y border-brand-dark/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader eyebrow="Cách hoạt động" title="Từ ruộng đến đơn hàng trong 4 bước" />

        <div ref={ref} className="relative mt-12 md:mt-16">
          {/* Rule through the step markers: vertical on phones, horizontal from md. On desktop it draws itself. */}
          <div className="absolute left-[11px] top-3 bottom-3 w-px md:left-0 md:right-0 md:top-[11px] md:bottom-auto md:h-px md:w-auto bg-brand-dark/15" aria-hidden="true" />
          {full ? (
            <m.div
              className="absolute left-0 right-0 top-[11px] h-px bg-primary-dark origin-left hidden md:block"
              initial={{ scaleX: 0 }}
              animate={seen ? { scaleX: 1 } : undefined}
              transition={{ duration: 1.6, ease: [...EASE.out] }}
              aria-hidden="true"
            />
          ) : (
            <div className="absolute left-0 right-0 top-[11px] h-px bg-primary-dark hidden md:block" aria-hidden="true" />
          )}

          <ol className="relative grid grid-cols-1 md:grid-cols-4 gap-y-10 md:gap-x-8">
            {steps.map((step, index) => (
              <Reveal as="li" key={step.title} delay={0.2 + index * 0.18} y={20} className="relative pl-10 md:pl-0 md:pt-12">
                <span
                  className="absolute left-0 top-1 md:top-0 w-[23px] h-[23px] rounded-full border border-primary-dark bg-brand-light flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="w-2 h-2 rounded-full bg-primary-dark" />
                </span>
                <p className="text-[13px] tracking-[0.16em] text-text-secondary">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 text-xl font-medium text-text-primary leading-snug">{step.title}</h3>
                <p className="mt-2 text-[15px] md:text-base text-text-secondary leading-relaxed">{step.desc}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
