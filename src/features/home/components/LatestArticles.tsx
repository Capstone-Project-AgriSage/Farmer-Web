import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { contentApi } from '../../../api/contentApi'
import { useContentQuery } from '../../../hooks/useContentQuery'
import ArticleCard from '../../../components/ui/ArticleCard'

export default function LatestArticles() {
  const load = useCallback((signal: AbortSignal) => contentApi.articles(1, '', signal), [])
  const { data } = useContentQuery(load)
  if (!data?.items.length) return null
  return <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
    <div className="flex justify-between items-center gap-4 mb-6"><h2 className="text-2xl font-helvetica-neue">Kiến thức mới</h2><Link className="text-sm underline" to="/knowledge">Xem tất cả bài viết</Link></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{data.items.slice(0, 3).map(article => <ArticleCard key={article.id} article={article} />)}</div>
  </section>
}
