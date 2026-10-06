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

  return (
    <div className="bg-brand-cream text-brand-dark min-h-screen pb-20">
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Sổ nợ' }]} />

      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-brand-dark text-white px-5 py-3 rounded-full flex items-center gap-3 animate-fade-in shadow-xl">
          <span className="material-symbols-outlined text-brand-green text-[20px]">task_alt</span>
          <span className="text-sm tracking-wide">{notification}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-medium font-helvetica-neue tracking-tight text-brand-dark">Sổ nợ</h1>
          <p className="text-brand-dark/60 mt-2 text-sm md:text-base max-w-2xl">
            Theo dõi công nợ vật tư, hạn mức mua chịu và lịch sử trả nợ với đại lý.
          </p>
        </div>

        {summaryLoading && <div className="text-center py-16 text-brand-dark/50">Đang tải Sổ nợ...</div>}

        {summaryError && (
          <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center">
            <p className="text-rose-600 mb-4">{summaryError}</p>
            <button
              type="button"
              onClick={() => setRefreshKey((k) => k + 1)}
              className="px-5 py-2 bg-brand-dark text-white text-[13px] font-medium rounded-full hover:bg-brand-green transition-colors"
            >
              Tải lại
            </button>
          </div>
        )}

        {noDebtBook && (
          <div className="bg-white rounded-2xl border border-brand-dark/10 p-10 text-center flex flex-col items-center shadow-sm">
            <span className="material-symbols-outlined text-[40px] text-brand-dark/20 mb-3">account_balance_wallet</span>
            <h2 className="text-lg font-helvetica-neue tracking-tight text-brand-dark">Bác chưa có Sổ nợ</h2>
            <p className="text-brand-dark/60 text-sm mt-2 max-w-md">
              Đại lý {activeStore.name} chưa cấp hạn mức mua chịu cho bác. Bác liên hệ đại lý để được mở Sổ nợ; trong lúc đó bác vẫn mua và trả tiền ngay như bình thường.
            </p>
            <Link to="/products" className="mt-5 px-5 py-2 bg-brand-dark text-white text-[13px] font-medium rounded-full hover:bg-brand-green transition-colors">
              Mua sắm ngay
            </Link>
          </div>
        )}

        {!summaryLoading && !summaryError && !noDebtBook && (
          <>
            {(overdueAmount > 0 || dueSoon) && (
              <div
                className={`rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 mb-8 shadow-sm border ${
                  overdueAmount > 0 ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-white border-brand-dark/10 text-brand-dark'
                }`}
              >
                <span className="material-symbols-outlined text-3xl shrink-0 hidden sm:block">notification_important</span>
                <div className="flex-1">
                  <h4 className="font-medium">{overdueAmount > 0 ? 'Bác có khoản nợ đã quá hạn' : 'Sắp đến hạn trả nợ'}</h4>
                  <p className="text-sm mt-1 opacity-80">
                    {overdueAmount > 0 ? (
                      <>
                        Số tiền quá hạn <strong>{formatVnd(overdueAmount)}</strong>. Bác nên thanh toán sớm để không bị chặn mua chịu thêm.
                      </>
                    ) : (
                      <>
                        Khoản nợ gần nhất đến hạn ngày <strong>{formatDate(account?.oldestDueDate)}</strong>
                        {daysToDue !== null && daysToDue >= 0 ? ` (còn ${daysToDue} ngày)` : ''}.
                      </>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRepayOpen(true)}
                  className="px-5 py-2.5 bg-brand-dark text-white text-sm font-medium rounded-xl hover:bg-brand-green transition-colors shrink-0 shadow-sm"
                >
                  Trả nợ ngay
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8">
                <DebtSummaryCard storeName={activeStore.name} credit={credit} account={account} />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-[20px] border border-brand-dark/5 shadow-sm">
                    <div className="text-brand-dark/50 text-sm mb-1">Khoản nợ đang mở</div>
                    <div className="text-2xl font-medium font-helvetica-neue text-brand-dark tracking-tight">{account?.openEntryCount ?? 0}</div>
                  </div>
                  <div className="bg-white p-4 rounded-[20px] border border-brand-dark/5 shadow-sm">
                    <div className="text-brand-dark/50 text-sm mb-1">Quá hạn</div>
                    <div className={`text-2xl font-medium font-helvetica-neue tracking-tight ${overdueAmount > 0 ? 'text-rose-600' : 'text-brand-dark'}`}>
                      {formatVnd(overdueAmount)}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-[20px] border border-brand-dark/5 shadow-sm">
                    <div className="text-brand-dark/50 text-sm mb-1">Hạn trả gần nhất</div>
                    <div className="text-2xl font-medium font-helvetica-neue text-brand-dark tracking-tight">
                      {account?.oldestDueDate && balance > 0 ? formatDate(account.oldestDueDate) : '—'}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-[20px] border border-brand-dark/5 shadow-sm">
                    <div className="text-brand-dark/50 text-sm mb-1">Đã trả gần đây</div>
                    <div className="text-2xl font-medium font-helvetica-neue text-brand-green tracking-tight">{formatVnd(totalRepaid)}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-lg font-medium font-helvetica-neue text-brand-dark flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">list_alt</span>
                      Danh sách khoản nợ
                    </h3>
                    <div className="flex flex-wrap bg-brand-light p-1 rounded-xl border border-brand-dark/5 self-start sm:self-auto gap-1">
                      {ENTRY_FILTERS.map((item) => (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => changeFilter(item.value)}
                          className={`px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                            filter === item.value ? 'bg-white text-brand-dark shadow-sm' : 'text-brand-dark/60 hover:text-brand-dark'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {entriesError && <p className="text-rose-600 text-sm">{entriesError}</p>}
                  {entriesLoading && !entries && <div className="text-center py-10 text-brand-dark/50">Đang tải khoản nợ...</div>}

                  <div className="space-y-4">
                    {entries?.items.map((entry) => (
                      <DebtEntryCard key={entry.id} entry={entry} onDispute={setDisputeEntry} />
                    ))}
                    {entries && entries.items.length === 0 && !entriesLoading && (
                      <div className="text-center py-12 bg-white rounded-[24px] border border-brand-dark/5">
                        <span className="material-symbols-outlined text-4xl text-brand-dark/20 mb-3">inbox</span>
                        <p className="text-brand-dark/50">Không có khoản nợ nào trong mục này.</p>
                      </div>
                    )}
                  </div>

                  {entries && entries.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1 || entriesLoading}
                        aria-label="Trang trước"
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-brand-dark/15 text-brand-dark disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-cream transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                      </button>
                      <span className="text-sm text-brand-dark/70">
                        Trang <strong className="text-brand-dark">{page}</strong> / {entries.totalPages} · {entries.totalCount} khoản nợ
                      </span>
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.min(entries.totalPages, p + 1))}
                        disabled={page === entries.totalPages || entriesLoading}
                        aria-label="Trang sau"
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-brand-dark/15 text-brand-dark disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-cream transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-4 space-y-4">
                {balance > 0 && (
                  <button
                    type="button"
                    onClick={() => setRepayOpen(true)}
                    className="w-full px-6 py-3.5 rounded-full bg-brand-dark hover:bg-brand-green text-white font-medium transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <span className="material-symbols-outlined text-[20px]">payments</span>
                    <span>Trả nợ qua payOS</span>
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
