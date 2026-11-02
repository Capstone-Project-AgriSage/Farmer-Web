import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { advisoryApi, describeAdvisoryError, type AdvisoryProblem, type ProblemType } from '../../api/advisoryApi'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { diseaseDisplayName } from '../ai-doctor/model'
import { PROBLEM_FILTERS, problemTypeLabel } from './model'

/** Waits for the farmer to stop typing before the server is called. */
const SEARCH_DEBOUNCE_MS = 400

/**
 * The farmer already knows the problem on the field: type its name, a folk name or a symptom (accents optional) or filter by
 * kind, then pick it to see the products. A farmer who does not know what the rice has is sent to the photo diagnosis.
 */
export default function AdvisoryPage() {
  useDocumentTitle('Tư vấn vật tư')
  const [text, setText] = useState('')
  const [search, setSearch] = useState('')
  const [type, setType] = useState<ProblemType | ''>('')
  const [attempt, setAttempt] = useState(0)
  // Answers remember the request they belong to, so loading is derived instead of being set before each request.
  const [loaded, setLoaded] = useState<{ key: string; items: AdvisoryProblem[] } | null>(null)
  const [failed, setFailed] = useState<{ key: string; message: string } | null>(null)
  const key = `${search}|${type}|${attempt}`
  const items = loaded?.key === key ? loaded.items : null
  const error = failed?.key === key ? failed.message : null
  const isLoading = items === null && error === null

  useEffect(() => {
    const timer = setTimeout(() => setSearch(text.trim()), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [text])

  useEffect(() => {
    let live = true
    advisoryApi.problems({ search, type: type || undefined }).then(
      (page) => {
        if (live) setLoaded({ key, items: page.items })
      },
      (err: unknown) => {
        if (live) setFailed({ key, message: describeAdvisoryError(err, 'problems') })
      },
    )
    return () => {
      live = false
    }
  }, [search, type, key])

  return (
    <div className="bg-brand-cream min-h-screen">
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Tư vấn vật tư' }]} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-normal tracking-tight text-text-primary">Tư vấn vật tư</h1>
          <p className="mt-3 text-base md:text-lg text-text-secondary leading-relaxed">
            Bác chọn vấn đề trên ruộng lúa để xem thuốc và phân bón của cửa hàng, liều dùng, số lượng cần mua cho ruộng của bác.
          </p>
        </header>

        <div className="bg-white border border-brand-dark/15 rounded-[var(--radius-surface)] p-5 sm:p-6 space-y-4">
          <label className="block">
            <span className="text-[15px] text-text-primary">Gõ tên bệnh, sâu, triệu chứng</span>
            <input
              type="search"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={100}
              placeholder="Ví dụ: đạo ôn, vàng lá, rầy nâu"
              data-testid="advisory-search"
              className="focus-ring mt-2 w-full min-h-[48px] px-4 text-base bg-white border border-brand-dark/25 rounded-[var(--radius-input)] text-text-primary placeholder:text-text-muted hover:border-brand-dark/60 focus:border-brand-dark transition-colors"
            />
          </label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Lọc theo loại vấn đề">
            {PROBLEM_FILTERS.map((f) => (
              <button
                key={f.value || 'all'}
                type="button"
                onClick={() => setType(f.value)}
                aria-pressed={type === f.value}
                data-testid={`advisory-type-${f.value || 'all'}`}
                className={`focus-ring min-h-[40px] px-4 rounded-full border text-[15px] transition-colors ${
                  type === f.value ? 'bg-brand-dark text-white border-brand-dark' : 'border-brand-dark/30 text-text-primary hover:bg-brand-dark hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <Link
          to="/ai-doctor"
          data-testid="advisory-photo-shortcut"
          className="focus-ring mt-5 flex items-center gap-4 rounded-[var(--radius-surface)] bg-brand-light px-5 py-4 hover:bg-brand-light/70 transition-colors"
        >
          <span className="material-symbols-outlined text-primary-dark" style={{ fontSize: 28 }} aria-hidden="true">photo_camera</span>
          <span className="flex-1">
            <span className="block text-base font-medium text-text-primary">Bác chưa biết lúa bị gì?</span>
            <span className="block text-[15px] text-text-secondary">Chụp ảnh lá bệnh để AI nhận biết rồi gợi ý thuốc.</span>
          </span>
          <span className="material-symbols-outlined text-text-muted" aria-hidden="true">chevron_right</span>
        </Link>

        <section className="mt-6" aria-live="polite">
          {isLoading ? (
            <div className="space-y-3" aria-busy="true" aria-label="Đang tải danh sách vấn đề">
              {[0, 1, 2].map((n) => (
                <div key={n} className="h-24 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div role="alert" className="border border-brand-dark/15 bg-white p-8 text-center rounded-[var(--radius-surface)]">
              <p className="text-lg text-text-primary">{error}</p>
              <button type="button" onClick={() => setAttempt((n) => n + 1)} className="focus-ring mt-4 min-h-[44px] px-7 rounded-full bg-brand-dark text-white hover:bg-brand-green text-[15px] transition-colors">
                Thử lại
              </button>
            </div>
          ) : items && items.length === 0 ? (
            <div className="border border-brand-dark/15 bg-white p-8 text-center rounded-[var(--radius-surface)]" data-testid="advisory-empty">
              <p className="text-lg text-text-primary">Không tìm thấy vấn đề phù hợp.</p>
              <p className="mt-2 text-[15px] text-text-secondary">Bác thử từ khác, hoặc chụp ảnh lá để AI nhận biết bệnh.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items?.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/advisory/problem/${p.id}`}
                    data-testid={`advisory-problem-${p.code}`}
                    className="focus-ring block bg-white border border-brand-dark/15 rounded-[var(--radius-surface)] p-5 hover:border-brand-dark/50 transition-colors"
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-medium text-text-primary">{diseaseDisplayName(p.code, p.name)}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[13px] bg-brand-light text-text-secondary">{problemTypeLabel(p.problemType)}</span>
                    </span>
                    {p.summary && <span className="block mt-2 text-[15px] text-text-secondary line-clamp-2">{p.summary}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
