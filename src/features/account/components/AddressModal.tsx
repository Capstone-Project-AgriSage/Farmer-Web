import { useState, useEffect } from 'react'
import Modal from '../../../components/ui/Modal'
import { describeApiError } from '../../../api/client'
import type { AddressRequest, AddressResponse, AddressType } from '../../../api/types'

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: AddressRequest) => Promise<void>
  initialData?: AddressResponse | null
}

const emptyForm: AddressRequest = {
  recipientName: '',
  recipientPhone: '',
  province: 'Cần Thơ',
  district: 'Huyện Thới Lai',
  ward: 'Thị trấn Thới Lai',
  addressLine: '',
  addressType: 'FARM',
  isDefault: false
}

const inputClass =
  'focus-ring w-full min-h-[48px] px-4 py-2.5 text-[16px] bg-white border border-brand-dark/30 hover:border-brand-dark/60 rounded-[var(--radius-input)] text-text-primary placeholder:text-text-muted'
const labelClass = 'block text-[15px] text-text-secondary mb-1.5'

export default function AddressModal({ isOpen, onClose, onSave, initialData }: AddressModalProps) {
  const [formData, setFormData] = useState<AddressRequest>(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setError(null)
      if (initialData) {
        setFormData({
          recipientName: initialData.recipientName,
          recipientPhone: initialData.recipientPhone,
          province: initialData.province,
          district: initialData.district || 'Huyện Thới Lai',
          ward: initialData.ward || 'Thị trấn Thới Lai',
          addressLine: initialData.addressLine,
          addressType: initialData.addressType,
          isDefault: initialData.isDefault
        })
      } else {
        setFormData(emptyForm)
      }
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      await onSave(formData)
      onClose()
    } catch (err) {
      console.error(err)
      setError(describeApiError(err, 'Có lỗi xảy ra, vui lòng thử lại.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      title={initialData ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
      icon="location_on"
      onClose={onClose}
      busy={isSubmitting}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="focus-ring min-h-[48px] px-6 rounded-full text-[16px] text-text-secondary hover:text-text-primary hover:bg-brand-light disabled:opacity-40 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="address-form"
            disabled={isSubmitting}
            className="focus-ring min-h-[48px] px-7 rounded-full bg-brand-dark text-white hover:bg-brand-green text-[16px] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Đang lưu…' : 'Lưu địa chỉ'}
          </button>
        </>
      }
    >
      <form id="address-form" onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="addr-name" className={labelClass}>Tên người nhận <span className="text-status-error" aria-hidden="true">*</span></label>
            <input id="addr-name" required autoComplete="name" type="text" className={inputClass} value={formData.recipientName} onChange={e => setFormData({...formData, recipientName: e.target.value})} />
          </div>
          <div>
            <label htmlFor="addr-phone" className={labelClass}>Số điện thoại <span className="text-status-error" aria-hidden="true">*</span></label>
            <input id="addr-phone" required autoComplete="tel" type="tel" className={inputClass} value={formData.recipientPhone} onChange={e => setFormData({...formData, recipientPhone: e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="addr-province" className={labelClass}>Tỉnh / Thành phố <span className="text-status-error" aria-hidden="true">*</span></label>
            <select id="addr-province" required className={inputClass} value={formData.province} onChange={e => setFormData({...formData, province: e.target.value})}>
              <option value="Cần Thơ">Cần Thơ</option>
              <option value="Hậu Giang">Hậu Giang</option>
            </select>
          </div>
          <div>
            <label htmlFor="addr-district" className={labelClass}>Huyện / Thị xã <span className="text-status-error" aria-hidden="true">*</span></label>
            <select id="addr-district" required className={inputClass} value={formData.district || ''} onChange={e => setFormData({...formData, district: e.target.value})}>
              <option value="Huyện Thới Lai">Huyện Thới Lai</option>
              <option value="Huyện Cờ Đỏ">Huyện Cờ Đỏ</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="addr-ward" className={labelClass}>Xã / Phường <span className="text-status-error" aria-hidden="true">*</span></label>
            <select id="addr-ward" required className={inputClass} value={formData.ward || ''} onChange={e => setFormData({...formData, ward: e.target.value})}>
              <option value="Thị trấn Thới Lai">Thị trấn Thới Lai</option>
              <option value="Xã Thới Thạnh">Xã Thới Thạnh</option>
            </select>
          </div>
          <div>
            <label htmlFor="addr-type" className={labelClass}>Loại địa chỉ</label>
            <select id="addr-type" className={inputClass} value={formData.addressType} onChange={e => setFormData({...formData, addressType: e.target.value as AddressType})}>
              <option value="FARM">Vườn / Trang trại</option>
              <option value="HOME">Nhà riêng</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="addr-line" className={labelClass}>Địa chỉ cụ thể <span className="text-status-error" aria-hidden="true">*</span></label>
          <input id="addr-line" required autoComplete="street-address" type="text" className={inputClass} placeholder="Số nhà, ấp, đường…" value={formData.addressLine} onChange={e => setFormData({...formData, addressLine: e.target.value})} />
        </div>

        {!initialData?.isDefault && (
          <label className="flex items-center gap-3 min-h-[44px] cursor-pointer">
            <input type="checkbox" className="focus-ring w-5 h-5 accent-brand-dark" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} />
            <span className="text-[16px] text-text-primary">Đặt làm địa chỉ mặc định</span>
          </label>
        )}

        {error && (
          <p role="alert" className="border border-status-error/40 bg-status-error-surface text-status-error rounded-[var(--radius-surface)] p-3 text-[15px]">
            {error}
          </p>
        )}
      </form>
    </Modal>
  )
}
