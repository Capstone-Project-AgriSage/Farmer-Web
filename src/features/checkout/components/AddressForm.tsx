import { useState, useEffect, useRef } from 'react'
import FieldError from '../../../components/ui/FieldError'
import { useMotionPolicy } from '../../../motion/useMotionPolicy'
import { isValidPhone } from '../../../utils/validation'
import { profileApi } from '../../../api/profileApi'
import type { AddressResponse } from '../../../api/types'

export interface AddressFormValues {
  recipientName: string
  phone: string
  province: string
  district: string
  ward: string
  addressDetail: string
  note: string
  useAddressBook: boolean
  selectedAddressId: string
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
  useAddressBook: true,
  selectedAddressId: '',
}


export function validateAddressForm(values: AddressFormValues): AddressFormErrors {
  const errors: AddressFormErrors = {}

  // Địa chỉ chọn từ sổ đã được lưu sẵn, chỉ form nhập mới cần kiểm tra.
  if (values.useAddressBook && values.selectedAddressId) {
    return errors
  }

  if (!values.recipientName.trim()) {
    errors.recipientName = 'Vui lòng nhập họ và tên người nhận'
  }

  if (!values.phone.trim()) {
    errors.phone = 'Vui lòng nhập số điện thoại liên hệ'
  } else if (!isValidPhone(values.phone)) {
    errors.phone = 'Số điện thoại không hợp lệ'
  }

  if (!values.province) {
    errors.province = 'Vui lòng chọn tỉnh / thành phố'
  }

  if (!values.district) {
    errors.district = 'Vui lòng chọn huyện / thị xã'
  }

  if (!values.ward) {
    errors.ward = 'Vui lòng chọn xã / thị trấn'
  }

  if (!values.addressDetail.trim()) {
    errors.addressDetail = 'Vui lòng nhập địa chỉ cụ thể / vị trí vườn'
  }

  return errors
}

interface AddressFormProps {
  values: AddressFormValues
  onChange: (field: keyof AddressFormValues, value: string) => void
  errors: AddressFormErrors
}

const errorInputClass =
  'border-status-error focus:border-status-error focus:ring-1 focus:ring-status-error/20'
const normalInputClass = 'border-brand-dark/15 focus:border-brand-dark/40'

const inputBase =
  'w-full h-9 px-3 text-xs bg-brand-cream border rounded-lg focus:outline-none text-brand-dark'
const selectBase =
  'w-full h-9 px-3 text-xs bg-brand-cream border rounded-lg focus:outline-none [&_option]:text-brand-dark'
const textareaBase =
  'w-full px-3 py-2 text-xs leading-relaxed bg-brand-cream border rounded-lg resize-y focus:outline-none text-brand-dark'
const labelClass = 'block text-xs font-medium text-brand-dark/70 mb-1.5'

