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

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('vi-VN')

export default function OrdersPage() {
  useDocumentTitle('Lịch sử đơn hàng')
  const [notification, setNotification] = useState<string | null>(null)
  const [orders, setOrders] = useState<OrderListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    fetchOrders(page)
  }, [page])

  const fetchOrders = async (target: number) => {
    try {
      setIsLoading(true)
      setLoadError(null)
      const res = await ordersApi.getOrders({ page: target, pageSize: PAGE_SIZE })
      // The last order of the last page was cancelled or moved: go back to the new last page.
      if (res.items.length === 0 && target > 1 && res.totalPages > 0) {
        setPage(Math.min(target - 1, res.totalPages))
        return
      }
      // Newest first within the page, whatever order the server returned them in.
      setOrders([...(res.items || [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      setTotalPages(Math.max(1, res.totalPages))
      setTotalCount(res.totalCount)
    } catch (err) {
      setLoadError(describeApiError(err, 'Lỗi tải danh sách đơn hàng'))
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

  const pageButton = 'focus-ring w-11 h-11 flex items-center justify-center rounded-full border border-brand-dark/25 text-text-primary hover:border-brand-dark/60 disabled:opacity-35 disabled:cursor-not-allowed transition-colors'

  return (
    <div className="bg-brand-cream text-brand-dark min-h-screen">
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Tài khoản', to: '/account' }, { label: 'Đơn hàng của tôi' }]} />

      {notification && (
        <div role="status" className="fixed top-24 right-6 z-50 bg-brand-dark text-white px-5 py-3 rounded-full flex items-center gap-3">
          <span className="material-symbols-outlined text-brand-light" style={{ fontSize: 20 }} aria-hidden="true">
            task_alt
          </span>
          <span className="text-[15px]">{notification}</span>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-10 md:py-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <p className="text-[13px] uppercase tracking-[0.16em] text-text-secondary mb-3">Tài khoản</p>
            <h1 className="text-[length:var(--type-h1)] leading-[var(--type-h1-lh)] font-light tracking-tight text-text-primary">Đơn hàng của tôi</h1>
          </div>
          {!isLoading && !loadError && totalCount > 0 && <p className="text-[15px] text-text-secondary">{totalCount} đơn </p>}
        </div>

        {isLoading ? (
          <ul className="border-t border-brand-dark/15" aria-busy="true" aria-label="Đang tải đơn hàng">
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="py-6 border-b border-brand-dark/15 flex items-center justify-between gap-6" aria-hidden="true">
                <div className="space-y-3 flex-1">
                  <div className="h-5 w-48 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
                  <div className="h-4 w-64 max-w-full bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
                </div>
                <div className="h-6 w-28 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
              </li>
            ))}
          </ul>
        ) : loadError ? (
          <div role="alert" className="border border-brand-dark/15 bg-white p-10 text-center rounded-[var(--radius-surface)]">
            <p className="text-lg text-text-primary">{loadError}</p>
            <button type="button" onClick={() => fetchOrders(page)} className="focus-ring mt-5 min-h-[44px] px-7 rounded-full bg-brand-dark text-white hover:bg-brand-green text-[15px] transition-colors">
              Thử lại
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="border border-brand-dark/15 bg-white p-12 text-center rounded-[var(--radius-surface)]">
            <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 48 }} aria-hidden="true">
              inventory_2
            </span>
            <p className="mt-3 text-lg text-text-primary">Bác chưa có đơn hàng nào.</p>
            <Link to="/products" className="focus-ring mt-5 inline-flex items-center min-h-[44px] px-7 rounded-full bg-brand-dark text-white hover:bg-brand-green text-[15px] transition-colors">
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <ul className="border-t border-brand-dark/15">
            {orders.map((order, index) => {
              const status = labelOf(ORDER_STATUS, order.status)
              const isNewest = page === 1 && index === 0
              return (
                <li key={order.id} className="border-b border-brand-dark/15">
                  <div className="py-6 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-x-8 gap-y-4 md:items-center">
                    <Link to={`/orders/${order.id}`} className="focus-ring group block min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <span className="text-xl font-medium tracking-tight text-text-primary group-hover:underline underline-offset-4">{order.orderNumber}</span>
                        <span className={`px-3 py-0.5 rounded-full text-[13px] font-medium border ${TONE_CLASSES[status.tone]}`}>{status.label}</span>
                        {isNewest && <span className="px-3 py-0.5 rounded-full text-[13px] font-medium bg-brand-dark text-white">Mới nhất</span>}
                      </div>
                      <p className="mt-2 text-[15px] text-text-secondary">
                        {formatDate(order.createdAt)} · {order.itemCount} sản phẩm · {order.settlementType === 'CREDIT' ? 'Mua chịu' : 'Thanh toán ngay'} ·{' '}
                        {order.fulfillmentType === 'DELIVERY' ? 'Giao tận nơi' : 'Nhận tại cửa hàng'}
                      </p>
                    </Link>

                    <div className="flex items-center justify-between md:justify-end gap-4 md:gap-6">
                      <p className="text-xl font-medium text-text-primary whitespace-nowrap">{formatVnd(order.totalAmount)}</p>
                      <div className="flex items-center gap-2">
                        {order.status === 'PENDING_CONFIRMATION' && (
                          <button
                            type="button"
                            onClick={() => handleCancelOrder(order)}
                            className="focus-ring min-h-[44px] px-4 rounded-full text-[15px] text-status-error hover:bg-status-error-surface transition-colors"
                          >
                            Hủy đơn
                          </button>
                        )}
                        <Link
                          to={`/orders/${order.id}`}
                          className="focus-ring inline-flex items-center gap-1.5 min-h-[44px] px-5 rounded-full border border-brand-dark/30 text-[15px] text-text-primary hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-colors"
                        >
                          Chi tiết
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden="true">
                            arrow_forward
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {!isLoading && !loadError && totalPages > 1 && (
          <nav aria-label="Phân trang" className="mt-8 flex items-center justify-center gap-4">
            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label="Trang trước" className={pageButton}>
              <span className="material-symbols-outlined" style={{ fontSize: 22 }} aria-hidden="true">
                chevron_left
              </span>
            </button>
            <span className="text-[15px] text-text-secondary">
              Trang <strong className="text-text-primary">{page}</strong> / {totalPages}
            </span>
            <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Trang sau" className={pageButton}>
              <span className="material-symbols-outlined" style={{ fontSize: 22 }} aria-hidden="true">
                chevron_right
              </span>
            </button>
          </nav>
        )}
      </div>
    </div>
  )
}
