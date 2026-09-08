import { useEffect, useRef, useState } from 'react'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { products } from '../../data/mockProducts'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { diagnosisScenarios, type CropValue, type DiagnosisScenario } from './diagnosisScenarios'
import UploadForm from './components/UploadForm'
import DiagnosisResultCard from './components/DiagnosisResultCard'
import PhotoTipsCard from './components/PhotoTipsCard'
import HotlineCard from './components/HotlineCard'
import RecommendedProductsCard from './components/RecommendedProductsCard'

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
            <UploadForm
              previewUrl={previewUrl}
              fileInputRef={fileInputRef}
              isDragging={isDragging}
              onDragStateChange={setIsDragging}
              onFileSelected={applyFile}
              onResetImage={handleReset}
              crop={crop}
              onCropChange={setCrop}
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
            <PhotoTipsCard />
            <HotlineCard />
            {result && (
              <RecommendedProductsCard diseaseName={result.diseaseName} products={recommendedProducts} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
