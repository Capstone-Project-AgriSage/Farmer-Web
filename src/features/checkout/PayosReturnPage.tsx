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
      setStatusText('Không tìm thấy phiên giao dịch. Bác vui lòng kiểm tra lại trong Đơn hàng của tôi.')
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
          setStatusText('Đang chờ hệ thống xác nhận. Bác vui lòng kiểm tra trạng thái trong Đơn hàng của tôi sau vài phút.')
          setIsChecking(false)
        } else {
          setStatusText('Thanh toán không thành công hoặc đã hết hạn.')
          setIsError(true)
          setIsChecking(false)
          clearPendingPayment()
        }
      } catch {
        if (cancelled) return
        setStatusText('Lỗi khi kiểm tra thanh toán. Bác vui lòng kiểm tra trong Đơn hàng của tôi.')
        setIsError(true)
        setIsChecking(false)
      }
    }

    checkPayment(0)
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [paymentId, isCancel, isSimulated])

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

  return (
    <div className="bg-brand-cream min-h-screen py-20 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-brand-dark/10 text-center">
        {isError ? (
          <span className="material-symbols-outlined text-rose-500 text-6xl mb-4">cancel</span>
        ) : payment?.status === 'PAID' ? (
          <span className="material-symbols-outlined text-brand-green text-6xl mb-4">check_circle</span>
        ) : isChecking ? (
          <span className="material-symbols-outlined text-amber-500 text-6xl mb-4 animate-spin">sync</span>
        ) : (
          <span className="material-symbols-outlined text-amber-500 text-6xl mb-4">schedule</span>
        )}

        <h1 className={`text-2xl font-helvetica-neue tracking-tight mb-4 ${isError ? 'text-rose-600' : 'text-brand-dark'}`}>
          {statusText}
        </h1>

        {isSimulated && payment?.status === 'PENDING' && !isError && (
          <div className="mt-2 mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="mb-3">
              Đây là môi trường thử: thanh toán không đi qua payOS và không có tiền thật.
              Bấm nút dưới để coi như bác đã chuyển khoản.
            </p>
            <button
              type="button"
              onClick={payNow}
              disabled={isPaying}
              className="px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-medium transition-colors text-sm"
            >
              {isPaying ? 'Đang xử lý...' : 'Thanh toán nhanh (chỉ môi trường thử)'}
            </button>
          </div>
        )}

        {payment && payment.status === 'PAID' && (
          <div className="text-brand-dark/70 mb-8 space-y-2 text-sm">
            <p>Mã thanh toán: <strong className="text-brand-dark">{payment.paymentNumber}</strong></p>
            <p>Số tiền: <strong className="text-brand-dark">{formatVnd(payment.amount)}</strong></p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link
            to={orderId ? `/orders/${orderId}` : '/orders'}
            className="px-6 py-3 rounded-full bg-brand-dark text-white hover:bg-brand-green font-medium transition-colors text-sm w-full sm:w-auto"
          >
            {orderId ? 'Xem chi tiết đơn hàng' : 'Xem đơn hàng của tôi'}
          </Link>
          <Link
            to="/"
            className="px-6 py-3 rounded-full bg-brand-cream text-brand-dark hover:bg-brand-light font-medium transition-colors text-sm w-full sm:w-auto"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  )
}
