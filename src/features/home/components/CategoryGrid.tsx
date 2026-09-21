import { ArrowRight } from 'lucide-react'
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
    <section className="w-full py-16 md:py-20 bg-brand-light border-y border-brand-dark/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-2 font-helvetica-neue">
              Danh mục vật tư
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-brand-dark tracking-tight font-helvetica-neue leading-[1.15]">
              Trang bị toàn diện cho mọi mùa vụ
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-brand-dark/70 hover:text-brand-dark transition-colors tracking-wide"
          >
            Xem tất cả
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?group=${encodeURIComponent(cat.group)}`}
              className="group bg-brand-cream border border-brand-dark/10 hover:border-brand-dark/30 transition-all duration-300 p-6 flex items-center gap-5"
            >
              <div className="w-[4.5rem] h-[4.5rem] bg-white border border-brand-dark/10 flex items-center justify-center p-2 shrink-0">
                <img
                  src={cat.image}
                  alt={cat.name}
                  onError={handleImageError}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-brand-dark group-hover:text-brand-green transition-colors leading-snug">
                  {cat.name}
                </h3>
                <p className="text-xs text-brand-dark/50 mt-1.5">{cat.count}</p>
                <div className="text-xs text-brand-dark/60 mt-3 flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                  <span>Khám phá</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
