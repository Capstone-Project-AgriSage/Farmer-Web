import { createContext, useContext, useState, type ReactNode } from 'react'
import type { FarmerUser, StoreInfo } from '../types'

const DEFAULT_FARMER: FarmerUser = {
  id: 'FARMER-8802',
  name: 'Nguyễn Văn Hùng',
  phone: '0918 234 567',
  address: 'Ấp Thới Phước 1, Xã Tân Thạnh, Huyện Thới Lai, TP. Cần Thơ',
  commune: 'Xã Tân Thạnh',
  district: 'Huyện Thới Lai',
  province: 'TP. Cần Thơ',
  landArea: '3.5 ha canh tác lúa giống ST25',
  creditLimit: 50000000,
  creditUsed: 13545000,
  initials: 'NH',
}

export const ACTIVE_STORE: StoreInfo = {
  id: 'STORE-HT-01',
  name: 'Đại lý Vật tư Nông nghiệp Hai Thắng',
  address: 'Thị trấn Thới Lai, Huyện Thới Lai, TP. Cần Thơ (ĐBSCL)',
  phone: '0918 234 567',
  bankName: 'Vietcombank - CN Cần Thơ',
  bankAccountNumber: '19006828999',
  bankAccountName: 'NGUYEN VAN THANG (HAI THANG)',
}

interface AuthContextValue {
  farmer: FarmerUser
  activeStore: StoreInfo
  updateFarmerProfile: (updates: Partial<FarmerUser>) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [farmer, setFarmer] = useState<FarmerUser>(DEFAULT_FARMER)

  const updateFarmerProfile = (updates: Partial<FarmerUser>) => {
    setFarmer((prev) => ({ ...prev, ...updates }))
  }

  return (
    <AuthContext.Provider value={{ farmer, activeStore: ACTIVE_STORE, updateFarmerProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
