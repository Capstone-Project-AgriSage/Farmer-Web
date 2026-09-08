import { Link } from 'react-router-dom'
import { formatVnd } from '../../../data/format'
import { handleImageError } from '../../../utils/image'
import type { CartItem } from '../../../types'

interface CartItemRowProps {
  item: CartItem
  alternate: boolean
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}

export default function CartItemRow({ item, alternate, onQuantityChange, onRemove }: CartItemRowProps) {
  return (
    <div
      className={`p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center ${alternate ? 'bg-surface-subtle/30' : ''}`}
    >
      <div className="sm:col-span-6 flex items-center gap-3.5">
        <div className="w-20 h-20 rounded-xl border border-border-subtle bg-surface-subtle p-1.5 flex-shrink-0 flex items-center justify-center overflow-hidden">
          <img
            alt={item.product.name}
            className="w-full h-full object-contain hover:scale-105 transition-transform"
            src={item.product.image}
            onError={handleImageError}
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-primary font-bold text-[10px]">
              {item.product.brand}
            </span>
            <span className="text-[10px] text-status-success font-medium flex items-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-status-success"></span> {item.product.stockLabel}
            </span>
          </div>
          <Link to={`/products/${item.product.slug}`}>
            <h3 className="text-sm font-bold text-text-primary leading-snug hover:text-primary transition-colors">
              {item.product.name}
            </h3>
          </Link>
          <div className="text-xs text-text-muted">
            Quy cách: <span className="font-medium text-text-secondary">{item.product.packaging}</span>
          </div>
        </div>
      </div>
      <div className="sm:col-span-2 text-left sm:text-center">
        <span className="sm:hidden text-xs text-text-muted mr-1">Đơn giá:</span>
        <span className="text-xs sm:text-sm font-bold text-text-primary">{formatVnd(item.product.price)}</span>
      </div>
      <div className="sm:col-span-2 flex items-center sm:justify-center gap-2">
        <div className="flex items-center border border-border-subtle rounded-lg bg-white overflow-hidden shadow-sm">
          <button
            onClick={() => onQuantityChange(item.quantity - 1)}
            className="px-2.5 py-1 text-text-secondary hover:bg-surface-subtle font-bold text-xs transition-colors"
          >
            -
          </button>
          <span className="w-8 text-center text-xs font-bold text-text-primary">{item.quantity}</span>
          <button
            onClick={() => onQuantityChange(item.quantity + 1)}
            className="px-2.5 py-1 text-text-secondary hover:bg-surface-subtle font-bold text-xs transition-colors"
          >
            +
          </button>
        </div>
      </div>
      <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-2">
        <span className="sm:hidden text-xs text-text-muted">Thành tiền:</span>
        <div className="text-sm font-extrabold text-primary whitespace-nowrap">
          {formatVnd(item.product.price * item.quantity)}
        </div>
        <button
          onClick={onRemove}
          className="text-text-muted hover:text-status-error p-1 rounded transition-colors ml-1"
          title="Xóa sản phẩm"
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    </div>
  )
}
