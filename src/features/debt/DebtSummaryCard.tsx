import { formatVnd } from '../../data/format'
import type { DebtAccount, MyCreditSummary } from '../../api/types'

interface DebtSummaryCardProps {
  storeName: string
  credit: MyCreditSummary | null
  account: DebtAccount | null
}

const PROFILE_STATUS: Record<string, string> = {
  SUSPENDED: 'Hạn mức đang tạm ngưng',
  BLOCKED: 'Hạn mức đã bị khóa',
}

// The numbers are the server's: outstanding = the debt account balance, reserved = credit held for credit orders that are not
// delivered yet, available = limit - outstanding - reserved (FLOW_3 §4).
export default function DebtSummaryCard({ storeName, credit, account }: DebtSummaryCardProps) {
  const limit = credit?.creditLimit ?? 0
  const outstanding = credit?.outstandingReceivable ?? account?.currentBalance ?? 0
  const reserved = credit?.reservedCredit ?? 0
  const available = credit?.availableCredit ?? 0
  const usedPercent = limit > 0 ? Math.min(100, Math.round(((outstanding + reserved) / limit) * 100)) : 0
  const profileProblem = credit?.status ? PROFILE_STATUS[credit.status.toUpperCase()] : undefined

  return (
    <div className="bg-gradient-to-br from-brand-dark to-[#1a2e22] text-white p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-green/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <span className="material-symbols-outlined text-[140px] text-white/5 absolute -right-6 -bottom-6 pointer-events-none">account_balance_wallet</span>

      <div className="flex items-center justify-between gap-3 flex-wrap relative z-10 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
            <span className="material-symbols-outlined text-[24px] text-brand-light">receipt_long</span>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-medium font-helvetica-neue tracking-tight">Hạn mức mua chịu</h2>
            <p className="text-white/70 text-sm mt-0.5">{storeName}</p>
          </div>
        </div>
        {profileProblem ? (
          <span className="px-3 py-1.5 rounded-full border border-rose-300/40 bg-rose-500/20 text-sm font-medium tracking-wide text-rose-100 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">block</span>
            {profileProblem}
          </span>
        ) : credit ? (
          <span className="px-3 py-1.5 rounded-full border border-brand-green/30 bg-brand-green/20 text-sm font-medium tracking-wide text-brand-light flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            0% lãi suất
          </span>
        ) : null}
      </div>

      <div className="relative z-10">
        <div className="flex items-end justify-between mb-3 gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-white/70 text-sm font-medium">Dư nợ hiện tại</span>
            <strong className="text-3xl md:text-4xl font-medium font-helvetica-neue tracking-tight">{formatVnd(outstanding)}</strong>
          </div>
          {credit && (
            <div className="flex flex-col gap-1 text-right">
              <span className="text-white/70 text-sm font-medium">Tổng hạn mức</span>
              <strong className="text-lg md:text-xl font-medium font-helvetica-neue text-white/90">{formatVnd(limit)}</strong>
            </div>
          )}
        </div>

        {credit && (
          <>
            <div className="h-3 rounded-full bg-black/40 overflow-hidden backdrop-blur-sm p-0.5" role="progressbar" aria-valuenow={usedPercent} aria-valuemin={0} aria-valuemax={100}>
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  usedPercent >= 80 ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-gradient-to-r from-brand-green to-emerald-400'
                }`}
                style={{ width: `${usedPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-sm text-white/80 mt-3 flex-wrap gap-x-4 gap-y-1">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">pie_chart</span>
                Đã dùng {usedPercent}% hạn mức
              </span>
              <span>
                Khả dụng còn lại:{' '}
                <strong className="text-white font-medium font-helvetica-neue">{formatVnd(available)}</strong>
              </span>
            </div>

            {(reserved > 0 || credit.paymentTermDays) && (
              <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-1 text-xs text-white/70">
                {reserved > 0 && <span>Đang giữ cho đơn mua chịu chưa giao: {formatVnd(reserved)}</span>}
                {credit.paymentTermDays ? <span>Hạn thanh toán: {credit.paymentTermDays} ngày kể từ ngày giao</span> : null}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
