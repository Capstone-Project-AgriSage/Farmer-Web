import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import { catalogApi } from '../../api/catalogApi'
import { packagingLabel, sellablePackagings } from '../../features/products/catalogMapping'
import { formatVnd } from '../../data/format'
import { useCart } from '../../context/CartContext'
import { handleImageError } from '../../utils/image'
import { stockStatusTone } from '../../utils/stockStatus'
import { useMotionPolicy } from '../../motion/useMotionPolicy'

// showcase: optional layout for the homepage. A tall poster whose top edge leans left or right (the bottom stays flat),
// with no card box around it. It straightens on hover. Without it the card is a plain bordered tile.
const SHOWCASE_IMAGE = {
  left: 'aspect-[3/4] rounded-[22px] [transform-origin:50%_100%] [transform:perspective(900px)_rotateY(13deg)] group-hover:[transform:perspective(900px)_rotateX(calc(var(--ty,0)*-7deg))_rotateY(calc(var(--tx,0)*9deg))] transition-transform duration-[var(--dur-image)] ease-[var(--motion-ease-out)]',
  right: 'aspect-[3/4] rounded-[22px] [transform-origin:50%_100%] [transform:perspective(900px)_rotateY(-13deg)] group-hover:[transform:perspective(900px)_rotateX(calc(var(--ty,0)*-7deg))_rotateY(calc(var(--tx,0)*9deg))] transition-transform duration-[var(--dur-image)] ease-[var(--motion-ease-out)]',
} as const

