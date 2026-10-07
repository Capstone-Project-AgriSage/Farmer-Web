import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reveal from '../../../components/ui/Reveal'
import SectionHeader from '../../../components/ui/SectionHeader'
import { articles } from '../../../data/mockArticles'

// The first three farmer-facing articles of the Knowledge page (/knowledge); the ones written for dealers are left out.
const featured = articles.filter((article) => article.badge.label !== 'Dành cho đại lý').slice(0, 3)

export default function ArticlesSection() {
  return (
    <section className="w-full py-20 md:py-28 bg-brand-light border-t border-brand-dark/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader eyebrow="Kiến thức nhà nông" title="Đọc nhanh trước khi ra ruộng" linkLabel="Xem tất cả bài viết" linkTo="/knowledge" />

        <ul className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10">
          {featured.map((article, index) => (
            <Reveal as="li" key={article.slug} delay={index * 0.12} y={24}>
              <Link to={`/knowledge/${article.slug}`} className="focus-ring group flex flex-col h-full border-t border-brand-dark/20 pt-5 hover:border-brand-dark transition-colors duration-[var(--dur-standard)]">
                <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.16em] text-text-secondary">
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                    {article.badge.icon}
                  </span>
                  {article.badge.label}
                </span>
                <h3 className="mt-4 text-xl md:text-[22px] font-normal leading-snug tracking-tight text-text-primary transition-transform duration-[var(--dur-standard)] ease-[var(--motion-ease-out)] group-hover:translate-x-1">
                  {article.title}
                </h3>
                <p className="mt-3 text-[15px] md:text-base text-text-secondary leading-relaxed line-clamp-3">{article.summary}</p>
                <div className="mt-auto pt-6 flex items-center justify-between text-[15px] text-text-secondary">
                  <span>{article.date}</span>
                  <span className="inline-flex items-center gap-1.5 text-text-primary">
                    Đọc tiếp
                    <ArrowRight className="w-4 h-4 transition-transform duration-[var(--dur-standard)] ease-[var(--motion-ease-out)] group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
