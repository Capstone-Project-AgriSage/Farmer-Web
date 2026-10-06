import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { paymentsApi } from '../../api/paymentsApi'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { clearPendingPayment, readPendingPayment } from './payos'

export default function PayosCancelPage() {
  useDocumentTitle('Hủy thanh toán')

  useEffect(() => {
    const pending = readPendingPayment()
    if (pending) {
      paymentsApi.cancelPayment(pending.paymentId).catch(() => {})
      clearPendingPayment()
    }
  }, [])

  return (
    <div className="bg-brand-cream min-h-screen py-20 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-brand-dark/10 text-center">
        <span className="material-symbols-outlined text-rose-500 text-6xl mb-4">cancel</span>
        <h1 className="text-2xl font-helvetica-neue tracking-tight mb-4 text-rose-600">
          Thanh toán đã bị hủy
        </h1>
        <p className="text-brand-dark/70 mb-8 text-sm">
          Bạn đã hủy giao dịch thanh toán hoặc giao dịch đã hết hạn. Bạn có thể thử thanh toán lại trong chi tiết đơn hàng.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/orders"
            className="px-6 py-3 rounded-full bg-brand-dark text-white hover:bg-brand-green font-medium transition-colors text-sm w-full sm:w-auto"
          >
            Về Đơn hàng của tôi
          </Link>
        </div>
      </div>
    </div>
  )
}
