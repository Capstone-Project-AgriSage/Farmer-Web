import { useState, useEffect, useId, useRef } from 'react'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useAuth } from '../../context/AuthContext'
import { profileApi } from '../../api/profileApi'
import type { FarmerProfile, AddressResponse, AddressRequest } from '../../api/types'
import AddressModal from './components/AddressModal'

const GENDER_LABEL: Record<string, string> = { MALE: 'Nam', FEMALE: 'Nữ', OTHER: 'Khác' }
const ADDRESS_TYPE_LABEL: Record<string, string> = { HOME: 'Nhà riêng', FARM: 'Vườn' }

const inputClass =
  'focus-ring w-full min-h-[48px] px-4 py-2.5 text-[16px] bg-white border border-brand-dark/30 hover:border-brand-dark/60 rounded-[var(--radius-input)] text-text-primary'
const labelClass = 'block text-[15px] text-text-secondary mb-1.5'
const textButton =
  'focus-ring min-h-[44px] px-4 rounded-full text-[15px] text-text-primary hover:bg-brand-light transition-colors'

const cardClass = 'bg-white border border-brand-dark/15 rounded-[var(--radius-surface)]'
const MAX_ADDRESSES = 10

function Field({ label, value, emptyText }: { label: string; value: string | null | undefined; emptyText: string }) {
  return (
    <div>
      <dt className="text-[13px] text-text-secondary">{label}</dt>
      {value ? (
        <dd className="mt-1 text-[17px] text-text-primary break-words">{value}</dd>
      ) : (
        <dd className="mt-1 text-[16px] italic text-text-muted">{emptyText}</dd>
      )}
    </div>
  )
}

type MenuAction = { label: string; onSelect: () => void; danger?: boolean }

