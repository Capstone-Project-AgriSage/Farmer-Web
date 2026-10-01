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
    <div className="bg-brand-cream text-brand-dark min-h-screen pb-20">
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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-[32px] p-6 sm:p-10 shadow-[0_4px_24px_rgb(0,0,0,0.02)] border border-brand-dark/5 space-y-10">
          
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-helvetica-neue tracking-tight text-brand-dark flex flex-wrap items-center gap-3">
                Chi tiết đơn hàng
                <span className="font-helvetica-neue text-brand-green bg-brand-green/10 px-3 py-1 rounded-xl text-lg sm:text-xl border border-brand-green/20">{order.code}</span>
              </h1>
              <p className="text-sm text-brand-dark/50 mt-2 font-medium">Đặt ngày {order.createdAt}</p>
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
          {order.status !== 'CANCELLED' && (
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

              {order.deliveries && order.deliveries.length > 0 ? (
                <div className="space-y-4">
                  {order.deliveries.map((delivery, idx) => {
                    const isFailed = delivery.status === 'FAILED'
                    const isDelivered = delivery.status === 'DELIVERED'
                    return (
                      <div key={delivery.id} className={`p-5 rounded-2xl border ${isFailed ? 'border-rose-100 bg-rose-50/50' : 'border-brand-dark/5 bg-brand-cream/30'}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-helvetica-neue text-[15px] font-semibold text-brand-dark">{delivery.id}</span>
                              <span className={`px-2.5 py-0.5 text-[10px]  font-medium tracking-wider rounded-full border ${
                                isFailed ? 'border-rose-200 text-rose-700 bg-rose-100/50' :
                                isDelivered ? 'border-brand-green/30 text-brand-green bg-brand-green/10' :
                                'border-amber-200 text-amber-700 bg-amber-50'
                              }`}>
                                {isFailed ? 'Giao thất bại' : isDelivered ? 'Đã giao' : 'Đang giao'}
                              </span>
                            </div>
                            {delivery.deliveryDate && <div className="text-[13px] text-brand-dark/60 font-medium">{delivery.deliveryDate}</div>}
                          </div>
                        </div>
                        
                        {isFailed && delivery.failReason && (
                          <div className="mb-4 text-[13px] font-medium text-rose-700 flex gap-2 items-start bg-rose-100/50 p-3 rounded-xl">
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            <span>Lý do: {delivery.failReason}</span>
                          </div>
                        )}

                        <div className="text-[14px] text-brand-dark/70 space-y-1.5 mb-4">
                          <p>Nhân viên giao: <strong className="text-brand-dark">{delivery.driverName}</strong></p>
                          <p>Số điện thoại: <strong className="text-brand-dark">{delivery.driverPhone}</strong></p>
                        </div>

                        <div className="pt-4 border-t border-brand-dark/5">
                          <div className="text-[11px] font-semibold tracking-wider text-brand-dark/40  mb-3">Sản phẩm đợt này</div>
                          <ul className="space-y-2">
                            {delivery.items.map((item, i) => (
                              <li key={i} className="text-[14px] flex justify-between items-center bg-white p-2.5 rounded-xl border border-brand-dark/5 shadow-sm">
                                <span className="text-brand-dark font-medium px-1">{item.product.name}</span>
                                <span className="font-helvetica-neue text-brand-dark/60 font-medium px-2">x{item.quantity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : order.status === 'SHIPPING' && (
                <div className="mt-6 p-5 bg-brand-cream/40 rounded-2xl border border-brand-dark/5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-brand-green">local_shipping</span>
                  </div>
                  <div className="text-[14px] text-brand-dark/70 space-y-1.5 pt-0.5">
                    <p className="text-brand-dark font-medium mb-2">Đơn hàng đang được giao bởi đại lý Hai Thắng.</p>
                    <p>Tên nhân viên: <strong>Nguyễn Văn A</strong></p>
                    <p>Số điện thoại: <strong>0901234567</strong></p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HALLMARK (CERTIFICATION & TRACEABILITY) */}
          {order.hallmark && (
            <div className="bg-gradient-to-br from-[#122A25] to-[#0A1815] border border-[#234A42] p-8 text-white relative overflow-hidden rounded-[24px] shadow-lg">
               <div className="absolute top-1/2 -translate-y-1/2 right-0 pr-8 opacity-5 pointer-events-none">
                 <span className="material-symbols-outlined text-[200px]">verified</span>
               </div>
               
               <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                 <div className="shrink-0 bg-white p-2.5 rounded-[20px] shadow-2xl border-4 border-brand-green/20 relative group hover:-translate-y-2 transition-transform duration-300">
                   <img src={order.hallmark.qrUrl} alt="QR Code Truy Xuất" className="w-28 h-28 object-contain rounded-xl" />
                   <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-brand-green text-white text-[10px] font-medium  tracking-wider px-3 py-1 rounded-full whitespace-nowrap shadow-md">
                     Quét QR
                   </div>
                 </div>
                 
                 <div className="flex-1 space-y-4 text-center md:text-left">
                   <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-green/20 border border-brand-green/30 text-[#A8D3C8] text-[11px] font-medium tracking-wider ">
                     <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
                     Chứng nhận chất lượng AgriSage
                   </div>
                   <h3 className="text-2xl font-medium font-helvetica-neue tracking-tight text-white flex items-center justify-center md:justify-start gap-2">
                     {order.hallmark.certification}
                     <span className="material-symbols-outlined text-brand-green text-[24px]">verified</span>
                   </h3>
                   <p className="text-[15px] text-[#A8D3C8]/90 max-w-xl leading-relaxed">
                     {order.hallmark.description}
                   </p>
                   <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-[13px] font-helvetica-neue text-[#A8D3C8]/70">
                     <div className="bg-black/40 px-4 py-2 rounded-xl flex items-center gap-2 border border-white/5">
                       <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
                       Mã lô: <strong className="text-white tracking-widest">{order.hallmark.traceCode}</strong>
                     </div>
                   </div>
                 </div>
               </div>
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
                <p>Người nhận: <strong className="text-brand-dark">{order.recipientName}</strong></p>
                <p>Số điện thoại: <strong className="text-brand-dark">{order.recipientPhone}</strong></p>
                <p>Địa chỉ: <strong className="text-brand-dark">{order.address}</strong></p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-[11px] tracking-[0.2em] font-semibold  text-brand-dark/40 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">payments</span>
                Thanh toán
              </h3>
              <div className="text-[14px] text-brand-dark/70 space-y-2.5 bg-brand-cream/20 p-5 rounded-2xl border border-brand-dark/5">
                <p>Hình thức: <strong className="text-brand-dark ">{order.paymentMethod}</strong></p>
                <p>Trạng thái: <strong className="text-brand-dark">{order.paymentStatus}</strong></p>
                <p>Tổng tiền: <strong className="font-helvetica-neue text-brand-dark text-base">{formatVnd(order.total)}</strong></p>
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
              {order.items.map((item, idx) => (
                <div key={idx} className="py-5 flex gap-4 items-center">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-[16px] border border-brand-dark/5 shadow-sm"
                  />
                  <div className="flex-1 space-y-1">
                    <h4 className="text-brand-dark font-medium text-[15px]">{item.product.name}</h4>
                    <p className="text-[13px] text-brand-dark/50 font-medium">{item.product.packaging}</p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <div className="font-helvetica-neue text-brand-dark font-medium text-[15px]">{formatVnd(item.product.price)}</div>
                    <div className="text-[13px] text-brand-dark/50 font-medium bg-brand-cream px-2 py-0.5 rounded-md inline-block mt-1">SL: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-6 space-y-3 text-[15px]">
              <div className="flex justify-between items-center text-brand-dark/70">
                <span className="font-medium">Tạm tính</span>
                <span className="font-helvetica-neue text-brand-dark font-semibold">{formatVnd(order.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-brand-dark/70">
                <span className="font-medium">Phí vận chuyển</span>
                <span className="font-helvetica-neue text-brand-dark font-semibold">{formatVnd(order.shippingFee)}</span>
              </div>
              {order.discount && order.discount > 0 ? (
                <div className="flex justify-between items-center text-brand-green">
                  <span className="font-medium">Ưu đãi</span>
                  <span className="font-helvetica-neue font-medium">-{formatVnd(order.discount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between items-center pt-6 mt-4 border-t-2 border-brand-dark/10 border-dashed">
                <span className="text-brand-dark font-medium text-lg">Thành tiền</span>
                <span className="font-helvetica-neue text-brand-dark text-3xl font-medium tracking-tight">{formatVnd(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
