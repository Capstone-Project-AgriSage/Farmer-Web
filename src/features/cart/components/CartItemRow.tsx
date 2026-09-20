import { Link } from 'react-router-dom'
import { formatVnd } from '../../../data/format'
import { handleImageError } from '../../../utils/image'
import { stockStatusTone } from '../../../utils/stockStatus'
import type { CartItem } from '../../../types'

interface CartItemRowProps {
  item: CartItem
  alternate: boolean
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}

export default function CartItemRow({ item, alternate, onQuantityChange, onRemove }: CartItemRowProps) {
  const tone = stockStatusTone(item.product.stockStatus)

  return (
    <div
      className={`p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center ${
        alternate ? 'bg-brand-cream/60' : ''
      }`}
    >
      <div className="sm:col-span-6 flex items-center gap-3.5">
        <div className="w-20 h-20 border border-brand-dark/10 bg-brand-cream p-1.5 flex-shrink-0 flex items-center justify-center overflow-hidden">
          <img
            alt={item.product.name}
            className="w-full h-full object-contain hover:scale-105 transition-transform"
            src={item.product.image}
            onError={handleImageError}
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-dark text-white text-[10px] tracking-wide">
              {item.product.brand}
            </span>
            <span className={`text-[10px] ${tone.text} flex items-center gap-0.5`}>
              <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`}></span> {item.product.stockLabel}
            </span>
          </div>
          <Link to={`/products/${item.product.slug}`}>
            <h3 className="text-sm font-helvetica-neue tracking-tight text-brand-dark leading-snug hover:text-brand-green transition-colors">
              {item.product.name}
            </h3>
          </Link>
          <div className="text-xs text-brand-dark/45">
            Quy cách: <span className="text-brand-dark/60">{item.product.packaging}</span>
          </div>
        </div>
      </div>
      <div className="sm:col-span-2 text-left sm:text-center">
        <span className="sm:hidden text-xs text-brand-dark/45 mr-1">Đơn giá:</span>
        <span className="text-xs sm:text-sm text-brand-dark tracking-tight">
          {formatVnd(item.product.price)}
        </span>
      </div>
      <div className="sm:col-span-2 flex items-center sm:justify-center gap-2">
        <div className="flex items-center border border-brand-dark/15 bg-white overflow-hidden">
          <button
            onClick={() => onQuantityChange(item.quantity - 1)}
            aria-label={`Giảm số lượng ${item.product.name}`}
            className="px-2.5 py-1 text-brand-dark/60 hover:bg-brand-cream text-xs transition-colors"
          >
            -
          </button>
          <span className="w-8 text-center text-xs text-brand-dark">{item.quantity}</span>
          <button
            onClick={() => onQuantityChange(item.quantity + 1)}
            aria-label={`Tăng số lượng ${item.product.name}`}
            className="px-2.5 py-1 text-brand-dark/60 hover:bg-brand-cream text-xs transition-colors"
          >
            +
          </button>
        </div>
      </div>
      <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-2">
        <span className="sm:hidden text-xs text-brand-dark/45">Thành tiền:</span>
        <div className="text-sm text-brand-dark tracking-tight whitespace-nowrap">
          {formatVnd(item.product.price * item.quantity)}
        </div>
        <button
          onClick={onRemove}
          className="text-brand-dark/40 hover:text-status-error p-1 transition-colors ml-1"
          title="Xóa sản phẩm"
          aria-label={`Xóa ${item.product.name} khỏi giỏ hàng`}
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    </div>
  )
}
