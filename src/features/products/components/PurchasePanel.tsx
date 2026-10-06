import { formatVnd } from '../../../data/format'
import { stockStatusTone } from '../../../utils/stockStatus'
import type { CatalogPackaging } from '../../../api/types'
import type { Product } from '../../../types'
import { packagingLabel } from '../catalogMapping'

interface PurchasePanelProps {
  product: Product
  sku: string | null
  packagings: CatalogPackaging[]
  selectedPackagingId: string
  onSelectPackaging: (id: string) => void
  quantity: number
  onQuantityChange: (quantity: number) => void
  isAdding: boolean
  onAddToCart: () => void
  onBuyNow: () => void
}

export default function PurchasePanel({
  product,
  sku,
  packagings,
  selectedPackagingId,
  onSelectPackaging,
  quantity,
  onQuantityChange,
  isAdding,
  onAddToCart,
  onBuyNow,
}: PurchasePanelProps) {
  const tone = stockStatusTone(product.stockStatus)
  const selected = packagings.find((p) => p.id === selectedPackagingId)
  const canBuy = Boolean(selected) && !isAdding

  return (
    <div className="lg:col-span-7 flex flex-col justify-between">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-dark/10 pb-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-light text-brand-dark/70 border border-brand-dark/10 tracking-wide">
              {product.category}
            </span>
            {product.brand && product.brand !== product.category && (
              <>
                <span className="text-brand-dark/30">|</span>
                <span className="text-brand-dark/60">
                  Thương hiệu: <span className="text-brand-dark">{product.brand}</span>
                </span>
              </>
            )}
          </div>
          {sku && <span className="text-[11px] text-brand-dark/45 tracking-wide">SKU: {sku}</span>}
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-helvetica-neue tracking-tight text-brand-dark leading-snug">
            {product.name}
          </h1>
          {product.activeIngredient && (
            <p className="text-xs sm:text-sm text-brand-dark/60 mt-1.5">Hoạt chất: {product.activeIngredient}</p>
          )}
        </div>
        <div className={`${tone.text} flex items-center gap-1 text-xs`}>
          <span className="material-symbols-outlined text-[16px]">inventory</span> {product.stockLabel}
        </div>

        <div className="bg-brand-light border border-brand-dark/10 p-4 sm:p-5 space-y-4">
          {selected ? (
            <div className="flex items-baseline flex-wrap gap-2.5">
              <span className="text-3xl sm:text-4xl font-helvetica-neue tracking-tight text-brand-dark">
                {formatVnd(selected.price ?? 0)}
              </span>
              <span className="text-xs sm:text-sm text-brand-dark/55">/ {packagingLabel(selected)}</span>
            </div>
          ) : (
            <p className="text-sm text-brand-dark/70">
              Sản phẩm này chưa có giá bán online. Bác vui lòng liên hệ cửa hàng để được báo giá.
            </p>
          )}

          {packagings.length > 0 && (
            <fieldset>
              <legend className="text-xs text-brand-dark/60 mb-2">Chọn quy cách</legend>
              <div className="flex flex-wrap gap-2">
                {packagings.map((p) => {
                  const active = p.id === selectedPackagingId
                  return (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onSelectPackaging(p.id)}
                      className={`px-3.5 py-2 rounded-xl border text-left text-xs transition-colors ${
                        active
                          ? 'border-brand-dark bg-white text-brand-dark'
                          : 'border-brand-dark/15 bg-white/60 text-brand-dark/70 hover:border-brand-dark/40'
                      }`}
                    >
                      <span className="block font-medium">{packagingLabel(p)}</span>
                      <span className="block text-[11px] text-brand-dark/55">{formatVnd(p.price ?? 0)}</span>
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )}
          <p className="text-[11px] text-brand-dark/50">
            Giá theo bảng giá hiện hành của cửa hàng, được tính lại khi Bác đặt hàng.
          </p>
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
                onChange={(e) => onQuantityChange(Math.max(1, Math.floor(Number(e.target.value)) || 1))}
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
              disabled={!canBuy}
              className="flex-1 py-2.5 px-4 border border-brand-dark/20 text-brand-dark hover:bg-brand-light tracking-wide text-xs sm:text-sm rounded-full transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              <span>Thêm vào giỏ</span>
            </button>
            <button
              onClick={onBuyNow}
              disabled={!canBuy}
              className="flex-1 py-2.5 px-4 rounded-full bg-brand-dark text-white hover:bg-brand-green tracking-wide text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
              <span>{selected ? 'Mua ngay' : 'Chưa có giá'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
