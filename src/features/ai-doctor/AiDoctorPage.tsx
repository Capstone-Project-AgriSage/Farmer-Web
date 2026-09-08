import { useEffect, useRef, useState } from 'react'
import Breadcrumb from '../../components/ui/Breadcrumb'
import ProductCard from '../../components/ui/ProductCard'
import { products } from '../../data/mockProducts'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { cropOptions, diagnosisScenarios, type CropValue, type DiagnosisScenario } from './diagnosisScenarios'

function confidenceTone(confidence: number) {
  if (confidence >= 85) {
    return {
      bar: 'bg-status-success',
      text: 'text-status-success',
      badgeBg: 'bg-status-success-surface',
      label: 'Độ tin cậy cao',
    }
  }
  if (confidence >= 60) {
    return {
      bar: 'bg-status-warning',
      text: 'text-status-warning',
      badgeBg: 'bg-status-warning-surface',
      label: 'Độ tin cậy trung bình',
    }
  }
  return {
    bar: 'bg-status-error',
    text: 'text-status-error',
    badgeBg: 'bg-status-error-surface',
    label: 'Độ tin cậy thấp',
  }
}

export default function AiDoctorPage() {
  useDocumentTitle('Bác sĩ cây trồng AI')

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [crop, setCrop] = useState<CropValue>('durian')
  const [symptomText, setSymptomText] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DiagnosisScenario | null>(null)
  const [showAlternatives, setShowAlternatives] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const applyFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(file))
    setResult(null)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    applyFile(e.dataTransfer.files?.[0])
  }

  const handleAnalyze = () => {
    if (!previewUrl) return
    setIsAnalyzing(true)
    setShowAlternatives(false)
    setTimeout(() => {
      setResult(diagnosisScenarios[crop])
      setIsAnalyzing(false)
    }, 1800)
  }

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setResult(null)
    setSymptomText('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const tone = result ? confidenceTone(result.confidence) : null
  const recommendedProducts = result
    ? products.filter((p) => p.diseaseTags?.includes(result.diseaseTag))
    : []

  return (
    <>
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Bác sĩ cây trồng AI' }]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            <span>Đột phá Trí Tuệ Nhân Tạo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mt-3">
            Bác Sĩ Cây Trồng AI - Chẩn Đoán Bệnh Trong 3 Giây
          </h1>
          <p className="text-sm text-text-secondary mt-2 leading-relaxed">
            Chụp ảnh vùng lá, cành hoặc rễ bị tổn thương, hệ thống AI của AgriSage sẽ phân tích mầm
            bệnh và gợi ý phác đồ điều trị. Hoàn toàn miễn phí cho bà con nông dân.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white rounded-2xl border border-border-subtle p-5 sm:p-6 shadow-sm space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-2">
                  1. Ảnh vùng cây bị bệnh
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative rounded-xl border-2 border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center text-center p-6 min-h-[220px] ${
                    isDragging ? 'border-primary bg-primary-light/40' : 'border-border-strong bg-surface-subtle hover:bg-surface-secondary'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => applyFile(e.target.files?.[0])}
                  />
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Ảnh cây trồng đã tải lên"
                      className="max-h-64 max-w-full object-contain rounded-lg"
                    />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-primary text-5xl">add_a_photo</span>
                      <p className="text-sm font-semibold text-text-primary mt-3">
                        Kéo thả ảnh vào đây hoặc bấm để chọn ảnh
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        Hỗ trợ JPG, PNG. Chụp rõ nét vị trí lá đốm, cháy bìa hay rễ thối.
                      </p>
                    </>
                  )}
                </div>
                {previewUrl && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-2 text-xs text-status-error hover:underline font-semibold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                    <span>Chọn ảnh khác</span>
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-2">
                  2. Loại cây trồng
                </label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value as CropValue)}
                  className="w-full px-3.5 py-2.5 text-sm bg-surface-subtle border border-border-subtle rounded-lg focus:outline-none focus:border-primary text-text-primary"
                >
                  {cropOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-2">
                  3. Mô tả triệu chứng (tùy chọn)
                </label>
                <textarea
                  value={symptomText}
                  onChange={(e) => setSymptomText(e.target.value)}
                  rows={3}
                  placeholder="Ví dụ: Lá xuất hiện đốm nâu từ 3 ngày nay, mưa nhiều tuần qua..."
                  className="w-full px-3.5 py-2.5 text-sm bg-surface-subtle border border-border-subtle rounded-lg focus:outline-none focus:border-primary text-text-primary resize-none"
                />
              </div>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!previewUrl || isAnalyzing}
                className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-bold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>AI đang phân tích ảnh...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">document_scanner</span>
                    <span>Chẩn đoán ngay</span>
                  </>
                )}
              </button>
            </div>

            {result && (
              <div className="bg-white rounded-2xl border border-border-subtle p-5 sm:p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                  <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">summarize</span>
                    <span>Kết quả chẩn đoán</span>
                  </h2>
                  <button
                    onClick={handleReset}
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
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tone?.badgeBg} ${tone?.text}`}>
                        Mức độ: {result.severity}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted italic">{result.pathogen}</p>
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={`font-bold ${tone?.text}`}>{tone?.label}</span>
                        <span className={`font-extrabold ${tone?.text}`}>{result.confidence}%</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-surface-secondary overflow-hidden">
                        <div
                          className={`h-full rounded-full ${tone?.bar} transition-all`}
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
                    onClick={() => setShowAlternatives((v) => !v)}
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
            )}
          </div>

          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
            <div className="bg-surface-secondary border border-border-subtle rounded-xl p-5 space-y-3">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">tips_and_updates</span>
                <span>Mẹo chụp ảnh chuẩn xác</span>
              </h4>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-status-success text-[16px] flex-shrink-0">
                    check_circle
                  </span>
                  <span>Chụp cận cảnh vùng lá/cành/rễ có dấu hiệu bất thường rõ nhất</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-status-success text-[16px] flex-shrink-0">
                    check_circle
                  </span>
                  <span>Chụp dưới ánh sáng tự nhiên, tránh ngược sáng hoặc quá tối</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-status-success text-[16px] flex-shrink-0">
                    check_circle
                  </span>
                  <span>Giữ máy ổn định, lấy nét rõ vào vùng bị bệnh</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-border-subtle p-5 shadow-sm flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-status-info-surface text-status-info flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[22px]">support_agent</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-text-primary">Cần kỹ sư xác nhận trực tiếp?</div>
                <div className="text-xs text-text-muted">Hỗ trợ miễn phí 7:00 - 20:00</div>
              </div>
              <a href="tel:19006828" className="font-extrabold text-primary text-sm hover:underline flex-shrink-0">
                1900 6828
              </a>
            </div>

            {result && (
              <div className="bg-white rounded-xl border border-border-subtle p-5 shadow-sm">
                <h4 className="text-sm font-bold text-text-primary mb-1">
                  Sản phẩm điều trị được gợi ý
                </h4>
                <p className="text-xs text-text-muted mb-4">
                  Phù hợp với chẩn đoán "{result.diseaseName}"
                </p>
                {recommendedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                    {recommendedProducts.map((p) => (
                      <ProductCard key={p.slug} product={p} />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-secondary">
                    Chưa có sản phẩm phù hợp trong danh mục hiện tại, vui lòng liên hệ hotline để
                    được tư vấn.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