export default function ProductCard({ product, showcase }: { product: Product; showcase?: keyof typeof SHOWCASE_IMAGE }) {
  const { addToCart, showToast } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tone = stockStatusTone(product.stockStatus)
  const motionPolicy = useMotionPolicy()
  const followPointer = Boolean(showcase) && motionPolicy === 'full'
  const outOfStock = product.stockStatus === 'Hết hàng'

  useEffect(
    () => () => {
      if (addedTimer.current) clearTimeout(addedTimer.current)
    },
    [],
  )

  // The button turns into a tick for a moment once the server accepted the line (the toast says which product).
  const confirmAdded = (accepted: boolean) => {
    if (!accepted) return
    setJustAdded(true)
    if (addedTimer.current) clearTimeout(addedTimer.current)
    addedTimer.current = setTimeout(() => setJustAdded(false), 1600)
  }

  // Catalog rows don't say which packaging to sell, so add the same default the detail page
  // preselects (largest priced pack) and name it in the toast; other packs are picked on the detail page.
  const handleQuickAdd = async () => {
    if (!product.storeProductId) return
    if (product.productPackagingId) {
      confirmAdded(await addToCart({ storeProductId: product.storeProductId, productPackagingId: product.productPackagingId, quantity: 1 }, product.name))
      return
    }
    setIsAdding(true)
    try {
      const detail = await catalogApi.getProduct(product.storeProductId)
      const pack = sellablePackagings(detail)[0]
      if (!pack) {
        showToast('Sản phẩm chưa có giá bán, Bác vui lòng liên hệ cửa hàng.')
        return
      }
      const name = sellablePackagings(detail).length > 1 ? `${detail.name} (${packagingLabel(pack)})` : detail.name
      confirmAdded(await addToCart({ storeProductId: detail.id, productPackagingId: pack.id, quantity: 1 }, name))
    } catch {
      showToast('Không tải được sản phẩm, vui lòng thử lại.')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div
      className={
        showcase
          ? 'flex flex-col h-full group'
          : 'group flex flex-col h-full bg-white border border-brand-dark/15 rounded-[var(--radius-surface)] overflow-hidden transition-colors duration-[var(--dur-standard)] hover:border-brand-dark/40'
      }
    >
      <Link
        to={`/products/${product.slug}`}
        onMouseMove={
          followPointer
            ? (event) => {
                // Poster leans toward the pointer: --tx / --ty run from -1 to 1 across the photo.
                const box = event.currentTarget.getBoundingClientRect()
                event.currentTarget.style.setProperty('--tx', String(((event.clientX - box.left) / box.width - 0.5) * 2))
                event.currentTarget.style.setProperty('--ty', String(((event.clientY - box.top) / box.height - 0.5) * 2))
              }
            : undefined
        }
        onMouseLeave={
          followPointer
            ? (event) => {
                event.currentTarget.style.setProperty('--tx', '0')
                event.currentTarget.style.setProperty('--ty', '0')
              }
            : undefined
        }
        aria-label={`Xem chi tiết ${product.name}`}
        className={`focus-ring relative block overflow-hidden ${showcase ? SHOWCASE_IMAGE[showcase] : 'aspect-[4/3] bg-brand-light'}`}
      >
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-white text-text-primary text-xs font-medium tracking-wide rounded-full z-10">{product.brand}</span>
        <img
          src={product.image}
          alt=""
          loading="lazy"
          decoding="async"
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-[var(--dur-image)] ease-[var(--motion-ease-out)] group-hover:scale-[1.04]"
        />
        <span className={`absolute bottom-3 right-3 px-2.5 py-1 ${tone.badgeBg} ${tone.text} text-xs font-medium rounded-full flex items-center gap-1.5 z-10`}>
          <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} aria-hidden="true"></span> {product.stockLabel}
        </span>
      </Link>

      <div className={`flex-1 flex flex-col ${showcase ? 'px-1 pt-5' : 'p-5'}`}>
        <p className="text-[13px] uppercase tracking-[0.12em] text-text-secondary mb-1.5">{product.category}</p>
        <Link to={`/products/${product.slug}`} className="focus-ring">
          <h3 className="text-[17px] text-text-primary line-clamp-2 leading-snug font-medium transition-colors group-hover:text-brand-green">{product.name}</h3>
        </Link>
        {(product.activeIngredient || product.packaging) && (
          <div className="mt-2 space-y-0.5 text-[15px] text-text-secondary">
            {product.activeIngredient && (
              <p>
                <span className="text-text-muted">Hoạt chất:</span> {product.activeIngredient}
              </p>
            )}
            {product.packaging && (
              <p>
                <span className="text-text-muted">Quy cách:</span> {product.packaging}
              </p>
            )}
          </div>
        )}
        {product.tag && (
          <p className="mt-3">
            <span className="inline-flex items-center text-[13px] bg-brand-light text-text-secondary px-2 py-0.5 rounded-[var(--radius-surface)]">{product.tag}</span>
          </p>
        )}
      </div>

      <div className={showcase ? 'px-1 pb-1' : 'px-5 pb-5'}>
        <div className="flex items-center justify-between gap-3 pt-4 mb-4 border-t border-brand-dark/10">
          <div>
            {product.originalPrice ? (
              <>
                <p className="text-[13px] text-text-muted line-through">{formatVnd(product.originalPrice)}</p>
                <p className="text-xl font-medium text-text-primary">{formatVnd(product.price)}</p>
              </>
            ) : product.wholesalePrice ? (
              <>
                <p className="text-[13px] text-text-secondary">Hạn mức nợ vụ</p>
                <p className="text-xl font-medium text-text-primary">{formatVnd(product.price)}</p>
              </>
            ) : outOfStock ? (
              <p className="text-[15px] text-text-secondary">Liên hệ cửa hàng</p>
            ) : (
              <p className="text-xl font-medium text-text-primary">
                {product.priceFrom && <span className="text-[13px] text-text-secondary font-normal mr-1">Từ</span>}
                {formatVnd(product.price)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={outOfStock || isAdding || !product.storeProductId}
            className={`focus-ring shrink-0 w-11 h-11 rounded-full border flex items-center justify-center transition-colors duration-[var(--dur-micro)] disabled:opacity-45 disabled:cursor-not-allowed ${
              justAdded ? 'bg-primary-dark border-primary-dark text-white' : 'bg-brand-cream border-brand-dark/20 text-text-primary hover:bg-brand-dark hover:border-brand-dark hover:text-white'
            }`}
            title={outOfStock ? 'Tạm hết hàng' : 'Thêm vào giỏ'}
            aria-label={`Thêm ${product.name} vào giỏ hàng`}
          >
            <span className={`material-symbols-outlined ${isAdding ? 'animate-spin' : ''}`} style={{ fontSize: 20 }} aria-hidden="true">
              {isAdding ? 'progress_activity' : justAdded ? 'check' : 'add_shopping_cart'}
            </span>
          </button>
        </div>

        <Link
          to={`/products/${product.slug}`}
          className={`focus-ring flex items-center justify-center w-full min-h-[44px] text-[15px] tracking-wide rounded-full transition-colors duration-[var(--dur-micro)] ${
            showcase ? 'bg-brand-dark text-white hover:bg-brand-green' : 'border border-brand-dark/30 text-text-primary hover:bg-brand-dark hover:border-brand-dark hover:text-white'
          }`}
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  )
}
