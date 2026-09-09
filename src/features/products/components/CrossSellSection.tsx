import { Link } from 'react-router-dom'
import { formatVnd } from '../../../data/format'
import { handleImageError } from '../../../utils/image'
import type { Product } from '../../../types'

interface CrossSellSectionProps {
  products: Product[]
  onAddToCart: (product: Product) => void
}

export default function CrossSellSection({ products, onAddToCart }: CrossSellSectionProps) {
  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-primary tracking-tight">
            Sản phẩm bổ trợ thường dùng kèm
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Bộ giải pháp phục hồi rễ và tăng cường đề kháng sau khi dập dịch nấm bệnh
          </p>
        </div>
        <Link to="/products" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
          <span>Xem tất cả thuốc BVTV</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((p) => (
          <div
            key={p.slug}
            className="bg-white rounded-xl border border-border-subtle hover:border-primary hover:shadow-card transition-all p-4 flex flex-col justify-between group"
          >
            <Link to={`/products/${p.slug}`}>
              <div className="relative mb-3 overflow-hidden rounded-lg">
                <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-primary-dark text-white text-[10px] font-bold rounded shadow-sm">
                  {p.brand}
                </span>
                <img
                  src={p.image}
                  alt={p.name}
                  onError={handleImageError}
                  className="w-full h-40 object-contain p-2 bg-surface-subtle rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider">
                {p.category}
              </span>
              <h4 className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2 mt-0.5">
                {p.name}
              </h4>
            </Link>
            <div className="pt-3 border-t border-border-subtle mt-3 flex items-center justify-between">
              <div>
                {p.originalPrice && (
                  <div className="text-[10px] text-text-muted line-through">{formatVnd(p.originalPrice)}</div>
                )}
                <div className="text-sm font-bold text-primary">{formatVnd(p.price)}</div>
              </div>
              <button
                onClick={() => onAddToCart(p)}
                className="p-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white transition-colors"
                title="Thêm"
                aria-label={`Thêm ${p.name} vào giỏ hàng`}
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
