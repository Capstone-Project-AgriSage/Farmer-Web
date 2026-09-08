export type DeliveryMode = 'garden' | 'pickup'

interface AddressFormProps {
  deliveryMode: DeliveryMode
  onDeliveryModeChange: (mode: DeliveryMode) => void
}

export default function AddressForm({ deliveryMode, onDeliveryModeChange }: AddressFormProps) {
  return (
    <div className="bg-white rounded-2xl border border-border-subtle p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-primary flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h2 className="text-base font-bold text-text-primary">Thông tin người nhận &amp; Địa chỉ vườn</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <label
          onClick={() => onDeliveryModeChange('garden')}
          className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer ${
            deliveryMode === 'garden'
              ? 'border-2 border-primary bg-emerald-50/50'
              : 'border border-border-subtle bg-white hover:bg-surface-subtle transition-colors'
          }`}
        >
          <input readOnly checked={deliveryMode === 'garden'} className="text-primary focus:ring-0 w-4 h-4" name="delivery_mode" type="radio" />
          <div>
            <div className={`text-xs flex items-center gap-1 ${deliveryMode === 'garden' ? 'font-bold text-primary' : 'font-semibold text-text-primary'}`}>
              <span className="material-symbols-outlined text-[16px]">agriculture</span>
              Giao tận vườn / Trang trại
            </div>
            <p className="text-[11px] text-text-muted">Xe tải hoặc bán tải đưa vào tận nơi</p>
          </div>
        </label>
        <label
          onClick={() => onDeliveryModeChange('pickup')}
          className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
            deliveryMode === 'pickup' ? 'border-2 border-primary bg-emerald-50/50' : 'border border-border-subtle bg-white hover:bg-surface-subtle'
          }`}
        >
          <input readOnly checked={deliveryMode === 'pickup'} className="text-primary focus:ring-0 w-4 h-4" name="delivery_mode" type="radio" />
          <div>
            <div className="text-xs font-semibold text-text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">store</span>
              Nhận tại kho Di Linh
            </div>
            <p className="text-[11px] text-text-muted">142 Hùng Vương, TT. Di Linh</p>
          </div>
        </label>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1.5">
              Họ và tên người nhận <span className="text-status-error">*</span>
            </label>
            <input
              className="w-full px-3.5 py-2 text-xs font-medium bg-surface-subtle border border-border-subtle rounded-lg focus:outline-none focus:border-primary text-text-primary"
              type="text"
              defaultValue="Nguyễn Văn Hùng"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1.5">
              Số điện thoại liên hệ <span className="text-status-error">*</span>
            </label>
            <input
              className="w-full px-3.5 py-2 text-xs font-medium bg-surface-subtle border border-border-subtle rounded-lg focus:outline-none focus:border-primary text-text-primary"
              type="tel"
              defaultValue="0918 234 567"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1.5">
              Tỉnh / Thành phố <span className="text-status-error">*</span>
            </label>
            <select className="w-full px-3 py-2 text-xs font-medium bg-surface-subtle border border-border-subtle rounded-lg focus:outline-none focus:border-primary text-text-primary">
              <option>Lâm Đồng</option>
              <option>Đắk Lắk</option>
              <option>Đồng Nai</option>
              <option>Gia Lai</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1.5">
              Huyện / Thị xã <span className="text-status-error">*</span>
            </label>
            <select className="w-full px-3 py-2 text-xs font-medium bg-surface-subtle border border-border-subtle rounded-lg focus:outline-none focus:border-primary text-text-primary">
              <option>Huyện Di Linh</option>
              <option>Huyện Đức Trọng</option>
              <option>TP. Bảo Lộc</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-text-secondary mb-1.5">
              Xã / Thị trấn <span className="text-status-error">*</span>
            </label>
            <select className="w-full px-3 py-2 text-xs font-medium bg-surface-subtle border border-border-subtle rounded-lg focus:outline-none focus:border-primary text-text-primary">
              <option>Xã Đinh Lạc</option>
              <option>Xã Gia Hiệp</option>
              <option>Thị trấn Di Linh</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-text-secondary mb-1.5">
            Địa chỉ cụ thể / Vị trí vườn sầu riêng <span className="text-status-error">*</span>
          </label>
          <input
            className="w-full px-3.5 py-2 text-xs font-medium bg-surface-subtle border border-border-subtle rounded-lg focus:outline-none focus:border-primary text-text-primary"
            type="text"
            defaultValue="Số 45 Thôn Tân Lạc (gần dốc ngã ba vườn sầu riêng Chú Năm)"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-secondary mb-1.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-text-muted">local_shipping</span>
            Ghi chú dặn dò lái xe tải giao hàng
          </label>
          <textarea
            className="w-full px-3.5 py-2 text-xs font-medium bg-surface-subtle border border-border-subtle rounded-lg focus:outline-none focus:border-primary text-text-primary"
            rows={2}
            defaultValue="Đường bê tông xe tải 5 tấn vào được tận sân kho, vui lòng liên hệ Chú Năm trước khi xuất bến 30 phút."
          />
        </div>
      </div>
    </div>
  )
}
