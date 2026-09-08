import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useClipboard } from '../../hooks/useClipboard'
import CheckoutStepper from './components/CheckoutStepper'
import AddressForm, { type DeliveryMode } from './components/AddressForm'
import ShippingMethodSelector, { type ShippingMethod } from './components/ShippingMethodSelector'
import PaymentMethodSelector, { type CopyField, type PaymentMethod } from './components/PaymentMethodSelector'
import OrderSummarySidebar from './components/OrderSummarySidebar'

const VOUCHER_DISCOUNT = 50000

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  useDocumentTitle('Thanh toán đơn hàng')

  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('garden')
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('truck')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vietqr')
  const { copiedField, copy } = useClipboard<CopyField>()

  const discount = items.length > 0 ? VOUCHER_DISCOUNT : 0
  const shippingFee = shippingMethod === 'express' ? 45000 : 0
  const total = subtotal - discount + shippingFee

  const handleConfirm = () => {
    clearCart()
    navigate('/order-success')
  }

  return (
    <>
      <CheckoutStepper />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <AddressForm deliveryMode={deliveryMode} onDeliveryModeChange={setDeliveryMode} />
            <ShippingMethodSelector shippingMethod={shippingMethod} onShippingMethodChange={setShippingMethod} />
            <PaymentMethodSelector
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              total={total}
              copiedField={copiedField}
              onCopy={copy}
            />
          </div>

          <OrderSummarySidebar
            items={items}
            subtotal={subtotal}
            discount={discount}
            shippingFee={shippingFee}
            total={total}
            onConfirm={handleConfirm}
          />
        </div>
      </div>
    </>
  )
}
