import { Link } from 'react-router-dom'
import type { AdvisoryProduct } from '../../../api/advisoryApi'
import { formatVnd } from '../../../data/format'
import { PRODUCT_IMAGE_FALLBACK, handleImageError } from '../../../utils/image'
import { stockBadgeClass, stockLabel } from '../model'

interface AdvisoryProductCardProps {
  product: AdvisoryProduct
  /** The farmer entered an area (so a missing quantity is not the farmer's omission). */
  hasArea: boolean
  adding: boolean
  onAdd: (product: AdvisoryProduct) => void
}

/**
 * One advised product: why, the registration source, the dose, the pre-harvest interval, the quantity and price for the
 * entered area, the stock status and the add-to-cart button. Quantity and price come from the server.
 */
export default function AdvisoryProductCard({ product: p, hasArea, adding, onAdd }: AdvisoryProductCardProps) {
  const plan = p.plan
  const out = p.stockStatus === 'OUT_OF_STOCK'

  return (
    <li className="py-5 first:pt-0 last:pb-0" data-testid={`advisory-product-${p.storeProductId}`}>
      <div className="flex gap-4">
        <Link to={`/products/${p.storeProductId}`} className="focus-ring shrink-0 rounded-[var(--radius-surface)]" aria-label={`Xem sản phẩm ${p.name}`}>
          <img
            src={p.imageUrl || PRODUCT_IMAGE_FALLBACK}
            alt=""
            onError={handleImageError}
            className="w-20 h-20 object-contain bg-brand-light rounded-[var(--radius-surface)]"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link to={`/products/${p.storeProductId}`} className="focus-ring block text-base md:text-lg font-medium text-text-primary hover:underline underline-offset-4">
            {p.name}
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[13px] ${stockBadgeClass(p.stockStatus)}`} data-testid={`advisory-stock-${p.storeProductId}`}>
              {stockLabel(p.stockStatus)}
            </span>
            {p.preHarvestDays !== null && (
              <span className="px-2.5 py-0.5 rounded-full text-[13px] bg-brand-light text-text-secondary">Cách ly {p.preHarvestDays} ngày</span>
            )}
          </div>
          {p.reason && <p className="mt-2 text-[15px] text-text-secondary">{p.reason}</p>}
          {p.registrationSource && (
            <p className="mt-1 text-[14px] text-text-muted" data-testid={`advisory-source-${p.storeProductId}`}>
              Đăng ký: {p.registrationSource}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-[var(--radius-surface)] bg-brand-light/70 px-4 py-3">
        <p className="text-[13px] tracking-[0.12em] text-text-muted uppercase">Cách dùng và liều</p>
        <p className="mt-1 text-[15px] text-text-primary leading-relaxed">{p.doseText}</p>
        {p.applications > 1 && <p className="mt-1 text-[14px] text-text-secondary">Dùng {p.applications} lần.</p>}
      </div>

      <div className="mt-4">
        {plan ? (
          <div data-testid={`advisory-plan-${p.storeProductId}`}>
            <p className="text-[14px] font-medium text-text-primary">Cho ruộng của bác cần:</p>
            <ul className="mt-1 text-[15px] text-text-secondary">
              {plan.lines.map((l) => (
                <li key={l.productPackagingId}>
                  {l.quantity} × {l.packagingName} ({formatVnd(l.lineAmount)})
                </li>
              ))}
            </ul>
            <p className="mt-1 text-base font-medium text-brand-dark">Ước tính {formatVnd(plan.totalAmount)}</p>
          </div>
        ) : (
          <p className="text-[15px] text-text-secondary" data-testid={`advisory-noplan-${p.storeProductId}`}>
            {hasArea
              ? 'Chưa tính được số lượng cho sản phẩm này. Bác mở sản phẩm để chọn quy cách.'
              : 'Bác nhập diện tích ruộng ở trên để biết cần mua bao nhiêu.'}
          </p>
        )}
        {p.stockStatus === 'NOT_ENOUGH' && (
          <p className="mt-2 text-[14px] text-status-warning">Cửa hàng chưa đủ số lượng này, bác có thể đặt ít hơn hoặc hỏi cửa hàng.</p>
        )}
      </div>

      <div className="mt-4">
        {out ? (
          <button type="button" disabled data-testid={`advisory-soldout-${p.storeProductId}`} className="min-h-[44px] px-6 rounded-full border border-brand-dark/20 text-[15px] text-text-muted cursor-not-allowed">
            Hết hàng
          </button>
        ) : plan ? (
          <button
            type="button"
            onClick={() => onAdd(p)}
            disabled={adding}
            data-testid={`advisory-add-${p.storeProductId}`}
            className="focus-ring min-h-[44px] px-6 rounded-full bg-brand-dark text-white hover:bg-brand-green text-[15px] transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
          >
            {adding ? 'Đang thêm...' : `Thêm vào giỏ · ${formatVnd(plan.totalAmount)}`}
          </button>
        ) : (
          <Link
            to={`/products/${p.storeProductId}`}
            data-testid={`advisory-open-${p.storeProductId}`}
            className="focus-ring inline-flex items-center min-h-[44px] px-6 rounded-full border border-brand-dark/30 text-[15px] text-text-primary hover:bg-brand-dark hover:text-white transition-colors"
          >
            Xem sản phẩm
          </Link>
        )}
      </div>
    </li>
  )
}
