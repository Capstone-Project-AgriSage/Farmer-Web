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
    <div className="bg-white border border-brand-dark/10 rounded-[20px] shadow-[0_2px_12px_rgb(0,0,0,0.06)] hover:shadow-[0_12px_24px_rgb(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      <Link
        to={`/products/${product.slug}`}
        className="relative block h-44 overflow-hidden"
      >
        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-white/90 backdrop-blur-md text-brand-dark text-[10px] font-medium tracking-wide rounded-full z-10 shadow-sm">
          {product.brand}
        </span>
        <img
          src={product.image}
          alt={product.name}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span
          className={`absolute bottom-2.5 right-2.5 px-2.5 py-1 ${tone.badgeBg} ${tone.text} text-[10px] font-medium rounded-full flex items-center gap-1.5 z-10 shadow-sm`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`}></span> {product.stockLabel}
        </span>
      </Link>
      
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] text-brand-dark/60  tracking-[0.1em] mb-1 font-semibold">
            {product.category}
          </div>
          <Link to={`/products/${product.slug}`}>
            <h3 className="text-[15px] text-brand-dark group-hover:text-brand-green transition-colors line-clamp-2 leading-tight font-medium mb-1.5">
              {product.name}
            </h3>
          </Link>
          <div className="flex flex-col gap-0.5 mt-1.5 mb-2.5">
            <p className="text-[13px] text-brand-dark/80">
              <span className="text-brand-dark/50">Hoạt chất:</span> {product.activeIngredient}
            </p>
            <p className="text-[13px] text-brand-dark/80">
              <span className="text-brand-dark/50">Quy cách:</span> {product.packaging}
            </p>
          </div>
          {product.tag && (
            <div className="mb-1">
              <span className="inline-flex items-center text-[10px] font-medium tracking-wide bg-brand-cream/60 text-brand-dark/80 px-2 py-0.5 rounded-md">
                {product.tag}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3 pt-3 border-t border-brand-dark/5">
          <div>
            {product.originalPrice ? (
              <>
                <div className="text-[11px] text-brand-dark/50 line-through mb-0.5">
                  {formatVnd(product.originalPrice)}
                </div>
                <div className="text-base font-medium text-brand-dark">
                  {formatVnd(product.price)}
                </div>
              </>
            ) : product.wholesalePrice ? (
              <>
                <div className="text-[11px] text-brand-dark/60 mb-0.5">Hạn mức nợ vụ</div>
                <div className="text-base font-medium text-brand-dark">
                  {formatVnd(product.price)}
                </div>
              </>
            ) : (
              <div className="text-base font-medium text-brand-dark">
                {formatVnd(product.price)}
              </div>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            disabled={outOfStock}
            className="w-10 h-10 rounded-full bg-brand-cream/80 hover:bg-brand-green hover:text-white text-brand-dark transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            title={outOfStock ? 'Tạm hết hàng' : 'Thêm vào giỏ'}
            aria-label={`Thêm ${product.name} vào giỏ hàng`}
          >
            <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
          </button>
        </div>
        
        <Link
          to={`/products/${product.slug}`}
          className="flex items-center justify-center w-full py-2 bg-brand-dark hover:bg-brand-green/90 text-white text-sm font-semibold tracking-wide rounded-[10px] transition-all duration-300 shadow-sm hover:shadow-md"
        >
          Mua Ngay
        </Link>
      </div>
    </div>
  )
}
