import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { formatVnd } from '../../data/format'
import { mockOrders } from '../../data/mockOrders'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export default function OrderDetailPage() {
  const { code } = useParams<{ code: string }>()
  const order = mockOrders.find((o) => o.code.replace('#', '') === code || o.code === code)
  useDocumentTitle(order ? `Chi tiết đơn hàng ${order.code}` : 'Không tìm thấy đơn hàng')

  const [notification, setNotification] = useState<string | null>(null)

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

  const handleCancelOrder = () => {
    if (confirm('Bác có chắc chắn muốn hủy đơn hàng này không?')) {
      showNotification(`Đã hủy đơn hàng ${order.code} thành công.`)
      // API call to cancel order
    }
  }

  const getCurrentStepIndex = () => {
    switch (order.status) {
      case 'PENDING_CONFIRMATION':
      case 'PENDING_PAYMENT':
        return 0
      case 'PROCESSING':
        return 1
      case 'SHIPPING':
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
    <div className="bg-brand-cream text-brand-dark min-h-screen">
      <Breadcrumb
        items={[
          { label: 'Trang chủ', to: '/' },
          { label: 'Tài khoản', to: '/account' },
          { label: 'Đơn hàng của tôi', to: '/orders' },
          { label: order.code },
        ]}
      />

      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-brand-dark text-white px-5 py-3 rounded-full flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-brand-light text-[20px]">task_alt</span>
          <span className="text-sm tracking-wide">{notification}</span>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-helvetica-neue tracking-tight text-brand-dark">
            Chi tiết đơn hàng {order.code}
          </h1>
          {order.status === 'PENDING_CONFIRMATION' && (
            <button
              onClick={handleCancelOrder}
              className="px-5 py-2 rounded-full border border-rose-600 text-rose-600 hover:bg-rose-50 tracking-wide uppercase text-xs transition-colors self-start sm:self-auto"
            >
              Hủy đơn hàng
            </button>
          )}
        </div>

        {/* TRACKING PROGRESS */}
        {order.status !== 'CANCELLED' && (
          <div className="bg-white border border-brand-dark/10 p-6">
            <h3 className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-6">Trạng thái đơn hàng</h3>
            <div className="flex items-start w-full">
              {stepLabels.map((label, idx) => {
                const isCurrent = idx === currentStepIdx
                return (
                  <div key={idx} className="flex flex-col items-center flex-1 relative">
                    <div className="flex items-center w-full">
                      {/* Left Line */}
                      <div className={`flex-1 h-[1px] ${idx === 0 ? 'bg-transparent' : 'bg-brand-dark/15'}`}></div>
                      
                      {/* Dot */}
                      <div
                        className={`w-4 h-4 rounded-full border-2 shrink-0 transition-colors z-10 ${
                          isCurrent
                            ? 'bg-brand-dark border-brand-dark'
                            : 'bg-white border-brand-dark/20'
                        }`}
                      />
                      
                      {/* Right Line */}
                      <div className={`flex-1 h-[1px] relative flex items-center ${idx === stepLabels.length - 1 ? 'bg-transparent' : 'bg-brand-dark/15'}`}>
                         {idx < stepLabels.length - 1 && (
                           <span className="material-symbols-outlined text-[16px] text-brand-dark/30 bg-white absolute right-0 translate-x-1/2 z-10">
                             chevron_right
                           </span>
                         )}
                      </div>
                    </div>
                    
                    {/* Label */}
                    <span
                      className={`text-[10px] sm:text-[11px] tracking-wide uppercase transition-colors text-center mt-2 px-1 ${
                        isCurrent ? 'text-brand-dark font-medium' : 'text-brand-dark/40'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>
            {order.deliveries && order.deliveries.length > 0 ? (
              <div className="mt-8 space-y-4">
                <h4 className="text-xs tracking-[0.25em] uppercase text-brand-dark/50">Chi tiết các đợt giao hàng</h4>
                {order.deliveries.map((delivery, idx) => {
                  const isFailed = delivery.status === 'FAILED'
                  const isDelivered = delivery.status === 'DELIVERED'
                  return (
                    <div key={delivery.id} className={`p-4 border ${isFailed ? 'border-rose-300 bg-rose-50/30' : 'border-brand-dark/10 bg-brand-light'}`}>
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-brand-dark">{delivery.id}</span>
                            <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wide rounded-full border ${
                              isFailed ? 'border-rose-600 text-rose-700' :
                              isDelivered ? 'border-brand-green text-brand-green' :
                              'border-amber-600 text-amber-700'
                            }`}>
                              {isFailed ? 'Giao thất bại' : isDelivered ? 'Đã giao' : 'Đang giao'}
                            </span>
                          </div>
                          {delivery.deliveryDate && <div className="text-xs text-brand-dark/50 mt-1">{delivery.deliveryDate}</div>}
                        </div>
                      </div>
                      
                      {isFailed && delivery.failReason && (
                        <div className="mb-3 text-xs text-rose-700 flex gap-1.5 items-start">
                          <span className="material-symbols-outlined text-[16px]">error</span>
                          <span>Lý do: {delivery.failReason}</span>
                        </div>
                      )}

                      <div className="text-sm text-brand-dark/70 space-y-1 mb-3">
                        <p>Nhân viên giao: <strong className="text-brand-dark">{delivery.driverName}</strong></p>
                        <p>Số điện thoại: <strong className="text-brand-dark">{delivery.driverPhone}</strong></p>
                      </div>

                      <div className="pt-3 border-t border-brand-dark/10">
                        <div className="text-xs text-brand-dark/50 mb-2">Sản phẩm đợt này:</div>
                        <ul className="space-y-1">
                          {delivery.items.map((item, i) => (
                            <li key={i} className="text-xs flex justify-between">
                              <span className="text-brand-dark">{item.product.name}</span>
                              <span className="font-mono text-brand-dark/60">x {item.quantity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : order.status === 'SHIPPING' && (
              <div className="mt-6 p-4 bg-brand-light border border-brand-dark/10 flex items-start gap-3">
                <span className="material-symbols-outlined text-brand-dark">local_shipping</span>
                <div className="text-sm text-brand-dark/70 space-y-1">
                  <p className="text-brand-dark">Đơn hàng đang được giao bởi nhân viên đại lý Hai Thắng.</p>
                  <p>Tên nhân viên: <strong>Nguyễn Văn A</strong></p>
                  <p>Số điện thoại: <strong>0901234567</strong></p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ORDER INFO */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white border border-brand-dark/10 p-6 space-y-4">
            <h3 className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 border-b border-brand-dark/10 pb-2">
              Thông tin nhận hàng
            </h3>
            <div className="text-sm text-brand-dark/70 space-y-2">
              <p>Người nhận: <strong className="text-brand-dark">{order.recipientName}</strong></p>
              <p>Số điện thoại: <strong className="text-brand-dark">{order.recipientPhone}</strong></p>
              <p>Địa chỉ: <strong className="text-brand-dark">{order.address}</strong></p>
            </div>
          </div>
          <div className="bg-white border border-brand-dark/10 p-6 space-y-4">
            <h3 className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 border-b border-brand-dark/10 pb-2">
              Thanh toán
            </h3>
            <div className="text-sm text-brand-dark/70 space-y-2">
              <p>Hình thức: <strong className="text-brand-dark uppercase">{order.paymentMethod}</strong></p>
              <p>Trạng thái thanh toán: <strong className="text-brand-dark">{order.paymentStatus}</strong></p>
              <p>Tổng tiền: <strong className="font-mono text-brand-dark text-base">{formatVnd(order.total)}</strong></p>
            </div>
          </div>
        </div>

        {/* ITEMS */}
        <div className="bg-white border border-brand-dark/10 p-6 space-y-4">
          <h3 className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 border-b border-brand-dark/10 pb-2">
            Danh sách sản phẩm
          </h3>
          <div className="divide-y divide-brand-dark/10">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-4 flex gap-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover border border-brand-dark/10"
                />
                <div className="flex-1 space-y-1">
                  <h4 className="text-brand-dark text-sm">{item.product.name}</h4>
                  <p className="text-xs text-brand-dark/50">{item.product.packaging}</p>
                </div>
                <div className="text-right space-y-1">
                  <div className="font-mono text-brand-dark text-sm">{formatVnd(item.product.price)}</div>
                  <div className="text-xs text-brand-dark/50">x {item.quantity}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-brand-dark/10 space-y-2 text-sm">
            <div className="flex justify-between text-brand-dark/70">
              <span>Tạm tính</span>
              <span className="font-mono text-brand-dark">{formatVnd(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-brand-dark/70">
              <span>Phí vận chuyển</span>
              <span className="font-mono text-brand-dark">{formatVnd(order.shippingFee)}</span>
            </div>
            {order.discount && order.discount > 0 ? (
              <div className="flex justify-between text-brand-green">
                <span>Ưu đãi</span>
                <span className="font-mono">-{formatVnd(order.discount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between pt-2 mt-2 border-t border-brand-dark/10">
              <span className="text-brand-dark font-bold">Thành tiền</span>
              <span className="font-mono text-brand-dark text-lg font-bold">{formatVnd(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
