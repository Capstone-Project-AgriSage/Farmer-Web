import { formatVnd } from '../../../data/format'
import { stockStatusTone } from '../../../utils/stockStatus'
import type { Product } from '../../../types'

export const specOptions = [
  { label: 'Gói 100g', note: 'Pha 40 - 50L nước', price: 48000 },
  { label: 'Gói 500g', note: 'Pha 1 phuy 200L', price: 225000 },
  { label: 'Thùng 100 gói (10kg)', note: 'Giá sỉ trang trại', price: 4600000 },
]

interface PurchasePanelProps {
  product: Product
  quantity: number
  onQuantityChange: (quantity: number) => void
  activeSpec: number
  onActiveSpecChange: (index: number) => void
  onAddToCart: () => void
  onBuyNow: () => void
}

export default function PurchasePanel({
  product,
  quantity,
  onQuantityChange,
  activeSpec,
  onActiveSpecChange,
  onAddToCart,
  onBuyNow,
}: PurchasePanelProps) {
  const tone = stockStatusTone(product.stockStatus)
  const outOfStock = product.stockStatus === 'Hết hàng'

  return (
    <div className="lg:col-span-7 flex flex-col justify-between">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-dark/10 pb-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-light text-brand-dark/70 border border-brand-dark/10 tracking-wide">
              {product.category}
            </span>
            <span className="text-brand-dark/30">|</span>
            <span className="text-brand-dark/60">
              Thương hiệu: <span className="text-brand-dark">{product.brand}</span>
            </span>
          </div>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-helvetica-neue tracking-tight text-brand-dark leading-snug">
            {product.name}
          </h1>
          <p className="text-xs sm:text-sm text-brand-dark/60 mt-1.5">
            Hoạt chất: {product.activeIngredient}. Quy cách: {product.packaging}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {product.rating && (
            <div className="flex items-center gap-1.5 bg-brand-cream px-2.5 py-1 border border-brand-dark/10">
              <div className="flex items-center text-[#F57C00]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[16px] fill">
                    star
                  </span>
                ))}
              </div>
              <span className="text-brand-dark tracking-tight">{product.rating}</span>
              <span className="text-brand-dark/45">({product.reviewCount} đánh giá từ nhà vườn)</span>
            </div>
          )}
          {product.soldCount && (
            <div className="text-brand-dark/60">
              Đã bán:{' '}
              <span className="text-brand-dark">{product.soldCount.toLocaleString('vi-VN')}</span> mùa
              này
            </div>
          )}
          <div className={`${tone.text} flex items-center gap-1`}>
            <span className="material-symbols-outlined text-[16px]">inventory</span> {product.stockLabel}
          </div>
        </div>

        <div className="bg-brand-light border border-brand-dark/10 p-4 sm:p-5 space-y-3.5">
          <div className="flex items-baseline flex-wrap gap-2.5">
            <span className="text-3xl sm:text-4xl font-helvetica-neue tracking-tight text-brand-dark">
              {formatVnd(specOptions[activeSpec].price)}
            </span>
            <span className="text-xs sm:text-sm text-brand-dark/55">
              / {specOptions[activeSpec].label}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-sm sm:text-base text-brand-dark/40 line-through ml-1">
                  {formatVnd(product.originalPrice)}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs tracking-wide bg-white text-brand-dark/70 border border-brand-dark/10">
                  <span className="material-symbols-outlined text-[13px]">trending_down</span> Tiết
                  kiệm 13%
                </span>
              </>
            )}
          </div>
          {product.wholesalePrice && (
            <div className="pt-3 border-t border-brand-dark/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs bg-white p-3 border border-brand-dark/10">
              <div className="flex items-center gap-2 text-brand-dark/60">
                <span className="material-symbols-outlined text-brand-dark/60 text-[18px]">storefront</span>
                <span>Giá sỉ đại lý:</span>
                <span className="text-brand-dark tracking-tight text-sm sm:text-base">
                  {formatVnd(product.wholesalePrice)}
                </span>
                <span className="text-brand-dark/40 text-xs">/ {product.wholesaleUnit}</span>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-dark text-white text-[11px] tracking-wide">
              <span className="material-symbols-outlined text-[14px]">credit_score</span>
              Áp dụng Sổ Nợ Vụ Lúa 0%
            </span>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <span className="text-xs tracking-[0.25em] uppercase text-brand-dark/50">
            Chọn quy cách đóng gói:
          </span>
          <div className="grid grid-cols-3 gap-3">
            {specOptions.map((opt, i) => (
              <button
                key={opt.label}
                onClick={() => onActiveSpecChange(i)}
                className={`p-3 text-left flex flex-col justify-between transition-colors ${
                  activeSpec === i
                    ? 'border border-brand-dark bg-brand-dark text-white'
                    : 'border border-brand-dark/15 bg-white text-brand-dark/70 hover:border-brand-dark/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs tracking-tight ${
                      activeSpec === i ? 'text-white' : 'text-brand-dark'
                    }`}
                  >
                    {opt.label}
                  </span>
                  {activeSpec === i && <span className="w-2 h-2 rounded-full bg-white"></span>}
                </div>
                <span
                  className={`text-[11px] mt-1 ${
                    activeSpec === i ? 'text-white/70' : 'text-brand-dark/45'
                  }`}
                >
                  {opt.note}
                </span>
                <span
                  className={`text-xs tracking-tight mt-2 ${
                    activeSpec === i ? 'text-white' : 'text-brand-dark'
                  }`}
                >
                  {formatVnd(opt.price)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center border border-brand-dark/15 bg-white overflow-hidden w-full sm:w-32 justify-between">
              <button
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                aria-label={`Giảm số lượng ${product.name}`}
                className="px-3.5 py-2 text-brand-dark/60 hover:bg-brand-cream text-sm transition-colors"
              >
                -
              </button>
              <input
                className="w-10 text-center text-xs text-brand-dark border-none focus:outline-none p-0 bg-transparent"
                aria-label={`Số lượng ${product.name}`}
                min={1}
                type="number"
                value={quantity}
                onChange={(e) => onQuantityChange(Math.max(1, Number(e.target.value) || 1))}
              />
              <button
                onClick={() => onQuantityChange(quantity + 1)}
                aria-label={`Tăng số lượng ${product.name}`}
                className="px-3.5 py-2 text-brand-dark/60 hover:bg-brand-cream text-sm transition-colors"
              >
                +
              </button>
            </div>
            <button
              onClick={onAddToCart}
              disabled={outOfStock}
              className="flex-1 py-2.5 px-4 border border-brand-dark/20 text-brand-dark hover:bg-brand-light tracking-wide uppercase text-xs sm:text-sm rounded-full transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              <span>Thêm vào giỏ</span>
            </button>
            <button
              onClick={onBuyNow}
              disabled={outOfStock}
              className="flex-1 py-2.5 px-4 rounded-full bg-brand-dark text-white hover:bg-brand-green tracking-wide uppercase text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">credit_card</span>
              <span>{outOfStock ? 'Tạm hết' : 'Mua ngay / Gối nợ'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
