import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import { formatVnd } from '../../data/format'
import { useCart } from '../../context/CartContext'
import { handleImageError } from '../../utils/image'
import { stockStatusTone } from '../../utils/stockStatus'

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const tone = stockStatusTone(product.stockStatus)
  const outOfStock = product.stockStatus === 'Hết hàng'

  return (
    <div className="bg-white rounded-2xl border border-border-subtle hover:border-[#2E7D32] hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      <Link
        to={`/products/${product.slug}`}
        className="relative p-4 bg-white flex items-center justify-center h-44 overflow-hidden"
      >
        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-[#2E7D32] text-white text-[10px] font-bold rounded-md z-10">
          {product.brand}
        </span>
        <img
          src={product.image}
          alt={product.name}
          onError={handleImageError}
          className="w-full h-full object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform duration-200"
        />
        <span className={`absolute bottom-2 right-2 px-2 py-0.5 ${tone.badgeBg} ${tone.text} text-[10px] font-semibold rounded-md flex items-center gap-1 z-10`}>
          <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`}></span> {product.stockLabel}
        </span>
      </Link>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] text-text-muted uppercase font-semibold tracking-wider mb-1">
            {product.category}
          </div>
          <Link to={`/products/${product.slug}`}>
            <h3 className="text-sm font-bold text-text-primary group-hover:text-[#2E7D32] transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-text-secondary mt-1 truncate">
            {product.activeIngredient ? `Hoạt chất: ${product.activeIngredient}` : product.packaging}
          </p>
        </div>

        {/* Price & Primary Purchase Action */}
        <div className="pt-3 border-t border-border-subtle mt-3 flex items-center justify-between gap-2">
          <div>
            {product.originalPrice ? (
              <div className="text-[11px] text-text-muted line-through">
                {formatVnd(product.originalPrice)}
              </div>
            ) : null}
            <div className="text-base font-extrabold text-[#2E7D32]">
              {formatVnd(product.price)}
            </div>
          </div>
          <button
            type="button"
            onClick={() => addToCart(product)}
            disabled={outOfStock}
            className="px-3.5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#256628] text-white text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            title={outOfStock ? 'Tạm hết hàng' : 'Thêm vào giỏ hàng'}
            aria-label={`Thêm ${product.name} vào giỏ hàng`}
          >
            <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
            <span>{outOfStock ? 'Tạm hết' : 'Chọn mua'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
