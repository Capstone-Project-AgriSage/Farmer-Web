import { useState } from 'react'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useAuth } from '../../context/AuthContext'

export default function AccountPage() {
  useDocumentTitle('Tài khoản của tôi - AgriSage')
  const { farmer, activeStore } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  const [formData, setFormData] = useState({
    name: farmer.name,
    phone: farmer.phone,
    address: farmer.address,
    landArea: farmer.landArea,
  })

  const handleSave = () => {
    // Mock save
    setIsEditing(false)
    alert('Đã cập nhật thông tin thành công!')
  }

  return (
    <div className="bg-brand-cream text-brand-dark min-h-screen pb-20">
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Tài khoản' }]} />

      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-6">
        <h1 className="text-2xl font-medium font-helvetica-neue tracking-tight flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-[28px]">person</span>
          Tài khoản của tôi
        </h1>

        {/* Farmer Profile Card (Matches User Request) */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-brand-dark/10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-brand-cream text-brand-dark flex items-center justify-center text-2xl md:text-3xl font-medium tracking-tight font-helvetica-neue shrink-0 border border-brand-dark/10">
            {farmer.name.split(' ').map(n => n[0]).slice(-2).join('')}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl md:text-2xl font-medium font-helvetica-neue tracking-tight text-brand-dark">
                {farmer.name}
              </h2>
              <span className="px-3 py-1 rounded-full border border-brand-green/20 bg-brand-green/5 text-brand-green text-[12px] font-semibold tracking-wide">
                {farmer.landArea}
              </span>
            </div>
            <p className="text-base text-brand-dark/70 leading-relaxed">{farmer.address}</p>
            <div className="flex items-center gap-3 text-sm text-brand-dark/50 pt-1">
              <span className="font-helvetica-neue text-brand-dark bg-brand-light px-2 py-0.5 rounded-md">{farmer.phone}</span>
              <span>·</span>
              <span>
                Đại lý: <span className="text-brand-dark font-medium">{activeStore.name}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-brand-dark/10 overflow-hidden">
          <div className="p-5 md:p-6 border-b border-brand-dark/10 flex items-center justify-between bg-brand-cream/20">
            <h3 className="font-medium text-brand-dark font-helvetica-neue text-lg">Thông tin cá nhân</h3>
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-sm font-semibold text-brand-dark hover:text-brand-green flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                <span>Chỉnh sửa</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs font-semibold text-brand-dark/60 hover:text-brand-dark  tracking-wide px-3 py-1.5 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="text-xs font-semibold text-white bg-brand-dark hover:bg-brand-green  tracking-wide px-4 py-1.5 rounded-full transition-colors"
                >
                  Lưu
                </button>
              </div>
            )}
          </div>
          
          <div className="p-5 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-brand-dark/70 tracking-wide">Họ và tên</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-brand-dark/15 bg-brand-light p-3 text-brand-dark focus:outline-none focus:border-brand-dark/40 focus:ring-2 focus:ring-brand-dark/5 disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-brand-dark/70 tracking-wide">Số điện thoại</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-brand-dark/15 bg-brand-light p-3 text-brand-dark font-helvetica-neue focus:outline-none focus:border-brand-dark/40 focus:ring-2 focus:ring-brand-dark/5 disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-brand-dark/70 tracking-wide">Địa chỉ canh tác</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-xl border border-brand-dark/15 bg-brand-light p-3 text-brand-dark focus:outline-none focus:border-brand-dark/40 focus:ring-2 focus:ring-brand-dark/5 disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-brand-dark/70 tracking-wide">Quy mô canh tác</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.landArea}
                  onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                  className="w-full rounded-xl border border-brand-dark/15 bg-brand-light p-3 text-brand-dark focus:outline-none focus:border-brand-dark/40 focus:ring-2 focus:ring-brand-dark/5 disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
