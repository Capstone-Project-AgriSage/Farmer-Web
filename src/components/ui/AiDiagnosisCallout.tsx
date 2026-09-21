import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface AiDiagnosisCalloutProps {
  title: string
  subtitle: string
}

export default function AiDiagnosisCallout({ title, subtitle }: AiDiagnosisCalloutProps) {
  return (
    <div className="mt-10 border border-brand-dark/10 bg-brand-light p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div className="space-y-2 max-w-xl">
        <p className="text-xs tracking-[0.25em] uppercase text-brand-dark/50">Bác sĩ cây trồng AI</p>
        <h4 className="text-lg md:text-xl text-brand-dark tracking-tight font-helvetica-neue leading-snug">
          {title}
        </h4>
        <p className="text-sm text-brand-dark/60 leading-relaxed">{subtitle}</p>
      </div>
      <Link
        to="/ai-doctor"
        className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark hover:bg-brand-green text-white text-sm tracking-wide uppercase rounded-full transition-colors whitespace-nowrap"
      >
        Quét lá với AI
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  )
}
