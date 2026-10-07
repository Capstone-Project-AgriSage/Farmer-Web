import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { parseStageLabel, riceStageOptions, type RiceStageValue } from '../model'
import type { DiagnosisStatus, PickedImage } from '../useDiagnosis'

interface UploadFormProps {
  image: PickedImage | null
  fileError: string | null
  status: DiagnosisStatus
  stage: RiceStageValue
  symptomText: string
  onFileSelected: (file: File | undefined) => void
  onResetImage: () => void
  onStageChange: (stage: RiceStageValue) => void
  onSymptomTextChange: (text: string) => void
  onAnalyze: () => void
}

const ANALYZING_STEPS = ['Đang nhận diện vùng bệnh trên lá…', 'Đối chiếu với các triệu chứng đã biết…', 'Đang tổng hợp gợi ý chẩn đoán…']

const formatSize = (bytes: number) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`)

function StepTitle({ number, children, hint }: { number: string; children: string; hint?: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-4">
      <span className="text-[13px] tracking-[0.16em] text-text-muted">{number}</span>
      <h2 className="text-lg md:text-xl font-normal tracking-tight text-text-primary">{children}</h2>
      {hint && <span className="text-[15px] text-text-secondary">{hint}</span>}
    </div>
  )
}

export default function UploadForm({ image, fileError, status, stage, symptomText, onFileSelected, onResetImage, onStageChange, onSymptomTextChange, onAnalyze }: UploadFormProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const analyzing = status === 'analyzing'

  // Cycle the status line while the diagnosis runs, so it is clear that something is happening.
  useEffect(() => {
    if (!analyzing) return
    const timer = setInterval(() => setStepIndex((i) => (i + 1) % ANALYZING_STEPS.length), 1800)
    return () => {
      clearInterval(timer)
      setStepIndex(0)
    }
  }, [analyzing])

  const openPicker = () => fileInputRef.current?.click()
  const onDropzoneKey = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openPicker()
    }
  }
  const pick = (file: File | undefined) => {
    onFileSelected(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  const canAnalyze = Boolean(image) && !analyzing

  return (
    <div className="bg-white border border-brand-dark/15 rounded-[var(--radius-surface)]">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />

      {/* 1. Photo */}
      <section className="p-5 sm:p-8">
        <StepTitle number="01">Ảnh chụp lá hoặc thân lúa</StepTitle>
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            pick(e.dataTransfer.files?.[0])
          }}
          {...(image
            ? {}
            : { role: 'button', tabIndex: 0, onClick: openPicker, onKeyDown: onDropzoneKey, 'aria-label': 'Chọn ảnh lá lúa từ máy', 'aria-describedby': 'photo-help' })}
          className={`focus-ring relative overflow-hidden rounded-[var(--radius-surface)] border-2 border-dashed transition-colors duration-[var(--dur-micro)] flex flex-col items-center justify-center text-center min-h-[260px] ${
            image ? 'border-brand-dark/15 bg-brand-light' : 'cursor-pointer p-6 ' + (isDragging ? 'border-primary bg-primary-subtle' : 'border-brand-dark/30 hover:border-brand-dark/60 bg-brand-cream')
          }`}
        >
          {image ? (
            <>
              <img src={image.url} alt="Ảnh lá lúa đã chọn" className={`w-full max-h-[360px] object-contain transition-opacity duration-[var(--dur-standard)] ${analyzing ? 'opacity-60' : 'opacity-100'}`} />
              {analyzing && (
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                  <div
                    className="scan-line absolute inset-0 border-b-2 border-primary"
                    style={{ background: 'linear-gradient(to bottom, transparent 82%, color-mix(in srgb, var(--color-primary) 35%, transparent) 100%)' }}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-primary-dark" style={{ fontSize: 48 }} aria-hidden="true">
                {isDragging ? 'download' : 'add_a_photo'}
              </span>
              <p className="mt-3 text-lg text-text-primary">{isDragging ? 'Thả ảnh vào đây' : 'Chụp hoặc chọn ảnh lá lúa'}</p>
              <p id="photo-help" className="mt-1 text-[15px] text-text-secondary max-w-sm">
                Kéo thả ảnh vào đây hoặc bấm để chọn. Chụp rõ vết đốm, cháy bìa mép lá hoặc bẹ chân lúa.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <span className="inline-flex items-center min-h-[44px] px-6 rounded-full bg-brand-dark text-white text-[15px]">Chọn ảnh</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    cameraInputRef.current?.click()
                  }}
                  className="focus-ring inline-flex items-center gap-2 min-h-[44px] px-6 rounded-full border border-brand-dark/30 text-text-primary text-[15px] hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden="true">
                    photo_camera
                  </span>
                  Chụp ảnh
                </button>
              </div>
            </>
          )}
        </div>

        {fileError && (
          <p role="alert" className="mt-3 flex items-start gap-2 text-[15px] text-status-error">
            <span className="material-symbols-outlined shrink-0" style={{ fontSize: 20 }} aria-hidden="true">
              error
            </span>
            {fileError}
          </p>
        )}

        {image && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[15px] text-text-secondary truncate max-w-[60%]">{image.name ? `${image.name}${image.size ? ` · ${formatSize(image.size)}` : ''}` : 'Ảnh mẫu'}</p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={openPicker} disabled={analyzing} className="focus-ring min-h-[44px] px-4 rounded-full border border-brand-dark/30 text-[15px] text-text-primary hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-colors disabled:opacity-45 disabled:cursor-not-allowed">
                Đổi ảnh
              </button>
              <button type="button" onClick={onResetImage} disabled={analyzing} className="focus-ring min-h-[44px] px-4 text-[15px] text-status-error hover:underline underline-offset-4 disabled:opacity-45 disabled:cursor-not-allowed">
                Xóa ảnh
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 2. Growth stage */}
      <section className="p-5 sm:p-8 border-t border-brand-dark/15">
        <StepTitle number="02">Giai đoạn sinh trưởng của lúa</StepTitle>
        <div role="radiogroup" aria-label="Giai đoạn sinh trưởng" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {riceStageOptions.map((option) => {
            const selected = option.value === stage
            const { name, days } = parseStageLabel(option.label)
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={analyzing}
                onClick={() => onStageChange(option.value)}
                className={`focus-ring text-left min-h-[72px] p-4 rounded-[var(--radius-surface)] border transition-colors duration-[var(--dur-micro)] disabled:cursor-not-allowed flex items-start justify-between gap-3 ${
                  selected ? 'border-brand-dark bg-brand-light' : 'border-brand-dark/25 hover:border-brand-dark/60'
                }`}
              >
                <span>
                  <span className="block text-base font-medium text-text-primary">{name}</span>
                  <span className="block mt-0.5 text-[15px] text-text-secondary">{days}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={`shrink-0 mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center ${selected ? 'border-brand-dark bg-brand-dark' : 'border-brand-dark/40'}`}
                >
                  {selected && <span className="w-2 h-2 rounded-full bg-white" />}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* 3. Symptoms */}
      <section className="p-5 sm:p-8 border-t border-brand-dark/15">
        <StepTitle number="03" hint="(tùy chọn)">
          Mô tả triệu chứng ngoài ruộng
        </StepTitle>
        <textarea
          value={symptomText}
          onChange={(e) => onSymptomTextChange(e.target.value)}
          disabled={analyzing}
          rows={4}
          aria-label="Mô tả triệu chứng ngoài ruộng"
          placeholder="Ví dụ: Vết mắt én xuất hiện sau đợt sương mù lạnh 3 ngày trước, ruộng đang bón thúc đợt 2..."
          className="focus-ring w-full px-4 py-3 text-base bg-white border border-brand-dark/25 rounded-[var(--radius-input)] text-text-primary placeholder:text-text-muted hover:border-brand-dark/60 focus:border-brand-dark transition-colors resize-none disabled:bg-brand-light"
        />
      </section>

      {/* Action: sticks to the bottom of the screen on phones so it is always in reach. */}
      <div className="sticky bottom-0 z-20 lg:static p-5 sm:p-8 pt-4 border-t border-brand-dark/15 bg-white rounded-b-[var(--radius-surface)]">
        {status === 'error' && (
          <div role="alert" className="mb-4 p-4 border border-status-error/40 bg-status-error-surface text-[15px] text-text-primary rounded-[var(--radius-surface)]">
            Chưa chẩn đoán được lần này. Ảnh và thông tin của bác vẫn còn nguyên, bác bấm thử lại nhé.
          </div>
        )}
        <button
          type="button"
          onClick={onAnalyze}
          disabled={!canAnalyze}
          aria-describedby="analyze-hint"
          className="focus-ring w-full min-h-[56px] rounded-full bg-brand-dark text-white hover:bg-brand-green text-base tracking-wide transition-colors flex items-center justify-center gap-2.5 disabled:opacity-45 disabled:cursor-not-allowed"
        >
          {analyzing ? (
            <>
              <span className="material-symbols-outlined animate-spin" style={{ fontSize: 22 }} aria-hidden="true">
                progress_activity
              </span>
              Đang phân tích…
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: 22 }} aria-hidden="true">
                document_scanner
              </span>
              {status === 'error' ? 'Thử lại' : status === 'result' ? 'Chẩn đoán lại' : 'Chẩn đoán bệnh lúa ngay'}
            </>
          )}
        </button>
        <p id="analyze-hint" role="status" aria-live="polite" className="mt-3 text-center text-[15px] text-text-secondary">
          {analyzing ? ANALYZING_STEPS[stepIndex] : image ? 'Sẵn sàng. Bác bấm nút để bắt đầu chẩn đoán.' : 'Bác cần chọn ảnh trước khi chẩn đoán.'}
        </p>
      </div>
    </div>
  )
}
