import { api } from './client'
import type { OrderPaymentSummary, PaymentResponse, PayOsPaymentRequest, PayOsPaymentResponse } from './types'

export const paymentsApi = {
  createPayosPayment: (data: PayOsPaymentRequest) => api<PayOsPaymentResponse>('/api/me/payments/payos', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  getPaymentById: (paymentId: string) => api<PaymentResponse>(`/api/me/payments/${paymentId}`),

  /** Asks the server to re-check the payment with payOS — used when the webhook is late. */
  syncPayment: (paymentId: string) => api<PaymentResponse>(`/api/payments/${paymentId}/sync`, {
    method: 'POST'
  }),

  cancelPayment: (paymentId: string) => api<PaymentResponse>(`/api/me/payments/${paymentId}/cancel`, {
    method: 'POST'
  }),

  getOrderPayments: (orderId: string) => api<OrderPaymentSummary>(`/api/me/orders/${orderId}/payments`)
}
