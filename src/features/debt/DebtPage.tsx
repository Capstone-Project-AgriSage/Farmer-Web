import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { formatVnd } from '../../data/format'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useAuth } from '../../context/AuthContext'
import { creditApi } from '../../api/creditApi'
import { debtApi } from '../../api/debtApi'
import { paymentsApi } from '../../api/paymentsApi'
import { ApiError, describeApiError } from '../../api/client'
import type { DebtAccount, DebtEntryListItem, DebtEntryStatus, MyCreditSummary, PagedResult, PaymentListItem } from '../../api/types'
import DebtSummaryCard from './DebtSummaryCard'
import DebtEntryCard from './DebtEntryCard'
import DisputeModal from './DisputeModal'
import RepayModal from './RepayModal'
import RepaymentHistory from './RepaymentHistory'
import { ENTRY_FILTERS, formatDate } from './debtLabels'

const PAGE_SIZE = 10

// 404 means the farmer has no credit profile, so no credit line and no debt account: that is "no debt book", not an error.
const orNull = <T,>(request: Promise<T>) =>
  request.catch((err: unknown) => {
    if (err instanceof ApiError && err.status === 404) return null
    throw err
  })

export default function DebtPage() {
  useDocumentTitle('Sổ nợ - AgriSage')
  const { activeStore } = useAuth()

  const [credit, setCredit] = useState<MyCreditSummary | null>(null)
  const [account, setAccount] = useState<DebtAccount | null>(null)
  const [repayments, setRepayments] = useState<PaymentListItem[]>([])
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [summaryError, setSummaryError] = useState<string | null>(null)

  const [filter, setFilter] = useState<DebtEntryStatus | 'ALL'>('ALL')
  const [page, setPage] = useState(1)
  const [entries, setEntries] = useState<PagedResult<DebtEntryListItem> | null>(null)
  const [entriesLoading, setEntriesLoading] = useState(true)
  const [entriesError, setEntriesError] = useState<string | null>(null)

  const [refreshKey, setRefreshKey] = useState(0)
  const [disputeEntry, setDisputeEntry] = useState<DebtEntryListItem | null>(null)
  const [repayOpen, setRepayOpen] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 4000)
  }

  // Credit line, debt account and the farmer's recent payments (debt repayments are picked out of them).
  useEffect(() => {
    let cancelled = false
    setSummaryLoading(true)
    setSummaryError(null)
    Promise.all([orNull(creditApi.getMyCredit()), orNull(debtApi.getAccount()), paymentsApi.getMyPayments({ pageSize: 100 })])
      .then(([c, a, p]) => {
        if (cancelled) return
        setCredit(c)
        setAccount(a)
        setRepayments(p.items.filter((item) => item.paymentContext === 'DEBT_REPAYMENT'))
      })
      .catch((err) => !cancelled && setSummaryError(describeApiError(err, 'Không tải được Sổ nợ.')))
      .finally(() => !cancelled && setSummaryLoading(false))
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  useEffect(() => {
    let cancelled = false
    setEntriesLoading(true)
    setEntriesError(null)
    debtApi
      .getEntries({ status: filter === 'ALL' ? undefined : filter, page, pageSize: PAGE_SIZE })
      .then((result) => {
        if (cancelled) return
        // The last entry of the last page left the filter (for example it was paid): go back to the new last page.
        if (result.items.length === 0 && page > 1 && result.totalPages > 0) {
          setPage(Math.min(page - 1, result.totalPages))
          return
        }
        setEntries(result)
      })
      .catch((err) => {
        if (cancelled) return
        // No credit profile: there is simply nothing to list.
        if (err instanceof ApiError && err.status === 404) setEntries({ items: [], totalCount: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 1 })
        else setEntriesError(describeApiError(err, 'Không tải được danh sách khoản nợ.'))
      })
      .finally(() => !cancelled && setEntriesLoading(false))
    return () => {
      cancelled = true
    }
  }, [filter, page, refreshKey])

  const balance = account?.currentBalance ?? credit?.outstandingReceivable ?? 0
  const noDebtBook = !summaryLoading && !summaryError && !credit && !account
  const totalRepaid = repayments.filter((p) => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0)

  // What needs attention first: money already overdue, otherwise a due date within a week.
  const overdueAmount = account?.overdueAmount ?? 0
  const daysToDue = account?.oldestDueDate ? Math.ceil((new Date(account.oldestDueDate).getTime() - Date.now()) / 86_400_000) : null
  const dueSoon = overdueAmount === 0 && balance > 0 && daysToDue !== null && daysToDue <= 7

  const changeFilter = (next: DebtEntryStatus | 'ALL') => {
    setFilter(next)
    setPage(1)
  }

  const pageButton =
    'focus-ring w-11 h-11 flex items-center justify-center rounded-full border border-brand-dark/25 text-text-primary hover:border-brand-dark/60 disabled:opacity-35 disabled:cursor-not-allowed transition-colors'

  return (
    <div className="bg-brand-cream text-brand-dark min-h-screen pb-20">
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Sổ nợ' }]} />

      {notification && (
        <div role="status" className="fixed top-24 right-6 z-50 bg-brand-dark text-white px-5 py-3 rounded-full flex items-center gap-3">
          <span className="material-symbols-outlined text-brand-light" style={{ fontSize: 20 }} aria-hidden="true">
            task_alt
          </span>
          <span className="text-[15px]">{notification}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-14">
        <div className="mb-10">
          <p className="text-[13px] uppercase tracking-[0.16em] text-text-secondary mb-3">Tài khoản</p>
          <h1 className="text-[length:var(--type-h1)] leading-[var(--type-h1-lh)] font-light tracking-tight text-text-primary">Sổ nợ</h1>
          <p className="mt-3 text-base text-text-secondary max-w-2xl leading-relaxed">Theo dõi công nợ vật tư, hạn mức mua chịu và lịch sử trả nợ với đại lý.</p>
        </div>

        {summaryLoading && (
          <div className="grid lg:grid-cols-12 gap-8" aria-busy="true" aria-label="Đang tải Sổ nợ">
            <div className="lg:col-span-8 space-y-6">
              <div className="h-64 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
                ))}
              </div>
              <div className="h-36 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
            </div>
            <div className="lg:col-span-4 h-72 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
          </div>
        )}

        {summaryError && (
          <div role="alert" className="border border-status-error/40 bg-status-error-surface p-8 text-center rounded-[var(--radius-surface)]">
            <p className="text-lg text-text-primary mb-5">{summaryError}</p>
            <button type="button" onClick={() => setRefreshKey((k) => k + 1)} className="focus-ring min-h-[44px] px-7 rounded-full bg-brand-dark text-white hover:bg-brand-green text-[15px] transition-colors">
              Tải lại
            </button>
          </div>
        )}

        {noDebtBook && (
          <div className="border border-brand-dark/15 bg-white p-10 md:p-14 text-center flex flex-col items-center rounded-[var(--radius-surface)]">
            <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 48 }} aria-hidden="true">
              account_balance_wallet
            </span>
            <h2 className="mt-4 text-2xl font-light tracking-tight text-text-primary">Bác chưa có Sổ nợ</h2>
            <p className="mt-3 text-base text-text-secondary max-w-md leading-relaxed">
              Đại lý {activeStore.name} chưa cấp hạn mức mua chịu cho bác. Bác liên hệ đại lý để được mở Sổ nợ; trong lúc đó bác vẫn mua vật tư và thanh toán ngay như bình thường.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link to="/products" className="focus-ring inline-flex items-center min-h-[48px] px-7 rounded-full bg-brand-dark text-white hover:bg-brand-green text-[15px] transition-colors">
                Mua sắm ngay
              </Link>
              <Link to="/contact" className="focus-ring inline-flex items-center min-h-[48px] px-7 rounded-full border border-brand-dark/30 text-[15px] text-text-primary hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-colors">
                Liên hệ đại lý
              </Link>
            </div>
          </div>
        )}

        {!summaryLoading && !summaryError && !noDebtBook && (
          <>
            {(overdueAmount > 0 || dueSoon) && (
              <div
                role={overdueAmount > 0 ? 'alert' : 'status'}
                className={`mb-8 p-5 flex flex-col sm:flex-row sm:items-center gap-4 rounded-[var(--radius-surface)] border-l-4 ${
                  overdueAmount > 0 ? 'bg-status-error-surface border-status-error' : 'bg-status-warning-surface border-status-warning'
                }`}
              >
                <span className={`material-symbols-outlined shrink-0 ${overdueAmount > 0 ? 'text-status-error' : 'text-status-warning'}`} style={{ fontSize: 28 }} aria-hidden="true">
                  {overdueAmount > 0 ? 'error' : 'schedule'}
                </span>
                <div className="flex-1">
                  <h2 className="text-lg font-medium text-text-primary">{overdueAmount > 0 ? 'Bác có khoản nợ đã quá hạn' : 'Sắp đến hạn trả nợ'}</h2>
                  <p className="mt-1 text-[15px] md:text-base text-text-primary leading-relaxed">
                    {overdueAmount > 0 ? (
                      <>
                        Số tiền quá hạn <strong className="font-medium">{formatVnd(overdueAmount)}</strong>. Bác nên thanh toán sớm để không bị chặn mua chịu thêm.
                      </>
                    ) : (
                      <>
                        Khoản nợ gần nhất đến hạn ngày <strong className="font-medium">{formatDate(account?.oldestDueDate)}</strong>
                        {daysToDue !== null && daysToDue >= 0 ? ` (còn ${daysToDue} ngày)` : ''}.
                      </>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRepayOpen(true)}
                  className="focus-ring min-h-[48px] px-7 rounded-full bg-brand-dark text-white hover:bg-brand-green text-[15px] transition-colors shrink-0"
                >
                  Trả nợ ngay
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-8 space-y-10 min-w-0">
                <DebtSummaryCard storeName={activeStore.name} credit={credit} account={account} />

                <dl className="grid grid-cols-2 md:grid-cols-4 border-y border-brand-dark/15 divide-x divide-brand-dark/15">
                  {[
                    { label: 'Khoản nợ đang mở', value: String(account?.openEntryCount ?? 0), tone: '' },
                    { label: 'Quá hạn', value: formatVnd(overdueAmount), tone: overdueAmount > 0 ? 'text-status-error' : '' },
                    { label: 'Hạn trả gần nhất', value: account?.oldestDueDate && balance > 0 ? formatDate(account.oldestDueDate) : '—', tone: '' },
                    { label: 'Đã trả gần đây', value: formatVnd(totalRepaid), tone: 'text-primary-dark' },
                  ].map((item, index) => (
                    <div key={item.label} className={`px-4 md:px-6 py-6 ${index % 2 === 0 ? 'pl-0 md:pl-6' : ''} ${index === 0 ? 'md:pl-0' : ''} ${index >= 2 ? 'border-t md:border-t-0 border-brand-dark/15' : ''}`}>
                      <dt className="text-[15px] text-text-secondary">{item.label}</dt>
                      <dd className={`mt-1 text-xl md:text-2xl font-light tracking-tight ${item.tone || 'text-text-primary'}`}>{item.value}</dd>
                    </div>
                  ))}
                </dl>

                <section className="space-y-5" aria-label="Danh sách khoản nợ">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-[13px] uppercase tracking-[0.16em] text-text-secondary">Danh sách khoản nợ</h2>
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc khoản nợ">
                      {ENTRY_FILTERS.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          aria-pressed={filter === item.value}
                          onClick={() => changeFilter(item.value)}
                          className={`focus-ring min-h-[44px] px-4 rounded-full text-[15px] transition-colors ${
                            filter === item.value ? 'bg-brand-dark text-white' : 'border border-brand-dark/25 text-text-primary hover:border-brand-dark/60'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {entriesError && (
                    <div role="alert" className="p-4 border border-status-error/40 bg-status-error-surface text-[15px] text-text-primary rounded-[var(--radius-surface)] flex items-center justify-between gap-4">
                      <span>{entriesError}</span>
                      <button type="button" onClick={() => setRefreshKey((k) => k + 1)} className="focus-ring min-h-[44px] px-5 rounded-full border border-brand-dark/30 hover:bg-white transition-colors shrink-0">
                        Tải lại
                      </button>
                    </div>
                  )}
                  {entriesLoading && !entries && (
                    <div className="space-y-4" aria-busy="true" aria-label="Đang tải khoản nợ">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-32 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
                      ))}
                    </div>
                  )}

                  <div className="space-y-4">
                    {entries?.items.map((entry) => (
                      <DebtEntryCard key={entry.id} entry={entry} onDispute={setDisputeEntry} />
                    ))}
                    {entries && entries.items.length === 0 && !entriesLoading && (
                      <div className="text-center py-14 border border-brand-dark/15 bg-white rounded-[var(--radius-surface)]">
                        <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 40 }} aria-hidden="true">
                          inbox
                        </span>
                        <p className="mt-2 text-[15px] text-text-secondary">Không có khoản nợ nào trong mục này.</p>
                      </div>
                    )}
                  </div>

                  {entries && entries.totalPages > 1 && (
                    <nav aria-label="Phân trang" className="flex items-center justify-center gap-4 pt-2">
                      <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || entriesLoading} aria-label="Trang trước" className={pageButton}>
                        <span className="material-symbols-outlined" style={{ fontSize: 22 }} aria-hidden="true">
                          chevron_left
                        </span>
                      </button>
                      <span className="text-[15px] text-text-secondary">
                        Trang <strong className="text-text-primary">{page}</strong> / {entries.totalPages} · {entries.totalCount} khoản nợ
                      </span>
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.min(entries.totalPages, p + 1))}
                        disabled={page === entries.totalPages || entriesLoading}
                        aria-label="Trang sau"
                        className={pageButton}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 22 }} aria-hidden="true">
                          chevron_right
                        </span>
                      </button>
                    </nav>
                  )}
                </section>
              </div>

              <div className="lg:col-span-4 space-y-5">
                {balance > 0 && (
                  <button
                    type="button"
                    onClick={() => setRepayOpen(true)}
                    className="focus-ring w-full min-h-[56px] rounded-full bg-brand-dark hover:bg-brand-green text-white text-base tracking-wide transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 22 }} aria-hidden="true">
                      payments
                    </span>
                    Trả nợ qua payOS
                  </button>
                )}
                <RepaymentHistory payments={repayments} />
              </div>
            </div>
          </>
        )}
      </div>

      {disputeEntry && (
        <DisputeModal
          entry={disputeEntry}
          onClose={() => setDisputeEntry(null)}
          onDisputed={(entry) => {
            setDisputeEntry(null)
            showNotification(`Đã gửi khiếu nại khoản nợ ${entry.orderNumber ?? entry.entryNumber}. Đại lý sẽ xem xét và phản hồi.`)
            setRefreshKey((k) => k + 1)
          }}
        />
      )}

      {repayOpen && <RepayModal balance={balance} onClose={() => setRepayOpen(false)} />}
    </div>
  )
}
