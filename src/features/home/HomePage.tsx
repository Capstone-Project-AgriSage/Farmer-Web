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
import UseCasesSection from './components/UseCasesSection'
import ProcessSection from './components/ProcessSection'
import GalleryBand from './components/GalleryBand'
import CategoryGrid from './components/CategoryGrid'
import FeaturedProducts from './components/FeaturedProducts'
import WeatherSection from './components/WeatherSection'
import FaqSection from './components/FaqSection'
import CommitmentSection from './components/CommitmentSection'

export default function HomePage() {
  useDocumentTitle()
  const [featured, setFeatured] = useState<Product[]>([])

  useEffect(() => {
    catalogApi.getProducts({ pageSize: 12 })
      .then((res) => setFeatured(res.items.filter((p) => p.fromPrice != null).slice(0, 10).map(toProductCard)))
      .catch(() => setFeatured([]))
  }, [])

  return (
    <LazyMotion features={domAnimation} strict>
      <SmoothScroll />
      <ScrollProgress />
      <div className="bg-brand-cream text-brand-dark">
        <HeroSection />
        <MemberStrip />
        <CategoryGrid />
        {featured.length > 0 && <FeaturedProducts products={featured} />}
        <UseCasesSection />
        <ProcessSection />
        <WeatherSection />
        <GalleryBand />
        <FaqSection />
        <CommitmentSection />
      </div>
    </LazyMotion>
  )
}
