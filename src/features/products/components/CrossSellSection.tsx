import { Link } from 'react-router-dom'
import ProductCard from '../../../components/ui/ProductCard'
import type { Product } from '../../../types'

export default function CrossSellSection({ products }: { products: Product[] }) {
  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <p className="text-xs tracking-[0.25em] text-brand-dark/50 mb-2 font-helvetica-neue">Gợi ý mua kèm</p>
          <h3 className="text-lg sm:text-xl font-helvetica-neue tracking-tight text-brand-dark">
            Sản phẩm cùng danh mục
          </h3>
        </div>
        <Link
          to="/products"
          className="text-xs text-brand-dark/70 hover:text-brand-dark tracking-wide transition-colors flex items-center gap-1 shrink-0"
        >
          <span>Xem tất cả sản phẩm</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  )
}
