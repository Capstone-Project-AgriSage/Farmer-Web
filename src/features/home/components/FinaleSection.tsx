import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import LineReveal from '../../../components/ui/LineReveal'
import Reveal from '../../../components/ui/Reveal'
import { useAuth } from '../../../context/AuthContext'

// Same four promises as before, shortened. The figures (100%, 0%, 2 giờ, 24/7) are not verified yet: confirm them with the
// dealer before launch, or remove them.
const commitments = [
  { title: '100% chính hãng', note: 'Tem VAT, mã QR truy xuất' },
  { title: 'Bảo lãnh nợ', note: 'Hạn mức 0% lãi suất' },
  { title: 'Giao tận ruộng', note: 'Trong 2 giờ quanh Thới Lai' },
  { title: 'Kỹ sư nông học 24/7', note: 'Tư vấn phác đồ phun thuốc' },
]

const primary =
  'focus-ring-light inline-flex items-center justify-center gap-2 min-h-[52px] px-8 rounded-full bg-white text-brand-dark hover:bg-brand-light text-base transition-colors'
const secondary =
  'focus-ring-light inline-flex items-center justify-center min-h-[52px] px-8 rounded-full border border-white/40 text-white hover:bg-white hover:text-brand-dark text-base transition-colors'

/** Last chapter of the home page: one closing line, the next step for this visitor, and the service promises. */
export default function FinaleSection() {
  const { isAuthenticated } = useAuth()

  return (
    <section aria-labelledby="home-finale-title" className="w-full bg-brand-green text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 md:pt-28 pb-14 md:pb-20">
        <LineReveal
          id="home-finale-title"
          lines={['Sẵn sàng', 'cho vụ mùa tới?']}
          className="text-[clamp(2.75rem,7vw,7rem)] leading-[0.98] font-light tracking-[-0.02em] text-white"
        />

        <Reveal delay={0.25} y={16} className="mt-10 flex flex-col sm:flex-row gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/products" className={primary}>
                Xem vật tư
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link to="/ai-doctor" className={secondary}>
                Chẩn đoán bệnh lúa
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className={primary}>
                Đăng ký tài khoản
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link to="/products" className={secondary}>
                Xem vật tư
              </Link>
            </>
          )}
        </Reveal>

        <h2 className="mt-20 md:mt-28 text-[13px] uppercase tracking-[0.16em] text-white/75">Cam kết dịch vụ</h2>
        <ul className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-8">
          {commitments.map((item, index) => (
            <Reveal as="li" key={item.title} delay={index * 0.07} className="border-t border-white/25 pt-5">
              <p className="text-[length:var(--type-h3)] leading-[var(--type-h3-lh)] font-normal tracking-tight text-white">{item.title}</p>
              <p className="mt-1.5 text-[15px] text-white/75">{item.note}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
