import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { describeDiagnosisError, diagnosisApi } from '../../api/diagnosisApi'
import type { MyDiagnosisCase } from '../../api/types'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import DiagnosisResultCard from './components/DiagnosisResultCard'
import HotlineCard from './components/HotlineCard'
import RecommendedProductsCard from './components/RecommendedProductsCard'
import { canCancel, formatDiagnosisTime, isWaiting, statusBadgeClass, statusLabel } from './model'

/** While the AI is still analysing, ask again this often (the upload answer normally has the result already). */
const POLL_MS = 5000

/** One of the farmer's diagnosis cases: the result as the AI (or, for an old case, the store) gave it. */
export default function DiagnosisCasePage() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [attempt, setAttempt] = useState(0)
  // Answers remember the case id (and attempt) they belong to, so loading is derived, not set before each request.
  const [loaded, setLoaded] = useState<{ id: string; value: MyDiagnosisCase } | null>(null)
  const [loadError, setLoadError] = useState<{ id: string; attempt: number; message: string } | null>(null)
  const [retrying, setRetrying] = useState(false)
  const [retryError, setRetryError] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const diagnosisCase = loaded?.id === id ? loaded.value : null
  const error = !diagnosisCase && loadError?.id === id && loadError.attempt === attempt ? loadError.message : null
  const isLoading = !diagnosisCase && !error
  useDocumentTitle(diagnosisCase ? `Ca chẩn đoán ${diagnosisCase.caseNumber}` : 'Ca chẩn đoán')

  const show = (value: MyDiagnosisCase) => setLoaded({ id: value.id, value })

  useEffect(() => {
    let live = true
    diagnosisApi.get(id).then(
      (value) => {
        if (live) setLoaded({ id, value })
      },
      (err: unknown) => {
        if (live) setLoadError({ id, attempt, message: describeDiagnosisError(err, 'load') })
      },
    )
    return () => {
      live = false
    }
  }, [id, attempt])

  // Ask again while the AI is still analysing; a failed read keeps what is on screen.
  const waiting = diagnosisCase ? isWaiting(diagnosisCase.status) && !diagnosisCase.canRetry : false
  useEffect(() => {
    if (!waiting) return
    const timer = setInterval(() => {
      diagnosisApi.get(id).then((value) => setLoaded({ id, value }), () => {})
    }, POLL_MS)
    return () => clearInterval(timer)
  }, [waiting, id])

  const retry = async () => {
    if (!diagnosisCase) return
    setRetrying(true)
    setRetryError(null)
    try {
      show(await diagnosisApi.retry(diagnosisCase.id))
    } catch (err) {
      setRetryError(describeDiagnosisError(err, 'retry'))
    } finally {
      setRetrying(false)
    }
  }

  const cancel = async () => {
    if (!diagnosisCase || !confirm(`Bác muốn huỷ ca ${diagnosisCase.caseNumber}? Ca sẽ được lưu là đã huỷ.`)) return
    setCancelling(true)
    setNotice(null)
    try {
      show(await diagnosisApi.cancel(diagnosisCase.id))
      setNotice('Đã huỷ ca chẩn đoán.')
    } catch (err) {
      setNotice(describeDiagnosisError(err, 'cancel'))
      // The case changed meanwhile (the AI finished): show what it is now.
      await diagnosisApi.get(diagnosisCase.id).then(show, () => {})
    } finally {
      setCancelling(false)
    }
  }

  const c = diagnosisCase

  return (
    <div className="bg-brand-cream min-h-screen">
      <Breadcrumb
        items={[
          { label: 'Trang chủ', to: '/' },
          { label: 'Bác sĩ cây trồng AI', to: '/ai-doctor' },
          { label: 'Lịch sử chẩn đoán', to: '/ai-doctor/history' },
          { label: c?.caseNumber ?? 'Ca chẩn đoán' },
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {isLoading ? (
          <div className="space-y-4" aria-busy="true" aria-label="Đang tải ca chẩn đoán">
            <div className="h-10 w-72 max-w-full bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
            <div className="h-64 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
          </div>
        ) : error || !c ? (
          <div role="alert" className="border border-brand-dark/15 bg-white p-10 text-center rounded-[var(--radius-surface)]">
            <p className="text-lg text-text-primary">{error ?? 'Không tìm thấy ca chẩn đoán.'}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => setAttempt((n) => n + 1)} className="focus-ring min-h-[44px] px-7 rounded-full bg-brand-dark text-white hover:bg-brand-green text-[15px] transition-colors">
                Thử lại
              </button>
              <Link to="/ai-doctor/history" className="focus-ring inline-flex items-center min-h-[44px] px-7 rounded-full border border-brand-dark/30 text-[15px] text-text-primary hover:bg-brand-dark hover:text-white transition-colors">
                Về lịch sử chẩn đoán
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
              <div>
                <p className="text-[13px] uppercase tracking-[0.16em] text-text-secondary mb-3">Ca chẩn đoán</p>
                <h1 className="text-[length:var(--type-h1)] leading-[var(--type-h1-lh)] font-light tracking-tight text-text-primary" data-testid="case-number">
                  {c.caseNumber}
                </h1>
                <p className="mt-2 text-[15px] text-text-secondary">Gửi lúc {formatDiagnosisTime(c.submittedAt)}</p>
              </div>
              <span className={`self-start sm:self-auto px-4 py-1.5 rounded-full text-[15px] ${statusBadgeClass(c.status)}`} data-testid="case-status">
                {statusLabel(c.status)}
              </span>
            </div>

            {notice && (
              <p role="status" className="mb-6 p-4 bg-white border border-brand-dark/15 text-[15px] text-text-primary rounded-[var(--radius-surface)]">
                {notice}
              </p>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-7 space-y-6">
                <DiagnosisResultCard
                  diagnosisCase={c}
                  previewUrl={c.image?.imageUrl ?? null}
                  onNewPhoto={() => navigate('/ai-doctor')}
                  onRetry={retry}
                  retrying={retrying}
                  retryError={retryError}
                />

                {c.farmerNote && (
                  <div className="bg-white border border-brand-dark/15 rounded-[var(--radius-surface)] p-6">
                    <h3 className="text-[13px] uppercase tracking-[0.16em] text-text-secondary mb-3">Ghi chú bác đã gửi</h3>
                    <p className="text-base text-text-primary leading-relaxed whitespace-pre-line">{c.farmerNote}</p>
                  </div>
                )}

                {canCancel(c.status) && (
                  <button
                    type="button"
                    onClick={cancel}
                    disabled={cancelling || retrying}
                    className="focus-ring w-full min-h-[48px] rounded-full border border-status-error text-status-error hover:bg-status-error-surface text-[15px] transition-colors disabled:opacity-45"
                  >
                    {cancelling ? 'Đang huỷ…' : 'Huỷ ca chẩn đoán'}
                  </button>
                )}
              </div>

              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
                {c.result && <RecommendedProductsCard result={c.result} />}
                <HotlineCard />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
