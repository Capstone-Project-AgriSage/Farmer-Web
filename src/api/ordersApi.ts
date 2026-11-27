import { api } from './client'
import type { CheckoutRequest, MyDelivery, MyDeliveryTracking, OrderListItem, OrderResponse, OrderStatus, PagedResult } from './types'

export interface MyOrdersQuery {
  status?: OrderStatus
  fromDate?: string
  toDate?: string
  page?: number
  pageSize?: number
}

export const ordersApi = {
  createOrder: (data: CheckoutRequest) => api<OrderResponse>('/api/me/orders', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  getOrders: (params?: MyOrdersQuery) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, value.toString())
        }
      })
    }
    const qs = searchParams.toString()
    return api<PagedResult<OrderListItem>>(`/api/me/orders${qs ? `?${qs}` : ''}`)
  },

  getOrderById: (id: string) => api<OrderResponse>(`/api/me/orders/${id}`),

  cancelOrder: (id: string, reason?: string) => api<OrderResponse>(`/api/me/orders/${id}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason })
  }),

  getOrderDeliveries: (id: string) => api<MyDelivery[]>(`/api/me/orders/${id}/deliveries`),
  /** F2.8: where the driver of this delivery is while the trip runs (polled every 15 s by the order page). */
  getDeliveryTracking: (orderId: string, deliveryId: string, signal?: AbortSignal) =>
    api<MyDeliveryTracking>(`/api/me/orders/${orderId}/deliveries/${deliveryId}/tracking`, { signal })
}
