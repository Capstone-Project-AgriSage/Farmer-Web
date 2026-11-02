import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { advisoryApi, describeAdvisoryError, type AdvisoryProduct, type AdvisoryRecommendation, type GrowthStage } from '../../api/advisoryApi'
import { useCart } from '../../context/CartContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { diseaseDisplayName, treatmentTypeLabel } from '../ai-doctor/model'
import AdvisoryProductCard from './components/AdvisoryProductCard'
import {
  AREA_ERROR,
  AREA_UNITS,
  GROWTH_STAGES,
  emptyReasonText,
  parseArea,
  problemTypeLabel,
  readRememberedArea,
  rememberArea,
  type AreaUnit,
} from './model'

interface Applied {
  sqm: number | undefined
  stage: GrowthStage | undefined
}

function SectionCard({ icon, title, children, testId }: { icon: string; title: string; children: ReactNode; testId?: string }) {
  return (
    <section className="bg-white border border-brand-dark/15 rounded-[var(--radius-surface)] p-5 sm:p-6" data-testid={testId}>
      <h2 className="flex items-center gap-2 text-lg font-medium text-text-primary">
        <span className="material-symbols-outlined text-primary-dark" style={{ fontSize: 24 }} aria-hidden="true">{icon}</span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

/**
 * Products for one problem: the farmer enters the field's area and the rice stage to get the quantity to buy, and adds a
 * product to the cart in one click. The list holds only products the store approved; price, quantity and stock come from the server.
 */
export default function AdvisoryProblemPage() {
  const { id = '' } = useParams<{ id: string }>()
  const [params] = useSearchParams()
  const caseId = params.get('caseId') ?? undefined
  const { addToCart } = useCart()

  // The area the farmer entered last time is in the box already and is used for the first request (one call, not two).
  const [remembered] = useState(readRememberedArea)
  const [areaText, setAreaText] = useState(remembered?.text ?? '')
  const [unit, setUnit] = useState<AreaUnit>(remembered?.unit ?? 'cong')
  const [stage, setStage] = useState<GrowthStage | undefined>(undefined)
  const [areaError, setAreaError] = useState<string | null>(null)
  const [applied, setApplied] = useState<Applied>(() => {
    const parsed = remembered ? parseArea(remembered.text, remembered.unit) : null
    return { sqm: parsed?.ok ? parsed.sqm : undefined, stage: undefined }
  })
  const [attempt, setAttempt] = useState(0)
  const [adding, setAdding] = useState<string | null>(null)

  // Answers remember the request they belong to, so loading is derived instead of being set before each request.
  const [loaded, setLoaded] = useState<{ key: string; value: AdvisoryRecommendation } | null>(null)
  const [failed, setFailed] = useState<{ key: string; message: string } | null>(null)
  const key = `${id}|${caseId ?? ''}|${applied.sqm ?? ''}|${applied.stage ?? ''}|${attempt}`
  const result = loaded?.key === key ? loaded.value : null
  const error = failed?.key === key ? failed.message : null
  const isLoading = result === null && error === null
  const [problemName, setProblemName] = useState<string | null>(null)
  useDocumentTitle(problemName ? `Tư vấn: ${problemName}` : 'Tư vấn vật tư')

  useEffect(() => {
    let live = true
    advisoryApi.recommend({ diseaseId: id, areaSqm: applied.sqm, growthStage: applied.stage, diagnosisCaseId: caseId }).then(
      (value) => {
        if (!live) return
        setLoaded({ key, value })
        setProblemName(diseaseDisplayName(value.problem.code, value.problem.name))
      },
      (err: unknown) => {
        if (live) setFailed({ key, message: describeAdvisoryError(err, 'recommend') })
      },
    )
    return () => {
      live = false
    }
  }, [id, caseId, applied, key])

  const apply = (nextStage: GrowthStage | undefined) => {
    const parsed = parseArea(areaText, unit)
    if (!parsed.ok) {
      setAreaError(AREA_ERROR)
      return
    }
    setAreaError(null)
    rememberArea(parsed.sqm === undefined ? null : { text: areaText.trim(), unit })
    setApplied({ sqm: parsed.sqm, stage: nextStage })
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    apply(stage)
  }

  const pickStage = (next: GrowthStage | undefined) => {
    setStage(next)
    apply(next)
  }

  const add = async (product: AdvisoryProduct) => {
    if (!product.plan || adding) return
    setAdding(product.storeProductId)
    try {
      for (const line of product.plan.lines) {
        const ok = await addToCart({ storeProductId: product.storeProductId, productPackagingId: line.productPackagingId, quantity: line.quantity }, product.name)
        if (!ok) break
      }
    } finally {
      setAdding(null)
    }
  }

  const heading = problemName ?? 'Gợi ý sản phẩm'
  const emptyText = result ? emptyReasonText(result.emptyReason) : null
  const hasProducts = !!result && (result.protection.length > 0 || result.nutrition.length > 0)
  const sortGroup = (items: AdvisoryProduct[]) => [...items].sort((a, b) => a.rankOrder - b.rankOrder)

  return (
    <div className="bg-brand-cream min-h-screen">
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Tư vấn vật tư', to: '/advisory' }, { label: heading }]} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-6">
        {isLoading && !problemName ? (
          <div className="space-y-4" aria-busy="true" aria-label="Đang tải tư vấn">
            <div className="h-10 w-72 max-w-full bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
            <div className="h-40 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
          </div>
        ) : null}

        {error ? (
          <div role="alert" className="border border-brand-dark/15 bg-white p-8 text-center rounded-[var(--radius-surface)]">
            <p className="text-lg text-text-primary">{error}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => setAttempt((n) => n + 1)} className="focus-ring min-h-[44px] px-7 rounded-full bg-brand-dark text-white hover:bg-brand-green text-[15px] transition-colors">
                Thử lại
              </button>
              <Link to="/advisory" className="focus-ring inline-flex items-center min-h-[44px] px-7 rounded-full border border-brand-dark/30 text-[15px] text-text-primary hover:bg-brand-dark hover:text-white transition-colors">
                Chọn vấn đề khác
              </Link>
            </div>
          </div>
        ) : null}

        {result && (
          <header className="rounded-[var(--radius-surface)] bg-brand-light px-6 py-5" data-testid="advisory-problem-header">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[13px] bg-white text-text-secondary">{problemTypeLabel(result.problem.problemType)}</span>
              {caseId && <span className="px-2.5 py-0.5 rounded-full text-[13px] bg-white text-text-secondary">Từ kết quả AI</span>}
            </div>
            <h1 className="mt-2 text-3xl md:text-4xl font-normal tracking-tight text-text-primary" data-testid="advisory-problem-name">
              {diseaseDisplayName(result.problem.code, result.problem.name)}
            </h1>
            {result.problem.symptoms && <p className="mt-2 text-[15px] md:text-base text-text-secondary leading-relaxed">{result.problem.symptoms}</p>}
          </header>
        )}

        <SectionCard icon="eco" title="Ruộng của bác" testId="advisory-field-card">
          <form onSubmit={submit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="advisory-area" className="text-[15px] text-text-primary">Diện tích ruộng</label>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <input
                  id="advisory-area"
                  inputMode="decimal"
                  value={areaText}
                  onChange={(e) => setAreaText(e.target.value.replace(/[^0-9.,]/g, ''))}
                  maxLength={12}
                  placeholder="Ví dụ: 3"
                  aria-invalid={areaError !== null}
                  aria-describedby={areaError ? 'advisory-area-error' : undefined}
                  data-testid="advisory-area"
                  className="focus-ring w-40 min-h-[48px] px-4 text-base bg-white border border-brand-dark/25 rounded-[var(--radius-input)] text-text-primary placeholder:text-text-muted hover:border-brand-dark/60 focus:border-brand-dark transition-colors"
                />
                <div className="flex flex-wrap gap-2" role="group" aria-label="Đơn vị diện tích">
                  {AREA_UNITS.map((u) => (
                    <button
                      key={u.value}
                      type="button"
                      onClick={() => setUnit(u.value)}
                      aria-pressed={unit === u.value}
                      data-testid={`advisory-unit-${u.value}`}
                      className={`focus-ring min-h-[40px] px-4 rounded-full border text-[15px] transition-colors ${
                        unit === u.value ? 'bg-brand-dark text-white border-brand-dark' : 'border-brand-dark/30 text-text-primary hover:bg-brand-dark hover:text-white'
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>
              {areaError && (
                <p id="advisory-area-error" role="alert" className="mt-2 text-[14px] text-status-error">
                  {areaError}
                </p>
              )}
              <p className="mt-2 text-[14px] text-text-muted">1 công = 1.000 m², 1 sào = 360 m².</p>
            </div>

            <div>
              <p className="text-[15px] text-text-primary">Lúa đang ở giai đoạn</p>
              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Giai đoạn của lúa">
                <button
                  type="button"
                  onClick={() => pickStage(undefined)}
                  aria-pressed={stage === undefined}
                  data-testid="advisory-stage-any"
                  className={`focus-ring min-h-[40px] px-4 rounded-full border text-[15px] transition-colors ${
                    stage === undefined ? 'bg-brand-dark text-white border-brand-dark' : 'border-brand-dark/30 text-text-primary hover:bg-brand-dark hover:text-white'
                  }`}
                >
                  Chưa rõ
                </button>
                {GROWTH_STAGES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => pickStage(s.value)}
                    aria-pressed={stage === s.value}
                    data-testid={`advisory-stage-${s.value}`}
                    className={`focus-ring min-h-[40px] px-4 rounded-full border text-[15px] transition-colors ${
                      stage === s.value ? 'bg-brand-dark text-white border-brand-dark' : 'border-brand-dark/30 text-text-primary hover:bg-brand-dark hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" data-testid="advisory-apply" className="focus-ring min-h-[48px] px-7 rounded-full bg-brand-dark text-white hover:bg-brand-green text-base transition-colors">
              Tính số lượng cần mua
            </button>
          </form>
        </SectionCard>

        {isLoading && problemName && (
          <div className="h-40 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" aria-busy="true" aria-label="Đang cập nhật gợi ý" />
        )}

        {result && (
          <>
            {result.careGuidance.length > 0 && (
              <SectionCard icon="spa" title="Cách chăm sóc" testId="advisory-care">
                <ul className="divide-y divide-brand-dark/10">
                  {[...result.careGuidance]
                    .sort((a, b) => a.rankOrder - b.rankOrder)
                    .map((t) => (
                      <li key={t.id} className="py-3 first:pt-0 last:pb-0">
                        <p className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[13px] bg-brand-light text-text-secondary">{treatmentTypeLabel(t.type)}</span>
                          <span className="text-base font-medium text-text-primary">{t.title}</span>
                        </p>
                        <p className="mt-2 text-[15px] text-text-secondary leading-relaxed">{t.instructions}</p>
                        {t.precautions && <p className="mt-1 text-[14px] text-status-warning">Lưu ý: {t.precautions}</p>}
                      </li>
                    ))}
                </ul>
              </SectionCard>
            )}

            {!hasProducts && (
              <SectionCard icon="info" title="Sản phẩm gợi ý">
                <p className="text-[15px] text-text-secondary leading-relaxed" data-testid="advisory-empty-reason">
                  {emptyText ?? 'Chưa có sản phẩm gợi ý.'}
                </p>
              </SectionCard>
            )}

            {result.protection.length > 0 && (
              <SectionCard icon="science" title="Thuốc bảo vệ thực vật" testId="advisory-protection">
                <ul>
                  {sortGroup(result.protection).map((p) => (
                    <AdvisoryProductCard key={p.storeProductId} product={p} hasArea={result.areaSqm !== null} adding={adding === p.storeProductId} onAdd={add} />
                  ))}
                </ul>
              </SectionCard>
            )}

            {result.nutrition.length > 0 && (
              <SectionCard icon="local_florist" title="Phân bón" testId="advisory-nutrition">
                <ul>
                  {sortGroup(result.nutrition).map((p) => (
                    <AdvisoryProductCard key={p.storeProductId} product={p} hasArea={result.areaSqm !== null} adding={adding === p.storeProductId} onAdd={add} />
                  ))}
                </ul>
              </SectionCard>
            )}

            <p className="rounded-[var(--radius-surface)] bg-status-warning-surface px-5 py-4 text-[15px] text-text-primary leading-relaxed" data-testid="advisory-disclaimer">
              {result.safetyNote || 'Bác đọc kỹ nhãn trước khi dùng, mang đồ bảo hộ, tuân thủ thời gian cách ly. Gợi ý chỉ mang tính tham khảo.'}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
