import type { RefObject } from 'react'
import { riceStageOptions, type RiceStageValue } from '../diagnosisScenarios'
import Spinner from '../../../components/ui/Spinner'

interface UploadFormProps {
  previewUrl: string | null
  fileInputRef: RefObject<HTMLInputElement | null>
  isDragging: boolean
  onDragStateChange: (dragging: boolean) => void
  onFileSelected: (file: File | undefined) => void
  onResetImage: () => void
  riceStage: RiceStageValue
  onRiceStageChange: (stage: RiceStageValue) => void
  symptomText: string
  onSymptomTextChange: (text: string) => void
  isAnalyzing: boolean
  onAnalyze: () => void
}

export default function UploadForm({
  previewUrl,
  fileInputRef,
  isDragging,
  onDragStateChange,
  onFileSelected,
  onResetImage,
  riceStage,
  onRiceStageChange,
  symptomText,
  onSymptomTextChange,
  isAnalyzing,
  onAnalyze,
}: UploadFormProps) {
  return (
    <div className="bg-white rounded-2xl border border-border-subtle p-5 sm:p-6 shadow-sm space-y-5">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-2">
          1. Ảnh chụp lá hoặc thân lúa bị bệnh
        </label>
        <div
          onDragOver={(e) => {
            e.preventDefault()
            onDragStateChange(true)
          }}
          onDragLeave={() => onDragStateChange(false)}
          onDrop={(e) => {
            e.preventDefault()
            onDragStateChange(false)
            onFileSelected(e.dataTransfer.files?.[0])
          }}
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
            onChange={(e) => onFileSelected(e.target.files?.[0])}
          />
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Ảnh lá lúa đã tải lên"
              className="max-h-64 max-w-full object-contain rounded-lg"
            />
          ) : (
            <>
              <span className="material-symbols-outlined text-primary text-5xl">add_a_photo</span>
              <p className="text-sm font-semibold text-text-primary mt-3">
                Kéo thả ảnh vào đây hoặc bấm để chọn ảnh lá lúa
              </p>
              <p className="text-xs text-text-muted mt-1">
                Hỗ trợ JPG, PNG. Chụp rõ nét vết mắt én, đốm nâu, cháy bìa mép lá hoặc bẹ chân lúa.
              </p>
            </>
          )}
        </div>
        {previewUrl && (
          <button
            type="button"
            onClick={onResetImage}
            className="mt-2 text-xs text-status-error hover:underline font-semibold flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">delete</span>
            <span>Chọn ảnh khác</span>
          </button>
        )}
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-2">
          2. Giai đoạn sinh trưởng của cây lúa
        </label>
        <select
          value={riceStage}
          onChange={(e) => onRiceStageChange(e.target.value as RiceStageValue)}
          className="w-full px-3.5 py-2.5 text-sm bg-surface-subtle border border-border-subtle rounded-lg focus:outline-none focus:border-primary text-text-primary"
        >
          {riceStageOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-text-primary mb-2">
          3. Mô tả triệu chứng đồng ruộng (tùy chọn)
        </label>
        <textarea
          value={symptomText}
          onChange={(e) => onSymptomTextChange(e.target.value)}
          rows={3}
          placeholder="Ví dụ: Vết mắt én xuất hiện sau đợt sương mù lạnh 3 ngày trước, ruộng đang bón thúc đợt 2..."
          className="w-full px-3.5 py-2.5 text-sm bg-surface-subtle border border-border-subtle rounded-lg focus:outline-none focus:border-primary text-text-primary resize-none"
        />
      </div>

      <button
        type="button"
        onClick={onAnalyze}
        disabled={!previewUrl || isAnalyzing}
        className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-bold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? (
          <>
            <Spinner />
            <span>AI đang phân tích mô bệnh lá lúa...</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[20px]">document_scanner</span>
            <span>Chẩn đoán bệnh lúa ngay</span>
          </>
        )}
      </button>
    </div>
  )
}
