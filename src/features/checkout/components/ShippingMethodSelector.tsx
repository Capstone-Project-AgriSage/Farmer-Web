export type ShippingMethod = 'truck' | 'express'

interface ShippingMethodSelectorProps {
  shippingMethod: ShippingMethod
  onShippingMethodChange: (method: ShippingMethod) => void
}

export default function ShippingMethodSelector({
  shippingMethod,
  onShippingMethodChange,
}: ShippingMethodSelectorProps) {
  return (
    <div className="bg-white border border-brand-dark/10 p-5 sm:p-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-brand-dark/10 mb-4">
        <div className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center text-sm">
          2
        </div>
        <h2 className="text-base font-helvetica-neue tracking-tight text-brand-dark">
          Phương thức vận chuyển vật tư
        </h2>
      </div>
      <div className="space-y-3">
        <label
          onClick={() => onShippingMethodChange('truck')}
          className={`relative flex items-start justify-between p-4 cursor-pointer transition-colors ${
            shippingMethod === 'truck'
              ? 'border border-brand-dark bg-brand-light'
              : 'border border-brand-dark/10 hover:bg-brand-cream'
          }`}
        >
          <div className="flex items-start gap-3">
            <input
              readOnly
              checked={shippingMethod === 'truck'}
              className="text-brand-dark focus:ring-0 mt-0.5 w-4 h-4 accent-brand-dark"
              name="shipping_method"
              type="radio"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-brand-dark">Xe tải giao tận vườn AgriExpress</span>
                <span className="px-2 py-0.5 rounded-full bg-brand-dark text-white text-[10px] tracking-wide uppercase">
                  Miễn phí
                </span>
              </div>
              <p className="text-xs text-brand-dark/60 mt-1">
                Chuyên chở phân bón, bao nặng 50kg, hỗ trợ bốc xếp xuống tận kho vườn.
              </p>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-brand-green">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                Dự kiến giao: Sáng mai (trước 11h)
              </div>
            </div>
          </div>
          <span className="text-xs text-brand-green uppercase sm:text-sm tracking-wide">0 đ</span>
        </label>
        <label
          onClick={() => onShippingMethodChange('express')}
          className={`relative flex items-start justify-between p-4 cursor-pointer transition-colors ${
            shippingMethod === 'express'
              ? 'border border-brand-dark bg-brand-light'
              : 'border border-brand-dark/10 hover:bg-brand-cream'
          }`}
        >
          <div className="flex items-start gap-3">
            <input
              readOnly
              checked={shippingMethod === 'express'}
              className="text-brand-dark focus:ring-0 mt-0.5 w-4 h-4 accent-brand-dark"
              name="shipping_method"
              type="radio"
            />
            <div>
              <span className="text-xs text-brand-dark">Giao hỏa tốc xe ba gác / Bán tải cơ động</span>
              <p className="text-xs text-brand-dark/60 mt-1">
                Giao nhanh trong 2 - 4 giờ cho trường hợp cần phun trừ bệnh khẩn cấp.
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-brand-dark/50">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                Giao ngay trong ngày
              </div>
            </div>
          </div>
          <span className="text-xs text-brand-dark">+45.000 đ</span>
        </label>
      </div>
    </div>
  )
}
