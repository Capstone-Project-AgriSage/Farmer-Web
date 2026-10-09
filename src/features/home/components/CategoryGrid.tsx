import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { catalogApi } from '../../../api/catalogApi'
import type { CatalogCategory } from '../../../api/types'
import LineReveal from '../../../components/ui/LineReveal'
import Reveal from '../../../components/ui/Reveal'
import { useMediaQuery } from '../../../motion/useMediaQuery'
import { handleImageError } from '../../../utils/image'

// The three groups the home page features (BLOCKER-13). Each is matched to a catalog category by its exact name, so the link
// filters on the real category and the count is real. A name that is not in the catalog falls back to the full product list.
const featured = [
  { name: 'Thuốc bảo vệ thực vật', image: '/images/categories/bvtv.webp', position: 'object-[50%_50%]' },
  { name: 'Phân bón', image: '/images/categories/npk.webp', position: 'object-[50%_50%]' },
  { name: 'Giống cây trồng', image: '/images/categories/hat-giong.webp', position: 'object-[50%_62%]' },
]

interface Panel {
  name: string
  image: string
  position: string
  to: string
  /** Products the catalog lists in this category; null while loading or when unknown. */
  count: number | null
}

const sameName = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

function usePanels(counts: Record<string, number> | null): Panel[] {
  const [categories, setCategories] = useState<CatalogCategory[] | null>(null)
  useEffect(() => {
    // Anything but a list (an error page, a changed contract) leaves the panels on their defaults instead of breaking the page.
    catalogApi
      .getCategories()
      .then((list) => setCategories(Array.isArray(list) ? list : []))
      .catch(() => setCategories([]))
  }, [])

  return featured.map((item) => {
    const category = categories?.find((c) => c.isActive && sameName(c.name, item.name))
    return {
      ...item,
      name: category?.name ?? item.name,
      to: category ? `/products?category=${category.id}` : '/products',
      count: category && counts ? (counts[category.id] ?? 0) : null,
    }
  })
}

const countLabel = (count: number | null) => (count == null ? '' : `${count} sản phẩm đang bán`)
const number = (index: number) => String(index + 1).padStart(2, '0')

/**
 * Desktop with a mouse: three tall photo panels side by side. The one under the pointer (or keyboard focus) widens and
 * shows its name, count and link; the others narrow to a vertical label. The first is open until another is chosen.
 * Widening animates flex-grow (layout) on three elements only; the global reduced-motion rule shortens it to 150ms.
 */
