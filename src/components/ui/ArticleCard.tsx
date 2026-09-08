import type { Article } from '../../data/mockArticles'

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <div className="bg-surface-subtle rounded-xl border border-border-subtle overflow-hidden hover:shadow-card transition-all group flex flex-col justify-between">
      <div className="p-5">
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold mb-3 ${article.badge.className}`}
        >
          <span className="material-symbols-outlined text-[14px]">{article.badge.icon}</span>
          <span>{article.badge.label}</span>
        </div>
        <h3 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors leading-snug mb-2">
          {article.title}
        </h3>
        <p className="text-xs text-text-secondary leading-relaxed">{article.summary}</p>
      </div>
      <div className="px-5 py-3 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted">
        <span>{article.date}</span>
        <span className="text-primary font-semibold flex items-center gap-0.5 group-hover:underline">
          Chi tiết <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </span>
      </div>
    </div>
  )
}
