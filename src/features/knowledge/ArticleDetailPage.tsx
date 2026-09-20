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
      <div className="bg-brand-cream text-brand-dark">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16 md:py-20 text-center">
          <h1 className="text-xl font-helvetica-neue tracking-tight text-brand-dark">
            Không tìm thấy bài viết
          </h1>
          <Link
            to="/knowledge"
            className="inline-flex items-center gap-1.5 mt-4 text-sm text-brand-dark/60 hover:text-brand-dark tracking-wide transition-colors"
          >
            Quay lại Kiến thức nông nghiệp
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-brand-cream text-brand-dark">
      <Breadcrumb
        items={[
          { label: 'Trang chủ', to: '/' },
          { label: 'Kiến thức', to: '/knowledge' },
          { label: article.title },
        ]}
      />
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-10 md:py-14">
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs tracking-wide mb-5 border border-brand-dark/10 bg-brand-light text-brand-dark/70`}
        >
          <span className="material-symbols-outlined text-[14px]">{article.badge.icon}</span>
          <span>{article.badge.label}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-helvetica-neue tracking-tight text-brand-dark leading-[1.2]">
          {article.title}
        </h1>
        <div className="text-xs tracking-wide text-brand-dark/50 mt-4 pb-6 border-b border-brand-dark/10">
          {article.date}
        </div>
        <div className="space-y-4 pt-6 text-base text-brand-dark/60 leading-relaxed">
          {article.content.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
        <Link
          to="/knowledge"
          className="inline-flex items-center gap-1.5 mt-10 text-sm text-brand-dark/60 hover:text-brand-dark tracking-wide transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Quay lại Kiến thức nông nghiệp</span>
        </Link>
        <AiDiagnosisCallout
          title="Cần tư vấn kỹ thuật cho tình huống cụ thể của vườn nhà?"
          subtitle="Chụp ảnh lá gửi Bác sĩ AI hoặc gọi hotline kỹ sư nông học để được tư vấn miễn phí."
        />
      </div>
    </div>
  )
}
