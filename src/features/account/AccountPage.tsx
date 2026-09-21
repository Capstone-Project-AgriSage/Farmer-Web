import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { formatVnd } from '../../data/format'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useAuth } from '../../context/AuthContext'
import { mockOrders } from '../../data/mockOrders'
import { mockDebtEntries as initialDebtEntries, mockDebtPayments as initialDebtPayments } from '../../data/mockDebts'
import { mockDiagnosisCases } from '../../data/mockDiagnosisCases'
import type { DebtEntry, DebtPayment, Order } from '../../types'

const tabs = [
  { id: 'overview', label: 'Tổng quan nông hộ', icon: 'dashboard' },
  { id: 'credit', label: 'Sổ nợ mùa vụ (Hai bên ký xác nhận)', icon: 'credit_score' },
  { id: 'orders', label: 'Lịch sử đơn hàng vật tư', icon: 'receipt_long' },
  { id: 'diagnosis', label: 'Lịch sử chẩn đoán AI', icon: 'psychology' },
] as const

type TabId = (typeof tabs)[number]['id']

function isTabId(value: string | null): value is TabId {
  return tabs.some((tab) => tab.id === value)
}

export default function AccountPage() {
  useDocumentTitle('Tài khoản của tôi - Sổ nợ & Đơn hàng')
  const { farmer, activeStore } = useAuth()
  const [searchParams] = useSearchParams()
  const requestedTab = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<TabId>(isTabId(requestedTab) ? requestedTab : 'overview')

  // Debt & Repayment State
  const [debtEntries, setDebtEntries] = useState<DebtEntry[]>(initialDebtEntries)
  const [debtPayments, setDebtPayments] = useState<DebtPayment[]>(initialDebtPayments)

  // Modals state
  const [disputeModalDebt, setDisputeModalDebt] = useState<DebtEntry | null>(null)
  const [disputeReason, setDisputeReason] = useState('')
  const [repayModalDebt, setRepayModalDebt] = useState<DebtEntry | null>(null)
  const [repayAmount, setRepayAmount] = useState<string>('')
  const [repayMethod, setRepayMethod] = useState<'VIETQR' | 'CASH'>('VIETQR')
  const [repayNote, setRepayNote] = useState('')
  const [selectedOrderForQr, setSelectedOrderForQr] = useState<Order | null>(null)
  const [notification, setNotification] = useState<string | null>(null)

  const showNotification = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 4000)
  }

  // Credit metrics
  const creditLimit = farmer.creditLimit
  const currentUsedDebt = debtEntries
    .filter((d) => d.status === 'ACTIVE')
    .reduce((sum, d) => sum + d.remainingDebt, 0)
  const creditPercent = Math.min(100, Math.round((currentUsedDebt / creditLimit) * 100))

  // Debts awaiting farmer confirmation (WF-03)
  const pendingConfirmDebts = debtEntries.filter((d) => d.farmerConfirmationStatus === 'AWAITING_CONFIRMATION')

  // Two-party debt confirmation actions
  const handleConfirmDebt = (debtId: string) => {
    setDebtEntries((prev) =>
      prev.map((d) =>
        d.id === debtId
          ? {
              ...d,
              confirmedByFarmer: true,
              farmerConfirmationStatus: 'CONFIRMED' as const,
              farmerConfirmedAt: 'Vừa xong',
            }
          : d,
      ),
    )
    showNotification(`Đã xác nhận khoản nợ ${debtId} vào sổ nợ mùa vụ Hai Thắng thành công!`)
  }

  const handleOpenDispute = (debt: DebtEntry) => {
    setDisputeModalDebt(debt)
    setDisputeReason('')
  }

  const handleSubmitDispute = () => {
    if (!disputeModalDebt) return
    if (!disputeReason.trim()) {
      alert('Vui lòng nhập nội dung phản hồi / lý do khiếu nại.')
      return
    }
    setDebtEntries((prev) =>
      prev.map((d) =>
        d.id === disputeModalDebt.id
          ? {
              ...d,
              farmerConfirmationStatus: 'DISPUTED' as const,
              disputeReason: disputeReason.trim(),
            }
          : d,
      ),
    )
    showNotification(`Đã gửi phản hồi khiếu nại khoản nợ ${disputeModalDebt.id} tới đại lý Hai Thắng!`)
    setDisputeModalDebt(null)
  }

  // Repayment submit (WF-04)
  const handleOpenRepay = (debt: DebtEntry) => {
    setRepayModalDebt(debt)
    setRepayAmount(debt.remainingDebt.toString())
    setRepayMethod('VIETQR')
    setRepayNote('')
  }

  const handleSubmitRepay = () => {
    if (!repayModalDebt) return
    const amountNum = Number.parseInt(repayAmount, 10)
    if (Number.isNaN(amountNum) || amountNum <= 0) {
      alert('Vui lòng nhập số tiền trả nợ hợp lệ.')
      return
    }
    const newPayment: DebtPayment = {
      id: `PAY-DEBT-${Date.now().toString().slice(-4)}`,
      debtEntryId: repayModalDebt.id,
      orderCode: repayModalDebt.orderCode,
      amount: amountNum,
      paymentMethod: repayMethod,
      status: 'PENDING_AGENT_CONFIRMATION',
      createdAt: 'Vừa xong',
      note: repayNote.trim() || `Thanh toán nợ cho đơn ${repayModalDebt.orderCode}`,
    }
    setDebtPayments((prev) => [newPayment, ...prev])
    showNotification(
      `Đã gửi thông báo trả nợ ${formatVnd(amountNum)}! Trạng thái: Chờ đại lý Hai Thắng xác nhận thu tiền.`,
    )
    setRepayModalDebt(null)
  }

  return (
    <div className="bg-brand-cream text-brand-dark">
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Tài khoản của tôi' }]} />

      {/* Global Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-brand-dark text-white px-5 py-3 rounded-full flex items-center gap-3 animate-fade-in">
          <span className="material-symbols-outlined text-brand-light text-[20px]">task_alt</span>
          <span className="text-sm tracking-wide">{notification}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-14 space-y-8">
        {/* TOP SUMMARY HEADER: Profile & Credit Limit Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Farmer Profile Card */}
          <div className="lg:col-span-5 border border-brand-dark/10 bg-white p-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-light text-brand-dark flex items-center justify-center text-xl tracking-tight font-helvetica-neue shrink-0 border border-brand-dark/10">
              NH
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-helvetica-neue tracking-tight text-brand-dark truncate">
                  {farmer.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full border border-brand-dark/15 text-[11px] tracking-wide text-brand-dark/60">
                  {farmer.landArea}
                </span>
              </div>
              <p className="text-sm text-brand-dark/60 mt-1">{farmer.address}</p>
              <div className="flex items-center gap-3 text-xs text-brand-dark/50 mt-2">
                <span className="font-mono text-brand-dark">{farmer.phone}</span>
                <span>·</span>
                <span>
                  Đại lý: <span className="text-brand-dark">{activeStore.name}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Credit Overview Card */}
          <div className="lg:col-span-7 border border-brand-dark/10 bg-white p-6 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-green text-xl">credit_score</span>
                <span className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 font-helvetica-neue">
                  Hạn mức sổ nợ vụ Đông Xuân 2025
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-light border border-brand-dark/10 text-[11px] tracking-wide text-brand-dark/70">
                0% lãi suất thu hoạch trả
              </span>
            </div>

            <div>
              <div className="flex items-baseline justify-between text-xs mb-2 gap-3">
                <span className="text-brand-dark/60">
                  Dư nợ đã dùng:{' '}
                  <strong className="font-mono text-brand-dark text-sm font-normal">{formatVnd(currentUsedDebt)}</strong>
                </span>
                <span className="text-brand-dark/60">
                  Hạn mức:{' '}
                  <strong className="font-mono text-brand-dark text-sm font-normal">{formatVnd(creditLimit)}</strong>
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-brand-light overflow-hidden border border-brand-dark/5">
                <div
                  className={`h-full rounded-full transition-all ${
                    creditPercent >= 80 ? 'bg-amber-600' : 'bg-brand-green'
                  }`}
                  style={{ width: `${creditPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-brand-dark/50 gap-3 flex-wrap">
              <span>Đã dùng {creditPercent}% hạn mức</span>
              <span>
                Khả dụng còn lại:{' '}
                <strong className="text-brand-dark font-mono font-normal">
                  {formatVnd(creditLimit - currentUsedDebt)}
                </strong>
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border border-brand-dark/10 bg-white overflow-hidden">
          <div className="flex flex-wrap gap-2 p-3 md:p-4 border-b border-brand-dark/10 bg-brand-light/60 overflow-x-auto">
            {tabs.map((tab) => {
              const hasBadge = tab.id === 'credit' && pendingConfirmDebts.length > 0
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-4 rounded-full flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm tracking-wide transition-colors ${
                    isActive
                      ? 'bg-brand-dark text-white'
                      : 'border border-brand-dark/15 text-brand-dark/60 hover:text-brand-dark hover:border-brand-dark/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {hasBadge && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] tracking-wide ${
                        isActive ? 'bg-white/20 text-white' : 'bg-amber-600 text-white'
                      }`}
                    >
                      {pendingConfirmDebts.length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="p-6 md:p-8 space-y-5">
              {pendingConfirmDebts.length > 0 && (
                <div className="p-4 border border-amber-600/30 bg-amber-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-amber-700 text-2xl shrink-0">
                      notification_important
                    </span>
                    <div>
                      <h4 className="font-helvetica-neue tracking-tight text-brand-dark text-sm">
                        Bác có {pendingConfirmDebts.length} khoản nợ mới từ Đại lý Hai Thắng cần xác nhận!
                      </h4>
                      <p className="text-xs text-brand-dark/60 mt-1">
                        Kiểm tra số lượng vật tư nhận tại ruộng và bấm &quot;Xác nhận nợ&quot; vào sổ nợ mùa vụ.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('credit')}
                    className="px-5 py-2 rounded-full bg-brand-dark text-white hover:bg-brand-green text-xs tracking-wide uppercase transition-colors shrink-0"
                  >
                    Xem và xác nhận ngay
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-brand-dark/10 bg-brand-light p-5 space-y-2">
                  <span className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 font-helvetica-neue">
                    Dư nợ mùa vụ
                  </span>
                  <div className="text-xl font-helvetica-neue tracking-tight text-brand-dark font-mono">
                    {formatVnd(currentUsedDebt)}
                  </div>
                  <button
                    onClick={() => setActiveTab('credit')}
                    className="text-xs tracking-wide text-brand-dark/60 hover:text-brand-dark inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Vào sổ nợ mùa vụ</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>

                <div className="border border-brand-dark/10 bg-brand-light p-5 space-y-2">
                  <span className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 font-helvetica-neue">
                    Đơn hàng mới nhất
                  </span>
                  <div className="text-sm font-helvetica-neue tracking-tight text-brand-dark font-mono">
                    {mockOrders[0].code}
                  </div>
                  <div className="text-xs text-brand-dark/50">{formatVnd(mockOrders[0].total)}</div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs tracking-wide text-brand-dark/60 hover:text-brand-dark inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Xem lịch sử đơn hàng</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>

                <div className="border border-brand-dark/10 bg-brand-light p-5 space-y-2">
                  <span className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 font-helvetica-neue">
                    Chẩn đoán AI gần nhất
                  </span>
                  <div className="text-sm font-helvetica-neue tracking-tight text-brand-dark line-clamp-1">
                    {mockDiagnosisCases[0].predictedDiseaseName}
                  </div>
                  <div className="text-xs text-brand-dark/50">
                    Độ tin cậy {mockDiagnosisCases[0].aiConfidence}%
                  </div>
                  <button
                    onClick={() => setActiveTab('diagnosis')}
                    className="text-xs tracking-wide text-brand-dark/60 hover:text-brand-dark inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Xem ca bệnh</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SỔ NỢ MÙA VỤ */}
          {activeTab === 'credit' && (
            <div className="p-6 md:p-8 space-y-8">
              {/* TWO-PARTY CONFIRMATION SECTION (WF-03) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <h3 className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 font-helvetica-neue">
                    Danh sách khoản nợ vụ lúa
                  </h3>
                  <span className="text-xs text-brand-dark/50">Đại lý lập nợ → Bác Bảy xác nhận</span>
                </div>

                <div className="space-y-3">
                  {debtEntries.map((debt) => {
                    const isAwaiting = debt.farmerConfirmationStatus === 'AWAITING_CONFIRMATION'
                    const isDisputed = debt.farmerConfirmationStatus === 'DISPUTED'
                    const isPaid = debt.status === 'PAID'

                    return (
                      <div
                        key={debt.id}
                        className={`p-5 border transition-colors ${
                          isAwaiting
                            ? 'border-amber-600/40 bg-amber-50/40'
                            : isDisputed
                              ? 'border-rose-300/60 bg-rose-50/30'
                              : isPaid
                                ? 'border-brand-dark/10 bg-brand-light'
                                : 'border-brand-dark/10 bg-white'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-sm text-brand-dark">{debt.orderCode}</span>
                              <span className="text-xs text-brand-dark/50">({debt.id})</span>
                              {isAwaiting && (
                                <span className="px-2.5 py-0.5 rounded-full border border-amber-600/40 text-amber-900 text-[10px] tracking-wide">
                                  Chờ Bác Bảy xác nhận nợ
                                </span>
                              )}
                              {isDisputed && (
                                <span className="px-2.5 py-0.5 rounded-full border border-rose-300 text-rose-800 text-[10px] tracking-wide">
                                  Đang khiếu nại sai lệch
                                </span>
                              )}
                              {!isAwaiting && !isDisputed && !isPaid && (
                                <span className="px-2.5 py-0.5 rounded-full bg-brand-light border border-brand-dark/10 text-brand-dark/70 text-[10px] tracking-wide">
                                  Đã xác nhận nợ
                                </span>
                              )}
                              {isPaid && (
                                <span className="px-2.5 py-0.5 rounded-full border border-brand-dark/15 text-brand-dark/50 text-[10px] tracking-wide">
                                  Đã tất toán
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-brand-dark/60">
                              <span>
                                Hạn trả: <span className="text-brand-dark">{debt.dueDate}</span>
                              </span>
                              <span className="text-brand-dark/40"> · Tạo ngày: {debt.createdAt}</span>
                            </div>
                            {isDisputed && debt.disputeReason && (
                              <div className="mt-1 text-xs text-rose-700">
                                Lý do khiếu nại: {debt.disputeReason}
                              </div>
                            )}
                          </div>

                          <div className="flex sm:flex-col items-baseline sm:items-end justify-between gap-1 shrink-0">
                            <span className="text-sm sm:text-base font-helvetica-neue tracking-tight text-brand-dark font-mono">
                              {formatVnd(debt.totalDebt)}
                            </span>
                            {debt.paidAmount > 0 && (
                              <span className="text-xs text-brand-green">
                                Đã trả: {formatVnd(debt.paidAmount)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-4 pt-3 border-t border-brand-dark/10 flex items-center justify-end gap-2">
                          {isAwaiting ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenDispute(debt)}
                                className="px-4 py-1.5 rounded-full border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs tracking-wide uppercase transition-colors"
                              >
                                Khiếu nại
                              </button>
                              <button
                                type="button"
                                onClick={() => handleConfirmDebt(debt.id)}
                                className="px-4 py-1.5 rounded-full bg-brand-dark hover:bg-brand-green text-white text-xs tracking-wide uppercase transition-colors inline-flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                <span>Xác nhận nợ</span>
                              </button>
                            </>
                          ) : !isPaid ? (
                            <button
                              type="button"
                              onClick={() => handleOpenRepay(debt)}
                              className="px-4 py-1.5 rounded-full bg-brand-dark hover:bg-brand-green text-white text-xs tracking-wide uppercase transition-colors inline-flex items-center gap-1.5"
                            >
                              <span className="material-symbols-outlined text-[16px]">payments</span>
                              <span>Trả nợ VietQR</span>
                            </button>
                          ) : null}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* REPAYMENT HISTORY */}
              <div className="pt-6 border-t border-brand-dark/10 space-y-4">
                <h3 className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 font-helvetica-neue">
                  Lịch sử trả nợ &amp; thu tiền
                </h3>
                <div className="space-y-2">
                  {debtPayments.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 border border-brand-dark/10 bg-brand-light flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-brand-dark">{p.id}</span>
                          <span className="text-brand-dark/50">· {p.orderCode}</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] tracking-wide ${
                              p.status === 'PENDING_AGENT_CONFIRMATION'
                                ? 'border border-amber-600/40 text-amber-900'
                                : 'bg-white border border-brand-dark/10 text-brand-dark/70'
                            }`}
                          >
                            {p.status === 'PENDING_AGENT_CONFIRMATION' ? 'Chờ đại lý xác nhận' : 'Đã khớp nợ'}
                          </span>
                        </div>
                        <div className="text-[11px] text-brand-dark/50 mt-1">
                          {p.paymentMethod === 'VIETQR' ? 'VietQR' : 'Tiền mặt'} · {p.createdAt}
                        </div>
                      </div>
                      <div className="font-mono text-brand-dark text-sm shrink-0">+{formatVnd(p.amount)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'orders' && (
            <div className="divide-y divide-brand-dark/10">
              {mockOrders.map((order) => {
                const isPendingVerification = order.paymentStatus === 'AWAITING_AGENT_VERIFICATION'

                return (
                  <div key={order.code} className="p-5 md:p-6 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-brand-dark text-sm">{order.code}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] tracking-wide border ${
                            order.status === 'SHIPPING'
                              ? 'border-brand-dark/20 text-brand-dark/70'
                              : order.status === 'PROCESSING'
                                ? 'border-brand-dark/20 text-brand-dark/70'
                                : 'bg-brand-light border-brand-dark/10 text-brand-dark'
                          }`}
                        >
                          {order.status === 'SHIPPING'
                            ? 'Đang giao tận ruộng'
                            : order.status === 'PROCESSING'
                              ? 'Đang đóng gói'
                              : 'Hoàn thành'}
                        </span>
                        <span className="text-xs text-brand-dark/50">
                          · {order.paymentMethod === 'SEASONAL_CREDIT' ? 'Gối nợ mùa vụ' : 'VietQR'}
                        </span>
                      </div>
                      <div className="font-mono font-helvetica-neue tracking-tight text-brand-dark text-sm">
                        {formatVnd(order.total)}
                      </div>
                    </div>

                    <div className="bg-brand-light border border-brand-dark/10 p-3 text-xs space-y-1.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-brand-dark/60 gap-3">
                          <span>
                            {item.product.name} ({item.product.packaging})
                          </span>
                          <span className="font-mono text-brand-dark shrink-0">
                            x{item.quantity} · {formatVnd(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-brand-dark/50 gap-3">
                      <span>Đặt ngày {order.createdAt}</span>
                      {isPendingVerification && (
                        <button
                          type="button"
                          onClick={() => setSelectedOrderForQr(order)}
                          className="text-brand-dark hover:text-brand-green tracking-wide inline-flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                          <span>Xem lại mã VietQR</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* TAB 4: DIAGNOSIS */}
          {activeTab === 'diagnosis' && (
            <div className="divide-y divide-brand-dark/10">
              {mockDiagnosisCases.map((c) => {
                const isVerified = c.status === 'VERIFIED'
                return (
                  <div
                    key={c.id}
                    className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={c.imageUrl}
                        alt={c.predictedDiseaseName}
                        className="w-16 h-16 object-cover border border-brand-dark/10 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-helvetica-neue tracking-tight text-sm text-brand-dark">
                            {isVerified ? c.verifiedDiseaseName : c.predictedDiseaseName}
                          </span>
                          <span className="text-xs font-mono text-brand-dark/50">({c.id})</span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] tracking-wide border ${
                              isVerified
                                ? 'bg-brand-light border-brand-dark/10 text-brand-dark/70'
                                : 'border-amber-600/40 text-amber-900'
                            }`}
                          >
                            {isVerified ? 'Đã thẩm định' : 'Chờ thẩm định'}
                          </span>
                        </div>
                        <div className="text-xs text-brand-dark/60 mt-1">
                          {c.cropStage} · AI tin cậy {c.aiConfidence}%
                        </div>
                        {c.reviewerNote && (
                          <div className="text-xs text-brand-dark/50 mt-1 italic">
                            Kỹ sư: &quot;{c.reviewerNote}&quot;
                          </div>
                        )}
                      </div>
                    </div>

                    <Link
                      to="/ai-doctor"
                      className="px-4 py-1.5 rounded-full border border-brand-dark/20 text-brand-dark hover:bg-brand-light text-xs tracking-wide uppercase transition-colors inline-flex items-center gap-1 self-end sm:self-center"
                    >
                      <span>Xem chi tiết ca bệnh</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL: DISPUTE DEBT (WF-03) */}
      {disputeModalDebt && (
        <div className="fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-brand-cream border border-brand-dark/10 max-w-lg w-full p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-brand-dark/10">
              <h3 className="font-helvetica-neue tracking-tight text-base text-brand-dark flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-600">report_problem</span>
                <span>Khiếu nại sai lệch ghi nợ ({disputeModalDebt.orderCode})</span>
              </h3>
              <button
                type="button"
                onClick={() => setDisputeModalDebt(null)}
                className="text-brand-dark/50 hover:text-brand-dark transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="text-xs text-brand-dark/60 space-y-2">
              <p>
                Khoản nợ ghi nhận:{' '}
                <strong className="text-brand-dark font-mono font-normal">
                  {formatVnd(disputeModalDebt.totalDebt)}
                </strong>
              </p>
              <label className="block text-brand-dark tracking-wide">
                Lý do khiếu nại (VD: giao thiếu phân bón, bao bì rách vỡ, chưa nhận hàng...):
              </label>
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Nhập chi tiết sai lệch để đại lý Hai Thắng kiểm tra lại kho và hiệu chỉnh thẻ nợ..."
                rows={3}
                className="w-full border border-brand-dark/15 bg-white p-3 text-xs text-brand-dark focus:outline-none focus:border-brand-dark/40"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDisputeModalDebt(null)}
                className="px-4 py-2 rounded-full border border-brand-dark/15 text-brand-dark/60 text-xs tracking-wide uppercase hover:text-brand-dark transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmitDispute}
                className="px-4 py-2 rounded-full bg-rose-700 hover:bg-rose-800 text-white text-xs tracking-wide uppercase transition-colors"
              >
                Gửi khiếu nại tới đại lý
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REPAY DEBT (WF-04) */}
      {repayModalDebt && (
        <div className="fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-brand-cream border border-brand-dark/10 max-w-lg w-full p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-brand-dark/10">
              <h3 className="font-helvetica-neue tracking-tight text-base text-brand-dark flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-green">payments</span>
                <span>Trả nợ gối đầu vụ mùa ({repayModalDebt.orderCode})</span>
              </h3>
              <button
                type="button"
                onClick={() => setRepayModalDebt(null)}
                className="text-brand-dark/50 hover:text-brand-dark transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-brand-light border border-brand-dark/10 flex justify-between items-center">
                <span className="text-brand-dark/50">Dư nợ còn lại:</span>
                <span className="font-mono font-helvetica-neue tracking-tight text-brand-dark text-base">
                  {formatVnd(repayModalDebt.remainingDebt)}
                </span>
              </div>

              <div>
                <label className="block text-brand-dark tracking-wide mb-1.5">Số tiền thanh toán (₫):</label>
                <input
                  type="number"
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(e.target.value)}
                  className="w-full border border-brand-dark/15 bg-white p-2.5 font-mono text-sm text-brand-dark focus:outline-none focus:border-brand-dark/40"
                />
              </div>

              <div>
                <label className="block text-brand-dark tracking-wide mb-1.5">Phương thức thanh toán:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRepayMethod('VIETQR')}
                    className={`p-3 border text-left transition-colors flex items-center gap-2 ${
                      repayMethod === 'VIETQR'
                        ? 'border-brand-dark bg-brand-light text-brand-dark'
                        : 'border-brand-dark/15 bg-white text-brand-dark/60'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">qr_code_2</span>
                    <div>
                      <div>Chuyển khoản VietQR</div>
                      <div className="text-[10px] text-brand-dark/50 font-normal">Vietcombank 19006828999</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRepayMethod('CASH')}
                    className={`p-3 border text-left transition-colors flex items-center gap-2 ${
                      repayMethod === 'CASH'
                        ? 'border-brand-dark bg-brand-light text-brand-dark'
                        : 'border-brand-dark/15 bg-white text-brand-dark/60'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">local_atm</span>
                    <div>
                      <div>Tiền mặt tại kho</div>
                      <div className="text-[10px] text-brand-dark/50 font-normal">Nộp tại quầy Hai Thắng</div>
                    </div>
                  </button>
                </div>
              </div>

              {repayMethod === 'VIETQR' && (
                <div className="p-3 border border-brand-dark/10 bg-brand-light flex items-center gap-3">
                  <div className="w-20 h-20 bg-white p-1 border border-brand-dark/10 flex-shrink-0">
                    <img
                      src="/images/misc/vietqr-demo.png"
                      alt="VietQR"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-[11px] space-y-0.5 text-brand-dark/60">
                    <div>
                      Ngân hàng: <span className="text-brand-dark">Vietcombank (VCB)</span>
                    </div>
                    <div>
                      Số tài khoản:{' '}
                      <span className="font-mono text-brand-dark">19006828999</span>
                    </div>
                    <div>
                      Chủ tài khoản: <span className="text-brand-dark">NGUYEN VAN THANG</span>
                    </div>
                    <div>
                      Cú pháp:{' '}
                      <span className="font-mono text-brand-dark">TRANO {repayModalDebt.id}</span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-brand-dark tracking-wide mb-1.5">Ghi chú trả nợ:</label>
                <input
                  type="text"
                  value={repayNote}
                  onChange={(e) => setRepayNote(e.target.value)}
                  placeholder="VD: Trả trước tiền phân bón vụ lúa Đông Xuân..."
                  className="w-full border border-brand-dark/15 bg-white p-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-dark/40"
                />
              </div>

              <div className="p-2.5 border border-amber-600/30 bg-amber-50/50 text-amber-950 text-[11px]">
                Sau khi gửi, yêu cầu sẽ ở trạng thái <strong>Chờ đối soát</strong>. Chủ đại lý Hai Thắng sẽ kiểm tra tài
                khoản/thủ quỹ và xác nhận khớp trừ nợ trong vòng 2-4 giờ.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-brand-dark/10">
              <button
                type="button"
                onClick={() => setRepayModalDebt(null)}
                className="px-4 py-2 rounded-full border border-brand-dark/15 text-brand-dark/60 text-xs tracking-wide uppercase hover:text-brand-dark transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmitRepay}
                className="px-5 py-2 rounded-full bg-brand-dark hover:bg-brand-green text-white text-xs tracking-wide uppercase transition-colors inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
                <span>Xác nhận đã gửi thanh toán</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIETQR DETAILS FOR ORDER */}
      {selectedOrderForQr && (
        <div className="fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-brand-cream border border-brand-dark/10 max-w-md w-full p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-brand-dark/10">
              <h3 className="font-helvetica-neue tracking-tight text-base text-brand-dark flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-green">qr_code_2</span>
                <span>Thông tin chuyển khoản đơn {selectedOrderForQr.code}</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedOrderForQr(null)}
                className="text-brand-dark/50 hover:text-brand-dark transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-brand-light border border-brand-dark/10 flex items-center gap-4">
                <div className="w-24 h-24 bg-white p-1 border border-brand-dark/10 flex-shrink-0">
                  <img
                    src="/images/misc/vietqr-demo.png"
                    alt="VietQR"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1 text-brand-dark/60">
                  <div>
                    Ngân hàng: <span className="text-brand-dark">Vietcombank (VCB)</span>
                  </div>
                  <div>
                    STK: <span className="font-mono text-brand-dark text-sm">19006828999</span>
                  </div>
                  <div>
                    Chủ TK: <span className="text-brand-dark">NGUYEN VAN THANG</span>
                  </div>
                  <div>
                    Số tiền:{' '}
                    <span className="font-mono text-brand-dark">{formatVnd(selectedOrderForQr.total)}</span>
                  </div>
                  <div>
                    Nội dung:{' '}
                    <span className="font-mono text-brand-dark">
                      {selectedOrderForQr.code.replace('#', '')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-3 border border-amber-600/30 bg-amber-50/50 text-amber-950 text-[11px] leading-relaxed">
                Đơn hàng đang chờ đại lý Hai Thắng đối soát thủ công trên sao kê Vietcombank. Bác nông dân không cần
                chuyển lại nếu đã thực hiện giao dịch.
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrderForQr(null)}
                className="px-5 py-2 rounded-full bg-brand-dark hover:bg-brand-green text-white text-xs tracking-wide uppercase transition-colors"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
