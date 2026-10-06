import { paymentsApi } from '../../api/paymentsApi'

// payOS sends the browser back with only its own orderCode, and there is no lookup by orderCode
// (FE_GUIDE_FLOW_2 §8), so the payment id must be saved before leaving the site.
const PENDING_PAYMENT_KEY = 'agrisage.pending_payos'

export interface PendingPayment {
  paymentId: string
  orderId: string
}

export function readPendingPayment(): PendingPayment | null {
  try {
    const raw = sessionStorage.getItem(PENDING_PAYMENT_KEY)
    return raw ? (JSON.parse(raw) as PendingPayment) : null
  } catch {
    return null
  }
}

export function clearPendingPayment() {
  sessionStorage.removeItem(PENDING_PAYMENT_KEY)
}

/**
 * Creates a payOS link for the unpaid remainder of an order and redirects to it.
 * Throws the ApiError untouched so callers can tell 503 (payOS down) from 409/422.
 */
export async function startPayosPayment(orderId: string): Promise<void> {
  const payment = await paymentsApi.createPayosPayment({ paymentContext: 'ORDER_PAYMENT', orderId, amount: null })
  sessionStorage.setItem(PENDING_PAYMENT_KEY, JSON.stringify({ paymentId: payment.paymentId, orderId } satisfies PendingPayment))
  window.location.assign(payment.checkoutUrl)
}