function Panels({ panels }: { panels: Panel[] }) {
  const [active, setActive] = useState(0)
  return (
    <ul className="mt-12 md:mt-16 flex gap-3 h-[clamp(420px,64vh,620px)]">
      {panels.map((panel, index) => {
        const on = index === active
        return (
          <li
            key={panel.name}
            className="relative min-w-0 basis-0 overflow-hidden rounded-[var(--radius-surface)] bg-brand-dark transition-[flex-grow] duration-[var(--dur-large)] ease-[var(--motion-ease-out)]"
            style={{ flexGrow: on ? 3.2 : 1 }}
          >
            <Link
              to={panel.to}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              aria-label={`${panel.name}${panel.count == null ? '' : `, ${countLabel(panel.count)}`}. Khám phá`}
              className="group absolute inset-0 block outline-none"
            >
              <img
                src={panel.image}
                alt=""
                loading="lazy"
                decoding="async"
                onError={handleImageError}
                className={`absolute inset-0 w-full h-full object-cover ${panel.position} transition-transform duration-[var(--dur-large)] ease-[var(--motion-ease-out)] ${
                  on ? 'scale-100' : 'scale-[1.08]'
                }`}
              />
              {/* Solid tint, not a gradient: darker while closed so the vertical label reads. */}
              <span
                aria-hidden="true"
                className={`absolute inset-0 bg-brand-dark transition-opacity duration-[var(--dur-large)] ${on ? 'opacity-45' : 'opacity-60 group-hover:opacity-50'}`}
              />

              <span aria-hidden="true" className="absolute left-6 top-6 text-[13px] tracking-[0.16em] text-white/85 tabular-nums">
                {number(index)}
              </span>

              {/* Closed: the name runs up the left edge. */}
              <span
                aria-hidden="true"
                className={`absolute left-5 bottom-6 [writing-mode:vertical-rl] rotate-180 whitespace-nowrap text-2xl font-normal tracking-tight text-white transition-opacity duration-[var(--dur-standard)] ${
                  on ? 'opacity-0' : 'opacity-100 delay-150'
                }`}
              >
                {panel.name}
              </span>

              {/* Open: big name, count and call to action. Fades in once the panel has mostly widened. */}
              <span
                aria-hidden="true"
                className={`absolute left-8 bottom-8 w-[min(34rem,calc(100%-4rem))] transition-[opacity,transform] ease-[var(--motion-ease-out)] ${
                  on ? 'opacity-100 translate-y-0 duration-[var(--dur-large)] delay-200' : 'opacity-0 translate-y-4 duration-[var(--dur-micro)]'
                }`}
              >
                <span className="block text-[clamp(2.25rem,3.4vw,3.5rem)] leading-[1.04] font-light tracking-tight text-white">{panel.name}</span>
                <span className="mt-3 block min-h-[1.5em] text-base text-white">{countLabel(panel.count)}</span>
                <span className="mt-6 inline-flex items-center gap-2 min-h-[48px] px-6 rounded-full bg-white text-brand-dark text-base">
                  Khám phá
                  <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-standard)] group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </span>

              {/* Keyboard focus ring, drawn inside the panel: an outline would be hidden under the photo layers. */}
              <span aria-hidden="true" className="pointer-events-none absolute inset-3 z-10 border-2 border-white opacity-0 group-focus-visible:opacity-100" />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

/** Phones, tablets and touch screens: the same three categories as plain photo cards. */
function Cards({ panels }: { panels: Panel[] }) {
  return (
    <ul className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-8">
      {panels.map((panel, index) => (
        <Reveal as="li" key={panel.name} delay={index * 0.08}>
          <Link to={panel.to} className="focus-ring group block">
            <div className="aspect-[16/10] md:aspect-[3/4] overflow-hidden rounded-[var(--radius-surface)] bg-brand-light">
              <img
                src={panel.image}
                alt=""
                loading="lazy"
                decoding="async"
                onError={handleImageError}
                className={`w-full h-full object-cover ${panel.position} transition-transform duration-[var(--dur-image)] ease-[var(--motion-ease-out)] group-hover:scale-[1.04]`}
              />
            </div>
            <div className="mt-4 flex items-start justify-between gap-4 border-t border-brand-dark/15 pt-4">
              <div className="min-w-0">
                <p className="text-[13px] tracking-[0.16em] text-text-muted tabular-nums">{number(index)}</p>
                <h3 className="mt-1 text-xl font-normal tracking-tight text-text-primary">{panel.name}</h3>
                <p className="mt-1 min-h-[1.5em] text-[15px] text-text-secondary">{countLabel(panel.count)}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 min-h-[44px] text-[15px] text-text-primary shrink-0">
                Khám phá
                <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-standard)] group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </ul>
  )
}

interface CategoryGridProps {
  /** Number of catalog products per category id; null while the catalog is loading or if it failed. */
  counts: Record<string, number> | null
}

export default function CategoryGrid({ counts }: CategoryGridProps) {
  const panels = usePanels(counts)
  // Hover-to-open needs a real pointer; touch screens of any width get the cards.
  const hoverPanels = useMediaQuery('(min-width: 1024px) and (hover: hover) and (pointer: fine)')

  return (
    <section aria-labelledby="home-categories-title" className="w-full py-20 md:py-28 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <Reveal as="p" y={12} className="text-[13px] uppercase tracking-[0.16em] text-text-secondary mb-4">
              Nhóm vật tư
            </Reveal>
            <LineReveal
              id="home-categories-title"
              lines={['Trang bị toàn diện', 'cho mọi mùa vụ.']}
              className="text-[clamp(2.75rem,7vw,7rem)] leading-[0.98] font-light tracking-[-0.02em] text-text-primary"
            />
          </div>
          <Reveal delay={0.3} y={12} className="shrink-0 lg:pb-3">
            <Link to="/products" className="focus-ring inline-flex items-center gap-2 min-h-[44px] text-[15px] text-text-primary hover:underline underline-offset-4">
              Xem tất cả vật tư
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        {hoverPanels ? <Panels panels={panels} /> : <Cards panels={panels} />}
      </div>
    </section>
  )
}
