import type { ReactNode } from 'react'
import type { DiagnosisResult, MyDiagnosisCase } from '../../../api/types'
import { certaintyHeading, diseaseDisplayName, isWaiting, treatmentTypeLabel } from '../model'

interface DiagnosisResultCardProps {
  diagnosisCase: MyDiagnosisCase
  previewUrl: string | null
  /** "Chụp lại" / "Gửi ảnh khác": back to an empty upload form. */
  onNewPhoto: () => void
  onRetry?: () => void
  retrying?: boolean
  retryError?: string | null
  /** Extra action in the card header, such as a link to the case page. */
  headerAction?: ReactNode
}

function SectionLabel({ children }: { children: string }) {
  return <h3 className="text-[13px] uppercase tracking-[0.16em] text-text-secondary mb-3">{children}</h3>
}

function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  return (
    <span className={`material-symbols-outlined shrink-0 ${className}`} style={{ fontSize: size }} aria-hidden="true">
      {name}
    </span>
  )
}

const has = (text: string | null | undefined) => Boolean(text && text.trim())

const outlineButton =
  'focus-ring inline-flex items-center justify-center gap-2 min-h-[48px] px-5 rounded-full border border-brand-dark/30 text-[15px] text-text-primary hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-colors disabled:opacity-45 disabled:cursor-not-allowed'
const solidButton =
  'focus-ring inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-full bg-brand-dark text-white hover:bg-brand-green text-[15px] transition-colors disabled:opacity-70 disabled:cursor-not-allowed'

