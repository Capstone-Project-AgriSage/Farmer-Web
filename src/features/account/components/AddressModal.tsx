import { useState, useEffect } from 'react'
import type { AddressRequest, AddressResponse, AddressType } from '../../../api/types'

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: AddressRequest) => Promise<void>
  initialData?: AddressResponse | null
}

export default function AddressModal({ isOpen, onClose, onSave, initialData }: AddressModalProps) {
  const [formData, setFormData] = useState<AddressRequest>({
    recipientName: '',
    recipientPhone: '',
    province: 'Cần Thơ',
    district: 'Huyện Thới Lai',
    ward: 'Thị trấn Thới Lai',
    addressLine: '',
    addressType: 'FARM',
    isDefault: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
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
        setFormData({
          recipientName: '',
          recipientPhone: '',
          province: 'Cần Thơ',
          district: 'Huyện Thới Lai',
          ward: 'Thị trấn Thới Lai',
          addressLine: '',
          addressType: 'FARM',
          isDefault: false
        })
      }
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSave(formData)
      onClose()
    } catch (err) {
      console.error(err)
      alert('Có lỗi xảy ra, vui lòng thử lại!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = "w-full px-3 py-2 text-sm bg-brand-light border border-brand-dark/15 rounded-lg focus:outline-none focus:border-brand-dark/40"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-brand-dark/10 flex items-center justify-between">
          <h2 className="text-lg font-medium font-helvetica-neue text-brand-dark">
            {initialData ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
          </h2>
          <button onClick={onClose} className="text-brand-dark/50 hover:text-brand-dark">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="p-5 overflow-y-auto">
          <form id="address-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-dark/70">Tên người nhận *</label>
                <input required type="text" className={inputClass} value={formData.recipientName} onChange={e => setFormData({...formData, recipientName: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-dark/70">Số điện thoại *</label>
                <input required type="tel" className={inputClass} value={formData.recipientPhone} onChange={e => setFormData({...formData, recipientPhone: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-dark/70">Tỉnh / Thành phố *</label>
                <select required className={inputClass} value={formData.province} onChange={e => setFormData({...formData, province: e.target.value})}>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Hậu Giang">Hậu Giang</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-dark/70">Huyện / Thị xã *</label>
                <select required className={inputClass} value={formData.district || ''} onChange={e => setFormData({...formData, district: e.target.value})}>
                  <option value="Huyện Thới Lai">Huyện Thới Lai</option>
                  <option value="Huyện Cờ Đỏ">Huyện Cờ Đỏ</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-dark/70">Xã / Phường *</label>
                <select required className={inputClass} value={formData.ward || ''} onChange={e => setFormData({...formData, ward: e.target.value})}>
                  <option value="Thị trấn Thới Lai">Thị trấn Thới Lai</option>
                  <option value="Xã Thới Thạnh">Xã Thới Thạnh</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brand-dark/70">Loại địa chỉ</label>
                <select className={inputClass} value={formData.addressType} onChange={e => setFormData({...formData, addressType: e.target.value as AddressType})}>
                  <option value="FARM">Vườn / Trang trại</option>
                  <option value="HOME">Nhà riêng</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-brand-dark/70">Địa chỉ cụ thể *</label>
              <input required type="text" className={inputClass} placeholder="Số nhà, ấp, đường..." value={formData.addressLine} onChange={e => setFormData({...formData, addressLine: e.target.value})} />
            </div>

            {!initialData?.isDefault && (
              <label className="flex items-center gap-2 mt-4 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-brand-green rounded" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} />
                <span className="text-sm text-brand-dark">Đặt làm địa chỉ mặc định</span>
              </label>
            )}
          </form>
        </div>

        <div className="p-5 border-t border-brand-dark/10 flex justify-end gap-3 bg-brand-cream/20">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-brand-dark/60 hover:text-brand-dark">Hủy</button>
          <button type="submit" form="address-form" disabled={isSubmitting} className="px-6 py-2 text-sm font-semibold bg-brand-dark hover:bg-brand-green text-white rounded-full transition-colors disabled:opacity-50">
            {isSubmitting ? 'Đang lưu...' : 'Lưu địa chỉ'}
          </button>
        </div>
      </div>
    </div>
  )
}
