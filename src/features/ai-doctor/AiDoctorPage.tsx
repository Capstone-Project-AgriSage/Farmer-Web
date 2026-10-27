import { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const location = useLocation()
  const diagnosis = useDiagnosis()
  const { image, status, diagnosisCase } = diagnosis
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

  const showResult = status === 'result' && diagnosisCase

  return (
    <LazyMotion features={domAnimation} strict>
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Bác sĩ cây trồng AI' }]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
        <Reveal y={16} className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div className="max-w-2xl">
            <p className="text-[13px] uppercase tracking-[0.16em] text-text-secondary mb-3">Chẩn đoán AI · Chuyên biệt 5 bệnh lúa</p>
            <h1 className="text-[length:var(--type-h1)] leading-[var(--type-h1-lh)] font-light tracking-tight text-text-primary">Bác Sĩ Cây Trồng AI</h1>
            <p className="mt-3 text-base text-text-secondary leading-relaxed">
              Gửi ảnh lá lúa, AI nhận diện đạo ôn, bạc lá, đốm nâu, khô vằn và cho kết quả ngay, kèm cách xử lý và sản phẩm gợi ý khi AI chắc chắn. Kết quả
              do AI dự đoán, chỉ để tham khảo.
            </p>
          </div>
          {diagnosis.isAuthenticated && (
            <Link
              to="/ai-doctor/history"
              className="focus-ring inline-flex items-center gap-2 min-h-[44px] px-5 rounded-full border border-brand-dark/30 text-[15px] text-text-primary hover:bg-brand-dark hover:text-white hover:border-brand-dark transition-colors self-start md:self-auto shrink-0"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden="true">
                history
              </span>
              Lịch sử{diagnosis.historyCount !== null ? ` (${diagnosis.historyCount} ca)` : ''}
            </Link>
          )}
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
                needsSignIn={!diagnosis.isAuthenticated}
                onSignIn={() => navigate('/login', { state: { from: location } })}
                submitError={diagnosis.submitError}
              />
            </Reveal>

            {showResult && (
              <div ref={resultRef} tabIndex={-1} className="scroll-mt-28 outline-none fade-swap">
                <DiagnosisResultCard
                  diagnosisCase={diagnosisCase}
                  previewUrl={image?.url ?? diagnosisCase.image?.imageUrl ?? null}
                  onNewPhoto={diagnosis.reset}
                  onRetry={diagnosis.retry}
                  retrying={diagnosis.retrying}
                  retryError={diagnosis.retryError}
                  headerAction={
                    <Link to={`/ai-doctor/cases/${diagnosisCase.id}`} className="focus-ring inline-flex items-center min-h-[44px] text-[15px] text-primary-dark hover:underline underline-offset-4">
                      Xem chi tiết ca
                    </Link>
                  }
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            {showResult && diagnosisCase.result && <RecommendedProductsCard result={diagnosisCase.result} />}
            <PhotoTipsCard />
            <HotlineCard />
          </div>
        </div>
      </div>
    </LazyMotion>
  )
}
