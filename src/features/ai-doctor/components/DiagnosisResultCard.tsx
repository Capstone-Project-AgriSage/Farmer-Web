import { useEffect, useState } from 'react'
import { confidenceTone, type DiagnosisScenario } from '../model'

interface DiagnosisResultCardProps {
  result: DiagnosisScenario
  previewUrl: string | null
  showAlternatives: boolean
  onToggleAlternatives: () => void
  onReset: () => void
  onSubmittedToAgent?: () => void
  isInconclusive?: boolean
}

// Severity is shown as an icon plus words, never colour alone.
const SEVERITY_STYLE: Record<DiagnosisScenario['severity'], { icon: string; className: string }> = {
  'Nhẹ': { icon: 'info', className: 'bg-status-info-surface text-status-info' },
  'Trung bình': { icon: 'warning', className: 'bg-status-warning-surface text-status-warning' },
  'Nặng': { icon: 'error', className: 'bg-status-error-surface text-status-error' },
  'Bình thường': { icon: 'check_circle', className: 'bg-status-success-surface text-status-success' },
}

function SectionLabel({ children }: { children: string }) {
  return <h3 className="text-[13px] uppercase tracking-[0.16em] text-text-secondary mb-3">{children}</h3>
}

export default function DiagnosisResultCard({ result, previewUrl, showAlternatives, onToggleAlternatives, onReset, onSubmittedToAgent, isInconclusive }: DiagnosisResultCardProps) {
  const tone = confidenceTone(result.confidence)
  const severity = SEVERITY_STYLE[result.severity]
  const [sentForReview, setSentForReview] = useState(false)
  const [isSendingReview, setIsSendingReview] = useState(false)
  // The bar fills from 0 to the confidence once the card is on screen.
  const [barShown, setBarShown] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setBarShown(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const handleSendForReview = () => {
    setIsSendingReview(true)
    setTimeout(() => {
      setIsSendingReview(false)
      setSentForReview(true)
      onSubmittedToAgent?.()
    }, 800)
  }

  return (
    <div className="bg-white border border-brand-dark/15 rounded-[var(--radius-surface)]">
      <div className="flex items-center justify-between gap-4 px-5 sm:px-8 py-4 border-b border-brand-dark/15">
        <h2 className="text-[13px] uppercase tracking-[0.16em] text-text-secondary">Kết quả chẩn đoán</h2>
        <button type="button" onClick={onReset} className="focus-ring inline-flex items-center gap-1.5 min-h-[44px] text-[15px] text-text-primary hover:underline underline-offset-4">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden="true">
            refresh
          </span>
          Chẩn đoán ảnh khác
        </button>
      </div>

      {/* 1. What is wrong with the plant */}
      <section className="px-5 sm:px-8 py-7 flex flex-col sm:flex-row gap-5 sm:gap-6">
        {previewUrl && <img src={previewUrl} alt="Ảnh đã chẩn đoán" className="w-full sm:w-28 h-40 sm:h-28 object-cover rounded-[var(--radius-surface)] border border-brand-dark/15 shrink-0" />}
        <div className="min-w-0">
          <p className="text-[length:var(--type-h2)] leading-[var(--type-h2-lh)] font-light tracking-tight text-text-primary">{result.diseaseName}</p>
          <p className="mt-1 text-[15px] italic text-text-secondary">{result.pathogen}</p>
          <p className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[15px] font-medium ${severity.className}`}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }} aria-hidden="true">
              {severity.icon}
            </span>
            Mức độ: {result.severity}
          </p>
        </div>
      </section>

      {isInconclusive ? (
        <section className="px-5 sm:px-8 pb-7">
          <div role="alert" className="p-5 border border-status-error/40 bg-status-error-surface rounded-[var(--radius-surface)]">
            <p className="flex items-center gap-2 text-lg font-medium text-text-primary">
              <span className="material-symbols-outlined text-status-error" style={{ fontSize: 24 }} aria-hidden="true">
                error
              </span>
              Chưa đủ cơ sở kết luận
            </p>
            <p className="mt-2 text-[15px] md:text-base text-text-primary leading-relaxed">
              Hình ảnh không đủ rõ hoặc triệu chứng chưa điển hình, nên hệ thống không đưa ra phác đồ tự động để đảm bảo an toàn. Bác chụp lại ảnh rõ hơn hoặc gửi ảnh để kỹ sư đại lý xem trực tiếp.
            </p>
          </div>
        </section>
      ) : (
        <>
          {/* 2. What to do right now */}
          <section className="px-5 sm:px-8 pb-7 border-t border-brand-dark/15 pt-7">
            <SectionLabel>Việc cần làm ngay tại ruộng</SectionLabel>
            <ol className="space-y-4">
              {result.treatmentSteps.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-brand-dark text-white text-[15px] flex items-center justify-center" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span className="text-base md:text-[17px] text-text-primary leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-6 p-4 border-l-4 border-status-warning bg-status-warning-surface text-[15px] text-text-primary leading-relaxed">
              <p className="flex items-center gap-2 font-medium">
                <span className="material-symbols-outlined text-status-warning" style={{ fontSize: 20 }} aria-hidden="true">
                  verified_user
                </span>
                Chính sách An toàn Nông nghiệp AgriSage
              </p>
              <p className="mt-1">
                Danh mục thuốc BVTV và phân bón thương mại <strong>chỉ hiển thị sau khi Đại lý Hai Thắng thẩm định trực tiếp hình ảnh</strong>, để tránh kháng thuốc hoặc dùng sai hoạt chất.
              </p>
            </div>
          </section>
        </>
      )}

      {/* 3. How sure the AI is */}
      <section className="px-5 sm:px-8 py-7 border-t border-brand-dark/15">
        <SectionLabel>Độ tin cậy của AI</SectionLabel>
        <div className="flex items-baseline justify-between gap-4">
          <p className={`text-[15px] md:text-base font-medium ${tone.text}`}>{tone.label}</p>
          <p className={`text-[length:var(--type-h2)] leading-none font-light ${tone.text}`}>{result.confidence}%</p>
        </div>
        <div className="mt-3 h-3 rounded-full bg-brand-light overflow-hidden" role="img" aria-label={`Độ tin cậy ${result.confidence}%`}>
          <div
            className={`h-full w-full rounded-full origin-left ${tone.bar} transition-transform duration-[var(--dur-large)] ease-[var(--motion-ease-out)]`}
            style={{ transform: `scaleX(${barShown ? result.confidence / 100 : 0})` }}
          />
        </div>
      </section>

      {/* 4. What the dealer is doing about it */}
      <section className="px-5 sm:px-8 py-7 border-t border-brand-dark/15">
        <SectionLabel>Chuyên gia đang xử lý</SectionLabel>
        {sentForReview ? (
          <div role="status" className="flex items-start gap-3 p-4 bg-brand-light border border-brand-dark/15 rounded-[var(--radius-surface)]">
            <span className="material-symbols-outlined text-status-warning shrink-0" style={{ fontSize: 26 }} aria-hidden="true">
              hourglass_top
            </span>
            <div>
              <p className="text-base font-medium text-text-primary">Đã chuyển ca tới Đại lý Hai Thắng (#AI-2401)</p>
              <p className="mt-1 text-[15px] text-text-secondary leading-relaxed">
                Trạng thái: <strong className="text-text-primary">Chờ đại lý duyệt phác đồ thương mại</strong>. Khi thẩm định viên xác nhận, thuốc đặc trị sẽ hiện ngay tại đây và có thông báo gửi về tài khoản của bác.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[15px] md:text-base text-text-secondary leading-relaxed">
              Gửi ca này cho đại lý để được thẩm định và mở phác đồ thương mại. <span className="text-text-muted">Đại lý: Hai Thắng (Thới Lai)</span>
            </p>
            <button
              type="button"
              onClick={handleSendForReview}
              disabled={isSendingReview}
              className="focus-ring w-full min-h-[52px] rounded-full bg-brand-dark text-white hover:bg-brand-green text-[15px] md:text-base tracking-wide transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <span className={`material-symbols-outlined ${isSendingReview ? 'animate-spin' : ''}`} style={{ fontSize: 20 }} aria-hidden="true">
                {isSendingReview ? 'progress_activity' : 'send'}
              </span>
              {isSendingReview ? 'Đang chuyển hình ảnh…' : 'Gửi đại lý Hai Thắng duyệt thuốc điều trị'}
            </button>
          </div>
        )}
      </section>

      {/* Details: kept below the decision */}
      {!isInconclusive && (
        <section className="px-5 sm:px-8 py-7 border-t border-brand-dark/15">
          <SectionLabel>Triệu chứng AI nhận diện được</SectionLabel>
          <ul className="space-y-2.5">
            {result.symptomsDetected.map((symptom) => (
              <li key={symptom} className="flex items-start gap-3 text-[15px] md:text-base text-text-secondary leading-relaxed">
                <span className="material-symbols-outlined text-primary-dark shrink-0 mt-0.5" style={{ fontSize: 20 }} aria-hidden="true">
                  check_circle
                </span>
                {symptom}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="border-t border-brand-dark/15">
        <button
          type="button"
          onClick={onToggleAlternatives}
          aria-expanded={showAlternatives}
          aria-controls="alternatives-list"
          className="focus-ring w-full flex items-center justify-between px-5 sm:px-8 min-h-[60px] text-left"
        >
          <span className="text-[13px] uppercase tracking-[0.16em] text-text-secondary">Khả năng khác ({result.alternatives.length})</span>
          <span className="material-symbols-outlined text-text-primary" style={{ fontSize: 24 }} aria-hidden="true">
            {showAlternatives ? 'expand_less' : 'expand_more'}
          </span>
        </button>
        {showAlternatives && (
          <ul id="alternatives-list" className="px-5 sm:px-8 pb-6 space-y-2">
            {result.alternatives.length === 0 && <li className="text-[15px] text-text-secondary">Không có khả năng khác.</li>}
            {result.alternatives.map((alt) => (
              <li key={alt.name} className="flex items-center justify-between text-[15px] bg-brand-light border border-brand-dark/10 px-4 py-3 rounded-[var(--radius-surface)]">
                <span className="text-text-primary">{alt.name}</span>
                <span className="text-text-secondary">{alt.confidence}%</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
