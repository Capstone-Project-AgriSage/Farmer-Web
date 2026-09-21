import FieldError from '../../../components/ui/FieldError'
import { isValidPhone } from '../../../utils/validation'

export type DeliveryMode = 'garden' | 'pickup'

export interface AddressFormValues {
  recipientName: string
  phone: string
  province: string
  district: string
  ward: string
  addressDetail: string
  note: string
}

export type AddressFormErrors = Partial<Record<keyof AddressFormValues, string>>

export const addressFormDefaults: AddressFormValues = {
  recipientName: 'Nguyễn Văn Hùng',
  phone: '0918 234 567',
  province: 'Cần Thơ',
  district: 'Huyện Thới Lai',
  ward: 'Thị trấn Thới Lai',
  addressDetail: 'Ấp Thới Thuận (gần ngã ba Kênh Xáng, cách đại lý Hai Thắng 1.5km)',
  note: 'Đường bê tông bờ kênh, xe tải 2.5 tấn hoặc ghe vào tận ruộng lúa. Gọi Chú Hùng trước khi giao hàng 15 phút.',
}


export function validateAddressForm(values: AddressFormValues): AddressFormErrors {
  const errors: AddressFormErrors = {}

  if (!values.recipientName.trim()) {
    errors.recipientName = 'Vui lòng nhập họ và tên người nhận'
  }

  if (!values.phone.trim()) {
    errors.phone = 'Vui lòng nhập số điện thoại liên hệ'
  } else if (!isValidPhone(values.phone)) {
    errors.phone = 'Số điện thoại không hợp lệ'
  }

  if (!values.addressDetail.trim()) {
    errors.addressDetail = 'Vui lòng nhập địa chỉ cụ thể / vị trí vườn'
  }

  return errors
}

interface AddressFormProps {
  deliveryMode: DeliveryMode
  onDeliveryModeChange: (mode: DeliveryMode) => void
  values: AddressFormValues
  onChange: (field: keyof AddressFormValues, value: string) => void
  errors: AddressFormErrors
}

const errorInputClass =
  'border-status-error focus:border-status-error focus:ring-1 focus:ring-status-error/20'
const normalInputClass = 'border-brand-dark/15 focus:border-brand-dark/40'

const inputBase =
  'w-full px-3.5 py-2 text-xs bg-brand-cream border rounded-lg focus:outline-none text-brand-dark'

export default function AddressForm({
  deliveryMode,
  onDeliveryModeChange,
  values,
  onChange,
  errors,
}: AddressFormProps) {
  return (
    <div className="bg-white border border-brand-dark/10 p-5 sm:p-6">
      <div className="flex items-center justify-between pb-4 border-b border-brand-dark/10 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center text-sm">
            1
          </div>
          <h2 className="text-base font-helvetica-neue tracking-tight text-brand-dark">
            Thông tin người nhận &amp; Địa chỉ vườn
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <label
          onClick={() => onDeliveryModeChange('garden')}
          className={`relative flex items-center gap-3 p-3 cursor-pointer transition-colors ${
            deliveryMode === 'garden'
              ? 'border border-brand-dark bg-brand-light'
              : 'border border-brand-dark/10 bg-white hover:bg-brand-cream'
          }`}
        >
          <input
            readOnly
            checked={deliveryMode === 'garden'}
            className="text-brand-dark focus:ring-0 w-4 h-4 accent-brand-dark"
            name="delivery_mode"
            type="radio"
          />
          <div>
            <div
              className={`text-xs flex items-center gap-1 ${
                deliveryMode === 'garden' ? 'text-brand-dark' : 'text-brand-dark/80'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">agriculture</span>
              Giao tận vườn / Trang trại
            </div>
            <p className="text-[11px] text-brand-dark/50">Xe tải hoặc bán tải đưa vào tận nơi</p>
          </div>
        </label>
        <label
          onClick={() => onDeliveryModeChange('pickup')}
          className={`relative flex items-center gap-3 p-3 cursor-pointer transition-colors ${
            deliveryMode === 'pickup'
              ? 'border border-brand-dark bg-brand-light'
              : 'border border-brand-dark/10 bg-white hover:bg-brand-cream'
          }`}
        >
          <input
            readOnly
            checked={deliveryMode === 'pickup'}
            className="text-brand-dark focus:ring-0 w-4 h-4 accent-brand-dark"
            name="delivery_mode"
            type="radio"
          />
          <div>
            <div className="text-xs text-brand-dark flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">store</span>
              Nhận tại đại lý Hai Thắng
            </div>
            <p className="text-[11px] text-brand-dark/50">Thị trấn Thới Lai, TP. Cần Thơ</p>
          </div>
        </label>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-brand-dark/50 mb-1.5">
              Họ và tên người nhận <span className="text-status-error">*</span>
            </label>
            <input
              className={`${inputBase} ${errors.recipientName ? errorInputClass : normalInputClass}`}
              type="text"
              value={values.recipientName}
              onChange={(e) => onChange('recipientName', e.target.value)}
            />
            <FieldError message={errors.recipientName} />
          </div>
          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-brand-dark/50 mb-1.5">
              Số điện thoại liên hệ <span className="text-status-error">*</span>
            </label>
            <input
              className={`${inputBase} ${errors.phone ? errorInputClass : normalInputClass}`}
              type="tel"
              value={values.phone}
              onChange={(e) => onChange('phone', e.target.value)}
            />
            <FieldError message={errors.phone} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-brand-dark/50 mb-1.5">
              Tỉnh / Thành phố <span className="text-status-error">*</span>
            </label>
            <select
              className={`${inputBase} ${normalInputClass}`}
              value={values.province}
              onChange={(e) => onChange('province', e.target.value)}
            >
              <option>Cần Thơ</option>
              <option>An Giang</option>
              <option>Đồng Tháp</option>
              <option>Hậu Giang</option>
            </select>
          </div>
          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-brand-dark/50 mb-1.5">
              Huyện / Thị xã <span className="text-status-error">*</span>
            </label>
            <select
              className={`${inputBase} ${normalInputClass}`}
              value={values.district}
              onChange={(e) => onChange('district', e.target.value)}
            >
              <option>Huyện Thới Lai</option>
              <option>Huyện Cờ Đỏ</option>
              <option>Quận Ô Môn</option>
              <option>Huyện Vĩnh Thạnh</option>
            </select>
          </div>
          <div>
            <label className="block text-xs tracking-[0.15em] uppercase text-brand-dark/50 mb-1.5">
              Xã / Thị trấn <span className="text-status-error">*</span>
            </label>
            <select
              className={`${inputBase} ${normalInputClass}`}
              value={values.ward}
              onChange={(e) => onChange('ward', e.target.value)}
            >
              <option>Thị trấn Thới Lai</option>
              <option>Xã Thới Thạnh</option>
              <option>Xã Tân Thạnh</option>
              <option>Xã Định Môn</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-brand-dark/50 mb-1.5">
            Địa chỉ cụ thể / Vị trí ruộng lúa <span className="text-status-error">*</span>
          </label>
          <input
            className={`${inputBase} ${errors.addressDetail ? errorInputClass : normalInputClass}`}
            type="text"
            value={values.addressDetail}
            onChange={(e) => onChange('addressDetail', e.target.value)}
          />
          <FieldError message={errors.addressDetail} />
        </div>
        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-brand-dark/50 mb-1.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-brand-dark/40">local_shipping</span>
            Ghi chú dặn dò lái xe tải giao hàng
          </label>
          <textarea
            className={`${inputBase} ${normalInputClass}`}
            rows={2}
            value={values.note}
            onChange={(e) => onChange('note', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
