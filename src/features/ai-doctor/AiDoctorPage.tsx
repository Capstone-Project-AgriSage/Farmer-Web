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
  }

  const handleAnalyze = () => {
    if (!previewUrl) return
    setIsAnalyzing(true)
    setShowAlternatives(false)
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
    setSymptomText('')
    setIsAnalyzing(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const isInconclusive = result ? result.confidence < 70 : false
  const recommendedProducts = result && !isInconclusive
    ? products.filter((p) => p.diseaseTags?.includes(result.diseaseTag))
    : []

  return (
    <>
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Bác sĩ cây trồng AI' }]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 bg-brand-cream">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-helvetica-neue tracking-tight text-brand-dark">
            Bác Sĩ Cây Trồng AI
          </h1>
          <Link
            to="/ai-doctor/history"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 border border-brand-dark/15 bg-white text-brand-dark/80 hover:border-brand-dark/30 hover:text-brand-dark tracking-wide uppercase text-sm rounded-full transition-colors self-start sm:self-auto shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
            <span>Lịch sử ({mockDiagnosisCases.length} ca)</span>
          </Link>
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
              <DiagnosisResultCard
                result={result}
                previewUrl={previewUrl}
                showAlternatives={showAlternatives}
                onToggleAlternatives={() => setShowAlternatives((v) => !v)}
                onReset={handleReset}
                isInconclusive={isInconclusive}
              />
            )}
          </div>

          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
            {result && !isInconclusive && (
              <RecommendedProductsCard
                diseaseName={result.diseaseName}
                products={recommendedProducts}
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
