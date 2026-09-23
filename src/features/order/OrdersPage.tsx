import { useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { formatVnd } from '../../data/format'
import { mockOrders } from '../../data/mockOrders'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import type { Order } from '../../types'

export default function OrdersPage() {
  useDocumentTitle('Lịch sử đơn hàng')
  const [notification, setNotification] = useState<string | null>(null)
  const [selectedOrderForQr, setSelectedOrderForQr] = useState<Order | null>(null)

  const showNotification = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 4000)
  }

  const handleCancelOrder = (order: Order) => {
    if (confirm('Bác có chắc chắn muốn hủy đơn hàng này không?')) {
      showNotification(`Đã hủy đơn hàng ${order.code} thành công.`)
      // In a real app, call API to cancel and refresh list
    }
  }

  return (
    <div className="bg-brand-cream text-brand-dark min-h-screen">
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Tài khoản', to: '/account' }, { label: 'Đơn hàng của tôi' }]} />

      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-brand-dark text-white px-5 py-3 rounded-full flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-brand-light text-[20px]">task_alt</span>
          <span className="text-sm tracking-wide">{notification}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <h1 className="text-2xl font-helvetica-neue tracking-tight text-brand-dark">Đơn hàng của tôi</h1>

        <div className="bg-white border border-brand-dark/10 divide-y divide-brand-dark/10">
          {mockOrders.length === 0 ? (
            <div className="p-8 text-center text-brand-dark/50 text-sm">Bác chưa có đơn hàng nào.</div>
          ) : (
            mockOrders.map((order) => {
              const isPendingVerification = order.paymentStatus === 'AWAITING_AGENT_VERIFICATION'

              return (
                <div key={order.code} className="p-5 md:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono text-brand-dark text-base font-bold">{order.code}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] tracking-wide border uppercase ${
                          order.status === 'SHIPPING'
                            ? 'border-brand-dark/20 text-brand-dark/70'
                            : order.status === 'PROCESSING'
                              ? 'border-brand-dark/20 text-brand-dark/70'
                              : order.status === 'PENDING_CONFIRMATION'
                                ? 'border-amber-600/40 text-amber-900 bg-amber-50/50'
                                : order.status === 'CANCELLED'
                                  ? 'border-rose-300 text-rose-700 bg-rose-50'
                                  : 'bg-brand-light border-brand-dark/10 text-brand-dark'
                        }`}
                      >
                        {order.status === 'SHIPPING'
                          ? 'Đang giao'
                          : order.status === 'PROCESSING'
                            ? 'Đang đóng gói'
                            : order.status === 'PENDING_CONFIRMATION'
                              ? 'Chờ duyệt'
                              : order.status === 'PENDING_PAYMENT'
                                ? 'Chờ thanh toán'
                                : order.status === 'CANCELLED'
                                  ? 'Đã hủy'
                                  : 'Hoàn thành'}
                      </span>
                    </div>
                    <Link
                      to={`/orders/${order.code.replace('#', '')}`}
                      className="text-xs text-brand-dark/60 hover:text-brand-dark tracking-wide inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Xem chi tiết</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                  </div>

                  <div className="bg-brand-light border border-brand-dark/10 p-3 text-xs space-y-2">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-brand-dark gap-3">
                        <span className="truncate">
                          {item.product.name} ({item.product.packaging})
                        </span>
                        <span className="font-mono text-brand-dark/60 shrink-0">
                          x{item.quantity}
                        </span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="text-brand-dark/50 italic pt-1 border-t border-brand-dark/5 mt-1">
                        ...và {order.items.length - 2} sản phẩm khác
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="text-brand-dark/50">
                      <span>Đặt ngày {order.createdAt}</span>
                      <span className="mx-2">·</span>
                      <span className="font-mono text-brand-dark font-bold text-sm">
                        {formatVnd(order.total)}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      {isPendingVerification && (
                        <button
                          type="button"
                          onClick={() => setSelectedOrderForQr(order)}
                          className="text-brand-dark hover:text-brand-green tracking-wide inline-flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                          <span>Mã VietQR</span>
                        </button>
                      )}
                      {order.status === 'PENDING_CONFIRMATION' && (
                        <button
                          type="button"
                          onClick={() => handleCancelOrder(order)}
                          className="text-rose-600 hover:text-rose-700 tracking-wide inline-flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">cancel</span>
                          <span>Hủy đơn</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {selectedOrderForQr && (
        <div className="fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-brand-cream border border-brand-dark/10 max-w-md w-full p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-brand-dark/10">
              <h3 className="font-helvetica-neue tracking-tight text-base text-brand-dark flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-green">qr_code_2</span>
                <span>Thông tin chuyển khoản đơn {selectedOrderForQr.code}</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedOrderForQr(null)}
                className="text-brand-dark/50 hover:text-brand-dark transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-brand-light border border-brand-dark/10 flex items-center gap-4">
                <div className="w-24 h-24 bg-white p-1 border border-brand-dark/10 flex-shrink-0">
                  <img
                    src="/images/misc/vietqr-demo.png"
                    alt="VietQR"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1 text-brand-dark/60">
                  <div>
                    Ngân hàng: <span className="text-brand-dark">Vietcombank (VCB)</span>
                  </div>
                  <div>
                    STK: <span className="font-mono text-brand-dark text-sm">19006828999</span>
                  </div>
                  <div>
                    Chủ TK: <span className="text-brand-dark">NGUYEN VAN THANG</span>
                  </div>
                  <div>
                    Số tiền:{' '}
                    <span className="font-mono text-brand-dark">{formatVnd(selectedOrderForQr.total)}</span>
                  </div>
                  <div>
                    Nội dung:{' '}
                    <span className="font-mono text-brand-dark">
                      {selectedOrderForQr.code.replace('#', '')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-3 border border-amber-600/30 bg-amber-50/50 text-amber-950 text-[11px] leading-relaxed">
                Đơn hàng đang chờ đại lý Hai Thắng đối soát thủ công trên sao kê Vietcombank. Bác nông dân không cần
                chuyển lại nếu đã thực hiện giao dịch.
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrderForQr(null)}
                className="px-5 py-2 rounded-full bg-brand-dark hover:bg-brand-green text-white text-xs tracking-wide uppercase transition-colors"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
