import { useRef, type RefObject } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LazyMotion, domAnimation, m, useInView, useScroll, useSpring } from 'framer-motion'
import Breadcrumb from '../../components/ui/Breadcrumb'
import ImageReveal from '../../components/ui/ImageReveal'
import Reveal from '../../components/ui/Reveal'
import SectionHeader from '../../components/ui/SectionHeader'
import WordReveal from '../../components/ui/WordReveal'
import { useAuth } from '../../context/AuthContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import ScrollProgress from '../../motion/ScrollProgress'
import SmoothScroll from '../../motion/SmoothScroll'
import { useMotionPolicy } from '../../motion/useMotionPolicy'
import { handleImageError } from '../../utils/image'
import type { ProductGroup } from '../../types'

const stats = [
  { label: 'Nhà vườn & đại lý liên kết', value: '3.200+' },
  { label: 'Sản phẩm vật tư chính hãng', value: '320+' },
  { label: 'Lượt chẩn đoán AI thành công', value: '48.000+' },
  { label: 'Chi nhánh kho vận', value: '2' },
]

const values = [
  {
    icon: 'verified',
    title: 'Chính hãng tuyệt đối',
    desc: '100% vật tư có tem chống giả, hóa đơn VAT điện tử, nguồn gốc truy xuất rõ ràng qua mã QR.',
  },
  {
    icon: 'psychology',
    title: 'Công nghệ AI đồng hành',
    desc: 'Bác sĩ cây trồng AI chẩn đoán bệnh hại qua ảnh chụp trong 3 giây, hỗ trợ miễn phí trọn đời cho nông hộ.',
  },
  {
    icon: 'credit_score',
    title: 'Đồng hành tài chính',
    desc: 'Sổ nợ AgriCredit 0% lãi suất, thanh toán linh hoạt sau thu hoạch, giảm áp lực vốn đầu năm.',
  },
  {
    icon: 'local_shipping',
    title: 'Giao tận vườn nhanh chóng',
    desc: 'Mạng lưới kho vận Lâm Đồng & ĐBSCL, giao vật tư tận vườn trong 2-4 giờ với đơn hỏa tốc.',
  },
]

const timeline = [
  {
    year: '2019',
    title: 'Khởi nguồn từ một đại lý vật tư ở Di Linh',
    desc: 'AgriSage bắt đầu là đại lý phân bón - thuốc BVTV nhỏ tại Lâm Đồng, ghi sổ nợ bằng tay cho hơn 200 nhà vườn cà phê, sầu riêng quen thuộc.',
  },
  {
    year: '2021',
    title: 'Số hóa sổ nợ & mở gian hàng trực tuyến',
    desc: 'Ra mắt nền tảng đặt vật tư trực tuyến đầu tiên, chuyển toàn bộ sổ nợ giấy sang hệ thống AgriCredit minh bạch, tra cứu được mọi lúc.',
  },
  {
    year: '2023',
    title: 'Bác sĩ cây trồng AI ra đời',
    desc: 'Hợp tác cùng kỹ sư nông học huấn luyện mô hình chẩn đoán bệnh hại qua ảnh chụp, mở đầu bằng các bệnh phổ biến trên cà phê và sầu riêng.',
  },
  {
    year: '2024',
    title: 'Mở rộng xuống Đồng bằng Sông Cửu Long',
    desc: 'Thêm chi nhánh kho vận tại Cần Thơ, mở rộng AI chẩn đoán sang cây lúa, phục vụ thêm hàng nghìn nông hộ trồng lúa vùng ĐBSCL.',
  },
]