/** The AI result (or an old store-confirmed result): disease, how sure, what to do. Never a probability (D8). */
function ResultBody({ result, previewUrl, onNewPhoto }: { result: DiagnosisResult; previewUrl: string | null; onNewPhoto: () => void }) {
  const d = result.disease
  const uncertain = result.certainty === 'UNCERTAIN'
  const fromAi = result.certainty !== 'VERIFIED'
  const healthy = d.isHealthy && !uncertain
  const name = diseaseDisplayName(d.code, d.name)
  const treatments = [...result.treatments].sort((a, b) => a.rankOrder - b.rankOrder)
  const noContent = !has(d.symptoms) && !has(d.prevention) && treatments.length === 0
  const tone = healthy ? 'text-status-success' : 'text-status-warning'

  return (
    <>
      <section className="px-5 sm:px-8 py-7 flex flex-col sm:flex-row gap-5 sm:gap-6">
        {previewUrl && (
          <img src={previewUrl} alt="Ảnh lá lúa đã gửi" className="w-full sm:w-28 h-40 sm:h-28 object-cover rounded-[var(--radius-surface)] border border-brand-dark/15 shrink-0" />
        )}
        <div className="min-w-0">
          <p className={`flex items-center gap-1.5 text-[15px] font-medium ${tone}`} data-testid="diagnosis-certainty">
            <Icon name={uncertain ? 'help' : healthy ? 'check_circle' : fromAi ? 'psychology' : 'verified'} />
            {certaintyHeading(result.certainty)}
          </p>
          <p className="mt-1 text-[length:var(--type-h2)] leading-[var(--type-h2-lh)] font-light tracking-tight text-text-primary" data-testid="diagnosis-disease">
            {name}
          </p>
          {d.name && d.name !== name && <p className="mt-1 text-[15px] italic text-text-secondary">{d.name}</p>}
          {healthy && <p className="mt-2 text-[15px] md:text-base text-status-success">Cây không có dấu hiệu bệnh.</p>}
          {fromAi && <p className="mt-2 text-[15px] text-text-secondary">Kết quả do AI dự đoán từ ảnh, có thể chưa chính xác.</p>}
        </div>
      </section>

      {uncertain && (
        <section className="px-5 sm:px-8 pb-7">
          <div role="status" data-testid="diagnosis-uncertain" className="p-5 border border-status-warning/40 bg-status-warning-surface rounded-[var(--radius-surface)]">
            <p className="flex items-center gap-2 text-lg font-medium text-text-primary">
              <Icon name="photo_camera" size={24} className="text-status-warning" />
              Nên chụp lại hoặc hỏi cửa hàng
            </p>
            <p className="mt-2 text-[15px] md:text-base text-text-primary leading-relaxed">
              AI chưa chắc đây là bệnh gì nên chưa gợi ý thuốc. Bác chụp lại gần một lá bệnh, đủ sáng, hoặc mang mẫu lá đến cửa hàng để được tư vấn.
            </p>
            <button type="button" onClick={onNewPhoto} className={`${solidButton} mt-4`}>
              <Icon name="photo_camera" />
              Chụp lại
            </button>
          </div>
        </section>
      )}

      {has(result.reviewerComment) && (
        <section className="px-5 sm:px-8 py-7 border-t border-brand-dark/15">
          <SectionLabel>Nhận xét của cửa hàng</SectionLabel>
          <p className="text-base text-text-primary leading-relaxed">{result.reviewerComment}</p>
        </section>
      )}

      {has(d.symptoms) && (
        <section className="px-5 sm:px-8 py-7 border-t border-brand-dark/15">
          <SectionLabel>Triệu chứng</SectionLabel>
          <p className="text-base text-text-primary leading-relaxed">{d.symptoms}</p>
        </section>
      )}

      {has(d.prevention) && (
        <section className="px-5 sm:px-8 py-7 border-t border-brand-dark/15">
          <SectionLabel>Cách phòng ngừa</SectionLabel>
          <p className="text-base text-text-primary leading-relaxed">{d.prevention}</p>
        </section>
      )}

      {treatments.length > 0 && (
        <section className="px-5 sm:px-8 py-7 border-t border-brand-dark/15" data-testid="diagnosis-treatments">
          <SectionLabel>Cách xử lý</SectionLabel>
          <ol className="space-y-5">
            {treatments.map((t, index) => (
              <li key={t.id} className="flex gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-brand-dark text-white text-[15px] flex items-center justify-center" aria-hidden="true">
                  {index + 1}
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-light text-[13px] text-text-secondary">{treatmentTypeLabel(t.type)}</span>
                    <span className="text-base md:text-[17px] font-medium text-text-primary">{t.title}</span>
                  </p>
                  <p className="mt-1.5 text-base text-text-primary leading-relaxed">{t.instructions}</p>
                  {has(t.activeIngredientName) && <p className="mt-1 text-[15px] text-text-secondary">Hoạt chất: {t.activeIngredientName}</p>}
                  {has(t.precautions) && (
                    <p className="mt-2 flex items-start gap-2 text-[15px] text-status-warning">
                      <Icon name="warning" size={18} className="mt-0.5" />
                      Lưu ý: {t.precautions}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {noContent && !d.isHealthy && (
        <section className="px-5 sm:px-8 py-7 border-t border-brand-dark/15">
          <SectionLabel>Cách xử lý</SectionLabel>
          <p className="text-base text-text-secondary">Cửa hàng chưa nhập hướng dẫn cho bệnh này. Bác hỏi cửa hàng để được tư vấn.</p>
        </section>
      )}

      {(fromAi || treatments.length > 0) && (
        <section className="px-5 sm:px-8 pb-7">
          <p className="p-4 border-l-4 border-status-warning bg-status-warning-surface text-[15px] text-text-primary leading-relaxed">
            {fromAi
              ? 'Kết quả do AI gợi ý, không thay thế tư vấn của cán bộ kỹ thuật. Bác đọc kỹ nhãn thuốc và hỏi cửa hàng trước khi dùng.'
              : 'Bác đọc kỹ hướng dẫn và liên hệ cửa hàng khi cần thêm tư vấn trước khi dùng thuốc.'}
          </p>
        </section>
      )}
    </>
  )
}

export default function DiagnosisResultCard({ diagnosisCase: c, previewUrl, onNewPhoto, onRetry, retrying = false, retryError, headerAction }: DiagnosisResultCardProps) {
  let body: ReactNode
  if (c.result) {
    body = <ResultBody result={c.result} previewUrl={previewUrl} onNewPhoto={onNewPhoto} />
  } else if (c.status === 'INCONCLUSIVE') {
    body = (
      <section className="px-5 sm:px-8 py-7" data-testid="diagnosis-inconclusive">
        <p className="flex items-center gap-2 text-lg font-medium text-text-primary">
          <Icon name="photo_camera" size={24} className="text-status-info" />
          Cửa hàng chưa kết luận được
        </p>
        <p className="mt-2 text-base text-text-primary leading-relaxed">Ảnh chưa đủ rõ để kết luận. Bác chụp lại và gửi ảnh mới.</p>
        {has(c.inconclusive?.comment) && (
          <p className="mt-3 p-4 bg-brand-light text-[15px] text-text-primary leading-relaxed rounded-[var(--radius-surface)]">Cửa hàng nhắn: "{c.inconclusive?.comment}"</p>
        )}
        <button type="button" onClick={onNewPhoto} className={`${solidButton} mt-4`}>
          <Icon name="photo_camera" />
          Chụp lại
        </button>
      </section>
    )
  } else if (c.status === 'CANCELLED') {
    body = <p className="px-5 sm:px-8 py-7 text-base text-text-secondary">Bác đã huỷ ca này. Cần khám lại thì gửi ảnh mới.</p>
  } else if (c.status === 'FAILED' || c.canRetry) {
    body = (
      <section className="px-5 sm:px-8 py-7" data-testid="diagnosis-failed">
        <p className="flex items-center gap-2 text-lg font-medium text-text-primary">
          <Icon name="cloud_off" size={24} className="text-status-error" />
          Chưa phân tích được ảnh
        </p>
        <p className="mt-2 text-base text-text-primary leading-relaxed">
          Dịch vụ AI đang bận hoặc chưa sẵn sàng. Bác thử lại sau ít phút, hoặc gửi một ảnh khác. Ảnh đã gửi vẫn được lưu.
        </p>
        {retryError && (
          <p role="alert" className="mt-3 flex items-start gap-2 text-[15px] text-status-error">
            <Icon name="error" />
            {retryError}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          {c.canRetry && onRetry && (
            <button type="button" onClick={onRetry} disabled={retrying} className={solidButton}>
              <Icon name={retrying ? 'progress_activity' : 'refresh'} className={retrying ? 'animate-spin' : ''} />
              {retrying ? 'AI đang phân tích lại…' : 'Thử lại'}
            </button>
          )}
          <button type="button" onClick={onNewPhoto} disabled={retrying} className={outlineButton}>
            <Icon name="photo_camera" />
            Gửi ảnh khác
          </button>
        </div>
      </section>
    )
  } else {
    body = (
      <section className="px-5 sm:px-8 py-7" role="status">
        <p className="flex items-center gap-2 text-lg font-medium text-text-primary">
          <Icon name="hourglass_top" size={24} className="text-status-warning" />
          {isWaiting(c.status) ? 'AI đang phân tích ảnh' : 'Đang cập nhật kết quả'}
        </p>
        <p className="mt-2 text-base text-text-secondary">Thường chỉ mất vài giây. Trang sẽ tự cập nhật.</p>
      </section>
    )
  }

  return (
    <div className="bg-white border border-brand-dark/15 rounded-[var(--radius-surface)]" data-testid="diagnosis-result">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 sm:px-8 py-4 border-b border-brand-dark/15">
        <h2 className="text-[13px] uppercase tracking-[0.16em] text-text-secondary">Kết quả chẩn đoán · {c.caseNumber}</h2>
        <div className="flex flex-wrap items-center gap-x-4">
          {headerAction}
          <button type="button" onClick={onNewPhoto} className="focus-ring inline-flex items-center gap-1.5 min-h-[44px] text-[15px] text-text-primary hover:underline underline-offset-4">
            <Icon name="refresh" size={18} />
            Chẩn đoán ảnh khác
          </button>
        </div>
      </div>
      {body}
    </div>
  )
}
