import { formatVnd } from '../../../data/format'
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
  return (
    <div className="lg:col-span-7 flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-primary font-semibold">
              {product.category}
            </span>
            <span className="text-text-muted">|</span>
            <span className="text-text-secondary">
              Thương hiệu: <strong className="text-text-primary">{product.brand}</strong>
            </span>
          </div>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight leading-snug">
            {product.name}
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Hoạt chất: {product.activeIngredient}. Quy cách: {product.packaging}.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {product.rating && (
            <div className="flex items-center gap-1.5 bg-surface-subtle px-2.5 py-1 rounded-md border border-border-subtle">
              <div className="flex items-center text-[#F57C00]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[16px] fill">
                    star
                  </span>
                ))}
              </div>
              <span className="font-bold text-text-primary">{product.rating}</span>
              <span className="text-text-muted">({product.reviewCount} đánh giá từ nhà vườn)</span>
            </div>
          )}
          {product.soldCount && (
            <div className="text-text-secondary">
              Đã bán: <strong className="text-text-primary font-semibold">{product.soldCount.toLocaleString('vi-VN')}</strong>{' '}
              mùa này
            </div>
          )}
          <div className="text-status-success font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">inventory</span> Còn hàng sẵn tại kho
          </div>
        </div>

        <div className="bg-surface-secondary/60 border border-border-subtle rounded-xl p-4 sm:p-5 space-y-3.5 shadow-sm">
          <div className="flex items-baseline flex-wrap gap-2.5">
            <span className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
              {formatVnd(specOptions[activeSpec].price)}
            </span>
            <span className="text-xs sm:text-sm font-medium text-text-secondary">
              / {specOptions[activeSpec].label}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-sm sm:text-base text-text-muted line-through ml-1">
                  {formatVnd(product.originalPrice)}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-status-error-surface text-status-error border border-status-error/20">
                  <span className="material-symbols-outlined text-[13px]">trending_down</span> Tiết
                  kiệm 13%
                </span>
              </>
            )}
          </div>
          {product.wholesalePrice && (
            <div className="pt-3 border-t border-border-subtle/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs bg-white/60 p-3 rounded-lg border border-border-subtle">
              <div className="flex items-center gap-2 text-text-secondary">
                <span className="material-symbols-outlined text-primary text-[18px]">storefront</span>
                <span>Giá sỉ đại lý:</span>
                <strong className="text-primary font-bold text-sm sm:text-base">
                  {formatVnd(product.wholesalePrice)}
                </strong>
                <span className="text-text-muted text-xs">/ {product.wholesaleUnit}</span>
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-primary-dark text-white font-semibold text-[11px] shadow-sm">
              <span className="material-symbols-outlined text-[15px]">payments</span> Áp dụng Sổ Nợ
              Mùa Vụ
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-primary font-semibold text-[11px] border border-primary/20">
              <span className="material-symbols-outlined text-[15px]">credit_score</span> Hỗ trợ
              AgriCredit 0% lãi suất thu hoạch trả
            </span>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-text-primary">
              Chọn quy cách đóng gói:
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {specOptions.map((opt, i) => (
              <button
                key={opt.label}
                onClick={() => onActiveSpecChange(i)}
                className={`rounded-lg p-2.5 text-left flex flex-col justify-between transition-colors group ${
                  activeSpec === i
                    ? 'border-2 border-primary bg-white text-primary shadow-sm'
                    : 'border border-border-subtle hover:border-primary bg-white text-text-secondary'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-text-primary group-hover:text-primary">
                    {opt.label}
                  </span>
                  {activeSpec === i && <span className="w-2 h-2 rounded-full bg-primary"></span>}
                </div>
                <span className="text-[11px] text-text-muted mt-1">{opt.note}</span>
                <span className="text-xs font-bold text-primary mt-1.5">{formatVnd(opt.price)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center border border-border-subtle rounded-lg bg-white overflow-hidden w-full sm:w-36 justify-between">
              <button
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                aria-label={`Giảm số lượng ${product.name}`}
                className="px-3.5 py-2.5 text-text-secondary hover:bg-surface-subtle font-bold text-sm transition-colors"
              >
                -
              </button>
              <input
                className="w-12 text-center text-xs font-bold text-text-primary border-none focus:outline-none focus:ring-0 p-0"
                aria-label={`Số lượng ${product.name}`}
                min={1}
                type="number"
                value={quantity}
                onChange={(e) => onQuantityChange(Math.max(1, Number(e.target.value) || 1))}
              />
              <button
                onClick={() => onQuantityChange(quantity + 1)}
                aria-label={`Tăng số lượng ${product.name}`}
                className="px-3.5 py-2.5 text-text-secondary hover:bg-surface-subtle font-bold text-sm transition-colors"
              >
                +
              </button>
            </div>
            <button
              onClick={onAddToCart}
              className="flex-1 py-3 px-4 border-2 border-primary text-primary hover:bg-emerald-50 font-bold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
              <span>Thêm vào giỏ hàng</span>
            </button>
            <button
              onClick={onBuyNow}
              className="flex-1 py-3 px-4 bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">credit_card</span>
              <span>Mua ngay / Ghi sổ nợ vụ</span>
            </button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-border-subtle text-xs">
            <div className="flex items-center gap-2 text-text-secondary">
              <span className="material-symbols-outlined text-primary text-[18px]">phone_in_talk</span>
              <span>Hotline kỹ sư tư vấn liều lượng sầu riêng, cà phê:</span>
            </div>
            <a className="font-bold text-primary hover:underline flex items-center gap-1" href="tel:19006828">
              <span>1900 6828</span>
              <span className="text-[10px] text-text-muted font-normal">(Miễn phí)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