const categories: { name: string; group: ProductGroup; image: string }[] = [
  { name: 'Phân bón NPK & Vi lượng', group: 'Phân bón NPK & Vi lượng', image: '/images/categories/npk.webp' },
  { name: 'Thuốc BVTV & Trừ nấm', group: 'Thuốc BVTV & Trừ nấm', image: '/images/categories/bvtv.webp' },
  { name: 'Phân hữu cơ vi sinh', group: 'Phân hữu cơ vi sinh', image: '/images/categories/huu-co.webp' },
  { name: 'Hạt giống & Cây giống', group: 'Hạt giống & Cây giống', image: '/images/categories/hat-giong.webp' },
  { name: 'Tưới nhỏ giọt & Thiết bị', group: 'Tưới nhỏ giọt & Thiết bị', image: '/images/categories/tuoi-nho-giot.webp' },
  { name: 'Thuốc trừ sâu sinh học', group: 'Thuốc trừ sâu sinh học', image: '/images/categories/sinh-hoc.webp' },
]

const branches = [
  {
    icon: 'apartment',
    title: 'Trung tâm điều hành',
    address: 'Tòa nhà AgriTech, Khu Công nghệ cao, TP. Hồ Chí Minh',
    note: 'Đội ngũ kỹ sư nông học & vận hành AI',
  },
  {
    icon: 'storefront',
    title: 'Chi nhánh Lâm Đồng',
    address: '142 Hùng Vương, TT. Di Linh, Tỉnh Lâm Đồng',
    note: 'Kho vật tư cà phê, sầu riêng, rau màu',
  },
  {
    icon: 'storefront',
    title: 'Chi nhánh Cần Thơ',
    address: 'Khu vực Ô Môn, TP. Cần Thơ',
    note: 'Kho vật tư lúa gạo & thủy sản Đồng bằng Sông Cửu Long',
  },
]

