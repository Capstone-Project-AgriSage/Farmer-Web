import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { formatVnd } from '../../data/format'
import { ordersApi } from '../../api/ordersApi'
import { describeApiError } from '../../api/client'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import type { OrderListItem } from '../../api/types'
import { ORDER_STATUS, TONE_CLASSES, labelOf } from './orderLabels'

const PAGE_SIZE = 10

export default function OrdersPage() {
  useDocumentTitle('Lịch sử đơn hàng')
  const [notification, setNotification] = useState<string | null>(null)
  const [orders, setOrders] = useState<OrderListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    fetchOrders(page)
  }, [page])

  const fetchOrders = async (target: number) => {
    try {
      setIsLoading(true)
      const res = await ordersApi.getOrders({ page: target, pageSize: PAGE_SIZE })
      // The last order of the last page was cancelled or moved: go back to the new last page.
      if (res.items.length === 0 && target > 1 && res.totalPages > 0) {
        setPage(Math.min(target - 1, res.totalPages))
        return
      }
      setOrders(res.items || [])
      setTotalPages(Math.max(1, res.totalPages))
      setTotalCount(res.totalCount)
    } catch (err) {
      showNotification(describeApiError(err, 'Lỗi tải danh sách đơn hàng'))
    } finally {
      setIsLoading(false)
    }
  }

  const showNotification = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 4000)
  }

  const handleCancelOrder = async (order: OrderListItem) => {
    if (confirm('Bác có chắc chắn muốn hủy đơn hàng này không?')) {
      try {
        await ordersApi.cancelOrder(order.id, 'Người dùng hủy')
        showNotification(`Đã hủy đơn hàng ${order.orderNumber} thành công.`)
        fetchOrders(page)
      } catch (err) {
        showNotification(describeApiError(err, 'Lỗi hủy đơn hàng'))
      }
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

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-10 text-brand-dark/50">Đang tải đơn hàng...</div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-brand-dark/10 p-10 text-center flex flex-col items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[40px] text-brand-dark/20 mb-3">inventory_2</span>
              <p className="text-brand-dark/50 text-sm">Bác chưa có đơn hàng nào.</p>
              <Link to="/products" className="mt-5 px-5 py-2 bg-brand-dark text-white text-[13px] font-medium rounded-full hover:bg-brand-green transition-colors">
                Mua sắm ngay
              </Link>
            </div>
          ) : (
            orders.map((order) => {
              const status = labelOf(ORDER_STATUS, order.status)

              return (
                <div key={order.id} className="bg-white rounded-2xl border border-brand-dark/10 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-dark/5 pb-3 mb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-helvetica-neue text-brand-dark text-base font-medium tracking-tight">{order.orderNumber}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wide border ${TONE_CLASSES[status.tone]}`}>
                        {status.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-brand-dark/50">
                      {order.settlementType === 'CREDIT' ? 'Mua chịu' : 'Thanh toán ngay'} ·{' '}
                      {order.fulfillmentType === 'DELIVERY' ? 'Giao tận nơi' : 'Nhận tại cửa hàng'}
                    </span>
                  </div>

                  <div className="bg-brand-light rounded-xl p-3.5 text-[13px] mb-4 border border-brand-dark/5 text-brand-dark/80 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-brand-dark/40">inventory_2</span>
                    {order.itemCount} sản phẩm
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-brand-dark/50 font-medium  tracking-widest mb-0.5">Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                      <span className="font-helvetica-neue text-brand-dark font-medium text-lg">
                        {formatVnd(order.totalAmount)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                      {order.status === 'PENDING_CONFIRMATION' && (
                        <button
                          type="button"
                          onClick={() => handleCancelOrder(order)}
                          className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-rose-100"
                        >
                          <span className="material-symbols-outlined text-[16px]">cancel</span>
                          <span>Hủy đơn</span>
                        </button>
                      )}
                      <Link
                        to={`/orders/${order.id}`}
                        className="flex-1 sm:flex-none px-5 py-2 rounded-full bg-brand-dark hover:bg-brand-green text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <span>Chi tiết</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-brand-dark/15 text-brand-dark disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-cream transition-colors"
              aria-label="Trang trước"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <span className="text-sm text-brand-dark/70">
              Trang <strong className="text-brand-dark">{page}</strong> / {totalPages} · {totalCount} đơn hàng
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-brand-dark/15 text-brand-dark disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-cream transition-colors"
              aria-label="Trang sau"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
