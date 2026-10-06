import { api } from './client'
import type { OrderPaymentSummary, PagedResult, PaymentListItem, PaymentResponse, PayOsPaymentRequest, PayOsPaymentResponse } from './types'

export const paymentsApi = {
  createPayosPayment: (data: PayOsPaymentRequest) => api<PayOsPaymentResponse>('/api/me/payments/payos', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  /** The farmer's own payments, newest first (orders and debt repayments); the server filters only by status. */
  getMyPayments: (params: { page?: number; pageSize?: number } = {}) => {
    const search = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) search.append(key, String(value))
    })
    const qs = search.toString()
    return api<PagedResult<PaymentListItem>>(`/api/me/payments${qs ? `?${qs}` : ''}`)
  },

  getPaymentById: (paymentId: string) => api<PaymentResponse>(`/api/me/payments/${paymentId}`),

  /** Asks the server to re-check the payment with payOS — used when the webhook is late. */
  syncPayment: (paymentId: string) => api<PaymentResponse>(`/api/payments/${paymentId}/sync`, {
    method: 'POST'
  }),

  /**
   * Test environment only: the API must run with PayOS:Mode=Simulated (it answers 404 otherwise). Pays the simulated link and
   * the server applies it exactly like a payOS status query, so the response is the real, settled payment.
   */
  simulatePaid: (paymentId: string) => api<PaymentResponse>(`/api/payments/${paymentId}/simulate-paid`, {
    method: 'POST'
  }),

  cancelPayment: (paymentId: string) => api<PaymentResponse>(`/api/me/payments/${paymentId}/cancel`, {
    method: 'POST'
  }),

  getOrderPayments: (orderId: string) => api<OrderPaymentSummary>(`/api/me/orders/${orderId}/payments`)
}
