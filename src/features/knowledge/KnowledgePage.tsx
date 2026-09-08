import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
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
            <div
              key={article.title}
              className="bg-surface-subtle rounded-xl border border-border-subtle overflow-hidden hover:shadow-card transition-all group flex flex-col justify-between"
            >
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
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-gradient-to-r from-emerald-50 via-surface-secondary to-primary-light border border-primary/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-md flex-shrink-0">
              <span className="material-symbols-outlined text-[26px]">psychology</span>
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-text-primary">
                Cần tư vấn kỹ thuật cho tình huống cụ thể của vườn nhà?
              </h4>
              <p className="text-xs text-text-secondary mt-0.5">
                Chụp ảnh lá gửi Bác sĩ AI hoặc gọi hotline kỹ sư nông học để được tư vấn miễn phí.
              </p>
            </div>
          </div>
          <Link
            to="/ai-doctor"
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            <span>Quét lá cây với AI</span>
          </Link>
        </div>
      </div>
    </>
  )
}
