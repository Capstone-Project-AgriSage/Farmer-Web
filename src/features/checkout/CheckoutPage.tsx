import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ordersApi } from '../../api/ordersApi'
import { startPayosPayment } from './payos'
import { ApiError, describeApiError } from '../../api/client'
import { useCart } from '../../context/CartContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useClipboard } from '../../hooks/useClipboard'
import CheckoutStepper from './components/CheckoutStepper'
import AddressForm, {
  addressFormDefaults,
  validateAddressForm,
  type AddressFormErrors,
  type AddressFormValues,
  type DeliveryMode,
} from './components/AddressForm'
import ShippingMethodSelector, { type ShippingMethod } from './components/ShippingMethodSelector'
import PaymentMethodSelector, { type CopyField, type PaymentMethod } from './components/PaymentMethodSelector'
import OrderSummarySidebar from './components/OrderSummarySidebar'


export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  useDocumentTitle('Thanh toán đơn hàng')

  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('garden')
  const [address, setAddress] = useState<AddressFormValues>(addressFormDefaults)
  const [addressErrors, setAddressErrors] = useState<AddressFormErrors>({})
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('truck')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('payos')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { copiedField, copy } = useClipboard<CopyField>()
  const addressFormRef = useRef<HTMLDivElement>(null)

  const discount = 0
  const shippingFee = shippingMethod === 'express' ? 45000 : 0
  const total = subtotal + shippingFee

  const handleAddressChange = (field: keyof AddressFormValues, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }))
  }

  const handleConfirm = async () => {
    const errors = validateAddressForm(address)
    setAddressErrors(errors)
    if (Object.keys(errors).length > 0) {
      addressFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    
    setIsSubmitting(true)
    try {
      const payload: any = {
        source: 'FARMER_WEB',
        // "Gối nợ mùa vụ" is a credit order; payOS and cash both settle the full amount before the store confirms.
        settlementType: paymentMethod === 'credit' ? 'CREDIT' : 'FULL_PAYMENT',
        fulfillmentType: deliveryMode === 'garden' ? 'DELIVERY' : 'PICKUP',
      }
      
      if (deliveryMode === 'garden') {
        if (address.useAddressBook && address.selectedAddressId) {
          payload.addressId = address.selectedAddressId
        } else {
          payload.deliveryAddress = {
            recipientName: address.recipientName,
            recipientPhone: address.phone,
            addressLine: address.addressDetail,
            province: address.province,
            ward: address.ward,
            district: address.district,
          }
        }
      }
      
      const order = await ordersApi.createOrder(payload)
      await clearCart()
      
      if (paymentMethod === 'payos') {
        try {
          await startPayosPayment(order.id)
          return
        } catch (payErr: any) {
          console.error('PayOS Error:', payErr)
          alert('Đơn hàng đã được tạo nhưng chưa mở được cổng thanh toán payOS. Bác có thể thanh toán lại trong Chi tiết đơn hàng.')
        }
      } 
      
      navigate(`/order-success?orderId=${order.id}`)
    } catch (err) {
      console.error(err)
      if (err instanceof ApiError && /credit refused/i.test(err.detail ?? '')) {
        alert('Bác chưa đủ điều kiện mua chịu (hết hạn mức hoặc chưa có hồ sơ tín dụng). Vui lòng chọn thanh toán payOS hoặc tiền mặt.')
      } else if (err instanceof ApiError && /empty/i.test(err.detail ?? '')) {
        alert('Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ trước khi thanh toán.')
      } else {
        alert(describeApiError(err, 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-brand-cream text-brand-dark">
      <CheckoutStepper />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div ref={addressFormRef}>
              <AddressForm
                deliveryMode={deliveryMode}
                onDeliveryModeChange={setDeliveryMode}
                values={address}
                onChange={handleAddressChange}
                errors={addressErrors}
              />
            </div>
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
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  )
}
