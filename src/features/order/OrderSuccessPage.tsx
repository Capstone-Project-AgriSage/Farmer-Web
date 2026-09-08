import { useDocumentTitle } from '../../hooks/useDocumentTitle'
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <OrderSuccessStepper />
      <SuccessHeroBanner />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <OrderTimeline />
          <DeliveryInfoCard />
          <PaymentReceiptCard />
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <OrderItemsSummaryCard />
          <AgronomistCard />
          <PostPurchaseGuarantees />
        </div>
      </div>
    </div>
  )
}
