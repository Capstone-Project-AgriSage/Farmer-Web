import { useRef, type ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { m, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import Reveal from '../../../components/ui/Reveal'
import ImageReveal from '../../../components/ui/ImageReveal'
import SectionHeader from '../../../components/ui/SectionHeader'
import { useMotionPolicy } from '../../../motion/useMotionPolicy'
import { useMediaQuery } from '../../../motion/useMediaQuery'
import { handleImageError } from '../../../utils/image'
import type { ProductGroup } from '../../../types'

const categories: { name: string; group: ProductGroup; count: string; image: string; position: string }[] = [
  {
    name: 'Thuốc Đặc Trị Nấm & Khuẩn',
    group: 'Thuốc đặc trị nấm & diệt khuẩn',
    count: '6 sản phẩm chuẩn',
    image: '/images/categories/bvtv.jpg',
    position: 'object-[50%_50%]',
  },
  {
    name: 'Phân Bón NPK & Dinh Dưỡng Lúa',
    group: 'Phân bón NPK & Dinh dưỡng lúa',
    count: '2 dòng chủ lực',
    image: '/images/categories/npk.jpg',
    position: 'object-[50%_50%]',
  },
  {
    name: 'Lúa Giống Xác Nhận',
    group: 'Lúa giống xác nhận',
    count: 'Chuẩn thuần F1',
    image: '/images/categories/hat-giong.jpg',
    position: 'object-[50%_62%]',
  },
]

/** Moves a tile from +offset to -offset px while it crosses the screen, so the columns drift at different speeds. */
function DriftInner({ offset, children }: { offset: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])
  return (
    <m.div ref={ref} style={{ y }}>
      {children}
    </m.div>
  )
}

function Drift({ offset, children }: { offset: number; children: ReactNode }) {
  const full = useMotionPolicy() === 'full'
  const wide = useMediaQuery('(min-width: 1024px)')
  return full && wide ? <DriftInner offset={offset}>{children}</DriftInner> : <>{children}</>
}

const DRIFT_OFFSETS = [28, 64, 28]

export default function CategoryGrid() {
  return (
    <section className="w-full py-20 md:py-28 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          eyebrow="Nhóm vật tư nổi bật"
          title="Trang bị toàn diện cho mọi mùa vụ"
          linkLabel="Xem tất cả vật tư"
          linkTo="/products"
        />

        <ul className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10">
          {categories.map((cat, index) => (
            <Reveal as="li" key={cat.name} delay={index * 0.12} y={0}>
              <Drift offset={DRIFT_OFFSETS[index] ?? 28}>
              <Link to={`/products?group=${encodeURIComponent(cat.group)}`} className="focus-ring group block">
                <ImageReveal className="rounded-[var(--radius-surface)] aspect-[4/3]" delay={index * 0.12}>
                  <img
                    src={cat.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onError={handleImageError}
                    className={`w-full h-full object-cover ${cat.position} transition-transform duration-[var(--dur-image)] ease-[var(--motion-ease-out)] group-hover:scale-[1.04]`}
                  />
                </ImageReveal>
                <div className="mt-5 flex items-start justify-between gap-4 border-t border-brand-dark/15 pt-4 group-hover:border-brand-dark/40 transition-colors">
                  <div className="min-w-0 transition-transform duration-[var(--dur-standard)] ease-[var(--motion-ease-out)] group-hover:translate-x-[3px]">
                    <h3 className="text-lg font-medium text-text-primary leading-snug">{cat.name}</h3>
                    <p className="mt-1 text-[15px] text-text-secondary">{cat.count}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[15px] text-text-primary shrink-0 pt-0.5">
                    Khám phá
                    <ArrowRight
                      className="w-4 h-4 transition-transform duration-[var(--dur-standard)] ease-[var(--motion-ease-out)] group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
              </Drift>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
