import { Link } from 'react-router-dom'

interface AiDiagnosisCalloutProps {
  title: string
  subtitle: string
}

export default function AiDiagnosisCallout({ title, subtitle }: AiDiagnosisCalloutProps) {
  return (
    <div className="mt-8 rounded-2xl bg-gradient-to-r from-emerald-50 via-surface-secondary to-primary-light border border-primary/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-md flex-shrink-0">
          <span className="material-symbols-outlined text-[26px]">psychology</span>
        </div>
        <div>
          <h4 className="text-sm sm:text-base font-bold text-text-primary">{title}</h4>
          <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>
        </div>
      </div>
      <Link
        to="/ai-doctor"
        className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 whitespace-nowrap"
      >
        <span className="material-symbols-outlined text-[18px]">photo_camera</span>
        <span>Quét lá cây với AI</span>
      </Link>
    </div>
  )
}
