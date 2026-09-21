import { handleImageError } from '../../../utils/image'
import { stockStatusTone } from '../../../utils/stockStatus'
import type { Product } from '../../../types'

const guarantees: [string, string][] = [
  ['check_circle', 'Bảo lãnh mùa vụ chính hãng'],
  ['assignment_return', 'Đổi trả miễn phí 7 ngày'],
  ['support_agent', 'Kỹ sư tư vấn nông học 24/7'],
  ['local_shipping', 'Giao tận vườn hỏa tốc 2-4h'],
]

export default function ProductImagePanel({ product }: { product: Product }) {
  const tone = stockStatusTone(product.stockStatus)

  return (
    <div className="lg:col-span-5 flex flex-col gap-5">
      <div className="bg-white border border-brand-dark/10 p-6 relative overflow-hidden flex items-center justify-center min-h-[420px]">
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="px-2.5 py-1 bg-brand-dark text-white text-[11px] tracking-wide rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified</span> Chính hãng{' '}
            {product.brand} 100%
          </span>
          <span className="px-2.5 py-0.5 bg-brand-light text-brand-dark/70 border border-brand-dark/10 text-[10px] tracking-wide rounded-full">
            Tem chống giả QR
          </span>
        </div>
        <span
          className={`absolute top-16 left-3 sm:top-3 sm:left-auto sm:right-3 px-2.5 py-1 ${tone.badgeBg} ${tone.text} text-xs tracking-wide rounded-full flex items-center gap-1 border border-current/20`}
        >
          <span className={`w-2 h-2 rounded-full ${tone.dot} animate-pulse`}></span>{' '}
          {product.stockLabel}
        </span>
        <div className="w-full h-80 flex items-center justify-center p-2">
          <img
            alt={product.name}
            className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
            src={product.image}
            onError={handleImageError}
          />
        </div>
      </div>
      <div className="bg-brand-light border border-brand-dark/10 p-4 space-y-3">
        <h4 className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-brand-dark/60 text-[18px]">shield</span>
          <span>Cam kết phân phối từ AgriSage</span>
        </h4>
        <div className="grid grid-cols-2 gap-2.5 text-xs text-brand-dark/60">
          {guarantees.map(([icon, label]) => (
            <div key={label} className="flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-green text-[18px]">{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
