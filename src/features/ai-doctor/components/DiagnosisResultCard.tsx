import { confidenceTone, type DiagnosisScenario } from '../diagnosisScenarios'

interface DiagnosisResultCardProps {
  result: DiagnosisScenario
  previewUrl: string | null
  showAlternatives: boolean
  onToggleAlternatives: () => void
  onReset: () => void
}

export default function DiagnosisResultCard({
  result,
  previewUrl,
  showAlternatives,
  onToggleAlternatives,
  onReset,
}: DiagnosisResultCardProps) {
  const tone = confidenceTone(result.confidence)

  return (
    <div className="bg-white rounded-2xl border border-border-subtle p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
        <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">summarize</span>
          <span>Kết quả chẩn đoán</span>
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

      <div
        className={`p-3.5 rounded-lg border text-xs leading-relaxed flex items-start gap-2 ${
          result.confidence >= 60
            ? 'bg-status-info-surface border-status-info/20 text-status-info'
            : 'bg-status-error-surface border-status-error/20 text-status-error'
        }`}
      >
        <span className="material-symbols-outlined text-[16px] flex-shrink-0 mt-0.5">
          {result.confidence >= 60 ? 'info' : 'warning'}
        </span>
        <span>
          {result.confidence >= 60
            ? 'Kết quả AI chỉ mang tính chất tham khảo hỗ trợ ra quyết định. Trường hợp bệnh nặng hoặc lan rộng, bà con nên liên hệ kỹ sư nông học qua hotline 1900 6828 để được xác nhận trước khi xử lý diện rộng.'
            : 'Độ tin cậy dưới 60% — ảnh chưa đủ rõ để AI kết luận chắc chắn. Vui lòng chụp lại cận cảnh vùng bệnh hoặc gọi ngay hotline 1900 6828 để kỹ sư nông học hỗ trợ trực tiếp trước khi phun thuốc.'}
        </span>
      </div>

      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-2">
          Triệu chứng AI nhận diện
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
          Phác đồ điều trị đề xuất
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
    </div>
  )
}
