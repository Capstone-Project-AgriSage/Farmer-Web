import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { FarmerUser, StoreInfo } from '../types'

const STORAGE_KEY = 'agrisage.farmer_auth.v1'

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
  isAuthenticated: boolean
  user: FarmerUser
  farmer: FarmerUser
  activeStore: StoreInfo
  login: (contact: string, password: string) => Promise<void>
  register: (fullName: string, contact: string, password: string) => Promise<void>
  logout: () => void
  updateFarmerProfile: (updates: Partial<FarmerUser>) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY) !== '0'
  })
  const [farmer, setFarmer] = useState<FarmerUser>(DEFAULT_FARMER)

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem(STORAGE_KEY, '1')
    } else {
      localStorage.setItem(STORAGE_KEY, '0')
    }
  }, [isAuthenticated])

  const login = async (_contact: string, _password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsAuthenticated(true)
  }

  const register = async (_fullName: string, _contact: string, _password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsAuthenticated(true)
  }

  const logout = () => setIsAuthenticated(false)

  const updateFarmerProfile = (updates: Partial<FarmerUser>) => {
    setFarmer((prev) => ({ ...prev, ...updates }))
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user: farmer,
        farmer,
        activeStore: ACTIVE_STORE,
        login,
        register,
        logout,
        updateFarmerProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
