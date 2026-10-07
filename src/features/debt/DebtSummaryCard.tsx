import { useEffect, useState } from 'react'
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
  const nearLimit = usedPercent >= 80

  // The bar fills once, when the page opens.
  const [barShown, setBarShown] = useState(false)
  useEffect(() => {
    const frame = requestAnimationFrame(() => setBarShown(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <section className="bg-brand-dark text-white p-6 md:p-10 rounded-[var(--radius-surface)]" aria-label="Tổng quan công nợ">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[13px] uppercase tracking-[0.16em] text-white/70">Hạn mức mua chịu</p>
          <p className="mt-1 text-[15px] text-white/80">{storeName}</p>
        </div>
        {profileProblem ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/40 text-[15px]">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden="true">
              block
            </span>
            {profileProblem}
          </span>
        ) : credit ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/30 text-[15px] text-white/90">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden="true">
              verified
            </span>
            0% lãi suất
          </span>
        ) : null}
      </div>

      <div className="mt-8 flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="text-[15px] text-white/75">Dư nợ hiện tại</p>
          <p className="mt-1 text-[length:var(--type-display)] leading-none font-light tracking-tight">{formatVnd(outstanding)}</p>
        </div>
        {credit && (
          <div className="text-right">
            <p className="text-[15px] text-white/75">Tổng hạn mức</p>
            <p className="mt-1 text-2xl font-light tracking-tight text-white/90">{formatVnd(limit)}</p>
          </div>
        )}
      </div>

      {credit && (
        <>
          <div
            className="mt-8 h-3 rounded-full bg-white/15 overflow-hidden"
            role="progressbar"
            aria-valuenow={usedPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Phần hạn mức đã dùng"
          >
            <div
              className={`h-full w-full rounded-full origin-left transition-transform duration-[var(--dur-large)] ease-[var(--motion-ease-out)] ${nearLimit ? 'bg-status-warning' : 'bg-white'}`}
              style={{ transform: `scaleX(${barShown ? usedPercent / 100 : 0})` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-[15px] text-white/85 flex-wrap gap-x-4 gap-y-1">
            <span>
              Đã dùng {usedPercent}% hạn mức{nearLimit ? ' · sắp chạm hạn mức' : ''}
            </span>
            <span>
              Khả dụng còn lại: <strong className="text-white font-medium">{formatVnd(available)}</strong>
            </span>
          </div>

          {(reserved > 0 || credit.paymentTermDays) && (
            <div className="mt-5 pt-5 border-t border-white/20 flex flex-wrap gap-x-8 gap-y-1 text-[15px] text-white/80">
              {reserved > 0 && <span>Đang giữ cho đơn mua chịu chưa giao: {formatVnd(reserved)}</span>}
              {credit.paymentTermDays ? <span>Hạn thanh toán: {credit.paymentTermDays} ngày kể từ ngày giao</span> : null}
            </div>
          )}
        </>
      )}
    </section>
  )
}
