import { Link } from 'react-router-dom'
import { handleImageError } from '../../../utils/image'
import type { ProductGroup } from '../../../types'

const categories: { name: string; group: ProductGroup; count: string; image: string }[] = [
  {
    name: 'Phân bón NPK & Vi lượng',
    group: 'Phân bón NPK & Vi lượng',
    count: '240+ sản phẩm',
    image: '/images/categories/npk.jpg',
  },
  {
    name: 'Thuốc BVTV & Diệt nấm',
    group: 'Thuốc BVTV & Trừ nấm',
    count: '180+ sản phẩm',
    image: '/images/categories/bvtv.jpg',
  },
  {
    name: 'Phân hữu cơ vi sinh',
    group: 'Phân hữu cơ vi sinh',
    count: '95+ sản phẩm',
    image: '/images/categories/huu-co.jpg',
  },
  {
    name: 'Hạt giống & Cây giống',
    group: 'Hạt giống & Cây giống',
    count: '120+ loại',
    image: '/images/categories/hat-giong.jpg',
  },
  {
    name: 'Tưới nhỏ giọt & Thiết bị',
    group: 'Tưới nhỏ giọt & Thiết bị',
    count: '70+ phụ kiện',
    image: '/images/categories/tuoi-nho-giot.jpg',
  },
  {
    name: 'Thuốc trừ sâu sinh học',
    group: 'Thuốc trừ sâu sinh học',
    count: '110+ sản phẩm',
    image: '/images/categories/sinh-hoc.jpg',
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?group=${encodeURIComponent(cat.group)}`}
              className="group bg-white p-5 rounded-xl border border-border-subtle hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md text-center flex flex-col items-center justify-between"
            >
              <img
                src={cat.image}
                alt={cat.name}
                onError={handleImageError}
                className="w-16 h-16 object-contain mb-3 group-hover:scale-110 transition-transform duration-300"
              />
              <h3 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-primary transition-colors leading-snug">
                {cat.name}
              </h3>
              <span className="text-[11px] text-text-muted mt-1">{cat.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
