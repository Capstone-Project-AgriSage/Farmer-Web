import { useState, useEffect } from 'react'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useAuth } from '../../context/AuthContext'
import { profileApi } from '../../api/profileApi'
import type { FarmerProfile, AddressResponse, AddressRequest } from '../../api/types'
import AddressModal from './components/AddressModal'

export default function AccountPage() {
  useDocumentTitle('Tài khoản của tôi - AgriSage')
  const { activeStore } = useAuth()
  
  const [profile, setProfile] = useState<FarmerProfile | null>(null)
  const [addresses, setAddresses] = useState<AddressResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '' as 'MALE' | 'FEMALE' | 'OTHER' | '',
    dateOfBirth: '',
  })

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<AddressResponse | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setLoadError(null)
      const [prof, addrs] = await Promise.all([
        profileApi.getProfile(),
        profileApi.getAddresses()
      ])
      setProfile(prof)
      setAddresses(addrs)
      setFormData({
        fullName: prof.fullName || '',
        gender: prof.gender || '',
        dateOfBirth: prof.dateOfBirth ? prof.dateOfBirth.split('T')[0] : '',
      })
    } catch (err: any) {
      console.error('Failed to load profile', err)
      setLoadError(err?.message || 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại đường truyền.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      const updated = await profileApi.updateProfile({
        fullName: formData.fullName,
        gender: formData.gender || null,
        dateOfBirth: formData.dateOfBirth || null
      } as any)
      setProfile(updated)
      setIsEditing(false)
      alert('Đã cập nhật thông tin thành công!')
    } catch (err) {
      console.error(err)
      alert('Có lỗi xảy ra khi cập nhật!')
    }
  }

  const handleSaveAddress = async (data: AddressRequest) => {
    if (editingAddress) {
      await profileApi.updateAddress(editingAddress.id, data)
    } else {
      await profileApi.createAddress(data)
    }
    await loadData()
  }

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return
    try {
      await profileApi.deleteAddress(id)
      await loadData()
    } catch (err) {
      console.error(err)
      alert('Không thể xóa địa chỉ!')
    }
  }

  const handleSetDefaultAddress = async (id: string) => {
    try {
      await profileApi.setDefaultAddress(id)
      await loadData()
    } catch (err) {
      console.error(err)
      alert('Không thể đặt mặc định!')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="flex items-center gap-3 text-brand-dark/70">
          <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
          <span>Đang tải thông tin tài khoản...</span>
        </div>
      </div>
    )
  }

  if (loadError && !profile) {
    return (
      <div className="min-h-screen bg-brand-cream text-brand-dark py-16 px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-brand-dark/10 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <span className="material-symbols-outlined text-[32px]">cloud_off</span>
          </div>
          <h2 className="text-xl font-medium font-helvetica-neue text-brand-dark">Không thể tải thông tin</h2>
          <p className="text-sm text-brand-dark/70 leading-relaxed">{loadError}</p>
          <div className="pt-2">
            <button
              onClick={loadData}
              className="px-6 py-2.5 bg-brand-dark text-white rounded-xl text-sm font-medium hover:bg-brand-green transition-colors inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              <span>Thử lại</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="bg-brand-cream text-brand-dark min-h-screen pb-20">
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Tài khoản' }]} />

      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-6">
        <h1 className="text-2xl font-medium font-helvetica-neue tracking-tight flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-[28px]">person</span>
          Tài khoản của tôi
        </h1>

        {/* Farmer Profile Card */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-brand-dark/10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-brand-cream text-brand-dark flex items-center justify-center text-2xl md:text-3xl font-medium tracking-tight font-helvetica-neue shrink-0 border border-brand-dark/10">
            {(profile.fullName || 'ND').trim().split(' ').filter(Boolean).map(n => n[0]).slice(-2).join('')}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl md:text-2xl font-medium font-helvetica-neue tracking-tight text-brand-dark">
                {profile.fullName}
              </h2>
              {profile.customerGroup && (
                <span className="px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-600 text-[12px] font-semibold tracking-wide">
                  {profile.customerGroup.name}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-brand-dark/50 pt-1">
              <span className="font-helvetica-neue text-brand-dark bg-brand-light px-2 py-0.5 rounded-md">{profile.phoneNumber || 'Chưa cập nhật SĐT'}</span>
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
                  className="text-xs font-semibold text-brand-dark/60 hover:text-brand-dark tracking-wide px-3 py-1.5 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="text-xs font-semibold text-white bg-brand-dark hover:bg-brand-green tracking-wide px-4 py-1.5 rounded-full transition-colors"
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
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full rounded-xl border border-brand-dark/15 bg-brand-light p-3 text-brand-dark focus:outline-none focus:border-brand-dark/40 focus:ring-2 focus:ring-brand-dark/5 disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-brand-dark/70 tracking-wide">Số điện thoại</label>
                <input
                  type="text"
                  disabled={true}
                  value={profile.phoneNumber || 'Chưa có'}
                  className="w-full rounded-xl border border-brand-dark/15 bg-brand-light p-3 text-brand-dark/50 font-helvetica-neue focus:outline-none cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-brand-dark/70 tracking-wide">Giới tính</label>
                <select
                  disabled={!isEditing}
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full rounded-xl border border-brand-dark/15 bg-brand-light p-3 text-brand-dark focus:outline-none focus:border-brand-dark/40 focus:ring-2 focus:ring-brand-dark/5 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <option value="">Chưa cập nhật</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-brand-dark/70 tracking-wide">Ngày sinh</label>
                <input
                  type="date"
                  disabled={!isEditing}
                  value={formData.dateOfBirth}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full rounded-xl border border-brand-dark/15 bg-brand-light p-3 text-brand-dark focus:outline-none focus:border-brand-dark/40 focus:ring-2 focus:ring-brand-dark/5 disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-brand-dark/70 tracking-wide">Email</label>
                <input
                  type="email"
                  disabled={true}
                  value={profile.email || 'Chưa có'}
                  className="w-full rounded-xl border border-brand-dark/15 bg-brand-light p-3 text-brand-dark/50 focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Address Book */}
        <div className="bg-white rounded-2xl shadow-sm border border-brand-dark/10 overflow-hidden">
          <div className="p-5 md:p-6 border-b border-brand-dark/10 flex items-center justify-between bg-brand-cream/20">
            <h3 className="font-medium text-brand-dark font-helvetica-neue text-lg">Sổ địa chỉ</h3>
            {addresses.length < 10 && (
              <button
                type="button"
                onClick={() => {
                  setEditingAddress(null)
                  setIsModalOpen(true)
                }}
                className="text-sm font-semibold text-brand-dark hover:text-brand-green flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Thêm địa chỉ</span>
              </button>
            )}
          </div>
          <div className="p-5 md:p-8 space-y-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-brand-dark/10 rounded-xl bg-brand-light gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-brand-dark">{addr.recipientName}</span>
                    <span className="text-brand-dark/50">|</span>
                    <span className="text-sm text-brand-dark/70 font-helvetica-neue">{addr.recipientPhone}</span>
                  </div>
                  <p className="text-brand-dark/80 text-sm leading-relaxed">{addr.addressLine}, {addr.ward}, {addr.district}, {addr.province}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {addr.isDefault && (
                      <span className="inline-block px-2 py-0.5 rounded border border-brand-green/20 bg-brand-green/10 text-brand-green text-[10px] font-semibold tracking-wide">
                        Mặc định
                      </span>
                    )}
                    <span className="inline-block px-2 py-0.5 rounded border border-brand-dark/20 bg-brand-dark/5 text-brand-dark/60 text-[10px] font-semibold tracking-wide">
                      {addr.addressType === 'HOME' ? 'Nhà riêng' : addr.addressType === 'FARM' ? 'Vườn' : 'Khác'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {!addr.isDefault && (
                    <>
                      <button 
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="text-xs font-semibold text-brand-dark/60 hover:text-brand-dark transition-colors"
                      >
                        Đặt mặc định
                      </button>
                      <button 
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-xs font-semibold text-rose-500/70 hover:text-rose-600 transition-colors"
                      >
                        Xóa
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => {
                      setEditingAddress(addr)
                      setIsModalOpen(true)
                    }}
                    className="text-xs font-semibold text-brand-dark/60 hover:text-brand-green transition-colors"
                  >
                    Sửa
                  </button>
                </div>
              </div>
            ))}
            {addresses.length === 0 && (
              <div className="text-center py-6 text-brand-dark/50 text-sm">
                Bạn chưa lưu địa chỉ nào.
              </div>
            )}
          </div>
        </div>
      </div>
      
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingAddress}
        onSave={handleSaveAddress}
      />
    </div>
  )
}
