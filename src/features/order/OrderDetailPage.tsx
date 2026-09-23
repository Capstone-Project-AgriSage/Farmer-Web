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

  // Delivery tracking mock steps
  const trackingSteps = [
    { label: 'Chờ duyệt', active: true, completed: order.status !== 'PENDING_CONFIRMATION' },
    { label: 'Đóng gói', active: order.status === 'PROCESSING', completed: order.status === 'SHIPPING' || order.status === 'COMPLETED' },
    { label: 'Đang giao', active: order.status === 'SHIPPING', completed: order.status === 'COMPLETED' },
    { label: 'Hoàn thành', active: order.status === 'COMPLETED', completed: order.status === 'COMPLETED' },
  ]

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
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-brand-dark/10 -z-10"></div>
              {trackingSteps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 bg-white px-2">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      step.completed
                        ? 'bg-brand-green border-brand-green'
                        : step.active
                          ? 'bg-brand-dark border-brand-dark'
                          : 'bg-white border-brand-dark/20'
                    }`}
                  />
                  <span
                    className={`text-[10px] sm:text-xs tracking-wide uppercase ${
                      step.completed || step.active ? 'text-brand-dark' : 'text-brand-dark/40'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            {order.status === 'SHIPPING' && (
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
                  src={item.product.imageUrl}
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
