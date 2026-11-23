import Breadcrumb from '../../components/ui/Breadcrumb'
import AiDiagnosisCallout from '../../components/ui/AiDiagnosisCallout'
import ArticleCard from '../../components/ui/ArticleCard'
import { useCallback, useEffect, useState } from 'react'
import { contentApi } from '../../api/contentApi'
import { useContentQuery } from '../../hooks/useContentQuery'
import ContentPagination from '../../components/ui/ContentPagination'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export default function KnowledgePage() {
  useDocumentTitle('Kiến thức nông nghiệp')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const load = useCallback((signal: AbortSignal) => contentApi.articles(page, search, signal), [page, search])
  const { data, error, loading, reload } = useContentQuery(load)
  useEffect(() => { if (data && page > Math.max(1, data.totalPages)) setPage(Math.max(1, data.totalPages)) }, [data, page])

  return (
    <div className="bg-brand-cream text-brand-dark">
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Kiến thức' }]} />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-14">
        <div className="mb-10 md:mb-12 max-w-2xl">
          <p className="text-xs tracking-[0.25em]  text-brand-dark/50 mb-2 font-helvetica-neue">
            Bản tin nông nghiệp &amp; dịch bệnh vùng
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-helvetica-neue tracking-tight text-brand-dark leading-[1.15]">
            Kiến thức &amp; kỹ thuật canh tác
          </h1>
          <p className="text-base text-brand-dark/60 mt-3 leading-relaxed">
            Cập nhật cảnh báo dịch hại theo vùng, quy trình bón phân - phun thuốc chuẩn kỹ sư nông
            học, giúp bà con canh tác hiệu quả và tiết kiệm chi phí mùa vụ.
          </p>
        </div>

        <form onSubmit={e => { e.preventDefault(); const value = new FormData(e.currentTarget).get('search'); setSearch(String(value ?? '').trim()); setPage(1) }} className="flex gap-3 mb-6">
          <input name="search" maxLength={100} aria-label="Tìm bài viết" placeholder="Tìm kiếm bài viết..." className="border border-brand-dark/20 bg-white p-3 flex-1 min-w-0" />
          <button className="bg-brand-dark text-white px-5">Tìm kiếm</button>
        </form>
        {error && <div role="alert">{error} <button onClick={reload} className="underline">Thử lại</button></div>}
        {loading && !data && <p role="status">Đang tải bài viết...</p>}
        {!loading && !error && !data?.items.length && <p>Chưa có bài viết phù hợp.</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {data?.items.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
        {data && <ContentPagination page={page} totalPages={data.totalPages} onChange={setPage} />}

        <AiDiagnosisCallout
          title="Cần tư vấn kỹ thuật cho tình huống cụ thể của vườn nhà?"
          subtitle="Chụp ảnh lá gửi Bác sĩ AI hoặc gọi hotline kỹ sư nông học để được tư vấn miễn phí."
        />
      </div>
    </div>
  )
}
