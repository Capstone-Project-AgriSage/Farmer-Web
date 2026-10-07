import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { paymentsApi } from '../../api/paymentsApi'
import { ApiError } from '../../api/client'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { formatVnd } from '../../data/format'
import type { PaymentResponse } from '../../api/types'
import { clearPendingPayment, readPendingPayment } from './payos'

const MAX_ATTEMPTS = 5

export default function PayosReturnPage() {
  useDocumentTitle('Kết quả thanh toán')
  const [searchParams] = useSearchParams()
  const [payment, setPayment] = useState<PaymentResponse | null>(null)
  const [statusText, setStatusText] = useState('Đang xác nhận thanh toán...')
  const [isError, setIsError] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [isPaying, setIsPaying] = useState(false)

  // Read once. clearPendingPayment() below empties the storage when the payment is settled, and reading it on every render
  // made paymentId turn null afterwards, which re-ran the effect and replaced the success message with an error.
  const [pending] = useState(readPendingPayment)
  const paymentId = pending?.paymentId ?? null
  const orderId = pending?.orderId ?? null
  const isDebtRepayment = pending?.context === 'DEBT_REPAYMENT'
  const isCancel = searchParams.get('cancel') === 'true' || searchParams.get('status') === 'CANCELLED'
  // The API runs with the simulated gateway: its link comes straight back here with simulated=1 (FLOW_2 §6.4).
  const isSimulated = searchParams.get('simulated') === '1'

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    let cancelled = false

    if (isCancel) {
      setStatusText('Bác đã huỷ thanh toán')
      setIsError(true)
      setIsChecking(false)
      if (paymentId) paymentsApi.cancelPayment(paymentId).catch(() => {})
      clearPendingPayment()
      return
    }

    if (!paymentId) {
      setStatusText(`Không tìm thấy phiên giao dịch. Bác vui lòng kiểm tra lại trong ${isDebtRepayment ? 'Sổ nợ' : 'Đơn hàng của tôi'}.`)
      setIsError(true)
      setIsChecking(false)
      return
    }

    // The webhook may arrive after the redirect, so ask the server to re-check with payOS.
    const checkPayment = async (attempt: number) => {
      try {
        const data = attempt === 0
          ? await paymentsApi.getPaymentById(paymentId)
          : await paymentsApi.syncPayment(paymentId)
        if (cancelled) return
        setPayment(data)
        if (data.status === 'PAID') {
          setStatusText('Thanh toán thành công!')
          setIsChecking(false)
          clearPendingPayment()
        } else if (data.status === 'PENDING' && isSimulated) {
          // Nothing will arrive from payOS: wait for the test button instead of polling.
          setStatusText('Thanh toán thử: tiền chưa đi qua payOS')
          setIsChecking(false)
        } else if (data.status === 'PENDING' && attempt < MAX_ATTEMPTS) {
          timer = setTimeout(() => checkPayment(attempt + 1), 2000)
        } else if (data.status === 'PENDING') {
          setStatusText(`Đang chờ hệ thống xác nhận. Bác vui lòng kiểm tra trạng thái trong ${isDebtRepayment ? 'Sổ nợ' : 'Đơn hàng của tôi'} sau vài phút.`)
          setIsChecking(false)
        } else {
          setStatusText('Thanh toán không thành công hoặc đã hết hạn.')
          setIsError(true)
          setIsChecking(false)
          clearPendingPayment()
        }
      } catch {
        if (cancelled) return
        setStatusText(`Lỗi khi kiểm tra thanh toán. Bác vui lòng kiểm tra trong ${isDebtRepayment ? 'Sổ nợ' : 'Đơn hàng của tôi'}.`)
        setIsError(true)
        setIsChecking(false)
      }
    }

    checkPayment(0)
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [paymentId, isCancel, isSimulated, isDebtRepayment])

  // Test button (only for a simulated link): the server pays the link and settles it like a real status query.
  const payNow = async () => {
    if (!paymentId || isPaying) return
    setIsPaying(true)
    try {
      const data = await paymentsApi.simulatePaid(paymentId)
      setPayment(data)
      if (data.status === 'PAID') {
        setStatusText('Thanh toán thành công!')
        clearPendingPayment()
      }
    } catch (err) {
      setStatusText(err instanceof ApiError && err.status === 404
        ? 'Máy chủ không ở chế độ thanh toán thử (PayOS:Mode=Simulated).'
        : 'Không thanh toán thử được. Bác tạo lại thanh toán rồi thử lại.')
      setIsError(true)
    } finally {
      setIsPaying(false)
    }
  }

  const tone = isError ? 'error' : payment?.status === 'PAID' ? 'success' : 'pending'
  const primaryClass =
    'focus-ring inline-flex items-center justify-center min-h-[48px] px-7 rounded-full bg-brand-dark text-white hover:bg-brand-green text-base transition-colors w-full sm:w-auto'
  const secondaryClass =
    'focus-ring inline-flex items-center justify-center min-h-[48px] px-7 rounded-full border border-brand-dark/30 text-text-primary hover:bg-brand-dark hover:text-white hover:border-brand-dark text-base transition-colors w-full sm:w-auto'

  return (
    <div className="bg-brand-cream text-brand-dark min-h-screen py-16 md:py-24 px-6">
      <div className="max-w-xl mx-auto bg-white border border-brand-dark/15 rounded-[var(--radius-surface)] p-8 sm:p-12 text-center">
        <span
          className={`material-symbols-outlined ${tone === 'error' ? 'text-status-error' : tone === 'success' ? 'text-brand-green' : 'text-status-warning'} ${isChecking ? 'animate-spin' : ''}`}
          style={{ fontSize: 56 }}
          aria-hidden="true"
        >
          {tone === 'error' ? 'cancel' : tone === 'success' ? 'check_circle' : isChecking ? 'sync' : 'schedule'}
        </span>

        <h1
          role={isError ? 'alert' : 'status'}
          className={`mt-5 text-[length:var(--type-h2)] leading-[var(--type-h2-lh)] font-light tracking-tight ${isError ? 'text-status-error' : 'text-text-primary'}`}
        >
          {statusText}
        </h1>

        {isSimulated && payment?.status === 'PENDING' && !isError && (
          <div className="mt-6 border border-status-warning/40 bg-status-warning-surface rounded-[var(--radius-surface)] p-4 text-[15px] leading-relaxed text-text-primary text-left">
            <p>
              Đây là môi trường thử: thanh toán không đi qua payOS và không có tiền thật. Bấm nút dưới để coi như bác đã chuyển khoản.
            </p>
            <button
              type="button"
              onClick={payNow}
              disabled={isPaying}
              className="focus-ring mt-4 min-h-[48px] px-6 rounded-full bg-brand-dark text-white hover:bg-brand-green disabled:opacity-60 text-base transition-colors"
            >
              {isPaying ? 'Đang xử lý…' : 'Thanh toán nhanh (chỉ môi trường thử)'}
            </button>
          </div>
        )}

        {payment && payment.status === 'PAID' && (
          <dl className="mt-8 border-t border-brand-dark/15 text-[15px] text-left">
            <div className="flex justify-between gap-4 py-3 border-b border-brand-dark/10">
              <dt className="text-text-secondary">Mã thanh toán</dt>
              <dd className="text-text-primary">{payment.paymentNumber}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3 border-b border-brand-dark/10">
              <dt className="text-text-secondary">Số tiền</dt>
              <dd className="text-text-primary font-medium">{formatVnd(payment.amount)}</dd>
            </div>
          </dl>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link to={isDebtRepayment ? '/debt' : orderId ? `/orders/${orderId}` : '/orders'} className={primaryClass}>
            {isDebtRepayment ? 'Quay lại Sổ nợ' : orderId ? 'Xem chi tiết đơn hàng' : 'Xem đơn hàng của tôi'}
          </Link>
          <Link to="/" className={secondaryClass}>
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}
