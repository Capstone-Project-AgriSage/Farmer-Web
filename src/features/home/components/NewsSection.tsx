import { Link } from 'react-router-dom'
import ArticleCard from '../../../components/ui/ArticleCard'
import type { Article } from '../../../data/mockArticles'

export default function NewsSection({ articles }: { articles: Article[] }) {
  return (
    <section className="w-full py-16 md:py-20 bg-brand-cream border-t border-brand-dark/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 md:mb-12 gap-4">
          <div className="max-w-xl">
            <p className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-2 font-helvetica-neue">
              Bản tin nông nghiệp &amp; dịch bệnh vùng
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-helvetica-neue tracking-tight text-brand-dark leading-[1.15]">
              Cập nhật kỹ thuật mùa vụ mới nhất
            </h2>
          </div>
          <Link
            to="/knowledge"
            className="text-sm text-brand-dark/60 hover:text-brand-dark flex items-center gap-1 tracking-wide transition-colors shrink-0"
          >
            <span>Xem tất cả bài viết</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}
