import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { paymentsApi } from '../../api/paymentsApi'
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

  const pending = readPendingPayment()
  const paymentId = pending?.paymentId ?? null
  const orderId = pending?.orderId ?? null
  const isCancel = searchParams.get('cancel') === 'true' || searchParams.get('status') === 'CANCELLED'

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
  }, [paymentId, isCancel])

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
