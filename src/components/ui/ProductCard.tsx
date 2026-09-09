import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import { formatVnd } from '../../data/format'
import { useCart } from '../../context/CartContext'
import { handleImageError } from '../../utils/image'

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()

  return (
    <div className="bg-white rounded-xl border border-border-subtle hover:border-primary hover:shadow-card transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      <Link
        to={`/products/${product.slug}`}
        className="relative p-4 bg-white flex items-center justify-center h-48 border-border-subtle overflow-hidden"
      >
        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded z-10">
          {product.brand}
        </span>
        <img
          src={product.image}
          alt={product.name}
          onError={handleImageError}
          className="w-full h-full object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-status-success-surface text-status-success text-[10px] font-semibold rounded flex items-center gap-1 z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-status-success"></span> {product.stockLabel}
        </span>
      </Link>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] text-text-muted uppercase font-semibold tracking-wider mb-1">
            {product.category}
          </div>
          <Link to={`/products/${product.slug}`}>
            <h3 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-text-secondary mt-1">Hoạt chất: {product.activeIngredient}</p>
          <p className="text-xs text-text-muted mt-0.5">Quy cách: {product.packaging}</p>
          {product.tag && (
            <div className="mt-2">
              <span className="inline-flex items-center text-[10px] font-semibold bg-emerald-50 text-primary px-2 py-0.5 rounded">
                {product.tag}
              </span>
            </div>
          )}
        </div>
        <div className="pt-3 border-t border-border-subtle mt-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              {product.originalPrice ? (
                <>
                  <div className="text-xs text-text-muted line-through">
                    {formatVnd(product.originalPrice)}
                  </div>
                  <div className="text-base font-bold text-primary">{formatVnd(product.price)}</div>
                </>
              ) : product.wholesalePrice ? (
                <>
                  <div className="text-xs text-text-muted">Hạn mức nợ vụ</div>
                  <div className="text-base font-bold text-primary">{formatVnd(product.price)}</div>
                </>
              ) : (
                <div className="text-base font-bold text-primary">{formatVnd(product.price)}</div>
              )}
            </div>
            <button
              onClick={() => addToCart(product)}
              className="p-2 rounded-lg bg-primary hover:bg-primary-hover text-white shadow-sm transition-colors flex items-center justify-center"
              title="Thêm vào giỏ"
              aria-label={`Thêm ${product.name} vào giỏ hàng`}
            >
              <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
            </button>
          </div>
          <Link
            to={`/products/${product.slug}`}
            className="block w-full text-center py-1.5 bg-surface-subtle hover:bg-primary-light text-primary hover:text-primary-dark border border-primary/20 text-xs font-semibold rounded transition-colors"
          >
            Mua ngay
          </Link>
        </div>
      </div>
    </div>
  )
}
