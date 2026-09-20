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
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-2 font-helvetica-neue">
            Gợi ý mua kèm
          </p>
          <h3 className="text-lg sm:text-xl font-helvetica-neue tracking-tight text-brand-dark">
            Sản phẩm bổ trợ thường dùng kèm
          </h3>
          <p className="text-xs text-brand-dark/55 mt-1">
            Bộ giải pháp phục hồi rễ và tăng cường đề kháng sau khi dập dịch nấm bệnh
          </p>
        </div>
        <Link
          to="/products"
          className="text-xs text-brand-dark/70 hover:text-brand-dark tracking-wide transition-colors flex items-center gap-1 shrink-0"
        >
          <span>Xem tất cả thuốc BVTV</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((p) => (
          <div
            key={p.slug}
            className="bg-white border border-brand-dark/10 hover:border-brand-dark/25 transition-all duration-300 p-4 flex flex-col justify-between group"
          >
            <Link to={`/products/${p.slug}`}>
              <div className="relative mb-3 overflow-hidden bg-brand-cream/50">
                <span className="absolute top-2 left-2 z-10 px-2.5 py-0.5 bg-brand-dark text-white text-[10px] tracking-wide rounded-full">
                  {p.brand}
                </span>
                <img
                  src={p.image}
                  alt={p.name}
                  onError={handleImageError}
                  className="w-full h-40 object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-[10px] uppercase tracking-[0.15em] text-brand-dark/45">
                {p.category}
              </span>
              <h4 className="text-xs font-helvetica-neue tracking-tight text-brand-dark group-hover:text-brand-green transition-colors line-clamp-2 mt-0.5">
                {p.name}
              </h4>
            </Link>
            <div className="pt-3 border-t border-brand-dark/10 mt-3 flex items-center justify-between">
              <div>
                {p.originalPrice && (
                  <div className="text-[10px] text-brand-dark/40 line-through">
                    {formatVnd(p.originalPrice)}
                  </div>
                )}
                <div className="text-sm text-brand-dark tracking-tight">{formatVnd(p.price)}</div>
              </div>
              <button
                onClick={() => onAddToCart(p)}
                className="p-1.5 rounded-full bg-brand-dark hover:bg-brand-green text-white transition-colors"
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
