import { useState, useEffect } from 'react'
import FieldError from '../../../components/ui/FieldError'
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
  values,
  onChange,
  errors,
}: AddressFormProps) {
  const [addresses, setAddresses] = useState<AddressResponse[]>([])
  
  useEffect(() => {
    profileApi.getAddresses().then(setAddresses).catch(console.error)
  }, [])

  const useAddressBook = values.useAddressBook
  const selectedAddressId = values.selectedAddressId
  const setUseAddressBook = (val: boolean) => onChange('useAddressBook', val as any)
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
      <p className="mb-5 flex items-start gap-2 text-[11px] text-brand-dark/60">
        <span className="material-symbols-outlined text-[16px] text-brand-green">local_shipping</span>
        Đơn đặt online được đại lý giao tận nơi. Muốn lấy hàng tại cửa hàng, bác đến quầy để nhân viên bán trực tiếp.
      </p>

      <div className="mb-6 flex items-center gap-4 border-b border-brand-dark/10 pb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={useAddressBook}
            onChange={() => setUseAddressBook(true)}
            className="text-brand-dark focus:ring-0 w-4 h-4 accent-brand-dark"
          />
          <span className="text-xs text-brand-dark">Chọn từ sổ địa chỉ</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={!useAddressBook}
            onChange={() => setUseAddressBook(false)}
            className="text-brand-dark focus:ring-0 w-4 h-4 accent-brand-dark"
          />
          <span className="text-xs text-brand-dark">Nhập địa chỉ mới</span>
        </label>
      </div>

      {useAddressBook && addresses.length > 0 ? (
        <div className="space-y-3 mb-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              onClick={() => handleSelectAddress(addr)}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedAddressId === addr.id
                  ? 'border-brand-dark bg-brand-light'
                  : 'border-brand-dark/10 bg-white hover:bg-brand-cream'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-brand-dark">{addr.recipientName} - {addr.recipientPhone}</p>
                  <p className="text-xs text-brand-dark/70 mt-1">{addr.addressLine}, {addr.ward}, {addr.district}, {addr.province}</p>
                </div>
                {addr.isDefault && (
                  <span className="px-2 py-0.5 rounded bg-brand-green/10 text-brand-green text-[10px] font-semibold">
                    Mặc định
                  </span>
                )}
              </div>
            </div>
          ))}
          <div className="mt-4">
            <label className="block text-xs tracking-[0.15em] text-brand-dark/50 mb-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-brand-dark/40">local_shipping</span>
              Ghi chú dặn dò lái xe tải giao hàng
            </label>
            <textarea
              className={`${inputBase} ${normalInputClass}`}
              rows={2}
              value={values.note}
              onChange={(e) => onChange('note', e.target.value)}
              placeholder="VD: Gọi trước khi giao, đường nhỏ xe không vào được..."
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-[0.15em]  text-brand-dark/50 mb-1.5">
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
              <label className="block text-xs tracking-[0.15em]  text-brand-dark/50 mb-1.5">
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
              <label className="block text-xs tracking-[0.15em]  text-brand-dark/50 mb-1.5">
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
              <label className="block text-xs tracking-[0.15em]  text-brand-dark/50 mb-1.5">
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
              <label className="block text-xs tracking-[0.15em]  text-brand-dark/50 mb-1.5">
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
            <label className="block text-xs tracking-[0.15em]  text-brand-dark/50 mb-1.5">
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
            <label className="block text-xs tracking-[0.15em]  text-brand-dark/50 mb-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-brand-dark/40">local_shipping</span>
              Ghi chú dặn dò lái xe tải giao hàng
            </label>
            <textarea
              className={`${inputBase} ${normalInputClass}`}
              rows={2}
              value={values.note}
              onChange={(e) => onChange('note', e.target.value)}
              placeholder="VD: Gọi trước khi giao, đường nhỏ xe không vào được..."
            />
          </div>
        </div>
      )}
    </div>
  )
}
