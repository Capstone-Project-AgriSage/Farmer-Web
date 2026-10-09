import { useEffect, useState } from 'react'
import { LazyMotion, domAnimation } from 'framer-motion'
import { catalogApi } from '../../api/catalogApi'
import type { Product } from '../../types'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { toProductCard } from '../products/catalogMapping'
import SmoothScroll from '../../motion/SmoothScroll'
import HeroSection from './components/HeroSection'
import MemberStrip from './components/MemberStrip'
import ScrollProgress from '../../motion/ScrollProgress'
import GalleryBand from './components/GalleryBand'
import CategoryGrid from './components/CategoryGrid'
import FeaturedProducts from './components/FeaturedProducts'
import WeatherSection from './components/WeatherSection'
import FaqSection from './components/FaqSection'
import FinaleSection from './components/FinaleSection'

export default function HomePage() {
  useDocumentTitle()
  const [featured, setFeatured] = useState<Product[]>([])
  // Products per category id, for the counts on the category panels.
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number> | null>(null)

  useEffect(() => {
    // One store's catalog is small: one call (API max page size) feeds both the featured strip and the category counts.
    catalogApi.getProducts({ pageSize: 100 })
      .then((res) => {
        setFeatured(res.items.filter((p) => p.fromPrice != null).slice(0, 10).map(toProductCard))
        const counts: Record<string, number> = {}
        for (const item of res.items) if (item.categoryId) counts[item.categoryId] = (counts[item.categoryId] ?? 0) + 1
        setCategoryCounts(counts)
      })
      .catch(() => {
        setFeatured([])
        setCategoryCounts(null)
      })
  }, [])

  return (
    <LazyMotion features={domAnimation} strict>
      <SmoothScroll />
      <ScrollProgress />
      <div className="bg-brand-cream text-brand-dark">
        <HeroSection />
        <MemberStrip />
        <CategoryGrid counts={categoryCounts} />
        {featured.length > 0 && <FeaturedProducts products={featured} />}
        <WeatherSection />
        <GalleryBand />
        <FaqSection />
        <FinaleSection />
      </div>
    </LazyMotion>
  )
}