/** Vertical rule that fills as the timeline scrolls past. Only mounted with full motion. */
function ProgressRule({ targetRef }: { targetRef: RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start 70%', 'end 60%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  return <m.div aria-hidden="true" className="absolute left-[11px] top-2 bottom-2 w-px bg-primary-dark origin-top" style={{ scaleY }} />
}

function TimelineItem({ year, title, desc, delay }: { year: string; title: string; desc: string; delay: number }) {
  const full = useMotionPolicy() === 'full'
  const ref = useRef<HTMLDivElement>(null)
  // The marker fills once the entry has risen into the upper part of the window and stays filled.
  const reached = useInView(ref, { once: true, margin: '0px 0px -45% 0px' }) || !full
  return (
    <Reveal delay={delay} y={28} className="relative pl-12 pb-12 last:pb-0">
      <div ref={ref}>
        <span
          aria-hidden="true"
          className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border flex items-center justify-center transition-colors duration-[var(--dur-image)] ${
            reached ? 'border-primary-dark bg-primary-dark' : 'border-brand-dark/30 bg-brand-light'
          }`}
        >
          <span className={`w-2 h-2 rounded-full transition-colors duration-[var(--dur-image)] ${reached ? 'bg-white' : 'bg-transparent'}`} />
        </span>
        <p className="text-[length:var(--type-h2)] leading-none font-light tracking-tight text-text-muted">{year}</p>
        <h3 className="mt-3 text-xl md:text-2xl font-normal tracking-tight text-text-primary leading-snug">{title}</h3>
        <p className="mt-2 text-[15px] md:text-base text-text-secondary leading-relaxed max-w-2xl">{desc}</p>
      </div>
    </Reveal>
  )
}

export default function AboutPage() {
  useDocumentTitle('Giới thiệu')
  const full = useMotionPolicy() === 'full'
  const { isAuthenticated } = useAuth()
  const timelineRef = useRef<HTMLDivElement>(null)

  return (
    <LazyMotion features={domAnimation} strict>
      <SmoothScroll />
      <ScrollProgress />
      <div className="bg-brand-cream text-brand-dark">
        <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Giới thiệu' }]} />

        {/* Hero */}
        <section className="w-full py-14 md:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <Reveal as="p" y={12} className="text-[13px] uppercase tracking-[0.16em] text-text-secondary mb-4">
                Về AgriSage
              </Reveal>
              <h1 className="text-[length:var(--type-display)] leading-[var(--type-display-lh)] font-light tracking-tight text-text-primary">
                <WordReveal text="Hệ sinh thái nông nghiệp số đồng hành cùng nhà nông" baseDelay={0.15} stagger={0.05} />
              </h1>
              <Reveal as="p" delay={0.7} y={18} className="mt-6 md:mt-8 text-base md:text-lg text-text-secondary leading-relaxed max-w-xl">
                AgriSage là nền tảng quản trị vật tư nông nghiệp toàn diện, kết hợp trợ lý AI nhận diện bệnh hại cây trồng qua ảnh chụp. Chúng tôi giúp đại lý quản lý tồn kho, sổ nợ minh bạch, đồng thời hỗ trợ nông dân tiếp cận vật tư chính hãng và kỹ thuật canh tác hiệu quả — không phải là tốt, mà là tốt nhất.
              </Reveal>
            </div>
            <div className="lg:col-span-5">
              <ImageReveal className="aspect-[4/3] lg:aspect-[4/5] rounded-[var(--radius-surface)]" delay={0.2}>
                <img
                  src="/images/misc/hero-farmer-phone.jpg"
                  width={1000}
                  height={1333}
                  alt="Nông dân dùng điện thoại chụp ảnh cây trồng để chẩn đoán AI ngoài đồng"
                  onError={handleImageError}
                  className="w-full h-full object-cover object-[50%_35%]"
                />
              </ImageReveal>
            </div>
          </div>
        </section>

        {/* Numbers: static text for now, they are not verified production figures. */}
        <section className="w-full border-y border-brand-dark/15">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 divide-x divide-brand-dark/15">
            {stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 0.1} y={20} className="px-4 md:px-8 py-10 md:py-14 first:pl-0 [&:nth-child(3)]:pl-0 md:[&:nth-child(3)]:pl-8">
                <p className="text-[length:var(--type-h1)] leading-none font-light tracking-tight text-text-primary">{stat.value}</p>
                <p className="mt-3 text-[15px] text-text-secondary leading-relaxed">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Journey */}
        <section className="w-full py-20 md:py-28 bg-brand-light">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <SectionHeader eyebrow="Hành trình" title="Từ một đại lý nhỏ ở Di Linh đến hệ sinh thái số" />
              </div>
            </div>
            <div ref={timelineRef} className="lg:col-span-8 relative">
              <div aria-hidden="true" className="absolute left-[11px] top-2 bottom-2 w-px bg-brand-dark/15" />
              {full ? <ProgressRule targetRef={timelineRef} /> : <div aria-hidden="true" className="absolute left-[11px] top-2 bottom-2 w-px bg-primary-dark" />}
              {timeline.map((item, index) => (
                <TimelineItem key={item.year} {...item} delay={index === 0 ? 0 : 0.05} />
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="w-full py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionHeader eyebrow="Điều chúng tôi theo đuổi" title="Giá trị cốt lõi" />
            <ul className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {values.map((value, index) => (
                <Reveal as="li" key={value.title} delay={index * 0.1} y={26} className="border-t border-brand-dark/20 pt-6">
                  <div className="flex items-center justify-between text-text-secondary">
                    <span className="text-[13px] tracking-[0.16em]">{String(index + 1).padStart(2, '0')}</span>
                    <span className="material-symbols-outlined text-text-primary" style={{ fontSize: 32 }} aria-hidden="true">
                      {value.icon}
                    </span>
                  </div>
                  <h3 className="mt-8 text-xl font-medium text-text-primary leading-snug">{value.title}</h3>
                  <p className="mt-3 text-[15px] md:text-base text-text-secondary leading-relaxed">{value.desc}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* Supply groups */}
        <section className="w-full py-20 md:py-28 bg-brand-light border-t border-brand-dark/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionHeader eyebrow="Lĩnh vực vật tư" title="6 nhóm vật tư chúng tôi cung ứng chính hãng" linkLabel="Xem toàn bộ sản phẩm" linkTo="/products" />
            <ul className="mt-10 md:mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 md:gap-x-6 gap-y-8">
              {categories.map((cat, index) => (
                <Reveal as="li" key={cat.name} delay={(index % 3) * 0.1} y={24}>
                  <Link to={`/products?group=${encodeURIComponent(cat.group)}`} className="focus-ring group block">
                    <div className="overflow-hidden rounded-[var(--radius-surface)] aspect-[3/4]">
                      <img
                        src={cat.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        onError={handleImageError}
                        className="w-full h-full object-cover transition-transform duration-[var(--dur-image)] ease-[var(--motion-ease-out)] group-hover:scale-[1.05]"
                      />
                    </div>
                    <h3 className="mt-4 text-[15px] md:text-base font-medium text-text-primary leading-snug transition-transform duration-[var(--dur-standard)] ease-[var(--motion-ease-out)] group-hover:translate-x-1">
                      {cat.name}
                    </h3>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* Network: hovering or focusing one location dims the others. */}
        <section className="w-full py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SectionHeader eyebrow="Mạng lưới" title="2 chi nhánh kho vận, 1 trung tâm điều hành" />
            <ul className="group/network mt-10 md:mt-14 border-t border-brand-dark/20">
              {branches.map((branch, index) => (
                <Reveal as="li" key={branch.title} delay={index * 0.1} y={20} className="border-b border-brand-dark/20">
                  <div
                    tabIndex={0}
                    className="focus-ring grid grid-cols-[3rem_1fr] md:grid-cols-[5rem_minmax(0,20rem)_1fr_minmax(0,18rem)] items-baseline gap-x-4 md:gap-x-8 gap-y-2 py-7 md:py-9 transition-opacity duration-[var(--dur-standard)] group-hover/network:opacity-45 hover:!opacity-100 focus:!opacity-100 group-focus-within/network:opacity-45"
                  >
                    <span className="material-symbols-outlined text-text-primary" style={{ fontSize: 28 }} aria-hidden="true">
                      {branch.icon}
                    </span>
                    <h3 className="text-xl md:text-2xl font-normal tracking-tight text-text-primary">{branch.title}</h3>
                    <p className="col-start-2 md:col-start-auto text-[15px] md:text-base text-text-secondary leading-relaxed">{branch.address}</p>
                    <p className="col-start-2 md:col-start-auto text-[15px] text-text-secondary leading-relaxed">{branch.note}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* Closing call to action: signed-in farmers are not asked to register again. */}
        <section className="w-full py-20 md:py-28 bg-brand-green">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-2xl">
              <Reveal as="p" y={12} className="text-[13px] uppercase tracking-[0.16em] text-white/75 mb-4">
                {isAuthenticated ? 'Bắt đầu' : 'Tham gia'}
              </Reveal>
              <h2 className="text-[length:var(--type-h1)] leading-[var(--type-h1-lh)] font-light tracking-tight text-white">
                <WordReveal text={isAuthenticated ? 'Thử chẩn đoán bệnh lúa qua ảnh chụp' : 'Sẵn sàng số hóa mùa vụ cùng AgriSage?'} inView />
              </h2>
              <Reveal as="p" delay={0.3} y={16} className="mt-5 text-base md:text-lg text-white/80 leading-relaxed">
                {isAuthenticated
                  ? 'Chụp ảnh lá lúa để nhận gợi ý chẩn đoán; phác đồ thương mại được đại lý thẩm định trước khi áp dụng.'
                  : 'Đăng ký tài khoản để trải nghiệm mua vật tư chính hãng và chẩn đoán AI miễn phí.'}
              </Reveal>
            </div>
            <Reveal delay={0.45} y={16}>
              <Link
                to={isAuthenticated ? '/ai-doctor' : '/register'}
                className="focus-ring-light inline-flex items-center justify-center gap-2 min-h-[52px] px-8 bg-white text-brand-green text-base tracking-wide rounded-full hover:bg-brand-light transition-colors whitespace-nowrap"
              >
                {isAuthenticated ? 'Chẩn đoán AI' : 'Đăng ký ngay'}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </section>
      </div>
    </LazyMotion>
  )
}