export default function AddressForm({
  values,
  onChange,
  errors,
}: AddressFormProps) {
  const [addresses, setAddresses] = useState<AddressResponse[]>([])
  const [addressesLoaded, setAddressesLoaded] = useState(false)

  useEffect(() => {
    profileApi
      .getAddresses()
      .then(setAddresses)
      .catch(console.error)
      .finally(() => setAddressesLoaded(true))
  }, [])

  const addressBookEmpty = addressesLoaded && addresses.length === 0

  // Sổ địa chỉ trống thì chuyển sang nhập mới, để radio luôn khớp với form đang hiện.
  useEffect(() => {
    if (addressBookEmpty && values.useAddressBook) {
      onChange('useAddressBook', false as any)
    }
  }, [addressBookEmpty, values.useAddressBook])

  const useAddressBook = values.useAddressBook
  const selectedAddressId = values.selectedAddressId
  const setUseAddressBook = (val: boolean) => onChange('useAddressBook', val as any)

  const cardRef = useRef<HTMLDivElement>(null)
  const scrollAfterModeChange = useRef(false)
  const motionPolicy = useMotionPolicy()

  // Đổi giữa sổ địa chỉ và nhập mới làm form cao/thấp đi, nên đưa cả mục về giữa màn hình sau khi render xong.
  // Chỉ chạy khi người dùng bấm, không chạy khi form tự chuyển vì sổ địa chỉ trống.
  useEffect(() => {
    if (!scrollAfterModeChange.current) return
    scrollAfterModeChange.current = false
    requestAnimationFrame(() => {
      const card = cardRef.current
      if (!card) return
      // Thẻ cao hơn màn hình thì căn giữa sẽ che mất đầu mục, khi đó cuộn tới mép trên (scroll-mt chừa chỗ cho header).
      const fitsInView = card.offsetHeight <= window.innerHeight - 112
      card.scrollIntoView({
        behavior: motionPolicy === 'none' ? 'auto' : 'smooth',
        block: fitsInView ? 'center' : 'start',
      })
    })
  }, [useAddressBook])

  const handleSwitchToAddressBook = () => {
    scrollAfterModeChange.current = true
    setUseAddressBook(true)
  }
  const setSelectedAddressId = (val: string) => onChange('selectedAddressId', val as any)

  useEffect(() => {
    if (!selectedAddressId && addresses.length) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0]
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id)
      }
    }
  }, [addresses, selectedAddressId])

  const handleSelectAddress = (addr: AddressResponse) => {
    setSelectedAddressId(addr.id)
    onChange('recipientName', addr.recipientName)
    onChange('phone', addr.recipientPhone)
    onChange('addressDetail', `${addr.addressLine}, ${addr.ward}, ${addr.district}, ${addr.province}`)
  }

  useEffect(() => {
    if (useAddressBook && selectedAddressId && addresses.length > 0) {
      const addr = addresses.find((a) => a.id === selectedAddressId)
      if (addr) {
        onChange('recipientName', addr.recipientName)
        onChange('phone', addr.recipientPhone)
        onChange('addressDetail', `${addr.addressLine}, ${addr.ward}, ${addr.district}, ${addr.province}`)
      }
    }
  }, [useAddressBook, selectedAddressId, addresses])

  // Nhập địa chỉ mới: giữ người nhận và SĐT từ địa chỉ đang chọn trong sổ, phần địa chỉ để trống cho bác tự nhập.
  const handleSwitchToNewAddress = () => {
    scrollAfterModeChange.current = true
    setUseAddressBook(false)
    if (addresses.length === 0) return

    const addr =
      addresses.find((a) => a.id === selectedAddressId) ||
      addresses.find((a) => a.isDefault) ||
      addresses[0]
    onChange('recipientName', addr.recipientName)
    onChange('phone', addr.recipientPhone)
    onChange('province', '')
    onChange('district', '')
    onChange('ward', '')
    onChange('addressDetail', '')
    onChange('note', '')
  }

  const selectClass = (field: 'province' | 'district' | 'ward') =>
    `${selectBase} ${errors[field] ? errorInputClass : normalInputClass} ${
      values[field] ? 'text-brand-dark' : 'text-brand-dark/45'
    }`

  const showAddressBook = useAddressBook && addresses.length > 0

  const noteField = (
    <div className="col-span-6">
      <label htmlFor="checkout-note" className={labelClass}>
        Ghi chú dặn dò lái xe tải giao hàng{' '}
        <span className="font-normal text-brand-dark/45">(không bắt buộc)</span>
      </label>
      <textarea
        id="checkout-note"
        className={`${textareaBase} ${normalInputClass}`}
        rows={3}
        value={values.note}
        onChange={(e) => onChange('note', e.target.value)}
        placeholder="VD: Gọi trước khi giao, đường nhỏ xe không vào được..."
      />
    </div>
  )

  return (
    <div ref={cardRef} className="bg-white border border-brand-dark/10 p-5 sm:p-6 scroll-mt-28">
      <div className="flex items-center gap-2.5 pb-4 border-b border-brand-dark/10 mb-5">
        <div className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center text-sm">
          1
        </div>
        <h2 className="text-base font-helvetica-neue tracking-tight text-brand-dark">
          Thông tin người nhận &amp; Địa chỉ vườn
        </h2>
      </div>

      <div className="mb-5 grid gap-3 rounded-lg bg-brand-light px-3.5 py-3">
        <p className="flex items-start gap-2 text-[11px] leading-relaxed text-brand-dark/65">
          <span className="material-symbols-outlined text-[16px] text-brand-green">local_shipping</span>
          Đơn đặt online được đại lý giao tận nơi. Muốn lấy hàng tại cửa hàng, bác đến quầy để nhân viên bán trực tiếp.
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <label
            className={`flex items-center gap-2 ${
              addressBookEmpty ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }`}
          >
            <input
              type="radio"
              checked={useAddressBook}
              disabled={addressBookEmpty}
              onChange={handleSwitchToAddressBook}
              className="text-brand-dark focus:ring-0 w-4 h-4 accent-brand-dark"
            />
            <span className="text-xs text-brand-dark">
              Chọn từ sổ địa chỉ
              {addressBookEmpty && (
                <span className="text-brand-dark/60"> (chưa có địa chỉ đã lưu)</span>
              )}
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={!useAddressBook}
              onChange={handleSwitchToNewAddress}
              className="text-brand-dark focus:ring-0 w-4 h-4 accent-brand-dark"
            />
            <span className="text-xs text-brand-dark">Nhập địa chỉ mới</span>
          </label>
        </div>
      </div>

      {showAddressBook ? (
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-6 grid gap-2.5">
            {addresses.map((addr) => (
              <button
                type="button"
                key={addr.id}
                onClick={() => handleSelectAddress(addr)}
                className={`text-left p-3 rounded-lg border transition-colors ${
                  selectedAddressId === addr.id
                    ? 'border-brand-dark bg-brand-light'
                    : 'border-brand-dark/10 bg-white hover:bg-brand-cream'
                }`}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-brand-dark">
                      {addr.recipientName} · {addr.recipientPhone}
                    </span>
                    <span className="block text-xs text-brand-dark/70 mt-1">
                      {addr.addressLine}, {addr.ward}, {addr.district}, {addr.province}
                    </span>
                  </span>
                  {addr.isDefault && (
                    <span className="shrink-0 px-2 py-0.5 rounded bg-brand-green/10 text-brand-green text-[10px] font-semibold">
                      Mặc định
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
          {noteField}
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-6 sm:col-span-3 min-w-0">
            <label htmlFor="checkout-recipient" className={labelClass}>
              Họ và tên người nhận <span className="text-status-error">*</span>
            </label>
            <input
              id="checkout-recipient"
              className={`${inputBase} ${errors.recipientName ? errorInputClass : normalInputClass}`}
              type="text"
              value={values.recipientName}
              onChange={(e) => onChange('recipientName', e.target.value)}
            />
            <FieldError message={errors.recipientName} />
          </div>
          <div className="col-span-6 sm:col-span-3 min-w-0">
            <label htmlFor="checkout-phone" className={labelClass}>
              Số điện thoại liên hệ <span className="text-status-error">*</span>
            </label>
            <input
              id="checkout-phone"
              className={`${inputBase} ${errors.phone ? errorInputClass : normalInputClass}`}
              type="tel"
              value={values.phone}
              onChange={(e) => onChange('phone', e.target.value)}
            />
            <FieldError message={errors.phone} />
          </div>

          {/* Tỉnh chiếm nửa trái để Huyện bắt đầu thẳng cột với ô Số điện thoại phía trên. */}
          <div className="col-span-6 sm:col-span-3 min-w-0">
            <label htmlFor="checkout-province" className={labelClass}>
              Tỉnh / Thành phố <span className="text-status-error">*</span>
            </label>
            <select
              id="checkout-province"
              className={selectClass('province')}
              value={values.province}
              onChange={(e) => onChange('province', e.target.value)}
            >
              <option value="" disabled>Chọn tỉnh / thành phố</option>
              <option>Cần Thơ</option>
              <option>An Giang</option>
              <option>Đồng Tháp</option>
              <option>Hậu Giang</option>
            </select>
            <FieldError message={errors.province} />
          </div>
          <div className="col-span-6 sm:col-span-3 grid grid-cols-2 gap-4">
            <div className="min-w-0">
              <label htmlFor="checkout-district" className={labelClass}>
                Huyện / Thị xã <span className="text-status-error">*</span>
              </label>
              <select
                id="checkout-district"
                className={selectClass('district')}
                value={values.district}
                onChange={(e) => onChange('district', e.target.value)}
              >
                <option value="" disabled>Chọn huyện / thị xã</option>
                <option>Huyện Thới Lai</option>
                <option>Huyện Cờ Đỏ</option>
                <option>Quận Ô Môn</option>
                <option>Huyện Vĩnh Thạnh</option>
              </select>
              <FieldError message={errors.district} />
            </div>
            <div className="min-w-0">
              <label htmlFor="checkout-ward" className={labelClass}>
                Xã / Thị trấn <span className="text-status-error">*</span>
              </label>
              <select
                id="checkout-ward"
                className={selectClass('ward')}
                value={values.ward}
                onChange={(e) => onChange('ward', e.target.value)}
              >
                <option value="" disabled>Chọn xã / thị trấn</option>
                <option>Thị trấn Thới Lai</option>
                <option>Xã Thới Thạnh</option>
                <option>Xã Tân Thạnh</option>
                <option>Xã Định Môn</option>
              </select>
              <FieldError message={errors.ward} />
            </div>
          </div>

          <div className="col-span-6 min-w-0">
            <label htmlFor="checkout-address-detail" className={labelClass}>
              Địa chỉ cụ thể / Vị trí ruộng lúa <span className="text-status-error">*</span>
            </label>
            <input
              id="checkout-address-detail"
              className={`${inputBase} ${errors.addressDetail ? errorInputClass : normalInputClass}`}
              type="text"
              value={values.addressDetail}
              onChange={(e) => onChange('addressDetail', e.target.value)}
            />
            <FieldError message={errors.addressDetail} />
          </div>
          {noteField}
        </div>
      )}
    </div>
  )
}
