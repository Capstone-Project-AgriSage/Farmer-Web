import { useEffect, useState } from 'react'
import { catalogApi } from '../../api/catalogApi'
import type { Product } from '../../types'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { toProductCard } from '../products/catalogMapping'
import HeroSection from './components/HeroSection'
import AiDiagnosisBanner from './components/AiDiagnosisBanner'
import CategoryGrid from './components/CategoryGrid'
import FeaturedProducts from './components/FeaturedProducts'
import CommitmentSection from './components/CommitmentSection'

export default function HomePage() {
  useDocumentTitle()
  const [featured, setFeatured] = useState<Product[]>([])

  useEffect(() => {
    catalogApi.getProducts({ pageSize: 8 })
      .then((res) => setFeatured(res.items.filter((p) => p.fromPrice != null).slice(0, 4).map(toProductCard)))
      .catch(() => setFeatured([]))
  }, [])

  return (
    <div className="bg-brand-cream text-brand-dark">
      <HeroSection />
      <AiDiagnosisBanner />
      <CategoryGrid />
      {featured.length > 0 && <FeaturedProducts products={featured} />}
      <CommitmentSection />
    </div>
  )
}
