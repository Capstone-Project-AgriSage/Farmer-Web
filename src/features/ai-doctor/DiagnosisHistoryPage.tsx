import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { describeDiagnosisError, diagnosisApi } from '../../api/diagnosisApi'
import type { DiagnosisCaseStatus, MyDiagnosisCaseListItem } from '../../api/types'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { diseaseDisplayName, formatDiagnosisTime, historyFilters, statusBadgeClass, statusLabel } from './model'

const PAGE_SIZE = 20

function CaseRow({ item }: { item: MyDiagnosisCaseListItem }) {
  const hasDisease = Boolean(item.diseaseCode || item.diseaseName)
  const uncertain = item.certainty === 'UNCERTAIN'
  const name = diseaseDisplayName(item.diseaseCode, item.diseaseName)
  const title = !hasDisease ? item.caseNumber : uncertain ? `Có thể là ${name} (AI chưa chắc)` : name
  const [icon, tone] = !hasDisease
    ? ['local_florist', 'bg-brand-light text-text-muted']
    : uncertain
      ? ['help', 'bg-status-warning-surface text-status-warning']
      : ['eco', 'bg-status-success-surface text-status-success']

  return (
    <li>
      <Link
        to={`/ai-doctor/cases/${item.id}`}
        data-testid={`diagnosis-row-${item.id}`}
        className="focus-ring flex items-center gap-4 py-5 px-1 border-b border-brand-dark/15 hover:bg-brand-light/50 transition-colors"
      >
        <span className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${tone}`}>
          <span className="material-symbols-outlined" style={{ fontSize: 24 }} aria-hidden="true">
            {icon}
          </span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base md:text-lg text-text-primary">{title}</span>
          <span className="block mt-0.5 text-[15px] text-text-secondary">
            {hasDisease ? `${item.caseNumber} · ` : ''}
            {formatDiagnosisTime(item.submittedAt)}
          </span>
          <span className={`inline-block mt-2 px-3 py-0.5 rounded-full text-[13px] ${statusBadgeClass(item.status)}`}>{statusLabel(item.status)}</span>
        </span>
        <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 22 }} aria-hidden="true">
          chevron_right
        </span>
      </Link>
    </li>
  )
}

type Filter = DiagnosisCaseStatus | ''

interface Loaded {
  filter: Filter
  items: MyDiagnosisCaseListItem[]
  page: number
  totalPages: number
  totalCount: number
}

export default function DiagnosisHistoryPage() {
  useDocumentTitle('Lịch sử chẩn đoán AI')
  const [filter, setFilter] = useState<Filter>('')
  const [attempt, setAttempt] = useState(0)
  // Each answer remembers the filter (and attempt) it belongs to, so loading is derived, not set before each request.
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [loadError, setLoadError] = useState<{ filter: Filter; attempt: number; message: string } | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [moreError, setMoreError] = useState<string | null>(null)

  useEffect(() => {
    let live = true
    diagnosisApi.list({ status: filter || undefined, page: 1, pageSize: PAGE_SIZE }).then(
      (res) => {
        if (live) setLoaded({ filter, items: res.items, page: 1, totalPages: res.totalPages, totalCount: res.totalCount })
      },
      (err: unknown) => {
        if (live) setLoadError({ filter, attempt, message: describeDiagnosisError(err, 'load') })
      },
    )
    return () => {
      live = false
    }
  }, [filter, attempt])

  const current = loaded?.filter === filter ? loaded : null
  const error = !current && loadError?.filter === filter && loadError.attempt === attempt ? loadError.message : null
  const isLoading = !current && !error
  const items = current?.items ?? []

  const chooseFilter = (next: Filter) => {
    setMoreError(null)
    setFilter(next)
  }

  const loadMore = async () => {
    if (!current) return
    const nextPage = current.page + 1
    setIsLoadingMore(true)
    setMoreError(null)
    try {
      const res = await diagnosisApi.list({ status: current.filter || undefined, page: nextPage, pageSize: PAGE_SIZE })
      setLoaded((prev) =>
        prev && prev.filter === current.filter
          ? {
              ...prev,
              items: [...prev.items, ...res.items.filter((i) => !prev.items.some((p) => p.id === i.id))],
              page: nextPage,
              totalPages: res.totalPages,
              totalCount: res.totalCount,
            }
          : prev,
      )
    } catch (err) {
      setMoreError(describeDiagnosisError(err, 'load'))
    } finally {
      setIsLoadingMore(false)
    }
  }

  const solidButton = 'focus-ring inline-flex items-center min-h-[44px] px-7 rounded-full bg-brand-dark text-white hover:bg-brand-green text-[15px] transition-colors'

  return (
    <div className="bg-brand-cream min-h-screen">
      <Breadcrumb
        items={[
          { label: 'Trang chủ', to: '/' },
          { label: 'Bác sĩ cây trồng AI', to: '/ai-doctor' },
          { label: 'Lịch sử chẩn đoán' },
        ]}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[13px] uppercase tracking-[0.16em] text-text-secondary mb-3">Bác sĩ cây trồng AI</p>
            <h1 className="text-[length:var(--type-h1)] leading-[var(--type-h1-lh)] font-light tracking-tight text-text-primary">Lịch sử chẩn đoán</h1>
            {current && <p className="mt-2 text-[15px] text-text-secondary">{current.totalCount} ca</p>}
          </div>
          <Link to="/ai-doctor" className={`${solidButton} gap-2 self-start sm:self-auto shrink-0`}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden="true">
              add_a_photo
            </span>
            Chẩn đoán mới
          </Link>
        </div>

        <div role="group" aria-label="Lọc theo trạng thái" className="flex flex-wrap gap-2 mb-6">
          {historyFilters.map((f) => (
            <button
              key={f || 'ALL'}
              type="button"
              aria-pressed={filter === f}
              onClick={() => chooseFilter(f)}
              className={`focus-ring min-h-[44px] px-4 rounded-full text-[15px] border transition-colors ${
                filter === f ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-text-primary border-brand-dark/25 hover:border-brand-dark/60'
              }`}
            >
              {statusLabel(f)}
            </button>
          ))}
        </div>

        {isLoading ? (
          <ul className="border-t border-brand-dark/15" aria-busy="true" aria-label="Đang tải lịch sử chẩn đoán">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="py-6 border-b border-brand-dark/15 flex items-center gap-4" aria-hidden="true">
                <div className="w-12 h-12 rounded-full bg-brand-dark/10 animate-pulse" />
                <div className="space-y-3 flex-1">
                  <div className="h-5 w-48 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
                  <div className="h-4 w-64 max-w-full bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
                </div>
              </li>
            ))}
          </ul>
        ) : error ? (
          <div role="alert" className="border border-brand-dark/15 bg-white p-10 text-center rounded-[var(--radius-surface)]">
            <p className="text-lg text-text-primary">{error}</p>
            <button type="button" onClick={() => setAttempt((n) => n + 1)} className={`${solidButton} mt-5`}>
              Thử lại
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="border border-brand-dark/15 bg-white p-12 text-center rounded-[var(--radius-surface)]">
            <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 48 }} aria-hidden="true">
              local_florist
            </span>
            <p className="mt-3 text-lg text-text-primary">
              {filter ? `Không có ca "${statusLabel(filter)}".` : 'Bác chưa gửi ảnh lá lúa nào để AI chẩn đoán.'}
            </p>
            {!filter && (
              <Link to="/ai-doctor" className={`${solidButton} mt-5`}>
                Chụp ảnh lá lúa
              </Link>
            )}
          </div>
        ) : (
          <>
            <ul className="border-t border-brand-dark/15 bg-white px-4 rounded-[var(--radius-surface)]">
              {items.map((item) => (
                <CaseRow key={item.id} item={item} />
              ))}
            </ul>
            {current && current.page < current.totalPages && (
              <div className="mt-6 text-center">
                {moreError && (
                  <p role="alert" className="mb-3 text-[15px] text-status-error">
                    {moreError}
                  </p>
                )}
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={isLoadingMore}
                  className="focus-ring min-h-[44px] px-7 rounded-full border border-brand-dark/30 text-[15px] text-text-primary hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-colors disabled:opacity-45"
                >
                  {isLoadingMore ? 'Đang tải…' : moreError ? 'Thử tải thêm' : 'Xem thêm'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
