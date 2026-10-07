import { Link } from 'react-router-dom'
import { formatVnd } from '../../../data/format'
import { PRODUCT_IMAGE_FALLBACK, handleImageError } from '../../../utils/image'
import type { CartItem } from '../../../api/types'

interface CartItemRowProps {
  item: CartItem
  alternate: boolean
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}

export default function CartItemRow({ item, alternate, onQuantityChange, onRemove }: CartItemRowProps) {
  const isUnavailable = !item.isAvailable

  return (
    <div
      className={`p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center relative ${
        alternate ? 'bg-brand-cream/60' : ''
      } ${isUnavailable ? 'opacity-60 bg-rose-50/30' : ''}`}
    >
      <div className="sm:col-span-6 flex items-center gap-3.5">
        <div className="w-20 h-20 border border-brand-dark/10 bg-brand-cream p-1.5 flex-shrink-0 flex items-center justify-center overflow-hidden">
          <img
            alt={item.productName}
            className="w-full h-full object-contain hover:scale-105 transition-transform"
            src={item.imageUrl || PRODUCT_IMAGE_FALLBACK}
            onError={handleImageError}
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-dark text-white text-[10px] tracking-wide">
              {item.sku}
            </span>
            {isUnavailable && (
              <span className="px-2 py-0.5 rounded border border-rose-200 bg-rose-50 text-rose-600 text-[10px] font-medium tracking-wide">
                {item.unavailableReason === 'NO_PRICE' ? 'Chưa có giá' : 'Ngừng kinh doanh'}
              </span>
            )}
          </div>
          <Link to={`/products/${item.storeProductId}`}>
            <h3 className="text-sm font-helvetica-neue tracking-tight text-brand-dark leading-snug hover:text-brand-green transition-colors">
              {item.productName}
            </h3>
          </Link>
          <div className="text-xs text-brand-dark/45">
            Quy cách: <span className="text-brand-dark/60">{item.packagingName}</span>
          </div>
        </div>
      </div>
      <div className="sm:col-span-2 text-left sm:text-center">
        <span className="sm:hidden text-xs text-brand-dark/45 mr-1">Đơn giá:</span>
        <span className="text-xs sm:text-sm text-brand-dark tracking-tight">
          {item.unitPrice != null ? formatVnd(item.unitPrice) : '---'}
        </span>
      </div>
      <div className="sm:col-span-2 flex items-center sm:justify-center gap-2">
        <div className={`flex items-center border border-brand-dark/15 bg-white overflow-hidden ${isUnavailable ? 'opacity-50 pointer-events-none' : ''}`}>
          <button
            onClick={() => onQuantityChange(item.quantity - 1)}
            aria-label={`Giảm số lượng ${item.productName}`}
            disabled={isUnavailable}
            className="px-2.5 py-1 text-brand-dark/60 hover:bg-brand-cream text-xs transition-colors disabled:cursor-not-allowed"
          >
            -
          </button>
          <span className="w-8 text-center text-xs text-brand-dark">{item.quantity}</span>
          <button
            onClick={() => onQuantityChange(item.quantity + 1)}
            aria-label={`Tăng số lượng ${item.productName}`}
            disabled={isUnavailable}
            className="px-2.5 py-1 text-brand-dark/60 hover:bg-brand-cream text-xs transition-colors disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>
      <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-2">
        <span className="sm:hidden text-xs text-brand-dark/45">Thành tiền:</span>
        <div className="text-sm text-brand-dark tracking-tight whitespace-nowrap">
          {item.lineTotalAmount != null ? formatVnd(item.lineTotalAmount) : '---'}
        </div>
        <button
          onClick={onRemove}
          className="text-brand-dark/40 hover:text-status-error p-1 transition-colors ml-1"
          title="Xóa sản phẩm"
          aria-label={`Xóa ${item.productName} khỏi giỏ hàng`}
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    </div>
  )
}
