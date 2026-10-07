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
import OrderProgress from './components/OrderProgress'
import { ATTEMPT_STATUS, DELIVERY_STATUS, FAILURE_REASON, ORDER_STATUS, TONE_CLASSES, formatAddress, formatDateTime, labelOf } from './orderLabels'

function SectionTitle({ children }: { children: string }) {
  return <h2 className="text-[13px] uppercase tracking-[0.16em] text-text-secondary mb-4">{children}</h2>
}

function DetailSkeleton() {
  return (
    <div className="max-w-[1240px] mx-auto px-6 lg:px-8 py-10 space-y-6" aria-busy="true" aria-label="Đang tải đơn hàng">
      <div className="h-10 w-72 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
      <div className="h-28 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 h-80 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
        <div className="lg:col-span-5 h-80 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
      </div>
    </div>
  )
}

export default function OrderDetailPage() {
  const { code: orderId } = useParams<{ code: string }>()
  const [order, setOrder] = useState<OrderResponse | null>(null)
  const [deliveries, setDeliveries] = useState<MyDelivery[]>([])
  const [paymentSummary, setPaymentSummary] = useState<OrderPaymentSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [notification, setNotification] = useState<string | null>(null)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      setIsLoading(true)
      setLoadError(null)
      const [res, delRes, payRes] = await Promise.all([
        ordersApi.getOrderById(orderId!),
        ordersApi.getOrderDeliveries(orderId!).catch((): MyDelivery[] => []),
        paymentsApi.getOrderPayments(orderId!).catch(() => null),
      ])
      setOrder(res)
      setDeliveries(delRes)
      setPaymentSummary(payRes)
    } catch (err) {
      setLoadError(describeApiError(err, 'Lỗi tải đơn hàng'))
    } finally {
      setIsLoading(false)
    }
  }

  useDocumentTitle(order ? `Chi tiết đơn hàng ${order.orderNumber}` : 'Đang tải...')

  if (isLoading) {
    return (
      <div className="bg-brand-cream min-h-screen">
        <DetailSkeleton />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="bg-brand-cream min-h-screen px-6 py-20 text-center">
        <h1 className="text-2xl text-text-primary">{loadError ?? 'Không tìm thấy đơn hàng'}</h1>
        <div className="mt-6 flex items-center justify-center gap-3">
          {loadError && (
            <button type="button" onClick={fetchOrder} className="focus-ring min-h-[44px] px-7 rounded-full bg-brand-dark text-white hover:bg-brand-green text-[15px] transition-colors">
              Thử lại
            </button>
          )}
          <Link to="/orders" className="focus-ring inline-flex items-center min-h-[44px] px-7 rounded-full border border-brand-dark/30 text-[15px] text-text-primary hover:bg-brand-dark hover:text-white transition-colors">
            Quay lại danh sách
          </Link>
        </div>
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

  const status = labelOf(ORDER_STATUS, order.status)
  const isCancelled = order.status === 'CANCELLED'
  const orderedUnits = order.items.reduce((sum, item) => sum + item.quantity, 0)
  const deliveredUnits = deliveries.reduce((sum, d) => sum + d.items.reduce((s, item) => s + item.deliveredQuantity, 0), 0)

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
        <div role="status" className="fixed top-24 right-6 z-50 bg-brand-dark text-white px-5 py-3 rounded-full flex items-center gap-3">
          <span className="material-symbols-outlined text-brand-light" style={{ fontSize: 20 }} aria-hidden="true">
            task_alt
          </span>
          <span className="text-[15px]">{notification}</span>
        </div>
      )}

      <div className="max-w-[1240px] mx-auto px-6 lg:px-8 py-10 md:py-14">
        <Link to="/orders" className="focus-ring inline-flex items-center gap-2 text-text-secondary hover:text-text-primary font-medium text-[15px] transition-colors mb-8">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden="true">arrow_back</span>
          Quay lại danh sách
        </Link>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div>
            <p className="text-[13px] uppercase tracking-[0.16em] text-text-secondary mb-3">Chi tiết đơn hàng</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <h1 className="text-[length:var(--type-h1)] leading-[var(--type-h1-lh)] font-light tracking-tight text-text-primary">{order.orderNumber}</h1>
              <span className={`px-3 py-1 rounded-full text-[15px] font-medium border ${TONE_CLASSES[status.tone]}`}>{status.label}</span>
            </div>
            <p className="mt-2 text-[15px] text-text-secondary">
              Đặt ngày {new Date(order.createdAt).toLocaleDateString('vi-VN')} · {order.settlementType === 'CREDIT' ? 'Mua chịu' : 'Thanh toán ngay'} ·{' '}
              {order.fulfillmentType === 'DELIVERY' ? 'Giao tận nơi' : 'Nhận tại cửa hàng'}
            </p>
          </div>
          {order.status === 'PENDING_CONFIRMATION' && (
            <button
              type="button"
              onClick={handleCancelOrder}
              className="focus-ring inline-flex items-center gap-2 min-h-[44px] px-5 rounded-full border border-status-error/50 text-[15px] text-status-error hover:bg-status-error-surface transition-colors self-start md:self-auto"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden="true">
                cancel
              </span>
              Hủy đơn hàng
            </button>
          )}
        </div>

        {/* Progress, or the cancellation card when the whole order was cancelled */}
        <section className="mt-10 border-y border-brand-dark/15 py-8">
          {isCancelled ? (
            <div role="status" className="flex items-start gap-4 p-5 border border-status-error/40 bg-status-error-surface rounded-[var(--radius-surface)]">
              <span className="material-symbols-outlined text-status-error shrink-0" style={{ fontSize: 28 }} aria-hidden="true">
                cancel
              </span>
              <div>
                <p className="text-lg font-medium text-text-primary">Đơn hàng đã huỷ</p>
                {order.cancelReason && <p className="mt-1 text-[15px] md:text-base text-text-primary">Lý do: {order.cancelReason}</p>}
                {order.cancelledAt && <p className="mt-1 text-[15px] text-text-secondary">Thời gian: {formatDateTime(order.cancelledAt)}</p>}
              </div>
            </div>
          ) : (
            <>
              <OrderProgress
                status={order.status}
                fulfillmentType={order.fulfillmentType}
                delivered={deliveredUnits}
                total={orderedUnits}
                hasConfirmation={Boolean(order.confirmedAt)}
                hasDeliveries={deliveries.length > 0}
              />
              {order.status === 'PARTIALLY_CANCELLED' && (
                <div role="status" className="mt-6 flex items-start gap-3 p-4 border-l-4 border-status-warning bg-status-warning-surface text-[15px] text-text-primary">
                  <span className="material-symbols-outlined text-status-warning shrink-0" style={{ fontSize: 22 }} aria-hidden="true">
                    warning
                  </span>
                  <div>
                    <p className="font-medium">Phần còn lại đã huỷ</p>
                    {order.cancelReason && <p>Lý do: {order.cancelReason}</p>}
                    {order.cancelledAt && <p className="text-text-secondary">Thời gian: {formatDateTime(order.cancelledAt)}</p>}
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Main column */}
          <div className="lg:col-span-7 space-y-12 min-w-0">
            {/* Deliveries */}
            {!isCancelled && deliveries.length > 0 && (
              <section>
                <SectionTitle>Giao hàng</SectionTitle>
                <div className="space-y-6">
                  {deliveries.map((delivery) => {
                    const deliveryStatus = labelOf(DELIVERY_STATUS, delivery.status)
                    const isRetry = delivery.status === 'RETRY_PENDING'
                    const failAttempt = [...delivery.attempts].reverse().find((a) => a.status === 'FAILED')
                    const failReason = failAttempt?.failureReasonCode
                    const deliveryDate = delivery.dispatchedAt || delivery.scheduledAt
                    return (
                      <article key={delivery.id} className={`p-5 sm:p-6 border rounded-[var(--radius-surface)] ${isRetry ? 'border-status-error/40 bg-status-error-surface' : 'border-brand-dark/15 bg-white'}`}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-medium text-text-primary">{delivery.deliveryNumber}</h3>
                            <span className={`px-3 py-0.5 rounded-full text-[13px] font-medium border ${TONE_CLASSES[deliveryStatus.tone]}`}>{deliveryStatus.label}</span>
                          </div>
                          {deliveryDate && <p className="text-[15px] text-text-secondary">Ngày {new Date(deliveryDate).toLocaleDateString('vi-VN')}</p>}
                        </div>

                        {isRetry && failReason && (
                          <p role="alert" className="mt-4 flex items-start gap-2 text-[15px] font-medium text-status-error">
                            <span className="material-symbols-outlined shrink-0" style={{ fontSize: 20 }} aria-hidden="true">
                              error
                            </span>
                            Lần giao trước không thành công: {FAILURE_REASON[failReason] ?? failReason}
                          </p>
                        )}

                        <p className="mt-4 text-[15px] text-text-secondary">
                          Nhân viên giao: <strong className="text-text-primary font-medium">{delivery.assignedTo?.fullName || 'Đang cập nhật'}</strong> · SĐT:{' '}
                          <strong className="text-text-primary font-medium">{delivery.assignedTo?.phoneNumber || 'Đang cập nhật'}</strong>
                        </p>

                        <ul className="mt-4 divide-y divide-brand-dark/10 border-t border-brand-dark/10">
                          {delivery.items.map((item) => (
                            <li key={item.orderItemId} className="py-3 flex items-center justify-between gap-4 text-[15px]">
                              <span className="text-text-primary">
                                {item.productName} <span className="text-text-secondary">({item.packagingName})</span>
                              </span>
                              <span className="text-text-secondary whitespace-nowrap">{item.deliveredQuantity > 0 ? `${item.deliveredQuantity}/${item.plannedQuantity}` : `x${item.plannedQuantity}`}</span>
                            </li>
                          ))}
                        </ul>

                        {/* One note can take several trips: each attempt keeps its proof photo. */}
                        {delivery.attempts.length > 0 && (
                          <div className="mt-5 pt-5 border-t border-brand-dark/10">
                            <h4 className="text-[13px] uppercase tracking-[0.16em] text-text-secondary mb-3">Các lần giao</h4>
                            <ol className="space-y-3">
                              {delivery.attempts.map((attempt) => {
                                const attemptStatus = labelOf(ATTEMPT_STATUS, attempt.status)
                                return (
                                  <li key={attempt.attemptNumber} className="flex gap-4 items-start">
                                    <div className="flex-1 min-w-0 text-[15px] text-text-secondary space-y-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-medium text-text-primary">Lần {attempt.attemptNumber}</span>
                                        <span className={`px-2.5 py-0.5 text-[13px] rounded-full border ${TONE_CLASSES[attemptStatus.tone]}`}>{attemptStatus.label}</span>
                                        <span className="text-[13px]">{formatDateTime(attempt.completedAt || attempt.startedAt)}</span>
                                      </div>
                                      {attempt.failureReasonCode && <p>Lý do: {FAILURE_REASON[attempt.failureReasonCode] ?? attempt.failureReasonCode}</p>}
                                      {attempt.receiverName && (
                                        <p>
                                          Người nhận: <strong className="text-text-primary font-medium">{attempt.receiverName}</strong>
                                        </p>
                                      )}
                                    </div>
                                    {attempt.proofImageUrl && (
                                      <a href={attempt.proofImageUrl} target="_blank" rel="noreferrer" className="focus-ring shrink-0" title="Xem ảnh giao hàng">
                                        <img
                                          src={attempt.proofImageUrl}
                                          alt={`Ảnh giao hàng lần ${attempt.attemptNumber}`}
                                          className="w-24 h-24 object-cover rounded-[var(--radius-surface)] border border-brand-dark/15"
                                          loading="lazy"
                                        />
                                      </a>
                                    )}
                                  </li>
                                )
                              })}
                            </ol>
                          </div>
                        )}
                      </article>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Items */}
            <section>
              <SectionTitle>Sản phẩm</SectionTitle>
              <ul className="border-t border-brand-dark/15">
                {order.items.map((item) => (
                  <li key={item.id} className="py-5 flex gap-4 items-center border-b border-brand-dark/15">
                    <span className="shrink-0 w-14 h-14 border border-brand-dark/15 bg-brand-light flex items-center justify-center text-text-muted rounded-[var(--radius-surface)]" aria-hidden="true">
                      <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
                        inventory_2
                      </span>
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-text-primary">{item.productName}</p>
                      <p className="text-[15px] text-text-secondary">{item.packagingName}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-base text-text-primary">{formatVnd(item.unitPrice)}</p>
                      <p className="text-[15px] text-text-secondary">Số lượng: {item.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="mt-6 space-y-3">
                <div className="flex justify-between text-[15px] text-text-secondary">
                  <dt>Tạm tính</dt>
                  <dd className="text-text-primary">{formatVnd(order.subtotalAmount)}</dd>
                </div>
                <div className="flex justify-between items-baseline pt-4 border-t border-brand-dark/15">
                  <dt className="text-lg text-text-primary">Thành tiền</dt>
                  <dd className="text-3xl font-light tracking-tight text-text-primary">{formatVnd(order.totalAmount)}</dd>
                </div>
              </dl>
            </section>
          </div>

          {/* Side column: payment first (what is owed), then where it goes */}
          <aside className="lg:col-span-5 space-y-10 lg:sticky lg:top-28">
            <section className="border border-brand-dark/15 bg-white p-6 sm:p-7 rounded-[var(--radius-surface)]">
              <SectionTitle>Thanh toán</SectionTitle>
              <OrderPaymentPanel order={order} summary={paymentSummary} onStale={fetchOrder} />
            </section>

            <section className="border border-brand-dark/15 bg-white p-6 sm:p-7 rounded-[var(--radius-surface)]">
              <SectionTitle>{order.fulfillmentType === 'PICKUP' || !order.deliveryAddress ? 'Nhận hàng' : 'Thông tin nhận hàng'}</SectionTitle>
              {order.fulfillmentType === 'PICKUP' || !order.deliveryAddress ? (
                <p className="text-[15px] md:text-base text-text-primary">Nhận tại cửa hàng</p>
              ) : (
                <dl className="space-y-3 text-[15px]">
                  <div>
                    <dt className="text-text-secondary">Người nhận</dt>
                    <dd className="text-base text-text-primary">{order.deliveryAddress.recipientName}</dd>
                  </div>
                  <div>
                    <dt className="text-text-secondary">Số điện thoại</dt>
                    <dd className="text-base text-text-primary">{order.deliveryAddress.recipientPhone}</dd>
                  </div>
                  <div>
                    <dt className="text-text-secondary">Địa chỉ</dt>
                    <dd className="text-base text-text-primary">{formatAddress(order.deliveryAddress)}</dd>
                  </div>
                </dl>
              )}
              {order.note && (
                <p className="mt-4 pt-4 border-t border-brand-dark/10 text-[15px] text-text-secondary">
                  Ghi chú: <span className="text-text-primary">{order.note}</span>
                </p>
              )}
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
