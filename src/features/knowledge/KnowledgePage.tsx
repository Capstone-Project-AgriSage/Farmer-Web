import Breadcrumb from '../../components/ui/Breadcrumb'
import AiDiagnosisCallout from '../../components/ui/AiDiagnosisCallout'
import ArticleCard from '../../components/ui/ArticleCard'
import { articles } from '../../data/mockArticles'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export default function KnowledgePage() {
  useDocumentTitle('Kiến thức nông nghiệp')

  return (
    <div className="bg-brand-cream text-brand-dark">
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Kiến thức' }]} />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-14">
        <div className="mb-10 md:mb-12 max-w-2xl">
          <p className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-2 font-helvetica-neue">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        <AiDiagnosisCallout
          title="Cần tư vấn kỹ thuật cho tình huống cụ thể của vườn nhà?"
          subtitle="Chụp ảnh lá gửi Bác sĩ AI hoặc gọi hotline kỹ sư nông học để được tư vấn miễn phí."
        />
      </div>
    </div>
  )
}
