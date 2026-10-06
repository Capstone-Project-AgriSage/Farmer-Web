import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { ordersApi } from '../../api/ordersApi'
import type { OrderResponse } from '../../api/types'
import OrderSuccessStepper from './components/OrderSuccessStepper'
import SuccessHeroBanner from './components/SuccessHeroBanner'
import OrderTimeline from './components/OrderTimeline'
import DeliveryInfoCard from './components/DeliveryInfoCard'
import PaymentReceiptCard from './components/PaymentReceiptCard'
import OrderItemsSummaryCard from './components/OrderItemsSummaryCard'
import AgronomistCard from './components/AgronomistCard'
import PostPurchaseGuarantees from './components/PostPurchaseGuarantees'

export default function OrderSuccessPage() {
  useDocumentTitle('Đặt hàng thành công')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<OrderResponse | null>(null)

  useEffect(() => {
    if (orderId) {
      ordersApi.getOrderById(orderId)
        .then(setOrder)
        .catch(err => {
          console.error(err)
          navigate('/products')
        })
    }
  }, [orderId, navigate])

  if (!order) return <div className="p-10 text-center">Đang tải thông tin đơn hàng...</div>

  return (
    <div className="bg-brand-cream text-brand-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 w-full">
        <OrderSuccessStepper />
        <SuccessHeroBanner order={order} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <OrderTimeline />
            <DeliveryInfoCard order={order} />
            <PaymentReceiptCard order={order} />
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <OrderItemsSummaryCard order={order} />
            <AgronomistCard />
            <PostPurchaseGuarantees />
          </div>
        </div>
      </div>
    </div>
  )
}
