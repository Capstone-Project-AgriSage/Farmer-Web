import { products } from '../../data/mockProducts'
import { articles } from '../../data/mockArticles'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import HeroSection from './components/HeroSection'
import AiDiagnosisBanner from './components/AiDiagnosisBanner'
import CategoryGrid from './components/CategoryGrid'
import FeaturedProducts from './components/FeaturedProducts'
import CommitmentSection from './components/CommitmentSection'
import NewsSection from './components/NewsSection'

export default function HomePage() {
  useDocumentTitle()

  return (
    <>
      <HeroSection />
      <AiDiagnosisBanner />
      <CategoryGrid />
      <FeaturedProducts products={products.slice(0, 4)} />
      <CommitmentSection />
      <NewsSection articles={articles.slice(0, 3)} />
    </>
  )
}
