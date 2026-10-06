import { paymentsApi } from '../../api/paymentsApi'

// payOS sends the browser back with only its own orderCode, and there is no lookup by orderCode
// (FE_GUIDE_FLOW_2 §8), so the payment id must be saved before leaving the site.
const PENDING_PAYMENT_KEY = 'agrisage.pending_payos'

export interface PendingPayment {
  paymentId: string
  /** null for a debt repayment, which belongs to no single order. */
  orderId: string | null
  /** Where the result page sends the buyer next; absent in sessions saved before debt repayments existed (= an order). */
  context?: 'ORDER_PAYMENT' | 'DEBT_REPAYMENT'
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
  sessionStorage.setItem(
    PENDING_PAYMENT_KEY,
    JSON.stringify({ paymentId: payment.paymentId, orderId, context: 'ORDER_PAYMENT' } satisfies PendingPayment),
  )
  window.location.assign(payment.checkoutUrl)
}

/**
 * Creates a payOS link to pay `amount` (whole VND) towards the farmer's debt and redirects to it. The server settles the
 * oldest debts first (FLOW_3 §7), so there is no order or entry to name. Throws the ApiError untouched.
 */
export async function startDebtRepayment(amount: number): Promise<void> {
  const payment = await paymentsApi.createPayosPayment({ paymentContext: 'DEBT_REPAYMENT', orderId: null, amount })
  sessionStorage.setItem(
    PENDING_PAYMENT_KEY,
    JSON.stringify({ paymentId: payment.paymentId, orderId: null, context: 'DEBT_REPAYMENT' } satisfies PendingPayment),
  )
  window.location.assign(payment.checkoutUrl)
}
