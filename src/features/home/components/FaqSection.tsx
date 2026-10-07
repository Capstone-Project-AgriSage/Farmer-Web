import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../../../components/ui/Reveal'
import SectionHeader from '../../../components/ui/SectionHeader'

// Answers restate what the app already does (checkout, debt book, orders, AI Doctor, footer contact details).
const faqs = [
  {
    q: 'Mua chịu hoạt động như thế nào?',
    a: 'Đại lý cấp hạn mức mua chịu cho từng nông hộ. Khi đã có hạn mức, bác chọn mua chịu lúc đặt hàng và theo dõi các khoản nợ, hạn trả trong mục Sổ nợ. Nếu chưa có hạn mức, bác liên hệ đại lý để được mở Sổ nợ.',
  },
  {
    q: 'Tôi thanh toán đơn hàng bằng cách nào?',
    a: 'Bác có thể thanh toán qua payOS (VietQR) khi đặt hàng, hoặc mua chịu nếu đã có hạn mức. Trạng thái thanh toán của từng đơn xem trong mục Đơn hàng.',
  },
  {
    q: 'Làm sao biết đơn hàng của tôi đang ở đâu?',
    a: 'Khi đặt hàng, bác chọn giao tận nơi hoặc nhận tại cửa hàng. Trong mục Đơn hàng, bác xem trạng thái đơn, từng lần giao và ảnh giao hàng của đơn đó.',
  },
  {
    q: 'Bác sĩ cây trồng AI chẩn đoán như thế nào?',
    a: 'Bác gửi ảnh lá hoặc thân lúa, chọn giai đoạn sinh trưởng và mô tả triệu chứng để AI đưa ra gợi ý chẩn đoán. Danh mục thuốc thương mại chỉ hiển thị sau khi đại lý thẩm định hình ảnh.',
  },
  {
    q: 'Cần hỗ trợ thì liên hệ ai?',
    a: 'Bác gọi tổng đài kỹ sư 1900 6828 (7:00 – 20:00), hoặc gửi yêu cầu ở trang Liên hệ đại lý.',
  },
]

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId()
  return (
    <li className="border-b border-brand-dark/15">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          className="focus-ring w-full flex items-center justify-between gap-6 py-6 text-left min-h-[64px]"
        >
          <span className="text-lg md:text-xl font-normal tracking-tight text-text-primary">{q}</span>
          <span
            aria-hidden="true"
            className={`shrink-0 relative w-6 h-6 transition-transform duration-[var(--dur-standard)] ease-[var(--motion-ease-out)] ${open ? 'rotate-45' : ''}`}
          >
            <span className="absolute left-0 right-0 top-1/2 h-px bg-text-primary" />
            <span className="absolute top-0 bottom-0 left-1/2 w-px bg-text-primary" />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-[var(--dur-standard)] ease-[var(--motion-ease-out)] ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <p className="pb-6 pr-10 text-[15px] md:text-base text-text-secondary leading-relaxed max-w-2xl">{a}</p>
        </div>
      </div>
    </li>
  )
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="w-full py-20 md:py-28 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHeader eyebrow="Giải đáp" title="Câu hỏi thường gặp" />
          <Reveal className="mt-6">
            <p className="text-[15px] md:text-base text-text-secondary leading-relaxed">
              Chưa thấy câu trả lời? Gọi <span className="text-text-primary">1900 6828</span> hoặc{' '}
              <Link to="/contact" className="focus-ring text-text-primary underline underline-offset-4 hover:no-underline">
                gửi yêu cầu cho đại lý
              </Link>
              .
            </p>
          </Reveal>
        </div>
        <Reveal className="lg:col-span-8">
          <ul className="border-t border-brand-dark/15">
            {faqs.map((item, index) => (
              <Item key={item.q} q={item.q} a={item.a} open={openIndex === index} onToggle={() => setOpenIndex(openIndex === index ? null : index)} />
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
