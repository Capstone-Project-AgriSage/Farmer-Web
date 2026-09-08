import Breadcrumb from '../../components/ui/Breadcrumb'
import AiDiagnosisCallout from '../../components/ui/AiDiagnosisCallout'
import ArticleCard from '../../components/ui/ArticleCard'
import { articles } from '../../data/mockArticles'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export default function KnowledgePage() {
  useDocumentTitle('Kiến thức nông nghiệp')

  return (
    <>
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Kiến thức' }]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
            BẢN TIN NÔNG NGHIỆP &amp; DỊCH BỆNH VÙNG
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Kiến Thức &amp; Kỹ Thuật Canh Tác
          </h1>
          <p className="text-sm text-text-secondary mt-1 max-w-2xl">
            Cập nhật cảnh báo dịch hại theo vùng, quy trình bón phân - phun thuốc chuẩn kỹ sư nông
            học, giúp bà con canh tác hiệu quả và tiết kiệm chi phí mùa vụ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.title} article={article} />
          ))}
        </div>

        <AiDiagnosisCallout
          title="Cần tư vấn kỹ thuật cho tình huống cụ thể của vườn nhà?"
          subtitle="Chụp ảnh lá gửi Bác sĩ AI hoặc gọi hotline kỹ sư nông học để được tư vấn miễn phí."
        />
      </div>
    </>
  )
}
