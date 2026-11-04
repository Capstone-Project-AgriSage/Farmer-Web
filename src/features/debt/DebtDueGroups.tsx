import { formatVnd } from '../../data/format'
import type { DebtGroup, DueState } from '../../api/types'
import { DUE_STATE, TONE_CLASSES, formatDate } from './debtLabels'

// Debt grouped by where it is collected and when it falls due. A group without a season follows the credit tier's term.

export function DueStateBadge({ state }: { state: DueState | null | undefined }) {
  if (!state) return null
  const { label, tone, icon } = DUE_STATE[state]
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full border text-[13px] font-medium ${TONE_CLASSES[tone]}`}>
      <span className="material-symbols-outlined" style={{ fontSize: 16 }} aria-hidden="true">
        {icon}
      </span>
      {label}
    </span>
  )
}

interface DebtDueGroupsProps {
  groups: DebtGroup[]
  /** Season id currently used as a filter (to mark the group). */
  activeSeasonId?: string
  onPickSeason?: (seasonId: string | null) => void
}

export default function DebtDueGroups({ groups, activeSeasonId, onPickSeason }: DebtDueGroupsProps) {
  if (groups.length === 0) return null
  return (
    <section aria-label="Nợ theo vụ và hạn trả" className="space-y-4">
      <div>
        <h2 className="text-[13px] uppercase tracking-[0.16em] text-text-secondary">Nợ theo hạn trả</h2>
        <p className="mt-1 text-[15px] text-text-secondary">Các khoản nợ cùng vụ và cùng hạn trả được gộp lại, để bác biết khi nào cần trả bao nhiêu.</p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {groups.map((group) => {
          const seasonId = group.collectionSeason?.id ?? null
          const picked = !!seasonId && seasonId === activeSeasonId
          return (
            <li key={`${seasonId ?? 'tier'}-${group.dueDate}`} className={`p-5 border rounded-[var(--radius-surface)] bg-white ${picked ? 'border-brand-dark' : 'border-brand-dark/15'}`}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className="text-[13px] uppercase tracking-[0.16em] text-text-secondary">{group.collectionSeason ? 'Thu theo vụ' : 'Thu theo hạng tín dụng'}</p>
                  <h3 className="mt-1 text-lg font-medium text-text-primary">{group.collectionSeason?.name ?? 'Không thuộc vụ nào'}</h3>
                </div>
                <DueStateBadge state={group.dueState} />
              </div>
              <p className="mt-3 text-2xl font-light tracking-tight text-text-primary">{formatVnd(group.outstandingAmount)}</p>
              <p className="mt-1 text-[15px] text-text-secondary">
                Hạn trả <strong className="font-medium text-text-primary">{formatDate(group.dueDate)}</strong> · {group.entryCount} khoản
              </p>
              {onPickSeason && seasonId && (
                <button
                  type="button"
                  onClick={() => onPickSeason(picked ? null : seasonId)}
                  aria-pressed={picked}
                  className="focus-ring mt-3 min-h-[44px] text-[15px] text-text-primary underline underline-offset-4 hover:text-brand-green"
                >
                  {picked ? 'Bỏ lọc theo vụ này' : 'Chỉ xem các khoản của vụ này'}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
