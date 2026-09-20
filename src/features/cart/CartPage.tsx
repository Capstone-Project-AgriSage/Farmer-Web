import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { useCart } from '../../context/CartContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { validateVoucherCode, type VoucherValidationResult } from '../../data/vouchers'
import CartItemRow from './components/CartItemRow'
import VoucherBar from './components/VoucherBar'
import CartPerksGrid from './components/CartPerksGrid'
import CartSummarySidebar from './components/CartSummarySidebar'

const DEFAULT_VOUCHER_INPUT = 'VUMUA2024'
const FREE_SHIPPING_THRESHOLD = 2000000

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeFromCart, clearCart } = useCart()
  const navigate = useNavigate()
  useDocumentTitle('Giỏ hàng của tôi')

  const [voucherInput, setVoucherInput] = useState(DEFAULT_VOUCHER_INPUT)
  const [voucherResult, setVoucherResult] = useState<VoucherValidationResult | null>(() =>
    validateVoucherCode(DEFAULT_VOUCHER_INPUT),
  )
  const [voucherError, setVoucherError] = useState('')

  const handleApplyVoucher = () => {
    const result = validateVoucherCode(voucherInput)
    setVoucherResult(result)
    setVoucherError(result ? '' : 'Mã ưu đãi không hợp lệ hoặc đã hết hạn')
  }

  const discount = items.length > 0 && voucherResult ? voucherResult.discount : 0
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 30000
  const total = subtotal - discount + shippingFee

  if (items.length === 0) {
    return (
      <>
        <Breadcrumb
          items={[
            { label: 'Trang chủ', to: '/' },
            { label: 'Danh mục vật tư', to: '/products' },
            { label: 'Giỏ hàng của tôi' },
          ]}
        />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <span className="material-symbols-outlined text-brand-dark/40 text-6xl">shopping_basket</span>
          <h1 className="text-xl font-helvetica-neue tracking-tight text-brand-dark mt-4">
            Giỏ hàng của bạn đang trống
          </h1>
          <Link
            to="/products"
            className="inline-block mt-5 px-6 py-2.5 rounded-full bg-brand-dark text-white hover:bg-brand-green tracking-wide uppercase text-sm transition-colors"
          >
            Tiếp tục mua vật tư
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Trang chủ', to: '/' },
          { label: 'Danh mục vật tư', to: '/products' },
          { label: 'Giỏ hàng của tôi' },
        ]}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-brand-dark/10">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-1 font-helvetica-neue">
                Đơn hàng
              </p>
              <h1 className="text-xl sm:text-2xl font-helvetica-neue tracking-tight text-brand-dark flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-dark/60 text-[28px]">
                  shopping_basket
                </span>
                Giỏ hàng của bạn
                <span className="text-sm text-brand-dark/50 bg-brand-light px-2.5 py-0.5 rounded-full border border-brand-dark/10">
                  ({items.length} sản phẩm)
                </span>
              </h1>
            </div>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-brand-dark/50 hover:text-status-error flex items-center gap-1 tracking-wide transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
            <span>Xóa tất cả</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-brand-dark/10 overflow-hidden">
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-3.5 bg-brand-light border-b border-brand-dark/10 text-xs tracking-[0.15em] uppercase text-brand-dark/50">
                <div className="col-span-6">Sản phẩm vật tư</div>
                <div className="col-span-2 text-center">Đơn giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-right">Thành tiền</div>
              </div>
              <div className="divide-y divide-brand-dark/10">
                {items.map((item, idx) => (
                  <CartItemRow
                    key={item.product.slug}
                    item={item}
                    alternate={idx % 2 === 1}
                    onQuantityChange={(quantity) => updateQuantity(item.product.slug, quantity)}
                    onRemove={() => removeFromCart(item.product.slug)}
                  />
                ))}
              </div>
            </div>

            <VoucherBar
              voucherInput={voucherInput}
              onVoucherInputChange={setVoucherInput}
              onApply={handleApplyVoucher}
              appliedVoucher={voucherResult?.code ?? null}
              voucherError={voucherError}
              discount={voucherResult?.discount ?? 0}
            />

            <CartPerksGrid />
          </div>

          <CartSummarySidebar
            itemCount={items.length}
            subtotal={subtotal}
            discount={discount}
            appliedVoucher={voucherResult?.code ?? null}
            shippingFee={shippingFee}
            total={total}
            onCheckout={() => navigate('/checkout')}
          />
        </div>
      </div>
    </>
  )
}
