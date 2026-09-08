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
    <div className="bg-white rounded-2xl border border-border-subtle p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2.5 pb-4 border-b border-border-subtle mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-primary flex items-center justify-center font-bold text-sm">2</div>
        <h2 className="text-base font-bold text-text-primary">Phương thức vận chuyển vật tư</h2>
      </div>
      <div className="space-y-3">
        <label
          onClick={() => onShippingMethodChange('truck')}
          className={`relative flex items-start justify-between p-4 rounded-xl cursor-pointer ${
            shippingMethod === 'truck'
              ? 'border-2 border-primary bg-emerald-50/40'
              : 'border border-border-subtle hover:bg-surface-subtle transition-colors'
          }`}
        >
          <div className="flex items-start gap-3">
            <input readOnly checked={shippingMethod === 'truck'} className="text-primary focus:ring-0 mt-0.5 w-4 h-4" name="shipping_method" type="radio" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-primary">Xe tải giao tận vườn AgriExpress</span>
                <span className="px-2 py-0.5 rounded bg-status-success text-white font-bold text-[10px]">MIỄN PHÍ</span>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                Chuyên chở phân bón, bao nặng 50kg, hỗ trợ bốc xếp xuống tận kho vườn.
              </p>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-primary font-semibold">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                Dự kiến giao: Sáng mai (trước 11h)
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-status-success uppercase sm:text-sm">0 đ</span>
        </label>
        <label
          onClick={() => onShippingMethodChange('express')}
          className={`relative flex items-start justify-between p-4 rounded-xl cursor-pointer transition-colors ${
            shippingMethod === 'express' ? 'border-2 border-primary bg-emerald-50/40' : 'border border-border-subtle hover:bg-surface-subtle'
          }`}
        >
          <div className="flex items-start gap-3">
            <input readOnly checked={shippingMethod === 'express'} className="text-primary focus:ring-0 mt-0.5 w-4 h-4" name="shipping_method" type="radio" />
            <div>
              <span className="text-xs font-bold text-text-primary">Giao hỏa tốc xe ba gác / Bán tải cơ động</span>
              <p className="text-xs text-text-secondary mt-1">
                Giao nhanh trong 2 - 4 giờ cho trường hợp cần phun trừ bệnh khẩn cấp.
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-text-muted">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                Giao ngay trong ngày
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-text-primary">+45.000 đ</span>
        </label>
      </div>
    </div>
  )
}
