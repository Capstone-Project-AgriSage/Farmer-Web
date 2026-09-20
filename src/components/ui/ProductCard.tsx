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
    <div className="bg-white border border-brand-dark/10 hover:border-brand-dark/25 transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      <Link
        to={`/products/${product.slug}`}
        className="relative p-4 bg-brand-cream/50 flex items-center justify-center h-48 overflow-hidden"
      >
        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-brand-dark text-white text-[10px] tracking-wide rounded-full z-10">
          {product.brand}
        </span>
        <img
          src={product.image}
          alt={product.name}
          onError={handleImageError}
          className="w-full h-full object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
        />
        <span
          className={`absolute bottom-2 right-2 px-2 py-0.5 ${tone.badgeBg} ${tone.text} text-[10px] rounded-full flex items-center gap-1 z-10`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`}></span> {product.stockLabel}
        </span>
      </Link>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] text-brand-dark/45 uppercase tracking-[0.15em] mb-1.5">
            {product.category}
          </div>
          <Link to={`/products/${product.slug}`}>
            <h3 className="text-sm text-brand-dark group-hover:text-brand-green transition-colors line-clamp-2 leading-snug font-helvetica-neue tracking-tight">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-brand-dark/55 mt-1.5">Hoạt chất: {product.activeIngredient}</p>
          <p className="text-xs text-brand-dark/45 mt-0.5">Quy cách: {product.packaging}</p>
          {product.tag && (
            <div className="mt-2">
              <span className="inline-flex items-center text-[10px] tracking-wide bg-brand-light text-brand-dark/70 px-2 py-0.5 border border-brand-dark/10">
                {product.tag}
              </span>
            </div>
          )}
        </div>
        <div className="pt-3 border-t border-brand-dark/10 mt-3">
          <div className="flex items-center justify-between mb-2.5">
            <div>
              {product.originalPrice ? (
                <>
                  <div className="text-xs text-brand-dark/40 line-through">
                    {formatVnd(product.originalPrice)}
                  </div>
                  <div className="text-base text-brand-dark tracking-tight">{formatVnd(product.price)}</div>
                </>
              ) : product.wholesalePrice ? (
                <>
                  <div className="text-xs text-brand-dark/45">Hạn mức nợ vụ</div>
                  <div className="text-base text-brand-dark tracking-tight">{formatVnd(product.price)}</div>
                </>
              ) : (
                <div className="text-base text-brand-dark tracking-tight">{formatVnd(product.price)}</div>
              )}
            </div>
            <button
              onClick={() => addToCart(product)}
              disabled={outOfStock}
              className="p-2 rounded-full bg-brand-dark hover:bg-brand-green text-white transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-dark"
              title={outOfStock ? 'Tạm hết hàng' : 'Thêm vào giỏ'}
              aria-label={`Thêm ${product.name} vào giỏ hàng`}
            >
              <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
            </button>
          </div>
          <Link
            to={`/products/${product.slug}`}
            className="block w-full text-center py-2 bg-brand-cream hover:bg-brand-light text-brand-dark border border-brand-dark/15 text-xs tracking-wide uppercase rounded-full transition-colors"
          >
            Mua ngay
          </Link>
        </div>
      </div>
    </div>
  )
}
