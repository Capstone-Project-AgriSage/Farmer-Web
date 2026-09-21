import { products } from '../../data/mockProducts'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import HeroSection from './components/HeroSection'
import AiDiagnosisBanner from './components/AiDiagnosisBanner'
import CategoryGrid from './components/CategoryGrid'
import FeaturedProducts from './components/FeaturedProducts'
import CommitmentSection from './components/CommitmentSection'

export default function HomePage() {
  useDocumentTitle()

  return (
    <div className="bg-brand-cream text-brand-dark">
      <HeroSection />
      <AiDiagnosisBanner />
      <CategoryGrid />
      <FeaturedProducts products={products.slice(0, 4)} />
      <CommitmentSection />
    </div>
  )
}
