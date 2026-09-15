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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Farmer Profile & Store Affiliation */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-sm text-center">
              <div className="w-20 h-20 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto text-2xl font-bold shadow-inner">
                NH
              </div>
              <h1 className="text-lg font-bold text-text-primary mt-3">{farmer.name}</h1>
              <p className="text-xs text-text-muted mt-0.5">{farmer.address}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Nông hộ {farmer.landArea}
              </div>

              <div className="mt-4 pt-4 border-t border-border-subtle text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-muted">Số điện thoại:</span>
                  <span className="font-semibold text-text-primary font-mono">{farmer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Hội viên từ:</span>
                  <span className="font-semibold text-text-primary">Tháng 03/2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Mã định danh:</span>
                  <span className="font-mono text-text-secondary">{farmer.id}</span>
                </div>
              </div>
            </div>

            {/* Store Information Box */}
            <div className="bg-surface-subtle/80 rounded-2xl border border-border-subtle p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">storefront</span>
                <h3 className="text-xs font-bold text-text-primary uppercase tracking-wide">Đại lý liên kết quản lý</h3>
              </div>
              <div>
                <h4 className="text-sm font-bold text-text-primary">{activeStore.name}</h4>
                <p className="text-xs text-text-secondary mt-0.5">{activeStore.address}</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-border-subtle text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-text-muted">Hotline kỹ thuật:</span>
                  <a href={`tel:${activeStore.phone}`} className="font-bold text-primary hover:underline">
                    {activeStore.phone}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Tài khoản VietQR:</span>
                  <span className="font-mono font-bold text-text-primary">{activeStore.bankAccountNumber} (VCB)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Chủ tài khoản:</span>
                  <span className="font-bold text-text-primary text-[11px] uppercase">{activeStore.bankAccountName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Tabs */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex border-b border-border-subtle bg-surface-subtle overflow-x-auto text-xs sm:text-sm font-semibold">
                {tabs.map((tab) => {
                  const hasBadge = tab.id === 'credit' && pendingConfirmDebts.length > 0
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-3.5 px-4 sm:px-6 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors relative ${
                        activeTab === tab.id
                          ? 'border-primary text-primary bg-white font-bold'
                          : 'border-transparent text-text-secondary hover:text-primary hover:bg-white/50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                      <span>{tab.label}</span>
                      {hasBadge && (
                        <span className="px-1.5 py-0.2 rounded-full bg-status-warning text-amber-900 font-extrabold text-[10px] animate-pulse">
                          {pendingConfirmDebts.length}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="p-6 space-y-6">
                  {/* Two-party attention banner if pending confirmation */}
                  {pendingConfirmDebts.length > 0 && (
                    <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-900 flex items-start gap-3 shadow-xs">
                      <span className="material-symbols-outlined text-amber-700 text-2xl flex-shrink-0 mt-0.5">
                        notification_important
                      </span>
                      <div className="flex-1 text-xs">
                        <h4 className="font-bold text-sm text-amber-950">
                          Bác có {pendingConfirmDebts.length} khoản nợ mới từ Đại lý Hai Thắng cần xác nhận!
                        </h4>
                        <p className="mt-1 leading-relaxed">
                          Đại lý đã giao vật tư vụ Đông Xuân 2025. Theo quy trình hai bên đối soát, bác vui lòng kiểm
                          tra số lượng hàng thực nhận và bấm "Xác nhận nợ" hoặc "Khiếu nại".
                        </p>
                        <button
                          onClick={() => setActiveTab('credit')}
                          className="mt-2.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors inline-flex items-center gap-1 shadow-sm"
                        >
                          <span>Xem và xác nhận ngay</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-border-subtle p-4 space-y-2 bg-white">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <span className="material-symbols-outlined text-primary text-[18px]">credit_score</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Dư nợ mùa vụ</span>
                      </div>
                      <div className="text-xl font-extrabold text-text-primary font-mono">
                        {formatVnd(currentUsedDebt)}
                      </div>
                      <div className="text-[11px] text-text-muted">
                        Hạn mức {formatVnd(creditLimit)} ({creditPercent}%)
                      </div>
                      <button
                        onClick={() => setActiveTab('credit')}
                        className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
                      >
                        Vào sổ nợ mùa vụ
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    </div>

                    <div className="rounded-xl border border-border-subtle p-4 space-y-2 bg-white">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <span className="material-symbols-outlined text-primary text-[18px]">receipt_long</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Đơn hàng mới nhất</span>
                      </div>
                      <div className="text-sm font-bold text-text-primary font-mono">{mockOrders[0].code}</div>
                      <div className="text-[11px] text-text-muted">
                        {mockOrders[0].status === 'SHIPPING' ? 'Đang giao tới ruộng' : 'Đang xử lý'} ·{' '}
                        {formatVnd(mockOrders[0].total)}
                      </div>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
                      >
                        Xem lịch sử đơn hàng
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    </div>

                    <div className="rounded-xl border border-border-subtle p-4 space-y-2 bg-white">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <span className="material-symbols-outlined text-primary text-[18px]">psychology</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Chẩn đoán AI gần nhất</span>
                      </div>
                      <div className="text-sm font-bold text-text-primary line-clamp-1">
                        {mockDiagnosisCases[0].predictedDiseaseName}
                      </div>
                      <div className="text-[11px] text-text-muted">
                        Độ tin cậy {mockDiagnosisCases[0].aiConfidence}% · Chờ kỹ sư thẩm định
                      </div>
                      <button
                        onClick={() => setActiveTab('diagnosis')}
                        className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
                      >
                        Xem chi tiết ca bệnh
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SỔ NỢ MÙA VỤ (WF-03 & WF-04) */}
              {activeTab === 'credit' && (
                <div className="p-6 space-y-6">
                  {/* Credit limit visual header */}
                  <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-xl">account_balance_wallet</span>
                        <h2 className="text-sm font-bold text-text-primary">Hạn mức tín dụng vụ Đông Xuân 2025</h2>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        0% Lãi suất
                      </span>
                    </div>
                    <div>
                      <div className="flex items-baseline justify-between text-xs text-text-secondary mb-1.5">
                        <span>
                          Dư nợ đã dùng: <strong className="text-text-primary font-mono">{formatVnd(currentUsedDebt)}</strong>
                        </span>
                        <span>
                          Hạn mức tối đa:{' '}
                          <strong className="text-text-primary font-mono">{formatVnd(creditLimit)}</strong>
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full bg-surface-secondary overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            creditPercent >= 80 ? 'bg-status-warning' : 'bg-primary'
                          }`}
                          style={{ width: `${creditPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-text-muted mt-1.5">
                        <span>Đã sử dụng {creditPercent}% hạn mức</span>
                        <span>Khả dụng còn lại: {formatVnd(creditLimit - currentUsedDebt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* TWO-PARTY CONFIRMATION SECTION (WF-03) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base text-primary">gavel</span>
                        <span>Sổ nợ mùa vụ - Hai bên ký duyệt</span>
                      </h3>
                      <span className="text-[11px] text-text-muted">Đại lý lập nợ → Bác nông dân ký xác nhận</span>
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
                                ? 'border-amber-400 bg-amber-50/50 shadow-sm ring-2 ring-amber-200'
                                : isDisputed
                                ? 'border-rose-300 bg-rose-50/30'
                                : isPaid
                                ? 'border-border-subtle bg-surface-subtle/30 opacity-80'
                                : 'border-border-subtle bg-white'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono font-bold text-sm text-text-primary">{debt.orderCode}</span>
                                  <span className="text-xs text-text-muted">({debt.id})</span>
                                  {isAwaiting && (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300 flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                                      Chờ Bác Hùng xác nhận nợ
                                    </span>
                                  )}
                                  {isDisputed && (
                                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] border border-rose-200">
                                      Đang khiếu nại sai lệch
                                    </span>
                                  )}
                                  {!isAwaiting && !isDisputed && !isPaid && (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                                      Hai bên đã xác nhận nợ
                                    </span>
                                  )}
                                  {isPaid && (
                                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                                      Đã tất toán 100%
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-text-secondary">
                                  <span>Hạn thanh toán: </span>
                                  <strong className="text-text-primary">{debt.dueDate}</strong>
                                  <span className="text-text-muted"> · Tạo ngày: {debt.createdAt}</span>
                                </div>

                                {isDisputed && debt.disputeReason && (
                                  <div className="mt-2 p-2 rounded bg-rose-50 border border-rose-200 text-xs text-rose-900">
                                    <strong>Ghi chú khiếu nại của bác:</strong> {debt.disputeReason}
                                  </div>
                                )}
                              </div>

                              <div className="text-right flex-shrink-0">
                                <span className="text-xs text-text-muted block">Tổng tiền ghi nợ:</span>
                                <span className="text-base font-extrabold text-primary font-mono">
                                  {formatVnd(debt.totalDebt)}
                                </span>
                                {debt.paidAmount > 0 && (
                                  <div className="text-[11px] text-emerald-700">
                                    Đã trả: {formatVnd(debt.paidAmount)} (Còn nợ {formatVnd(debt.remainingDebt)})
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons for Debt Lifecycle */}
                            <div className="mt-3 pt-3 border-t border-border-subtle/70 flex flex-wrap items-center justify-between gap-2">
                              {isAwaiting ? (
                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenDispute(debt)}
                                    className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
                                  >
                                    Khiếu nại sai lệch
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleConfirmDebt(debt.id)}
                                    className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                    <span>Xác nhận nợ</span>
                                  </button>
                                </div>
                              ) : !isPaid ? (
                                <button
                                  type="button"
                                  onClick={() => handleOpenRepay(debt)}
                                  className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-colors shadow-sm inline-flex items-center gap-1.5 ml-auto"
                                >
                                  <span className="material-symbols-outlined text-[16px]">payments</span>
                                  <span>Trả nợ gối đầu</span>
                                </button>
                              ) : null}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* REPAYMENT HISTORY (WF-04) */}
                  <div className="pt-4 border-t border-border-subtle space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base text-primary">history</span>
                      <span>Lịch sử trả nợ &amp; Đối soát thu tiền</span>
                    </h3>
                    <div className="space-y-2">
                      {debtPayments.map((p) => (
                        <div
                          key={p.id}
                          className="p-3 rounded-xl border border-border-subtle bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-text-primary">{p.id}</span>
                              <span className="text-text-muted">· Đơn {p.orderCode}</span>
                              {p.status === 'PENDING_AGENT_CONFIRMATION' ? (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] border border-amber-200">
                                  Chờ đại lý Hai Thắng xác nhận thu
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                                  Đại lý đã xác nhận khớp sổ nợ
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-text-muted mt-0.5">
                              Hình thức: {p.paymentMethod === 'VIETQR' ? 'Chuyển khoản VietQR' : 'Tiền mặt tại kho'} · {p.createdAt}
                            </div>
                            {p.note && <div className="text-[11px] text-text-secondary mt-0.5">{p.note}</div>}
                          </div>
                          <div className="font-mono font-extrabold text-emerald-700 text-sm">
                            +{formatVnd(p.amount)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ORDERS (WF-02) */}
              {activeTab === 'orders' && (
                <div className="divide-y divide-border-subtle">
                  {mockOrders.map((order) => {
                    const isPendingVerification = order.paymentStatus === 'AWAITING_AGENT_VERIFICATION'

                    return (
                      <div key={order.code} className="p-5 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-text-primary text-sm">{order.code}</span>
                            {/* Fulfillment status */}
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                order.status === 'SHIPPING'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.status === 'PROCESSING'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : order.status === 'COMPLETED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {order.status === 'SHIPPING'
                                ? 'Đang giao tận ruộng'
                                : order.status === 'PROCESSING'
                                ? 'Đang bốc xếp tại kho'
                                : order.status === 'COMPLETED'
                                ? 'Đã hoàn thành'
                                : 'Chờ xử lý'}
                            </span>

                            {/* Payment method & status */}
                            {order.paymentMethod === 'VIETQR' && (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                  isPendingVerification
                                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                }`}
                              >
                                {isPendingVerification
                                  ? 'VietQR: Chờ đại lý Hai Thắng đối soát'
                                  : 'VietQR: Đã khớp tiền'}
                              </span>
                            )}
                            {order.paymentMethod === 'SEASONAL_CREDIT' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                                Gối nợ mùa vụ
                              </span>
                            )}
                          </div>
                          <div className="text-right font-mono font-extrabold text-primary text-sm">
                            {formatVnd(order.total)}
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="bg-surface-subtle/60 rounded-xl p-3 text-xs space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-text-secondary">
                              <span>
                                {item.product.name} ({item.product.packaging})
                              </span>
                              <span className="font-mono font-semibold text-text-primary">
                                x{item.quantity} · {formatVnd(item.product.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center justify-between text-xs text-text-muted gap-2">
                          <span>Đặt ngày {order.createdAt} · Giao tới: {order.address}</span>
                          {isPendingVerification && (
                            <button
                              type="button"
                              onClick={() => setSelectedOrderForQr(order)}
                              className="text-primary hover:underline font-bold inline-flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                              <span>Xem lại thông tin chuyển khoản Vietcombank</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* TAB 4: DIAGNOSIS (WF-01) */}
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
                            className="w-16 h-16 rounded-xl object-cover border border-border-subtle flex-shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-text-primary">
                                {isVerified ? c.verifiedDiseaseName : c.predictedDiseaseName}
                              </span>
                              <span className="text-xs font-mono text-text-muted">({c.id})</span>
                              {isVerified ? (
                                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[12px]">verified</span>
                                  Đã thẩm định
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                                  Chờ đại lý thẩm định
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-text-secondary mt-1">
                              Giai đoạn: {c.cropStage} · AI tin cậy {c.aiConfidence}%
                            </div>
                            {c.reviewerNote && (
                              <div className="text-xs text-emerald-800 mt-1 italic">
                                "Ý kiến KS: {c.reviewerNote}"
                              </div>
                            )}
                            <span className="text-[11px] text-text-muted block mt-1">Chẩn đoán lúc: {c.createdAt}</span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <Link
                            to="/ai-doctor"
                            className="px-3 py-1.5 rounded-lg border border-primary text-primary hover:bg-primary/5 text-xs font-bold transition-colors inline-flex items-center gap-1"
                          >
                            <span>Mở ca chẩn đoán</span>
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
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