function ActionsMenu({ label, actions }: { label: string; actions: MenuAction[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!isOpen) return
    rootRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')?.focus()
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  const moveFocus = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const items = Array.from(rootRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [])
    const current = items.indexOf(document.activeElement as HTMLButtonElement)
    const next = e.key === 'ArrowDown' ? (current + 1) % items.length : (current - 1 + items.length) % items.length
    items[next]?.focus()
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={() => setIsOpen((v) => !v)}
        className="focus-ring w-11 h-11 rounded-full flex items-center justify-center text-text-secondary hover:bg-brand-light hover:text-text-primary transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>
      {isOpen && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          onKeyDown={moveFocus}
          className="absolute right-0 top-full mt-1 z-20 min-w-[180px] py-1 bg-white border border-brand-dark/15 rounded-[var(--radius-input)] shadow-[0_8px_24px_rgba(45,58,46,0.12)]"
        >
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setIsOpen(false)
                action.onSelect()
              }}
              className={`focus-ring w-full min-h-[44px] px-4 text-left text-[15px] transition-colors ${
                action.danger
                  ? 'text-status-error hover:bg-status-error-surface'
                  : 'text-text-primary hover:bg-brand-light'
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ReadOnlyField({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div>
      <p className={labelClass}>{label}</p>
      <p className="min-h-[48px] px-4 py-3 text-[16px] bg-brand-light rounded-[var(--radius-input)] text-text-secondary break-words">
        {value}
      </p>
      {note && <p className="mt-1 text-[13px] text-text-muted">{note}</p>}
    </div>
  )
}

export default function AccountPage() {
  useDocumentTitle('Tài khoản của tôi - AgriSage')
  const { activeStore } = useAuth()

  const [profile, setProfile] = useState<FarmerProfile | null>(null)
  const [addresses, setAddresses] = useState<AddressResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [notice, setNotice] = useState<{ tone: 'success' | 'error'; text: string } | null>(null)
  const [isSavingProfile, setIsSavingProfile] = useState(false)

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
    setIsSavingProfile(true)
    setNotice(null)
    try {
      const updated = await profileApi.updateProfile({
        fullName: formData.fullName,
        gender: formData.gender || null,
        dateOfBirth: formData.dateOfBirth || null
      } as any)
      setProfile(updated)
      setIsEditing(false)
      setNotice({ tone: 'success', text: 'Đã cập nhật thông tin.' })
    } catch (err) {
      console.error(err)
      setNotice({ tone: 'error', text: 'Có lỗi xảy ra khi cập nhật. Bác thử lại nhé.' })
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        gender: profile.gender || '',
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
      })
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
    if (!window.confirm('Bác có chắc chắn muốn xóa địa chỉ này?')) return
    try {
      await profileApi.deleteAddress(id)
      await loadData()
    } catch (err) {
      console.error(err)
      setNotice({ tone: 'error', text: 'Không thể xóa địa chỉ.' })
    }
  }

  const handleSetDefaultAddress = async (id: string) => {
    try {
      await profileApi.setDefaultAddress(id)
      await loadData()
    } catch (err) {
      console.error(err)
      setNotice({ tone: 'error', text: 'Không thể đặt địa chỉ mặc định.' })
    }
  }

  if (isLoading && !profile) {
    return (
      <div className="bg-brand-cream min-h-screen">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-14 space-y-6" aria-busy="true" aria-label="Đang tải thông tin tài khoản">
          <div className="h-10 w-64 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
          <div className="h-24 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
          <div className="h-56 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
        </div>
      </div>
    )
  }

  if (loadError && !profile) {
    return (
      <div className="min-h-screen bg-brand-cream text-brand-dark py-16 px-6">
        <div role="alert" className="max-w-md mx-auto bg-white border border-brand-dark/15 rounded-[var(--radius-surface)] p-8 text-center">
          <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 44 }} aria-hidden="true">
            cloud_off
          </span>
          <h1 className="mt-3 text-xl text-text-primary">Không thể tải thông tin</h1>
          <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">{loadError}</p>
          <button
            type="button"
            onClick={loadData}
            className="focus-ring mt-6 min-h-[48px] px-7 rounded-full bg-brand-dark text-white hover:bg-brand-green text-base transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  if (!profile) return null

  const initials = (profile.fullName || 'ND').trim().split(' ').filter(Boolean).map(n => n[0]).slice(-2).join('')
  const missingFields = [
    !profile.gender && 'giới tính',
    !profile.dateOfBirth && 'ngày sinh',
  ].filter(Boolean) as string[]

  return (
    <div className="bg-brand-cream text-brand-dark min-h-screen pb-20">
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Tài khoản' }]} />

      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-10 md:py-14">
        <p className="text-[13px] uppercase tracking-[0.16em] text-text-secondary mb-3">Tài khoản</p>
        <h1 className="text-[length:var(--type-h1)] leading-[var(--type-h1-lh)] font-light tracking-tight text-text-primary">
          Tài khoản của tôi
        </h1>

        {notice && (
          <p
            role={notice.tone === 'error' ? 'alert' : 'status'}
            className={`mt-6 rounded-[var(--radius-surface)] border p-3 text-[15px] ${
              notice.tone === 'error'
                ? 'border-status-error/40 bg-status-error-surface text-status-error'
                : 'border-status-success/40 bg-status-success-surface text-status-success'
            }`}
          >
            {notice.text}
          </p>
        )}

        <div className="mt-10 flex flex-col gap-10">
          {/* Profile card: identity + personal information */}
          <section aria-labelledby="account-name" className={cardClass}>
            <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-5">
              <div
                className="w-20 h-20 shrink-0 rounded-full border border-brand-dark/30 flex items-center justify-center text-2xl text-text-primary"
                aria-hidden="true"
              >
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 id="account-name" className="text-2xl font-medium tracking-tight text-text-primary break-words">
                    {profile.fullName || 'Chưa cập nhật tên'}
                  </h2>
                  {profile.customerGroup && (
                    <span className="px-3 py-0.5 rounded-full border border-brand-dark/30 text-[13px] text-text-secondary">
                      {profile.customerGroup.name}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-[16px] text-text-secondary tabular-nums">
                  {profile.phoneNumber || 'Chưa cập nhật số điện thoại'} · Đại lý: <span className="text-text-primary">{activeStore.name}</span>
                </p>
              </div>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className={`${textButton} border border-brand-dark/30 self-start sm:self-center`}
                >
                  Chỉnh sửa
                </button>
              )}
            </div>

            <div className="border-t border-brand-dark/15 p-6">
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    <div>
                      <label htmlFor="acc-name" className={labelClass}>Họ và tên</label>
                      <input
                        id="acc-name"
                        type="text"
                        autoComplete="name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <ReadOnlyField
                      label="Số điện thoại"
                      value={profile.phoneNumber || 'Chưa có'}
                      note="Không đổi được ở đây"
                    />
                    <div>
                      <label htmlFor="acc-gender" className={labelClass}>Giới tính</label>
                      <select
                        id="acc-gender"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                        className={inputClass}
                      >
                        <option value="">Chưa cập nhật</option>
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                        <option value="OTHER">Khác</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="acc-dob" className={labelClass}>Ngày sinh</label>
                      <input
                        id="acc-dob"
                        type="date"
                        value={formData.dateOfBirth}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <ReadOnlyField
                      label="Email"
                      value={profile.email || 'Chưa có'}
                      note="Không đổi được ở đây"
                    />
                  </div>
                  <div className="mt-6 pt-5 border-t border-brand-dark/15 flex justify-end gap-2">
                    <button type="button" onClick={handleCancelEdit} disabled={isSavingProfile} className={`${textButton} disabled:opacity-40`}>
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                      className="focus-ring min-h-[44px] px-6 rounded-full bg-brand-dark text-white hover:bg-brand-green text-[15px] transition-colors disabled:opacity-50"
                    >
                      {isSavingProfile ? 'Đang lưu…' : 'Lưu'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
                    <Field label="Giới tính" value={GENDER_LABEL[profile.gender ?? '']} emptyText="Chưa cập nhật" />
                    <Field
                      label="Ngày sinh"
                      value={profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('vi-VN') : null}
                      emptyText="Chưa cập nhật"
                    />
                    <Field label="Email" value={profile.email} emptyText="Chưa có" />
                  </dl>
                  {missingFields.length > 0 && (
                    <div className="mt-5 px-4 py-3 rounded-[var(--radius-surface)] bg-status-warning-surface text-[15px] text-text-primary flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                      <p>Bác bổ sung {missingFields.join(', ')} để đại lý hỗ trợ tốt hơn.</p>
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="focus-ring min-h-[44px] underline underline-offset-2 hover:text-brand-green"
                      >
                        Cập nhật ngay
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Address book */}
          <section aria-labelledby="account-addresses">
            <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
              <h2 id="account-addresses" className="text-[18px] font-medium text-text-primary">
                Sổ địa chỉ
                {addresses.length > 0 && (
                  <span className="ml-2 text-[14px] font-normal text-text-muted tabular-nums">
                    {addresses.length}/{MAX_ADDRESSES}
                  </span>
                )}
              </h2>
              {addresses.length < MAX_ADDRESSES && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingAddress(null)
                    setIsModalOpen(true)
                  }}
                  className={`${textButton} border border-brand-dark/30 inline-flex items-center gap-1.5`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden="true">
                    add
                  </span>
                  Thêm địa chỉ
                </button>
              )}
            </div>

            {addresses.length === 0 ? (
              <div className={`${cardClass} p-10 text-center`}>
                <p className="text-lg text-text-primary">Bác chưa lưu địa chỉ nào.</p>
                <p className="mt-1 text-[15px] text-text-secondary">Lưu sẵn địa chỉ để đặt hàng nhanh hơn.</p>
              </div>
            ) : (
              <ul className={`${cardClass} divide-y divide-brand-dark/15`}>
                {addresses.map((addr) => (
                  <li key={addr.id} className="px-6 py-5 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-x-3 gap-y-1 flex-wrap">
                        <p className="text-[17px] font-medium text-text-primary tabular-nums">
                          {addr.recipientName} · {addr.recipientPhone}
                        </p>
                        {addr.isDefault && (
                          <span className="px-3 py-0.5 rounded-full bg-brand-dark text-white text-[13px]">Mặc định</span>
                        )}
                        <span className="px-3 py-0.5 rounded-full border border-brand-dark/30 text-[13px] text-text-secondary">
                          {ADDRESS_TYPE_LABEL[addr.addressType] ?? 'Khác'}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[16px] leading-relaxed text-text-secondary">
                        {addr.addressLine}, {addr.ward}, {addr.district}, {addr.province}
                      </p>
                    </div>
                    <div className="shrink-0 -mt-2 -mr-3">
                      <ActionsMenu
                        label={`Thao tác với địa chỉ của ${addr.recipientName}`}
                        actions={[
                          ...(addr.isDefault
                            ? []
                            : [{ label: 'Đặt làm mặc định', onSelect: () => handleSetDefaultAddress(addr.id) }]),
                          {
                            label: 'Sửa',
                            onSelect: () => {
                              setEditingAddress(addr)
                              setIsModalOpen(true)
                            },
                          },
                          ...(addr.isDefault
                            ? []
                            : [{ label: 'Xóa', onSelect: () => handleDeleteAddress(addr.id), danger: true }]),
                        ]}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
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
