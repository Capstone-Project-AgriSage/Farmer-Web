import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { products } from '../../data/mockProducts'
import { mockDiagnosisCases } from '../../data/mockDiagnosisCases'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { diagnosisScenarios, type RiceStageValue, type DiagnosisScenario } from './diagnosisScenarios'
import UploadForm from './components/UploadForm'
import DiagnosisResultCard from './components/DiagnosisResultCard'
import PhotoTipsCard from './components/PhotoTipsCard'
import HotlineCard from './components/HotlineCard'
import RecommendedProductsCard from './components/RecommendedProductsCard'

export default function AiDoctorPage() {
  useDocumentTitle('Bác sĩ cây trồng AI - Lúa Chuyên Biệt')

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [riceStage, setRiceStage] = useState<RiceStageValue>('tillering')
  const [symptomText, setSymptomText] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<DiagnosisScenario | null>(null)
  const [showAlternatives, setShowAlternatives] = useState(false)
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const analyzeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const scrollToResultRef = useRef(false)

  useEffect(() => {
    return () => {
      if (previewUrl && !previewUrl.startsWith('http')) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  useEffect(() => {
    return () => {
      if (analyzeTimeoutRef.current) clearTimeout(analyzeTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (!result || !scrollToResultRef.current) return
    scrollToResultRef.current = false
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [result])

  const applyFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return
    if (previewUrl && !previewUrl.startsWith('http')) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(file))
    setResult(null)
    setSelectedCaseId(null)
  }

  const handleAnalyze = () => {
    if (!previewUrl) return
    setIsAnalyzing(true)
    setShowAlternatives(false)
    setSelectedCaseId(null)
    if (analyzeTimeoutRef.current) clearTimeout(analyzeTimeoutRef.current)
    analyzeTimeoutRef.current = setTimeout(() => {
      scrollToResultRef.current = true
      setResult(diagnosisScenarios[riceStage])
      setIsAnalyzing(false)
      analyzeTimeoutRef.current = null
    }, 1500)
  }

  const handleReset = () => {
    if (analyzeTimeoutRef.current) {
      clearTimeout(analyzeTimeoutRef.current)
      analyzeTimeoutRef.current = null
    }
    if (previewUrl && !previewUrl.startsWith('http')) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setResult(null)
    setSelectedCaseId(null)
    setSymptomText('')
    setIsAnalyzing(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSelectVerifiedCase = (caseItem: (typeof mockDiagnosisCases)[number]) => {
    setPreviewUrl(caseItem.imageUrl)
    setSelectedCaseId(caseItem.id)
    setResult({
      diseaseId: caseItem.predictedDiseaseId as any,
      diseaseName: caseItem.verifiedDiseaseName ?? caseItem.predictedDiseaseName,
      pathogen: 'Tác nhân đã được đại lý kiểm chứng',
      confidence: caseItem.aiConfidence,
      severity: 'Trung bình',
      symptomsDetected: [
        'Vết bệnh đặc trưng trên phiến lá lúa',
        'Hình ảnh thực tế từ đồng ruộng Thới Lai, Cần Thơ',
      ],
      treatmentSteps: [
        'Giữ mực nước ruộng 3-5cm, tránh ngập úng hoặc cạn nứt',
        'Không bón đạm khi ruộng đang nhiễm bệnh',
        'Phun hoạt chất được thẩm định viên khuyến cáo',
      ],
      alternatives: [],
      diseaseTag: caseItem.predictedDiseaseId,
    })
  }

  const selectedCase = mockDiagnosisCases.find((c) => c.id === selectedCaseId)
  const isVerifiedCase = selectedCase?.status === 'CONFIRMED' || selectedCase?.status === 'CORRECTED'
  const isInconclusive = selectedCase ? selectedCase.status === 'INCONCLUSIVE' : (result ? result.confidence < 70 : false)
  const recommendedProducts = isVerifiedCase
    ? selectedCase.recommendedProducts
    : (result && !isInconclusive)
      ? products.filter((p) => p.diseaseTags?.includes(result.diseaseTag))
      : []

  return (
    <>
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Bác sĩ cây trồng AI' }]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 bg-brand-cream">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 font-helvetica-neue">
              Chẩn đoán AI đề xuất · Chuyên biệt 5 bệnh lúa
            </p>
            <h1 className="text-2xl sm:text-3xl font-helvetica-neue tracking-tight text-brand-dark mt-1.5">
              Bác Sĩ Cây Trồng AI
            </h1>
            <p className="text-xs sm:text-sm text-brand-dark/60 mt-1">
              Chẩn đoán tức thì đạo ôn, bạc lá vi khuẩn, đốm nâu, khô vằn. Phác đồ được kỹ sư Hai Thắng thẩm định.
            </p>
          </div>
          <Link
            to="/ai-doctor/history"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-brand-dark/15 bg-white text-brand-dark/80 hover:border-brand-dark/30 hover:text-brand-dark tracking-wide uppercase text-sm rounded-full transition-colors self-start sm:self-auto shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
            <span>Lịch sử ({mockDiagnosisCases.length} ca)</span>
          </Link>
        </div>

        {/* QUICK SAMPLE SELECTOR */}
        <div className="bg-white p-3.5 border border-brand-dark/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-brand-dark/60">
            <span className="material-symbols-outlined text-brand-green text-[18px]">collections_bookmark</span>
            <span>Thử nhanh mẫu lá bệnh thực tế:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {mockDiagnosisCases.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectVerifiedCase(c)}
                className={`px-3 py-1 rounded-full text-xs tracking-wide uppercase border transition-colors ${selectedCaseId === c.id
                    ? 'bg-brand-dark text-white border-brand-dark'
                    : 'bg-brand-light text-brand-dark/70 border-brand-dark/10 hover:border-brand-dark/30 hover:text-brand-dark'
                  }`}
              >
                {c.predictedDiseaseName}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-5">
            <UploadForm
              previewUrl={previewUrl}
              fileInputRef={fileInputRef}
              isDragging={isDragging}
              onDragStateChange={setIsDragging}
              onFileSelected={applyFile}
              onResetImage={handleReset}
              riceStage={riceStage}
              onRiceStageChange={setRiceStage}
              symptomText={symptomText}
              onSymptomTextChange={setSymptomText}
              isAnalyzing={isAnalyzing}
              onAnalyze={handleAnalyze}
            />

            {result && (
              <div ref={resultRef} className="scroll-mt-24">
                <DiagnosisResultCard
                  result={result}
                  previewUrl={previewUrl}
                  showAlternatives={showAlternatives}
                  onToggleAlternatives={() => setShowAlternatives((v) => !v)}
                  onReset={handleReset}
                  isInconclusive={isInconclusive}
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
            {result && !isInconclusive && (
              <RecommendedProductsCard
                diseaseName={result.diseaseName}
                reviewerName={selectedCase?.reviewerName}
                reviewerNote={selectedCase?.reviewerNote}
                products={recommendedProducts}
                isVerified={isVerifiedCase}
              />
            )}
            <PhotoTipsCard />
            <HotlineCard />
          </div>
        </div>
      </div>
    </>
  )
}
