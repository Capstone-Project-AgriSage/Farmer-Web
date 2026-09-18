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
    <>
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Tài khoản của tôi' }]} />

      {/* Global Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-800 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in border border-emerald-600">
          <span className="material-symbols-outlined text-emerald-300">task_alt</span>
          <span className="text-sm font-semibold">{notification}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* TOP SUMMARY HEADER: Profile & Credit Limit Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Farmer Profile Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-border-subtle p-5 shadow-xs flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-primary flex items-center justify-center text-xl font-extrabold shrink-0">
              NH
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold text-text-primary truncate">
                  {farmer.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-primary">
                  {farmer.landArea}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">{farmer.address}</p>
              <div className="flex items-center gap-3 text-xs text-text-muted mt-2">
                <span className="font-mono font-medium text-text-primary">{farmer.phone}</span>
                <span>•</span>
                <span>Đại lý: <strong className="text-text-primary">{activeStore.name}</strong></span>
              </div>
            </div>
          </div>

          {/* Credit Overview Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-border-subtle p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">credit_score</span>
                <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  Hạn Mức Sổ Nợ Vụ Đông Xuân 2025
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                0% Lãi suất thu hoạch trả
              </span>
            </div>

            <div className="my-2">
              <div className="flex items-baseline justify-between text-xs mb-1.5">
                <span className="text-text-secondary">
                  Dư nợ đã dùng: <strong className="font-mono text-primary text-sm">{formatVnd(currentUsedDebt)}</strong>
                </span>
                <span className="text-text-secondary">
                  Hạn mức: <strong className="font-mono text-text-primary text-sm">{formatVnd(creditLimit)}</strong>
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    creditPercent >= 80 ? 'bg-amber-500' : 'bg-primary'
                  }`}
                  style={{ width: `${creditPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>Đã dùng {creditPercent}% hạn mức</span>
              <span>Khả dụng còn lại: <strong className="text-emerald-700 font-mono">{formatVnd(creditLimit - currentUsedDebt)}</strong></span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl border border-border-subtle shadow-xs overflow-hidden">
          <div className="flex border-b border-border-subtle bg-slate-50/70 overflow-x-auto text-xs sm:text-sm font-semibold p-1 gap-1">
            {tabs.map((tab) => {
              const hasBadge = tab.id === 'credit' && pendingConfirmDebts.length > 0
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2.5 px-4 sm:px-6 rounded-xl flex items-center gap-2 whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-primary font-bold shadow-xs'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/60'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {hasBadge && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-extrabold text-[10px]">
                      {pendingConfirmDebts.length}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="p-6 space-y-5">
              {pendingConfirmDebts.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-amber-600 text-2xl">
                      notification_important
                    </span>
                    <div>
                      <h4 className="font-bold text-sm">
                        Bác có {pendingConfirmDebts.length} khoản nợ mới từ Đại lý Hai Thắng cần xác nhận!
                      </h4>
                      <p className="text-xs text-amber-800 mt-0.5">
                        Kiểm tra số lượng vật tư nhận tại ruộng và bấm "Xác nhận nợ" vào sổ nợ mùa vụ.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('credit')}
                    className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shrink-0 shadow-xs"
                  >
                    Xem và xác nhận ngay
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-border-subtle p-4 space-y-2 bg-slate-50/50">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Dư nợ mùa vụ</span>
                  <div className="text-xl font-bold text-primary font-mono">{formatVnd(currentUsedDebt)}</div>
                  <button
                    onClick={() => setActiveTab('credit')}
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>Vào sổ nợ mùa vụ</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>

                <div className="rounded-xl border border-border-subtle p-4 space-y-2 bg-slate-50/50">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Đơn hàng mới nhất</span>
                  <div className="text-sm font-bold text-text-primary font-mono">{mockOrders[0].code}</div>
                  <div className="text-xs text-text-muted">{formatVnd(mockOrders[0].total)}</div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>Xem lịch sử đơn hàng</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>

                <div className="rounded-xl border border-border-subtle p-4 space-y-2 bg-slate-50/50">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Chẩn đoán AI gần nhất</span>
                  <div className="text-sm font-bold text-text-primary line-clamp-1">{mockDiagnosisCases[0].predictedDiseaseName}</div>
                  <div className="text-xs text-text-muted">Độ tin cậy {mockDiagnosisCases[0].aiConfidence}%</div>
                  <button
                    onClick={() => setActiveTab('diagnosis')}
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
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
            <div className="p-6 space-y-6">
              {/* TWO-PARTY CONFIRMATION SECTION (WF-03) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    Danh Sách Khoản Nợ Vụ Lúa
                  </h3>
                  <span className="text-xs text-text-muted">Đại lý lập nợ → Bác Bảy xác nhận</span>
                </div>

                <div className="space-y-3">
                  {debtEntries.map((debt) => {
                    const isAwaiting = debt.farmerConfirmationStatus === 'AWAITING_CONFIRMATION'
                    const isDisputed = debt.farmerConfirmationStatus === 'DISPUTED'
                    const isPaid = debt.status === 'PAID'

                    return (
                      <div
                        key={debt.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isAwaiting
                            ? 'border-amber-400 bg-amber-50/40 shadow-xs'
                            : isDisputed
                            ? 'border-rose-300 bg-rose-50/30'
                            : isPaid
                            ? 'border-border-subtle bg-slate-50/40'
                            : 'border-border-subtle bg-white'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-bold text-sm text-text-primary">{debt.orderCode}</span>
                              <span className="text-xs text-text-muted">({debt.id})</span>
                              {isAwaiting && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300">
                                  Chờ Bác Bảy xác nhận nợ
                                </span>
                              )}
                              {isDisputed && (
                                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                                  Đang khiếu nại sai lệch
                                </span>
                              )}
                              {!isAwaiting && !isDisputed && !isPaid && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                                  Đã xác nhận nợ
                                </span>
                              )}
                              {isPaid && (
                                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px]">
                                  Đã tất toán
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-text-secondary">
                              <span>Hạn trả: <strong>{debt.dueDate}</strong></span>
                              <span className="text-text-muted"> · Tạo ngày: {debt.createdAt}</span>
                            </div>
                            {isDisputed && debt.disputeReason && (
                              <div className="mt-1 text-xs text-rose-700">
                                Lý do khiếu nại: {debt.disputeReason}
                              </div>
                            )}
                          </div>

                          <div className="flex sm:flex-col items-baseline sm:items-end justify-between gap-1 shrink-0">
                            <span className="text-sm sm:text-base font-extrabold text-primary font-mono">
                              {formatVnd(debt.totalDebt)}
                            </span>
                            {debt.paidAmount > 0 && (
                              <span className="text-xs text-emerald-700 font-medium">
                                Đã trả: {formatVnd(debt.paidAmount)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-3 pt-3 border-t border-border-subtle/60 flex items-center justify-end gap-2">
                          {isAwaiting ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenDispute(debt)}
                                className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
                              >
                                Khiếu nại
                              </button>
                              <button
                                type="button"
                                onClick={() => handleConfirmDebt(debt.id)}
                                className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                <span>Xác nhận nợ</span>
                              </button>
                            </>
                          ) : !isPaid ? (
                            <button
                              type="button"
                              onClick={() => handleOpenRepay(debt)}
                              className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-colors shadow-sm inline-flex items-center gap-1.5"
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
              <div className="pt-4 border-t border-border-subtle space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                  Lịch Sử Trả Nợ &amp; Thu Tiền
                </h3>
                <div className="space-y-2">
                  {debtPayments.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl border border-border-subtle bg-slate-50/50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-text-primary">{p.id}</span>
                          <span className="text-text-muted">· {p.orderCode}</span>
                          <span className={`px-2 py-0.2 rounded-full font-bold text-[10px] ${
                            p.status === 'PENDING_AGENT_CONFIRMATION'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {p.status === 'PENDING_AGENT_CONFIRMATION' ? 'Chờ đại lý xác nhận' : 'Đã khớp nợ'}
                          </span>
                        </div>
                        <div className="text-[11px] text-text-muted mt-0.5">
                          {p.paymentMethod === 'VIETQR' ? 'VietQR' : 'Tiền mặt'} · {p.createdAt}
                        </div>
                      </div>
                      <div className="font-mono font-bold text-emerald-700 text-sm">
                        +{formatVnd(p.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'orders' && (
            <div className="divide-y divide-border-subtle">
              {mockOrders.map((order) => {
                const isPendingVerification = order.paymentStatus === 'AWAITING_AGENT_VERIFICATION'

                return (
                  <div key={order.code} className="p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-text-primary text-sm">{order.code}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.status === 'SHIPPING'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'PROCESSING'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {order.status === 'SHIPPING' ? 'Đang giao tận ruộng' : order.status === 'PROCESSING' ? 'Đang đóng gói' : 'Hoàn thành'}
                        </span>
                        <span className="text-xs text-text-muted">· {order.paymentMethod === 'SEASONAL_CREDIT' ? 'Gối nợ mùa vụ' : 'VietQR'}</span>
                      </div>
                      <div className="font-mono font-extrabold text-primary text-sm">
                        {formatVnd(order.total)}
                      </div>
                    </div>

                    <div className="bg-slate-50/60 rounded-xl p-3 text-xs space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-text-secondary">
                          <span>{item.product.name} ({item.product.packaging})</span>
                          <span className="font-mono font-medium text-text-primary">x{item.quantity} · {formatVnd(item.product.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span>Đặt ngày {order.createdAt}</span>
                      {isPendingVerification && (
                        <button
                          type="button"
                          onClick={() => setSelectedOrderForQr(order)}
                          className="text-primary hover:underline font-bold inline-flex items-center gap-1"
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
            <div className="divide-y divide-border-subtle">
              {mockDiagnosisCases.map((c) => {
                const isVerified = c.status === 'VERIFIED'
                return (
                  <div key={c.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={c.imageUrl}
                        alt={c.predictedDiseaseName}
                        className="w-16 h-16 rounded-xl object-cover border border-border-subtle shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-text-primary">
                            {isVerified ? c.verifiedDiseaseName : c.predictedDiseaseName}
                          </span>
                          <span className="text-xs font-mono text-text-muted">({c.id})</span>
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {isVerified ? 'Đã thẩm định' : 'Chờ thẩm định'}
                          </span>
                        </div>
                        <div className="text-xs text-text-secondary mt-0.5">
                          {c.cropStage} · AI tin cậy {c.aiConfidence}%
                        </div>
                        {c.reviewerNote && (
                          <div className="text-xs text-emerald-800 mt-1 italic">
                            Kỹ sư: "{c.reviewerNote}"
                          </div>
                        )}
                      </div>
                    </div>

                    <Link
                      to="/ai-doctor"
                      className="px-3 py-1.5 rounded-lg border border-primary text-primary hover:bg-primary/5 text-xs font-bold transition-colors inline-flex items-center gap-1 self-end sm:self-center"
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <h3 className="font-bold text-base text-text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-600">report_problem</span>
                <span>Khiếu nại sai lệch ghi nợ ({disputeModalDebt.orderCode})</span>
              </h3>
              <button
                type="button"
                onClick={() => setDisputeModalDebt(null)}
                className="text-text-muted hover:text-text-primary"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="text-xs text-text-secondary space-y-2">
              <p>
                Khoản nợ ghi nhận:{' '}
                <strong className="text-primary font-mono">{formatVnd(disputeModalDebt.totalDebt)}</strong>
              </p>
              <label className="block font-semibold text-text-primary">
                Lý do khiếu nại (VD: giao thiếu phân bón, bao bì rách vỡ, chưa nhận hàng...):
              </label>
              <textarea
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Nhập chi tiết sai lệch để đại lý Hai Thắng kiểm tra lại kho và hiệu chỉnh thẻ nợ..."
                rows={3}
                className="w-full rounded-xl border border-border-subtle p-3 text-xs focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDisputeModalDebt(null)}
                className="px-4 py-2 rounded-xl border border-border-subtle text-text-secondary text-xs font-semibold hover:bg-surface-subtle"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmitDispute}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
              >
                Gửi khiếu nại tới đại lý
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REPAY DEBT (WF-04) */}
      {repayModalDebt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <h3 className="font-bold text-base text-text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">payments</span>
                <span>Trả nợ gối đầu vụ mùa ({repayModalDebt.orderCode})</span>
              </h3>
              <button
                type="button"
                onClick={() => setRepayModalDebt(null)}
                className="text-text-muted hover:text-text-primary"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-surface-subtle rounded-xl flex justify-between items-center">
                <span className="text-text-muted">Dư nợ còn lại:</span>
                <span className="font-mono font-extrabold text-primary text-base">
                  {formatVnd(repayModalDebt.remainingDebt)}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-text-primary mb-1">Số tiền thanh toán (₫):</label>
                <input
                  type="number"
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(e.target.value)}
                  className="w-full rounded-xl border border-border-subtle p-2.5 font-mono text-sm font-bold text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-text-primary mb-1">Phương thức thanh toán:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRepayMethod('VIETQR')}
                    className={`p-3 rounded-xl border text-left transition-colors flex items-center gap-2 ${
                      repayMethod === 'VIETQR'
                        ? 'border-primary bg-emerald-50/60 font-bold text-primary'
                        : 'border-border-subtle bg-white text-text-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">qr_code_2</span>
                    <div>
                      <div>Chuyển khoản VietQR</div>
                      <div className="text-[10px] text-text-muted font-normal">Vietcombank 19006828999</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRepayMethod('CASH')}
                    className={`p-3 rounded-xl border text-left transition-colors flex items-center gap-2 ${
                      repayMethod === 'CASH'
                        ? 'border-primary bg-emerald-50/60 font-bold text-primary'
                        : 'border-border-subtle bg-white text-text-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">local_atm</span>
                    <div>
                      <div>Tiền mặt tại kho</div>
                      <div className="text-[10px] text-text-muted font-normal">Nộp tại quầy Hai Thắng</div>
                    </div>
                  </button>
                </div>
              </div>

              {repayMethod === 'VIETQR' && (
                <div className="p-3 rounded-xl bg-surface-subtle border border-border-subtle flex items-center gap-3">
                  <div className="w-20 h-20 bg-white p-1 rounded-lg border border-border-subtle flex-shrink-0">
                    <img
                      src="/images/misc/vietqr-demo.png"
                      alt="VietQR"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-[11px] space-y-0.5">
                    <div>
                      Ngân hàng: <strong>Vietcombank (VCB)</strong>
                    </div>
                    <div>
                      Số tài khoản: <strong className="font-mono text-primary">19006828999</strong>
                    </div>
                    <div>
                      Chủ tài khoản: <strong>NGUYEN VAN THANG</strong>
                    </div>
                    <div>
                      Cú pháp: <strong className="font-mono text-primary">TRANO {repayModalDebt.id}</strong>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-text-primary mb-1">Ghi chú trả nợ:</label>
                <input
                  type="text"
                  value={repayNote}
                  onChange={(e) => setRepayNote(e.target.value)}
                  placeholder="VD: Trả trước tiền phân bón vụ lúa Đông Xuân..."
                  className="w-full rounded-xl border border-border-subtle p-2.5 text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                Sau khi gửi, yêu cầu sẽ ở trạng thái <strong>Chờ đối soát</strong>. Chủ đại lý Hai Thắng sẽ kiểm tra tài
                khoản/thủ quỹ và xác nhận khớp trừ nợ trong vòng 2-4 giờ.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setRepayModalDebt(null)}
                className="px-4 py-2 rounded-xl border border-border-subtle text-text-secondary text-xs font-semibold hover:bg-surface-subtle"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmitRepay}
                className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <h3 className="font-bold text-base text-text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">qr_code_2</span>
                <span>Thông tin chuyển khoản đơn {selectedOrderForQr.code}</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedOrderForQr(null)}
                className="text-text-muted hover:text-text-primary"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-surface-subtle rounded-xl flex items-center gap-4">
                <div className="w-24 h-24 bg-white p-1 rounded-lg border border-border-subtle flex-shrink-0">
                  <img
                    src="/images/misc/vietqr-demo.png"
                    alt="VietQR"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <div>
                    Ngân hàng: <strong>Vietcombank (VCB)</strong>
                  </div>
                  <div>
                    STK: <strong className="font-mono text-primary text-sm">19006828999</strong>
                  </div>
                  <div>
                    Chủ TK: <strong>NGUYEN VAN THANG</strong>
                  </div>
                  <div>
                    Số tiền: <strong className="font-mono text-primary">{formatVnd(selectedOrderForQr.total)}</strong>
                  </div>
                  <div>
                    Nội dung: <strong className="font-mono text-primary">{selectedOrderForQr.code.replace('#', '')}</strong>
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                Đơn hàng đang chờ đại lý Hai Thắng đối soát thủ công trên sao kê Vietcombank. Bác nông dân không cần
                chuyển lại nếu đã thực hiện giao dịch.
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrderForQr(null)}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
