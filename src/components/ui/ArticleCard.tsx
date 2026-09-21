import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Article } from '../../data/mockArticles'

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      to={`/knowledge/${article.slug}`}
      className="bg-brand-light border border-brand-dark/10 overflow-hidden hover:border-brand-dark/25 transition-all group flex flex-col justify-between"
    >
      <div className="p-6">
        <div className="inline-flex items-center gap-1.5 text-xs tracking-[0.2em] uppercase text-brand-dark/50 mb-4">
          <span className="material-symbols-outlined text-[14px]">{article.badge.icon}</span>
          <span>{article.badge.label}</span>
        </div>
        <h3 className="text-base md:text-lg text-brand-dark group-hover:text-brand-green transition-colors leading-snug mb-2 font-helvetica-neue tracking-tight">
          {article.title}
        </h3>
        <p className="text-sm text-brand-dark/60 leading-relaxed">{article.summary}</p>
      </div>
      <div className="px-6 py-3.5 border-t border-brand-dark/10 flex items-center justify-between text-xs text-brand-dark/50">
        <span>{article.date}</span>
        <span className="text-brand-dark flex items-center gap-1 group-hover:gap-2 transition-all">
          Chi tiết <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </Link>
  )
}
