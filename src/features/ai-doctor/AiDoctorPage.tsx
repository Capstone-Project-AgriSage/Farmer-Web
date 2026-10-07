import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { LazyMotion, domAnimation } from 'framer-motion'
import Breadcrumb from '../../components/ui/Breadcrumb'
import Reveal from '../../components/ui/Reveal'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useMotionPolicy } from '../../motion/useMotionPolicy'
import { useDiagnosis } from './useDiagnosis'
import UploadForm from './components/UploadForm'
import DiagnosisResultCard from './components/DiagnosisResultCard'
import PhotoTipsCard from './components/PhotoTipsCard'
import HotlineCard from './components/HotlineCard'
import RecommendedProductsCard from './components/RecommendedProductsCard'

export default function AiDoctorPage() {
  useDocumentTitle('Bác sĩ cây trồng AI - Lúa Chuyên Biệt')
  const motionPolicy = useMotionPolicy()
  const diagnosis = useDiagnosis()
  const { image, status, outcome, sampleId } = diagnosis
  const resultRef = useRef<HTMLDivElement>(null)
  const previousStatus = useRef(status)

  // After a diagnosis finishes, bring the result into view and hand it focus (screen readers announce its heading).
  useEffect(() => {
    if (previousStatus.current === 'analyzing' && status === 'result') {
      resultRef.current?.scrollIntoView({ behavior: motionPolicy === 'none' ? 'auto' : 'smooth', block: 'start' })
      resultRef.current?.focus({ preventScroll: true })
    }
    previousStatus.current = status
  }, [status, motionPolicy])

  const review = outcome?.review
  const showResult = status === 'result' && outcome

  return (
    <LazyMotion features={domAnimation} strict>
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Bác sĩ cây trồng AI' }]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
        <Reveal y={16} className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div className="max-w-2xl">
            <p className="text-[13px] uppercase tracking-[0.16em] text-text-secondary mb-3">Chẩn đoán AI đề xuất · Chuyên biệt 5 bệnh lúa</p>
            <h1 className="text-[length:var(--type-h1)] leading-[var(--type-h1-lh)] font-light tracking-tight text-text-primary">Bác Sĩ Cây Trồng AI</h1>
            <p className="mt-3 text-base text-text-secondary leading-relaxed">
              Gửi ảnh lá lúa để nhận gợi ý chẩn đoán đạo ôn, bạc lá vi khuẩn, đốm nâu, khô vằn. Phác đồ được kỹ sư Hai Thắng thẩm định.
            </p>
          </div>
          <Link
            to="/ai-doctor/history"
            className="focus-ring inline-flex items-center gap-2 min-h-[44px] px-5 rounded-full border border-brand-dark/30 text-[15px] text-text-primary hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-colors self-start md:self-auto shrink-0"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden="true">
              history
            </span>
            Lịch sử ({diagnosis.historyCount} ca)
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-8">
            <Reveal y={20} delay={0.1}>
              <UploadForm
                image={image}
                fileError={diagnosis.fileError}
                status={status}
                stage={diagnosis.stage}
                symptomText={diagnosis.symptomText}
                onFileSelected={diagnosis.selectFile}
                onResetImage={diagnosis.reset}
                onStageChange={diagnosis.setStage}
                onSymptomTextChange={diagnosis.setSymptomText}
                onAnalyze={diagnosis.analyze}
              />
            </Reveal>

            {/* Demo cases: kept out of the way, the form above is the real flow. */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="text-[15px] text-text-secondary">Chưa có ảnh? Xem thử một ca đã được đại lý thẩm định:</p>
              <div className="flex flex-wrap gap-2">
                {diagnosis.sampleCases.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    aria-pressed={sampleId === sample.id}
                    onClick={() => diagnosis.loadSample(sample.id)}
                    className={`focus-ring min-h-[44px] px-4 rounded-full text-[15px] transition-colors ${
                      sampleId === sample.id ? 'bg-brand-dark text-white' : 'border border-brand-dark/25 text-text-primary hover:border-brand-dark/60'
                    }`}
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {showResult && (
              <div ref={resultRef} tabIndex={-1} className="scroll-mt-28 outline-none fade-swap">
                <DiagnosisResultCard
                  result={outcome.result}
                  previewUrl={image?.url ?? null}
                  showAlternatives={diagnosis.showAlternatives}
                  onToggleAlternatives={diagnosis.toggleAlternatives}
                  onReset={diagnosis.reset}
                  isInconclusive={review?.inconclusive}
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            {showResult && review && !review.inconclusive && (
              <RecommendedProductsCard
                diseaseName={outcome.result.diseaseName}
                reviewerName={review.reviewerName}
                reviewerNote={review.reviewerNote}
                products={review.products}
                isVerified={review.verified}
              />
            )}
            <PhotoTipsCard />
            <HotlineCard />
          </div>
        </div>
      </div>
    </LazyMotion>
  )
}
