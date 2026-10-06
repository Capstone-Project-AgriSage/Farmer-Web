import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { formatVnd } from '../../data/format'
import { ordersApi } from '../../api/ordersApi'
import { paymentsApi } from '../../api/paymentsApi'
import { describeApiError } from '../../api/client'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import type { MyDelivery, OrderPaymentSummary, OrderResponse } from '../../api/types'
import OrderPaymentPanel from './components/OrderPaymentPanel'
import { DELIVERY_STATUS, FAILURE_REASON, ORDER_STATUS, TONE_CLASSES, formatAddress, labelOf } from './orderLabels'

export default function OrderDetailPage() {
  const { code: orderId } = useParams<{ code: string }>()
  const [order, setOrder] = useState<OrderResponse | null>(null)
  const [deliveries, setDeliveries] = useState<MyDelivery[]>([])
  const [paymentSummary, setPaymentSummary] = useState<OrderPaymentSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notification, setNotification] = useState<string | null>(null)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      setIsLoading(true)
      const [res, delRes, payRes] = await Promise.all([
        ordersApi.getOrderById(orderId!),
        ordersApi.getOrderDeliveries(orderId!).catch((): MyDelivery[] => []),
        paymentsApi.getOrderPayments(orderId!).catch(() => null)
      ])
      setOrder(res)
      setDeliveries(delRes)
      setPaymentSummary(payRes)
    } catch (err) {
      showNotification(describeApiError(err, 'Lỗi tải đơn hàng'))
    } finally {
      setIsLoading(false)
    }
  }

  useDocumentTitle(order ? `Chi tiết đơn hàng ${order.orderNumber}` : 'Đang tải...')

  if (isLoading) {
    return <div className="bg-brand-cream min-h-screen pt-20 px-4 text-center">Đang tải...</div>
  }

  if (!order) {
    return (
      <div className="bg-brand-cream min-h-screen pt-20 px-4 text-center">
        <h1 className="text-xl text-brand-dark">Không tìm thấy đơn hàng</h1>
        <Link to="/orders" className="text-brand-dark/60 hover:text-brand-dark mt-4 inline-block">
          Quay lại danh sách
        </Link>
      </div>
    )
  }

  const showNotification = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 4000)
  }

  const handleCancelOrder = async () => {
    if (confirm('Bác có chắc chắn muốn hủy đơn hàng này không?')) {
      try {
        await ordersApi.cancelOrder(order.id, 'Người dùng hủy')
        showNotification(`Đã hủy đơn hàng ${order.orderNumber} thành công.`)
        fetchOrder()
      } catch (err) {
        showNotification(describeApiError(err, 'Lỗi hủy đơn hàng'))
      }
    }
  }

  const getCurrentStepIndex = () => {
    switch (order.status) {
      case 'PENDING_CONFIRMATION':
      case 'CONFIRMED':
        return 0
      case 'PREPARING':
        return 1
      case 'READY_FOR_FULFILLMENT':
      case 'PARTIALLY_FULFILLED':
        return 2
      case 'COMPLETED':
        return 3
      default:
        return -1
    }
  }
  const currentStepIdx = getCurrentStepIndex()
  const stepLabels = ['Chờ duyệt', 'Đóng gói', 'Đang giao', 'Hoàn thành']

  return (
    <div className="bg-brand-cream text-brand-dark min-h-screen pb-20">
      <Breadcrumb
        items={[
          { label: 'Trang chủ', to: '/' },
          { label: 'Tài khoản', to: '/account' },
          { label: 'Đơn hàng của tôi', to: '/orders' },
          { label: order.orderNumber },
        ]}
      />

      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-brand-dark text-white px-5 py-3 rounded-full flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-brand-light text-[20px]">task_alt</span>
          <span className="text-sm tracking-wide">{notification}</span>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-[32px] p-6 sm:p-10 shadow-[0_4px_24px_rgb(0,0,0,0.02)] border border-brand-dark/5 space-y-10">
          
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-helvetica-neue tracking-tight text-brand-dark flex flex-wrap items-center gap-3">
                Chi tiết đơn hàng
                <span className="font-helvetica-neue text-brand-green bg-brand-green/10 px-3 py-1 rounded-xl text-lg sm:text-xl border border-brand-green/20">{order.orderNumber}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${TONE_CLASSES[labelOf(ORDER_STATUS, order.status).tone]}`}>
                  {labelOf(ORDER_STATUS, order.status).label}
                </span>
              </h1>
              {order.cancelReason && (
                <p className="text-sm text-rose-700 mt-2">Lý do huỷ: {order.cancelReason}</p>
              )}
              <p className="text-sm text-brand-dark/50 mt-2 font-medium">Đặt ngày {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
            </div>
            {order.status === 'PENDING_CONFIRMATION' && (
              <button
                onClick={handleCancelOrder}
                className="px-6 py-3 rounded-xl bg-rose-50 text-rose-600 font-semibold tracking-wide text-sm transition-colors hover:bg-rose-100 self-start sm:self-auto flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
                Hủy đơn hàng
              </button>
            )}
          </div>

          <hr className="border-brand-dark/5" />

          {/* TRACKING PROGRESS */}
          {!['CANCELLED', 'PARTIALLY_CANCELLED'].includes(order.status) && (
            <div className="space-y-8">
              <div>
                <h3 className="text-[11px] tracking-[0.2em] font-semibold  text-brand-dark/40 mb-8 text-center sm:text-left">Trạng thái giao hàng</h3>
                <div className="flex items-start w-full">
                  {stepLabels.map((label, idx) => {
                    const isCurrent = idx === currentStepIdx
                    const isPassed = idx < currentStepIdx
                    return (
                      <div key={idx} className="flex flex-col items-center flex-1 relative">
                        <div className="flex items-center w-full">
                          {/* Left Line */}
                          <div className={`flex-1 h-[2px] ${idx === 0 ? 'bg-transparent' : (isPassed || isCurrent ? 'bg-brand-green' : 'bg-brand-dark/5')}`}></div>
                          
                          {/* Dot */}
                          <div
                            className={`w-5 h-5 rounded-full shrink-0 transition-colors z-10 flex items-center justify-center ${
                              isPassed
                                ? 'bg-brand-green text-white'
                                : isCurrent
                                  ? 'bg-brand-dark ring-4 ring-brand-dark/10'
                                  : 'bg-brand-cream border-2 border-brand-dark/10'
                            }`}
                          >
                            {isPassed && <span className="material-symbols-outlined text-[12px] font-medium">check</span>}
                          </div>
                          
                          {/* Right Line */}
                          <div className={`flex-1 h-[2px] relative flex items-center ${idx === stepLabels.length - 1 ? 'bg-transparent' : (isPassed ? 'bg-brand-green' : 'bg-brand-dark/5')}`}>
                          </div>
                        </div>
                        
                        {/* Label */}
                        <span
                          className={`text-[10px] sm:text-[11px] tracking-wide  transition-colors text-center mt-3 px-1 ${
                            isCurrent || isPassed ? 'text-brand-dark font-medium' : 'text-brand-dark/40 font-medium'
                          }`}
                        >
                          {label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {deliveries && deliveries.length > 0 ? (
                <div className="space-y-4">
                  {deliveries.map((delivery) => {
                    const status = labelOf(DELIVERY_STATUS, delivery.status)
                    const isRetry = delivery.status === 'RETRY_PENDING'
                    const failAttempt = [...delivery.attempts].reverse().find((a) => a.status === 'FAILED')
                    const failReason = failAttempt?.failureReasonCode
                    const deliveryDate = delivery.dispatchedAt || delivery.scheduledAt
                    return (
                      <div key={delivery.id} className={`p-5 rounded-2xl border ${isRetry ? 'border-rose-100 bg-rose-50/50' : 'border-brand-dark/5 bg-brand-cream/30'}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-helvetica-neue text-[15px] font-semibold text-brand-dark">{delivery.deliveryNumber}</span>
                              <span className={`px-2.5 py-0.5 text-[10px]  font-medium tracking-wider rounded-full border ${TONE_CLASSES[status.tone]}`}>
                                {status.label}
                              </span>
                            </div>
                            {deliveryDate && (
                              <div className="text-[13px] text-brand-dark/60 font-medium">
                                Ngày: {new Date(deliveryDate).toLocaleDateString('vi-VN')}
                              </div>
                            )}
                          </div>
                        </div>

                        {isRetry && failReason && (
                          <div className="mb-4 text-[13px] font-medium text-rose-700 flex gap-2 items-start bg-rose-100/50 p-3 rounded-xl">
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            <span>Lần giao trước không thành công: {FAILURE_REASON[failReason] ?? failReason}</span>
                          </div>
                        )}

                        <div className="text-[14px] text-brand-dark/70 space-y-1.5 mb-4">
                          <p>Nhân viên giao: <strong className="text-brand-dark">{delivery.assignedTo?.fullName || 'Đang cập nhật'}</strong></p>
                          <p>Số điện thoại: <strong className="text-brand-dark">{delivery.assignedTo?.phoneNumber || 'Đang cập nhật'}</strong></p>
                        </div>

                        <div className="pt-4 border-t border-brand-dark/5">
                          <div className="text-[11px] font-semibold tracking-wider text-brand-dark/40  mb-3">Sản phẩm đợt này</div>
                          <ul className="space-y-2">
                            {delivery.items.map((item) => (
                              <li key={item.orderItemId} className="text-[14px] flex justify-between items-center bg-white p-2.5 rounded-xl border border-brand-dark/5 shadow-sm">
                                <span className="text-brand-dark font-medium px-1">
                                  {item.productName} <span className="text-brand-dark/50 font-normal">({item.packagingName})</span>
                                </span>
                                <span className="font-helvetica-neue text-brand-dark/60 font-medium px-2">
                                  {item.deliveredQuantity > 0 ? `${item.deliveredQuantity}/${item.plannedQuantity}` : `x${item.plannedQuantity}`}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : ['READY_FOR_FULFILLMENT', 'PARTIALLY_FULFILLED'].includes(order.status) && (
                <div className="mt-6 p-5 bg-brand-cream/40 rounded-2xl border border-brand-dark/5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-brand-green">local_shipping</span>
                  </div>
                  <div className="text-[14px] text-brand-dark/70 space-y-1.5 pt-0.5">
                    <p className="text-brand-dark font-medium mb-2">Đơn hàng đang chuẩn bị giao.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ORDER INFO */}
          <div className="grid sm:grid-cols-2 gap-8 pt-4">
            <div className="space-y-4">
              <h3 className="text-[11px] tracking-[0.2em] font-semibold  text-brand-dark/40 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                Thông tin nhận hàng
              </h3>
              <div className="text-[14px] text-brand-dark/70 space-y-2.5 bg-brand-cream/20 p-5 rounded-2xl border border-brand-dark/5">
                {order.fulfillmentType === 'PICKUP' || !order.deliveryAddress ? (
                  <p>Hình thức: <strong className="text-brand-dark">Nhận tại cửa hàng</strong></p>
                ) : (
                  <>
                    <p>Người nhận: <strong className="text-brand-dark">{order.deliveryAddress.recipientName}</strong></p>
                    <p>Số điện thoại: <strong className="text-brand-dark">{order.deliveryAddress.recipientPhone}</strong></p>
                    <p>Địa chỉ: <strong className="text-brand-dark">{formatAddress(order.deliveryAddress)}</strong></p>
                  </>
                )}
                {order.note && <p>Ghi chú: <strong className="text-brand-dark">{order.note}</strong></p>}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-[11px] tracking-[0.2em] font-semibold  text-brand-dark/40 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">payments</span>
                Thanh toán
              </h3>
              <div className="bg-brand-cream/20 p-5 rounded-2xl border border-brand-dark/5">
                <OrderPaymentPanel order={order} summary={paymentSummary} onStale={fetchOrder} />
              </div>
            </div>
          </div>

          <hr className="border-brand-dark/5" />

          {/* ITEMS */}
          <div className="space-y-6">
            <h3 className="text-[11px] tracking-[0.2em] font-semibold  text-brand-dark/40 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">inventory_2</span>
              Danh sách sản phẩm
            </h3>
            <div className="divide-y divide-brand-dark/5">
              {order.items.map((item) => (
                <div key={item.id} className="py-5 flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-[16px] border border-brand-dark/5 bg-brand-cream flex items-center justify-center text-brand-dark/30 shrink-0">
                    <span className="material-symbols-outlined text-[32px]">inventory_2</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-brand-dark font-medium text-[15px]">{item.productName}</h4>
                    <p className="text-[13px] text-brand-dark/50 font-medium">{item.packagingName}</p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <div className="font-helvetica-neue text-brand-dark font-medium text-[15px]">{formatVnd(item.unitPrice)}</div>
                    <div className="text-[13px] text-brand-dark/50 font-medium bg-brand-cream px-2 py-0.5 rounded-md inline-block mt-1">SL: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-6 space-y-3 text-[15px]">
              <div className="flex justify-between items-center text-brand-dark/70">
                <span className="font-medium">Tạm tính</span>
                <span className="font-helvetica-neue text-brand-dark font-semibold">{formatVnd(order.subtotalAmount)}</span>
              </div>
              <div className="flex justify-between items-center pt-6 mt-4 border-t-2 border-brand-dark/10 border-dashed">
                <span className="text-brand-dark font-medium text-lg">Thành tiền</span>
                <span className="font-helvetica-neue text-brand-dark text-3xl font-medium tracking-tight">{formatVnd(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
