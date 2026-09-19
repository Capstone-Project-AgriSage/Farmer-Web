import { useState } from 'react'
import { confidenceTone, type DiagnosisScenario } from '../diagnosisScenarios'

interface DiagnosisResultCardProps {
  result: DiagnosisScenario
  previewUrl: string | null
  showAlternatives: boolean
  onToggleAlternatives: () => void
  onReset: () => void
  onSubmittedToAgent?: () => void
}

export default function DiagnosisResultCard({
  result,
  previewUrl,
  showAlternatives,
  onToggleAlternatives,
  onReset,
  onSubmittedToAgent,
}: DiagnosisResultCardProps) {
  const tone = confidenceTone(result.confidence)
  const [sentForReview, setSentForReview] = useState(false)
  const [isSendingReview, setIsSendingReview] = useState(false)

  const handleSendForReview = () => {
    setIsSendingReview(true)
    setTimeout(() => {
      setIsSendingReview(false)
      setSentForReview(true)
      onSubmittedToAgent?.()
    }, 800)
  }

  return (
    <div className="bg-white rounded-2xl border border-border-subtle p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
        <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">summarize</span>
          <span>Kết quả chẩn đoán sơ bộ từ AI</span>
        </h2>
        <button
          onClick={onReset}
          className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[14px]">refresh</span>
          <span>Chẩn đoán ảnh khác</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Ảnh đã chẩn đoán"
            className="w-full sm:w-32 h-32 object-cover rounded-xl border border-border-subtle flex-shrink-0"
          />
        )}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-text-primary">{result.diseaseName}</h3>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tone.badgeBg} ${tone.text}`}>
              Mức độ: {result.severity}
            </span>
          </div>
          <p className="text-xs text-text-muted italic">{result.pathogen}</p>
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className={`font-bold ${tone.text}`}>{tone.label}</span>
              <span className={`font-extrabold ${tone.text}`}>{result.confidence}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-surface-secondary overflow-hidden">
              <div
                className={`h-full rounded-full ${tone.bar} transition-all`}
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI SAFETY COMPLIANCE BANNER */}
      <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/80 text-amber-900 text-xs leading-relaxed space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-950">
          <span className="material-symbols-outlined text-amber-600 text-[18px]">verified_user</span>
          <span>Lưu ý an toàn mùa vụ từ Đại lý Hai Thắng</span>
        </div>
        <p>
          Để đảm bảo an toàn tuyệt đối cho ruộng lúa và tránh xịt nhầm thuốc,{' '}
          <strong>kết quả sẽ được đại lý có quyền thẩm định kiểm tra trước khi gửi khuyến nghị thuốc cho bà con.</strong>
        </p>
      </div>

      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-2">
          Triệu chứng bệnh lá lúa được AI nhận diện
        </h4>
        <ul className="space-y-1.5 text-xs text-text-secondary">
          {result.symptomsDetected.map((s) => (
            <li key={s} className="flex items-start gap-2">
              <span className="material-symbols-outlined text-primary text-[15px] flex-shrink-0 mt-0.5">
                check_circle
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-2">
          Biện pháp canh tác &amp; xử lý an toàn ngay tại ruộng
        </h4>
        <ol className="space-y-1.5 text-xs text-text-secondary list-decimal list-inside">
          {result.treatmentSteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>

      <div className="border-t border-border-subtle pt-3">
        <button
          onClick={onToggleAlternatives}
          className="w-full flex items-center justify-between text-xs font-bold text-text-primary uppercase tracking-wider"
        >
          <span>Khả năng khác ({result.alternatives.length})</span>
          <span className="material-symbols-outlined text-[18px]">
            {showAlternatives ? 'expand_less' : 'expand_more'}
          </span>
        </button>
        {showAlternatives && (
          <div className="mt-2 space-y-1.5">
            {result.alternatives.map((alt) => (
              <div
                key={alt.name}
                className="flex items-center justify-between text-xs bg-surface-subtle rounded-lg px-3 py-2"
              >
                <span className="text-text-secondary">{alt.name}</span>
                <span className="font-semibold text-text-muted">{alt.confidence}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* HUMAN IN THE LOOP TRIGGER BUTTON */}
      <div className="border-t border-border-subtle pt-4">
        {sentForReview ? (
          <div className="p-4 rounded-xl bg-status-success-surface border border-status-success/30 flex items-start gap-2.5 text-sm text-status-success leading-relaxed">
            <span className="material-symbols-outlined text-[22px] flex-shrink-0 mt-0.5">task_alt</span>
            <div>
              <div className="font-bold">Đã chuyển ca chẩn đoán tới Đại lý Hai Thắng (#AI-2401)</div>
              <div className="text-xs mt-1 text-text-secondary">
                Trạng thái: <strong className="text-amber-700">Chờ đại lý kiểm tra kết quả</strong>.
                Sau khi đại lý kiểm tra xác nhận, danh mục thuốc phù hợp sẽ được hiển thị ngay tại đây và gửi thông báo về tài khoản của bà con.
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
                Yêu cầu phác đồ điều trị
              </span>
              <span className="text-[11px] text-text-muted">Đại lý: Hai Thắng (Thới Lai)</span>
            </div>
            <button
              type="button"
              onClick={handleSendForReview}
              disabled={isSendingReview}
              className="w-full h-11 bg-primary hover:bg-primary-hover text-white font-bold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>{isSendingReview ? 'Đang chuyển hình ảnh...' : 'Gửi để đại lý kiểm tra và lên đơn thuốc'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
