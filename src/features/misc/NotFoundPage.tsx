import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export default function NotFoundPage() {
  useDocumentTitle('Không tìm thấy trang')

  return (
    <div className="bg-brand-cream text-brand-dark">
      <div className="max-w-2xl mx-auto px-6 lg:px-8 py-20 sm:py-28 text-center">
        <span className="material-symbols-outlined text-brand-green text-5xl">eco</span>
        <div className="text-6xl sm:text-7xl font-helvetica-neue tracking-tight text-brand-dark mt-3">404</div>
        <h1 className="text-xl sm:text-2xl font-helvetica-neue tracking-tight text-brand-dark mt-4">
          Không tìm thấy trang bạn cần
        </h1>
        <p className="text-base text-brand-dark/60 mt-3 leading-relaxed max-w-md mx-auto">
          Đường dẫn này không tồn tại hoặc đã được di chuyển. Bà con thử quay lại trang chủ hoặc tiếp
          tục xem vật tư nông nghiệp nhé.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Link
            to="/"
            className="px-6 py-2.5 bg-brand-dark hover:bg-brand-green text-white text-sm tracking-wide uppercase rounded-full transition-colors inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            <span>Về trang chủ</span>
          </Link>
          <Link
            to="/products"
            className="px-6 py-2.5 border border-brand-dark/20 text-brand-dark hover:border-brand-dark/40 text-sm tracking-wide uppercase rounded-full transition-colors inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span>Xem vật tư nông nghiệp</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
