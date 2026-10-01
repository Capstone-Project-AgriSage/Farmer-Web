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
      <div className="bg-white border border-brand-dark/10 relative overflow-hidden aspect-[4/3] sm:aspect-[3/2] w-full group">
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 max-w-[65%] pointer-events-none">
          <span className="px-3 py-1.5 bg-brand-dark/90 backdrop-blur-sm text-white text-[11px] font-medium tracking-wide rounded-full flex items-center gap-1.5 w-fit shadow-sm">
            <span className="material-symbols-outlined text-[15px] shrink-0">verified</span> 
            <span className="line-clamp-1">Chính hãng {product.brand} 100%</span>
          </span>
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-brand-dark/80 border border-brand-dark/10 text-[10px] font-medium tracking-wide rounded-full w-fit shadow-sm">
            Tem chống giả QR
          </span>
        </div>
        
        <span
          className={`absolute bottom-4 right-4 px-3 py-1.5 ${tone.badgeBg} ${tone.text} text-[11px] font-medium tracking-wide rounded-full flex items-center gap-1.5 border border-white/50 z-10 shadow-sm max-w-[40%]`}
        >
          <span className={`w-2 h-2 rounded-full ${tone.dot} animate-pulse shrink-0`}></span>
          <span className="truncate">{product.stockLabel}</span>
        </span>
        
        <div className="w-full h-full absolute inset-0">
          <img
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
            src={product.image}
            onError={handleImageError}
          />
        </div>
      </div>
      <div className="bg-brand-light border border-brand-dark/10 p-4 space-y-3">
        <h4 className="text-xs tracking-[0.25em]  text-brand-dark/50 flex items-center gap-1.5">
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
