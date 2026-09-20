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
    <div className="bg-white border border-brand-dark/10 p-5 sm:p-6 space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-brand-dark/10">
        <h2 className="text-base font-helvetica-neue tracking-tight text-brand-dark flex items-center gap-2">
          <span className="material-symbols-outlined text-brand-green text-[20px]">summarize</span>
          <span>Kết quả nhận diện ban đầu từ AI Vision</span>
        </h2>
        <button
          onClick={onReset}
          className="text-xs text-brand-green hover:text-brand-dark hover:underline flex items-center gap-1 transition-colors"
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
            className="w-full sm:w-32 h-32 object-cover border border-brand-dark/10 flex-shrink-0"
          />
        )}
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-helvetica-neue tracking-tight text-brand-dark">{result.diseaseName}</h3>
            <span className={`px-2 py-0.5 text-[10px] tracking-wide uppercase ${tone.badgeBg} ${tone.text}`}>
              Mức độ: {result.severity}
            </span>
          </div>
          <p className="text-xs text-brand-dark/50 italic">{result.pathogen}</p>
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className={`${tone.text}`}>{tone.label}</span>
              <span className={`${tone.text}`}>{result.confidence}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-brand-light overflow-hidden">
              <div
                className={`h-full rounded-full ${tone.bar} transition-all`}
                style={{ width: `${result.confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI SAFETY COMPLIANCE BANNER */}
      <div className="p-4 border border-amber-300/60 bg-amber-50/80 text-amber-900 text-xs leading-relaxed space-y-2">
        <div className="flex items-center gap-2 text-amber-950 tracking-wide">
          <span className="material-symbols-outlined text-amber-600 text-[18px]">verified_user</span>
          <span>Chính sách An toàn Nông nghiệp AgriSage (Human-in-the-Loop)</span>
        </div>
        <p>
          Để đảm bảo an toàn tuyệt đối cho ruộng lúa và tránh nguy cơ kháng thuốc hoặc dùng sai hoạt chất,{' '}
          <strong>danh mục thuốc BVTV &amp; phân bón thương mại chỉ được hiển thị sau khi Đại lý Hai Thắng thẩm định trực tiếp hình ảnh.</strong>
        </p>
      </div>

      <div>
        <h4 className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-2">
          Triệu chứng bệnh lá lúa được AI nhận diện
        </h4>
        <ul className="space-y-1.5 text-xs text-brand-dark/60">
          {result.symptomsDetected.map((s) => (
            <li key={s} className="flex items-start gap-2">
              <span className="material-symbols-outlined text-brand-green text-[15px] flex-shrink-0 mt-0.5">
                check_circle
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-2">
          Biện pháp canh tác &amp; xử lý an toàn ngay tại ruộng
        </h4>
        <ol className="space-y-1.5 text-xs text-brand-dark/60 list-decimal list-inside">
          {result.treatmentSteps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>

      <div className="border-t border-brand-dark/10 pt-3">
        <button
          onClick={onToggleAlternatives}
          className="w-full flex items-center justify-between text-xs tracking-[0.25em] uppercase text-brand-dark/50"
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
                className="flex items-center justify-between text-xs bg-brand-light border border-brand-dark/10 px-3 py-2"
              >
                <span className="text-brand-dark/60">{alt.name}</span>
                <span className="text-brand-dark/50">{alt.confidence}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* HUMAN IN THE LOOP TRIGGER BUTTON */}
      <div className="border-t border-brand-dark/10 pt-4">
        {sentForReview ? (
          <div className="p-4 bg-brand-light border border-brand-dark/10 flex items-start gap-2.5 text-sm text-brand-dark leading-relaxed">
            <span className="material-symbols-outlined text-brand-green text-[22px] flex-shrink-0 mt-0.5">task_alt</span>
            <div>
              <div className="font-helvetica-neue tracking-tight">Đã chuyển ca chẩn đoán tới Đại lý Hai Thắng (#AI-2401)</div>
              <div className="text-xs mt-1 text-brand-dark/60">
                Trạng thái: <strong className="text-amber-700">Chờ đại lý duyệt phác đồ thương mại</strong>.
                Sau khi thẩm định viên xác nhận, thuốc đặc trị sẽ được hiển thị ngay tại đây và gửi thông báo về tài khoản của bà con.
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-[0.25em] uppercase text-brand-dark/50">
                Yêu cầu phác đồ thương mại
              </span>
              <span className="text-[11px] text-brand-dark/50">Đại lý: Hai Thắng (Thới Lai)</span>
            </div>
            <button
              type="button"
              onClick={handleSendForReview}
              disabled={isSendingReview}
              className="w-full h-11 rounded-full bg-brand-dark text-white hover:bg-brand-green tracking-wide uppercase text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>{isSendingReview ? 'Đang chuyển hình ảnh...' : 'Gửi đại lý Hai Thắng duyệt nhanh thuốc điều trị'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
