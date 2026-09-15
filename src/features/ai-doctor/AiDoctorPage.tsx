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
  const isVerifiedCase = selectedCase?.status === 'VERIFIED'
  const recommendedProducts = isVerifiedCase
    ? selectedCase.recommendedProducts
    : result
      ? products.filter((p) => p.diseaseTags?.includes(result.diseaseTag))
      : []

  return (
    <>
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Bác sĩ cây trồng AI' }]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">psychology</span>
              <span>AI Vision v2.1 • Chuyên Biệt 5 Bệnh Lúa</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mt-3">
              Bác Sĩ Cây Trồng AI - Thẩm Định Bệnh Lúa ĐBSCL
            </h1>
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
              Chẩn đoán tức thì 5 bệnh phổ biến trên lúa (Đạo ôn, Bạc lá vi khuẩn, Đốm nâu, Khô vằn, Lúa khỏe).
              Tuân thủ an toàn nông nghiệp: thuốc điều trị được Đại lý Hai Thắng thẩm định trước khi mở bán.
            </p>
          </div>
          <Link
            to="/account?tab=diagnosis"
            className="inline-flex items-center justify-center gap-1.5 self-end px-4 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold text-sm rounded-lg shadow-sm transition-all shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span>Xem sổ chẩn đoán ({mockDiagnosisCases.length} ca)</span>
          </Link>
        </div>

        {/* QUICK CASE SELECTOR FROM REALISTIC HISTORY */}
        <div className="mt-6 p-4 rounded-xl bg-surface-subtle border border-border-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-text-primary font-medium">
            <span className="material-symbols-outlined text-primary text-[18px]">bookmark</span>
            <span>Mẫu ca đồng ruộng thực tế:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {mockDiagnosisCases.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectVerifiedCase(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  selectedCaseId === c.id
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-white text-text-secondary border-border-subtle hover:border-primary hover:text-primary'
                }`}
              >
                #{c.id} • {c.predictedDiseaseName} ({c.status === 'VERIFIED' ? 'Đã duyệt' : c.status === 'REJECTED_INCONCLUSIVE' ? 'Ảnh mờ' : 'Chờ duyệt'})
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
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
              <DiagnosisResultCard
                result={result}
                previewUrl={previewUrl}
                showAlternatives={showAlternatives}
                onToggleAlternatives={() => setShowAlternatives((v) => !v)}
                onReset={handleReset}
              />
            )}
          </div>

          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
            {result && (
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
