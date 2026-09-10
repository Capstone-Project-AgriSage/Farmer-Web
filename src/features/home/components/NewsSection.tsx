import { Link } from 'react-router-dom'
import ArticleCard from '../../../components/ui/ArticleCard'
import type { Article } from '../../../data/mockArticles'

export default function NewsSection({ articles }: { articles: Article[] }) {
  return (
    <section className="w-full py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
              BẢN TIN NÔNG NGHIỆP &amp; DỊCH BỆNH VÙNG
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Cập Nhật Kỹ Thuật Mùa Vụ Mới Nhất
            </h2>
          </div>
          <Link
            to="/knowledge"
            className="text-sm font-semibold text-primary hover:text-primary-dark flex items-center gap-1 hover:underline"
          >
            <span>Xem tất cả bài viết</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}
