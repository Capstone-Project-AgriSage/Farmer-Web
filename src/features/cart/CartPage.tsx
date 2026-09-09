import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { useCart } from '../../context/CartContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import CartItemRow from './components/CartItemRow'
import VoucherBar from './components/VoucherBar'
import CartPerksGrid from './components/CartPerksGrid'
import CartSummarySidebar from './components/CartSummarySidebar'

const VALID_VOUCHER_CODE = 'VUMUA2024'
const VOUCHER_DISCOUNT = 50000
const FREE_SHIPPING_THRESHOLD = 2000000

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeFromCart, clearCart } = useCart()
  const navigate = useNavigate()
  useDocumentTitle('Giỏ hàng của tôi')

  const [voucherInput, setVoucherInput] = useState(VALID_VOUCHER_CODE)
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(VALID_VOUCHER_CODE)
  const [voucherError, setVoucherError] = useState('')

  const handleApplyVoucher = () => {
    const code = voucherInput.trim().toUpperCase()
    if (code === VALID_VOUCHER_CODE) {
      setAppliedVoucher(code)
      setVoucherError('')
    } else {
      setAppliedVoucher(null)
      setVoucherError('Mã ưu đãi không hợp lệ hoặc đã hết hạn')
    }
  }

  const discount = items.length > 0 && appliedVoucher ? VOUCHER_DISCOUNT : 0
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 30000
  const total = subtotal - discount + shippingFee

  if (items.length === 0) {
    return (
      <>
        <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Danh mục vật tư', to: '/products' }, { label: 'Giỏ hàng của tôi' }]} />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <span className="material-symbols-outlined text-primary text-6xl">shopping_basket</span>
          <h1 className="text-xl font-bold text-text-primary mt-4">Giỏ hàng của bạn đang trống</h1>
          <Link to="/products" className="inline-block mt-4 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold text-sm rounded-lg">
            Tiếp tục mua vật tư
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Danh mục vật tư', to: '/products' }, { label: 'Giỏ hàng của tôi' }]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[28px]">shopping_basket</span>
              Giỏ hàng của bạn
              <span className="text-sm font-semibold text-text-muted bg-surface-secondary px-2.5 py-0.5 rounded-full border border-border-subtle">
                ({items.length} sản phẩm)
              </span>
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-status-error hover:underline flex items-center gap-1 font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
            <span>Xóa tất cả</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-3.5 bg-surface-subtle border-b border-border-subtle text-xs font-bold text-text-secondary uppercase tracking-wider">
                <div className="col-span-6">Sản phẩm vật tư</div>
                <div className="col-span-2 text-center">Đơn giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-right">Thành tiền</div>
              </div>
              <div className="divide-y divide-border-subtle">
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
              appliedVoucher={appliedVoucher}
              voucherError={voucherError}
              discount={VOUCHER_DISCOUNT}
            />

            <CartPerksGrid />
          </div>

          <CartSummarySidebar
            itemCount={items.length}
            subtotal={subtotal}
            discount={discount}
            appliedVoucher={appliedVoucher}
            shippingFee={shippingFee}
            total={total}
            onCheckout={() => navigate('/checkout')}
          />
        </div>
      </div>
    </>
  )
}
