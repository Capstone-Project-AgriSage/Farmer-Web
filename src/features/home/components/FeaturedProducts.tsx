import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '../../../components/ui/ProductCard'
import Reveal from '../../../components/ui/Reveal'
import SectionHeader from '../../../components/ui/SectionHeader'
import { useMotionPolicy } from '../../../motion/useMotionPolicy'
import type { Product } from '../../../types'

const arrowClass =
  'focus-ring inline-flex absolute top-[34%] z-10 w-11 h-11 sm:w-12 sm:h-12 items-center justify-center rounded-full bg-brand-dark text-white shadow-[0_2px_10px_rgb(0,0,0,0.25)] hover:bg-brand-green transition-[opacity,background-color] duration-200 disabled:opacity-35 disabled:pointer-events-none'

export default function FeaturedProducts({ products }: { products: Product[] }) {
  const policy = useMotionPolicy()
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const updateArrows = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    setCanPrev(track.scrollLeft > 4)
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    updateArrows()
    track.addEventListener('scroll', updateArrows, { passive: true })
    const observer = new ResizeObserver(updateArrows)
    observer.observe(track)
    return () => {
      track.removeEventListener('scroll', updateArrows)
      observer.disconnect()
    }
  }, [updateArrows, products.length])

  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const behavior = policy === 'none' ? 'auto' : 'smooth'
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4
    // At the last page, next goes back to the first one.
    if (direction === 1 && atEnd) track.scrollTo({ left: 0, behavior })
    else track.scrollBy({ left: direction * track.clientWidth * 0.9, behavior })
  }

  return (
    <section className="w-full py-20 md:py-28 bg-brand-light border-t border-brand-dark/10" id="products">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          eyebrow="Sản phẩm chính hãng"
          title="Vật tư & nông dược bán chạy"
          linkLabel="Xem toàn bộ cửa hàng"
          linkTo="/products"
        >
          <span className="text-[15px] text-text-secondary">100% hóa đơn VAT &amp; tem chống hàng giả</span>
        </SectionHeader>

        {/* About 5 products in view on desktop; the rest scroll in with the arrows, swipe or keyboard. */}
        <div className="relative mt-6 md:mt-10">
          <button type="button" onClick={() => scrollByPage(-1)} disabled={!canPrev} aria-label="Sản phẩm trước" className={`${arrowClass} left-1 sm:left-0 sm:-translate-x-1/2`}>
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => scrollByPage(1)} disabled={!canPrev && !canNext} aria-label="Sản phẩm tiếp theo" className={`${arrowClass} right-1 sm:right-0 sm:translate-x-1/2`}>
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>

          <div
            ref={trackRef}
            style={{ '--pv-sm': Math.min(2, products.length), '--pv-md': Math.min(3, products.length), '--pv-lg': Math.min(5, products.length) } as React.CSSProperties}
            className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-px-4 pt-10 pb-2 px-4 -mx-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {products.map((product, index) => (
              <Reveal
                key={product.slug}
                delay={(index % 5) * 0.08}
                className="shrink-0 snap-start w-[70%] sm:w-[calc((100%-(var(--pv-sm)-1)*1.5rem)/var(--pv-sm))] md:w-[calc((100%-(var(--pv-md)-1)*1.5rem)/var(--pv-md))] lg:w-[calc((100%-(var(--pv-lg)-1)*1.5rem)/var(--pv-lg))]"
              >
                <ProductCard product={product} showcase={index % 2 === 0 ? 'left' : 'right'} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
