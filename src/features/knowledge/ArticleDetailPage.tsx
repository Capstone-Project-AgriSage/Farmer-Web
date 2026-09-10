import { Link, useParams } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import AiDiagnosisCallout from '../../components/ui/AiDiagnosisCallout'
import { getArticleBySlug } from '../../data/mockArticles'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const article = getArticleBySlug(slug ?? '')

  useDocumentTitle(article ? article.title : 'Không tìm thấy bài viết')

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-text-primary">Không tìm thấy bài viết</h1>
        <Link to="/knowledge" className="text-primary font-semibold hover:underline mt-2 inline-block">
          Quay lại Kiến thức nông nghiệp
        </Link>
      </div>
    )
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Trang chủ', to: '/' },
          { label: 'Kiến thức', to: '/knowledge' },
          { label: article.title },
        ]}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold mb-4 ${article.badge.className}`}
        >
          <span className="material-symbols-outlined text-[14px]">{article.badge.icon}</span>
          <span>{article.badge.label}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight leading-snug">
          {article.title}
        </h1>
        <div className="text-xs text-text-muted mt-3 pb-6 border-b border-border-subtle">{article.date}</div>
        <div className="space-y-4 pt-6 text-sm text-text-secondary leading-relaxed">
          {article.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
        <Link
          to="/knowledge"
          className="inline-flex items-center gap-1.5 mt-8 text-sm font-semibold text-primary hover:underline"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Quay lại Kiến thức nông nghiệp</span>
        </Link>
        <AiDiagnosisCallout
          title="Cần tư vấn kỹ thuật cho tình huống cụ thể của vườn nhà?"
          subtitle="Chụp ảnh lá gửi Bác sĩ AI hoặc gọi hotline kỹ sư nông học để được tư vấn miễn phí."
        />
      </div>
    </>
  )
}
