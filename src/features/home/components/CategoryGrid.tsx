import { Link } from 'react-router-dom'
import { handleImageError } from '../../../utils/image'
import type { ProductGroup } from '../../../types'

const categories: { name: string; group: ProductGroup; count: string; image: string }[] = [
  {
    name: 'Thuốc Đặc Trị Nấm & Khuẩn',
    group: 'Thuốc đặc trị nấm & diệt khuẩn',
    count: '6 sản phẩm chuẩn',
    image: '/images/categories/bvtv.jpg',
  },
  {
    name: 'Phân Bón NPK & Dinh Dưỡng Lúa',
    group: 'Phân bón NPK & Dinh dưỡng lúa',
    count: '2 dòng chủ lực',
    image: '/images/categories/npk.jpg',
  },
  {
    name: 'Lúa Giống Xác Nhận',
    group: 'Lúa giống xác nhận',
    count: 'Chuẩn thuần F1',
    image: '/images/categories/hat-giong.jpg',
  },
]

export default function CategoryGrid() {
  return (
    <section className="w-full py-12 bg-surface-subtle border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
              DANH MỤC VẬT TƯ CHỦ LỰC
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Trang Bị Toàn Diện Cho Mọi Mùa Vụ
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-primary hover:text-primary-dark flex items-center gap-1 hover:underline"
          >
            <span>Xem tất cả danh mục</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?group=${encodeURIComponent(cat.group)}`}
              className="group bg-white p-6 rounded-2xl border border-border-subtle hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-5"
            >
              <div className="w-20 h-20 rounded-xl bg-slate-50 border border-border-subtle/80 flex items-center justify-center p-2 shrink-0 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  onError={handleImageError}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors leading-snug">
                  {cat.name}
                </h3>
                <p className="text-xs text-text-muted mt-1">{cat.count}</p>
                <div className="text-xs font-semibold text-primary mt-2 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Khám phá</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
