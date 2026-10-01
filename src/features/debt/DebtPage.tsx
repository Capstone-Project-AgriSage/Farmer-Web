import { useState } from 'react'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { formatVnd } from '../../data/format'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useAuth } from '../../context/AuthContext'
import { mockDebtEntries as initialDebtEntries, mockDebtPayments as initialDebtPayments } from '../../data/mockDebts'
import type { DebtEntry, DebtPayment } from '../../types'

export default function DebtPage() {
  useDocumentTitle('Sổ nợ mùa vụ - AgriSage')
  const { farmer } = useAuth()

  // Debt & Repayment State
  const [debtEntries, setDebtEntries] = useState<DebtEntry[]>(initialDebtEntries)
  const [debtPayments, setDebtPayments] = useState<DebtPayment[]>(initialDebtPayments)
  const [filter, setFilter] = useState<'ALL' | 'AWAITING' | 'PAID'>('ALL')

  // Modals state
  const [disputeModalDebt, setDisputeModalDebt] = useState<DebtEntry | null>(null)
  const [disputeReason, setDisputeReason] = useState('')
  const [repayModalDebt, setRepayModalDebt] = useState<DebtEntry | null>(null)
  const [repayAmount, setRepayAmount] = useState<string>('')
  const [repayMethod, setRepayMethod] = useState<'VIETQR' | 'CASH'>('VIETQR')
  const [repayNote, setRepayNote] = useState('')

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

  const totalPaid = debtPayments.filter(p => p.status === 'CONFIRMED').reduce((sum, p) => sum + p.amount, 0)

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
    showNotification(`Đã xác nhận khoản nợ ${debtId} thành công!`)
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
    showNotification(`Đã gửi phản hồi khiếu nại khoản nợ ${disputeModalDebt.id}!`)
    setDisputeModalDebt(null)
  }

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
      `Đã gửi thông báo trả nợ ${formatVnd(amountNum)}! Đang chờ xác nhận.`,
    )
    setRepayModalDebt(null)
  }

  const filteredEntries = debtEntries.filter(d => {
    if (filter === 'AWAITING') return d.farmerConfirmationStatus === 'AWAITING_CONFIRMATION'
    if (filter === 'PAID') return d.status === 'PAID'
    return true
  })

  // Tìm khoản nợ sắp đến hạn nhất để hiển thị cảnh báo
  const upcomingDebt = debtEntries.find(d => d.status === 'ACTIVE' && !d.confirmedByFarmer) || debtEntries[0]

  return (
    <div className="bg-brand-cream text-brand-dark min-h-screen pb-20">
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Sổ nợ mùa vụ' }]} />

      {/* Global Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-brand-dark text-white px-5 py-3 rounded-full flex items-center gap-3 animate-fade-in shadow-xl">
          <span className="material-symbols-outlined text-brand-green text-[20px]">task_alt</span>
          <span className="text-sm tracking-wide">{notification}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-medium font-helvetica-neue tracking-tight text-brand-dark">
              Sổ nợ mùa vụ
            </h1>
            <p className="text-brand-dark/60 mt-2 text-sm md:text-base max-w-2xl">
              Quản lý công nợ vật tư nông nghiệp, theo dõi hạn mức tín dụng và lịch sử thanh toán với đại lý.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-brand-dark/10 hover:border-brand-dark/30 hover:shadow-sm transition-all text-sm font-medium text-brand-dark shrink-0">
            <span className="material-symbols-outlined text-[18px]">download</span>
            Tải bảng sao kê
          </button>
        </div>

        {/* ALERTS SECTION (NEW) */}
        {upcomingDebt && upcomingDebt.status === 'ACTIVE' && (
          <div className="bg-white border border-brand-dark/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 mb-8 text-brand-dark shadow-sm">
            <span className="material-symbols-outlined text-brand-dark/50 text-3xl shrink-0 hidden sm:block">notification_important</span>
            <div className="flex-1">
              <h4 className="font-medium text-brand-dark flex items-center gap-2">
                <span className="material-symbols-outlined text-brand-dark/50 text-xl sm:hidden">notification_important</span>
                Lưu ý kỳ hạn thanh toán sắp tới
              </h4>
              <p className="text-sm mt-1 text-brand-dark/70">
                Khoản nợ <strong>{upcomingDebt.orderCode}</strong> trị giá <strong>{formatVnd(upcomingDebt.remainingDebt)}</strong> dự kiến sẽ đến hạn vào <strong>{upcomingDebt.dueDate}</strong>. Bác vui lòng chuẩn bị tài chính để thanh toán đúng hạn.
              </p>
            </div>
            <button 
              onClick={() => handleOpenRepay(upcomingDebt)}
              className="px-5 py-2.5 bg-brand-dark text-white text-sm font-medium rounded-xl hover:bg-brand-green transition-colors shrink-0 shadow-sm"
            >
              Thanh toán ngay
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Overview + Debt List */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Credit Overview Card */}
            <div className="bg-gradient-to-br from-brand-dark to-[#1a2e22] text-white p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden">
              {/* Premium Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-green/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
              <span className="material-symbols-outlined text-[140px] text-white/5 absolute -right-6 -bottom-6 pointer-events-none">account_balance_wallet</span>
              
              <div className="flex items-center justify-between gap-3 flex-wrap relative z-10 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                    <span className="material-symbols-outlined text-[24px] text-brand-light">receipt_long</span>
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-medium font-helvetica-neue tracking-tight">Vụ Đông Xuân 2024</h2>
                    <p className="text-white/70 text-sm mt-0.5">Đại lý Hai Thắng</p>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-full border border-brand-green/30 bg-brand-green/20 text-sm font-medium tracking-wide text-brand-light backdrop-blur-sm flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  0% lãi suất
                </span>
              </div>

              <div className="relative z-10">
                <div className="flex items-end justify-between mb-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-white/70 text-sm font-medium">Dư nợ hiện tại</span>
                    <strong className="text-3xl md:text-4xl font-medium font-helvetica-neue tracking-tight">{formatVnd(currentUsedDebt)}</strong>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-white/70 text-sm font-medium">Tổng hạn mức</span>
                    <strong className="text-lg md:text-xl font-medium font-helvetica-neue text-white/90">{formatVnd(creditLimit)}</strong>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="h-3 rounded-full bg-black/40 overflow-hidden backdrop-blur-sm p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 relative overflow-hidden ${
                      creditPercent >= 80 ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-gradient-to-r from-brand-green to-emerald-400'
                    }`}
                    style={{ width: `${creditPercent}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-white/80 mt-3 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">pie_chart</span>
                    Đã dùng {creditPercent}% hạn mức
                  </span>
                  <span>
                    Khả dụng còn lại:{' '}
                    <strong className="text-white font-medium font-helvetica-neue">
                      {formatVnd(creditLimit - currentUsedDebt)}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-[20px] border border-brand-dark/5 shadow-sm">
                <div className="text-brand-dark/50 text-sm mb-1">Số đơn nợ</div>
                <div className="text-2xl font-medium font-helvetica-neue text-brand-dark tracking-tight">{debtEntries.length}</div>
              </div>
              <div className="bg-white p-4 rounded-[20px] border border-brand-dark/5 shadow-sm">
                <div className="text-brand-dark/50 text-sm mb-1">Cần xác nhận</div>
                <div className="text-2xl font-medium font-helvetica-neue text-amber-600 tracking-tight">
                  {debtEntries.filter(d => d.farmerConfirmationStatus === 'AWAITING_CONFIRMATION').length}
                </div>
              </div>
              <div className="bg-white p-4 rounded-[20px] border border-brand-dark/5 shadow-sm col-span-2">
                <div className="text-brand-dark/50 text-sm mb-1">Tổng tiền đã trả vụ này</div>
                <div className="text-2xl font-medium font-helvetica-neue text-brand-green tracking-tight">{formatVnd(totalPaid)}</div>
              </div>
            </div>



            {/* TWO-PARTY CONFIRMATION SECTION (WF-03) */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-medium font-helvetica-neue text-brand-dark flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">list_alt</span>
                  Danh sách khoản nợ
                </h3>
                <div className="flex bg-brand-light p-1 rounded-xl border border-brand-dark/5 self-start sm:self-auto">
                  <button 
                    onClick={() => setFilter('ALL')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === 'ALL' ? 'bg-white text-brand-dark shadow-sm' : 'text-brand-dark/60 hover:text-brand-dark'}`}
                  >
                    Tất cả
                  </button>
                  <button 
                    onClick={() => setFilter('AWAITING')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === 'AWAITING' ? 'bg-white text-amber-600 shadow-sm' : 'text-brand-dark/60 hover:text-brand-dark'}`}
                  >
                    Chờ xác nhận
                  </button>
                  <button 
                    onClick={() => setFilter('PAID')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${filter === 'PAID' ? 'bg-white text-brand-dark shadow-sm' : 'text-brand-dark/60 hover:text-brand-dark'}`}
                  >
                    Đã tất toán
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {filteredEntries.map((debt) => {
                  const isAwaiting = debt.farmerConfirmationStatus === 'AWAITING_CONFIRMATION'
                  const isDisputed = debt.farmerConfirmationStatus === 'DISPUTED'
                  const isPaid = debt.status === 'PAID'

                  return (
                    <div
                      key={debt.id}
                      className={`p-5 md:p-6 rounded-[24px] border transition-all duration-300 relative overflow-hidden ${
                        isAwaiting
                          ? 'border-amber-200 bg-amber-50/50 hover:shadow-md'
                          : isDisputed
                            ? 'border-rose-200 bg-rose-50/50'
                            : isPaid
                              ? 'border-brand-dark/5 bg-brand-cream/50'
                              : 'border-brand-dark/10 bg-white shadow-sm hover:shadow-md'
                      }`}
                    >
                      {/* Status indicator line */}
                      <div className={`absolute top-0 left-0 w-1.5 h-full ${
                        isAwaiting ? 'bg-amber-400' : isDisputed ? 'bg-rose-400' : isPaid ? 'bg-brand-dark/20' : 'bg-brand-green'
                      }`} />

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-2">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="text-lg font-medium font-helvetica-neue text-brand-dark tracking-tight">{debt.orderCode}</span>
                            <span className="text-sm text-brand-dark/50">({debt.id})</span>
                            {isAwaiting && (
                              <span className="px-3 py-1 rounded-full border border-amber-200 bg-amber-100/50 text-amber-800 text-xs font-medium">
                                Chờ xác nhận
                              </span>
                            )}
                            {isDisputed && (
                              <span className="px-3 py-1 rounded-full border border-rose-200 bg-rose-100/50 text-rose-800 text-xs font-medium">
                                Đang khiếu nại
                              </span>
                            )}
                            {!isAwaiting && !isDisputed && !isPaid && (
                              <span className="px-3 py-1 rounded-full border border-brand-green/20 bg-brand-green/10 text-brand-green text-xs font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">verified</span>
                                Đã chốt nợ
                              </span>
                            )}
                            {isPaid && (
                              <span className="px-3 py-1 rounded-full bg-brand-dark/5 text-brand-dark/60 text-xs font-medium">
                                Đã tất toán
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-brand-dark/60 flex items-center gap-2">
                            <span>
                              Hạn trả: <strong className="text-brand-dark font-medium">{debt.dueDate}</strong>
                            </span>
                            <span className="text-brand-dark/30">|</span>
                            <span>Ngày tạo: {debt.createdAt}</span>
                          </div>
                          {isDisputed && debt.disputeReason && (
                            <div className="mt-2 text-sm text-rose-700 bg-white p-3.5 rounded-xl border border-rose-100 shadow-sm inline-block">
                              <strong className="flex items-center gap-1.5 mb-1 text-rose-800 font-medium">
                                <span className="material-symbols-outlined text-[18px]">report</span>
                                Lý do khiếu nại
                              </strong>
                              {debt.disputeReason}
                            </div>
                          )}
                        </div>

                        <div className="flex md:flex-col items-baseline md:items-end justify-between gap-1 shrink-0 pt-4 md:pt-0 border-t md:border-0 border-brand-dark/5 mt-4 md:mt-0 pl-2 md:pl-0">
                          <div className="flex flex-col items-start md:items-end">
                            <span className="text-xs text-brand-dark/50 mb-1 hidden md:block">Số dư nợ</span>
                            <span className="text-xl md:text-2xl font-medium font-helvetica-neue tracking-tight text-brand-dark">
                              {formatVnd(debt.totalDebt)}
                            </span>
                          </div>
                          {debt.paidAmount > 0 && (
                            <span className="text-sm font-medium text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-md mt-1">
                              Đã trả: {formatVnd(debt.paidAmount)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-5 pt-5 border-t border-brand-dark/10 flex flex-wrap items-center sm:justify-end gap-3 pl-2">
                        {!isPaid && !isAwaiting && (
                          <button
                            type="button"
                            onClick={() => alert('Tính năng xin gia hạn nợ đang được nâng cấp!')}
                            className="flex-1 sm:flex-none px-5 py-2.5 rounded-full border border-brand-dark/20 text-brand-dark hover:bg-brand-light text-sm font-medium transition-colors inline-flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[18px]">calendar_clock</span>
                            <span>Xin gia hạn</span>
                          </button>
                        )}
                        
                        {isAwaiting ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenDispute(debt)}
                              className="flex-1 sm:flex-none px-5 py-2.5 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-medium transition-colors text-center"
                            >
                              Khiếu nại
                            </button>
                            <button
                              type="button"
                              onClick={() => handleConfirmDebt(debt.id)}
                              className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-brand-dark hover:bg-brand-green text-white text-sm font-medium transition-colors inline-flex items-center justify-center gap-2 shadow-md"
                            >
                              <span className="material-symbols-outlined text-[18px]">check_circle</span>
                              <span>Chốt sổ nợ</span>
                            </button>
                          </>
                        ) : !isPaid ? (
                          <button
                            type="button"
                            onClick={() => handleOpenRepay(debt)}
                            className="flex-1 sm:flex-none w-full sm:w-auto px-6 py-2.5 rounded-full bg-brand-dark hover:bg-brand-green text-white text-sm font-medium transition-colors inline-flex items-center justify-center gap-2 shadow-md"
                          >
                            <span className="material-symbols-outlined text-[18px]">payments</span>
                            <span>Trả nợ qua VietQR</span>
                          </button>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
                {filteredEntries.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-[24px] border border-brand-dark/5">
                    <span className="material-symbols-outlined text-4xl text-brand-dark/20 mb-3">inbox</span>
                    <p className="text-brand-dark/50">Không có khoản nợ nào trong mục này.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Repayment History Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[24px] border border-brand-dark/10 p-6 md:p-8 shadow-sm sticky top-28">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-dark/10">
                <h3 className="text-lg font-medium font-helvetica-neue text-brand-dark flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-brand-green">history</span>
                  Lịch sử giao dịch
                </h3>
                <span className="text-sm font-medium text-brand-dark/60 bg-brand-light px-3 py-1 rounded-full">
                  {debtPayments.length} gd
                </span>
              </div>
              
              <div className="space-y-4">
                {debtPayments.map((p) => (
                  <div key={p.id} className="group flex gap-4 relative">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-10 bottom-[-16px] w-[1px] bg-brand-dark/10 group-last:hidden" />
                    
                    <div className="w-12 h-12 rounded-full bg-brand-light border border-brand-dark/10 flex items-center justify-center shrink-0 z-10 group-hover:bg-brand-dark group-hover:border-brand-dark transition-colors">
                        <span className={`material-symbols-outlined text-[22px] group-hover:text-white transition-colors ${p.paymentMethod === 'VIETQR' ? 'text-blue-600' : 'text-emerald-600'}`}>
                          {p.paymentMethod === 'VIETQR' ? 'qr_code_2' : 'local_atm'}
                        </span>
                    </div>
                    
                    <div className="flex-1 pb-4">
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-helvetica-neue text-brand-green text-lg font-medium tracking-tight">
                          +{formatVnd(p.amount)}
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                            p.status === 'PENDING_AGENT_CONFIRMATION'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-brand-light text-brand-dark/60 border border-brand-dark/5'
                          }`}
                        >
                          {p.status === 'PENDING_AGENT_CONFIRMATION' ? 'Chờ duyệt' : 'Hoàn tất'}
                        </span>
                      </div>
                      
                      <div className="text-sm text-brand-dark/70 mb-1">
                        Thanh toán cho <strong className="text-brand-dark font-medium">{p.orderCode}</strong>
                      </div>
                      
                      <div className="text-xs text-brand-dark/50 flex items-center gap-1.5 font-medium">
                        <span>{p.paymentMethod === 'VIETQR' ? 'Chuyển khoản' : 'Tiền mặt'}</span>
                        <span>•</span>
                        <span>{p.createdAt}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: DISPUTE DEBT (WF-03) */}
      {disputeModalDebt && (
        <div className="fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-brand-cream border border-brand-dark/10 max-w-lg w-full p-6 md:p-8 space-y-6 animate-fade-in rounded-[32px] shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-brand-dark/10">
              <h3 className="font-helvetica-neue tracking-tight text-lg text-brand-dark flex items-center gap-2 font-medium">
                <span className="material-symbols-outlined text-rose-600 text-[24px]">report_problem</span>
                <span>Khiếu nại sai lệch</span>
              </h3>
              <button
                type="button"
                onClick={() => setDisputeModalDebt(null)}
                className="w-10 h-10 rounded-full bg-white border border-brand-dark/10 flex items-center justify-center text-brand-dark/50 hover:text-brand-dark hover:bg-brand-light transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="text-base text-brand-dark/70 space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-brand-dark/10 flex justify-between items-center shadow-sm">
                <span>Đơn hàng: <strong className="text-brand-dark">{disputeModalDebt.orderCode}</strong></span>
                <strong className="text-brand-dark font-helvetica-neue text-lg font-medium">{formatVnd(disputeModalDebt.totalDebt)}</strong>
              </div>
              <div>
                <label className="block text-brand-dark font-medium mb-2">
                  Chi tiết vấn đề bác gặp phải:
                </label>
                <textarea
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="VD: Thiếu 2 bao phân, giá ghi sai..."
                  rows={4}
                  className="w-full rounded-2xl border border-brand-dark/15 bg-white p-4 text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDisputeModalDebt(null)}
                className="px-6 py-3 rounded-full bg-brand-light text-brand-dark/70 font-medium hover:bg-brand-dark/10 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmitDispute}
                className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-medium transition-colors shadow-md"
              >
                Gửi khiếu nại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REPAY DEBT (WF-04) */}
      {repayModalDebt && (
        <div className="fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-brand-cream border border-brand-dark/10 max-w-lg w-full p-5 md:p-6 space-y-4 animate-fade-in rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-brand-dark/10">
              <h3 className="font-helvetica-neue tracking-tight text-base text-brand-dark flex items-center gap-2 font-medium">
                <span className="material-symbols-outlined text-brand-green text-[20px]">payments</span>
                <span>Thanh toán nợ</span>
              </h3>
              <button
                type="button"
                onClick={() => setRepayModalDebt(null)}
                className="w-8 h-8 rounded-full bg-white border border-brand-dark/10 flex items-center justify-center text-brand-dark/50 hover:text-brand-dark hover:bg-brand-light transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="p-3 rounded-xl bg-brand-light border border-brand-dark/10 flex justify-between items-center shadow-inner">
                <span className="text-brand-dark/60 font-medium">Dư nợ đơn {repayModalDebt.orderCode}:</span>
                <span className="font-helvetica-neue tracking-tight text-brand-dark text-lg font-medium">
                  {formatVnd(repayModalDebt.remainingDebt)}
                </span>
              </div>

              <div>
                <label className="block text-brand-dark font-medium mb-1.5">Số tiền muốn trả (₫):</label>
                <input
                  type="number"
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(e.target.value)}
                  className="w-full rounded-xl border border-brand-dark/15 bg-white p-3 font-helvetica-neue text-base font-medium text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
                />
              </div>

              <div>
                <label className="block text-brand-dark font-medium mb-1.5">Hình thức:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRepayMethod('VIETQR')}
                    className={`p-3 rounded-xl border text-left transition-colors flex items-center gap-3 ${
                      repayMethod === 'VIETQR'
                        ? 'border-brand-dark bg-brand-dark text-white shadow-md'
                        : 'border-brand-dark/15 bg-white text-brand-dark hover:border-brand-dark/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">qr_code_2</span>
                    <div>
                      <div className="font-medium text-sm">VietQR</div>
                      <div className={`text-[11px] ${repayMethod === 'VIETQR' ? 'text-white/70' : 'text-brand-dark/50'}`}>Chuyển khoản 24/7</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRepayMethod('CASH')}
                    className={`p-3 rounded-xl border text-left transition-colors flex items-center gap-3 ${
                      repayMethod === 'CASH'
                        ? 'border-brand-dark bg-brand-dark text-white shadow-md'
                        : 'border-brand-dark/15 bg-white text-brand-dark hover:border-brand-dark/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">local_atm</span>
                    <div>
                      <div className="font-medium text-sm">Tiền mặt</div>
                      <div className={`text-[11px] ${repayMethod === 'CASH' ? 'text-white/70' : 'text-brand-dark/50'}`}>Trực tiếp đại lý</div>
                    </div>
                  </button>
                </div>
              </div>

              {repayMethod === 'VIETQR' && (
                <div className="p-4 rounded-xl border border-brand-dark/10 bg-white flex items-center gap-4 shadow-sm">
                  <div className="w-20 h-20 bg-white p-1.5 border border-brand-dark/10 rounded-xl flex-shrink-0">
                    <img
                      src="/images/misc/vietqr-demo.png"
                      alt="VietQR"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-sm space-y-1 text-brand-dark/70 w-full">
                    <div className="flex justify-between border-b border-brand-dark/5 pb-1">
                      <span>Ngân hàng</span> <strong className="text-brand-dark">Vietcombank</strong>
                    </div>
                    <div className="flex justify-between border-b border-brand-dark/5 pb-1">
                      <span>Số TK</span> <strong className="font-helvetica-neue text-brand-dark">19006828999</strong>
                    </div>
                    <div className="flex justify-between border-b border-brand-dark/5 pb-1">
                      <span>Chủ TK</span> <strong className="text-brand-dark">NGUYEN VAN THANG</strong>
                    </div>
                    <div className="flex justify-between items-center pt-0.5">
                      <span>Nội dung</span> 
                      <strong className="font-helvetica-neue text-brand-dark bg-brand-light px-1.5 py-0.5 text-xs rounded border border-brand-dark/10">TRANO {repayModalDebt.id}</strong>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-brand-dark font-medium mb-1.5">Lời nhắn (Tùy chọn):</label>
                <input
                  type="text"
                  value={repayNote}
                  onChange={(e) => setRepayNote(e.target.value)}
                  placeholder="Bác nông dân ghi chú thêm tại đây..."
                  className="w-full rounded-xl border border-brand-dark/15 bg-white p-3 text-brand-dark focus:outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-dark/10"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-brand-dark/10">
              <button
                type="button"
                onClick={() => setRepayModalDebt(null)}
                className="px-5 py-2.5 rounded-full bg-brand-light text-brand-dark/70 font-medium hover:bg-brand-dark/10 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmitRepay}
                className="px-5 py-2.5 rounded-full bg-brand-dark hover:bg-brand-green text-white font-medium transition-colors inline-flex items-center gap-1.5 shadow-md"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>Hoàn tất thanh toán</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
