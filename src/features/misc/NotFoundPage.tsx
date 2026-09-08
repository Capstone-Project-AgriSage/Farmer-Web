import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export default function NotFoundPage() {
  useDocumentTitle('Không tìm thấy trang')

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 sm:py-28 text-center">
      <span className="material-symbols-outlined text-primary text-6xl">eco</span>
      <div className="text-6xl sm:text-7xl font-extrabold text-primary tracking-tight mt-2">404</div>
      <h1 className="text-xl sm:text-2xl font-bold text-text-primary mt-3">
        Không tìm thấy trang bạn cần
      </h1>
      <p className="text-sm text-text-secondary mt-2 leading-relaxed">
        Đường dẫn này không tồn tại hoặc đã được di chuyển. Bà con thử quay lại trang chủ hoặc tiếp
        tục xem vật tư nông nghiệp nhé.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        <Link
          to="/"
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg shadow-sm transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">home</span>
          <span>Về trang chủ</span>
        </Link>
        <Link
          to="/products"
          className="px-5 py-2.5 border border-primary text-primary hover:bg-primary-light text-sm font-semibold rounded-lg transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">storefront</span>
          <span>Xem vật tư nông nghiệp</span>
        </Link>
      </div>
    </div>
  )
}
