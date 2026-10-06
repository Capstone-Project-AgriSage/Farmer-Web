import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { FarmerUser, StoreInfo } from '../types'
import { authApi } from '../api/authApi'
import { profileApi } from '../api/profileApi'

const STORAGE_KEY = 'agrisage.farmer_auth.v1'
const TOKEN_KEY = 'agrisage.farmer_token'

const DEFAULT_FARMER: FarmerUser = {
  id: 'FARMER-8802',
  name: 'Nguyễn Văn Hùng',
  phone: '0918 234 567',
  address: 'Ấp Thới Phước 1, Xã Tân Thạnh, Huyện Thới Lai, TP. Cần Thơ',
  addresses: [
    { id: 'addr-1', text: 'Ấp Thới Phước 1, Xã Tân Thạnh, Huyện Thới Lai, TP. Cần Thơ', isDefault: true },
    { id: 'addr-2', text: 'Ấp Thới Phước 2, Xã Tân Thạnh, Huyện Thới Lai, TP. Cần Thơ', isDefault: false },
  ],
  customerGroup: 'Khách hàng thân thiết (Hạng Vàng)',
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
    const token = localStorage.getItem(TOKEN_KEY)
    return Boolean(token && token.includes('.'))
  })
  const [farmer, setFarmer] = useState<FarmerUser>(DEFAULT_FARMER)

  useEffect(() => {
    // If user previously had mock auth flag '1' but no JWT token, attempt auto-login with default farmer
    const existingToken = localStorage.getItem(TOKEN_KEY)
    const hasMockFlag = localStorage.getItem(STORAGE_KEY) === '1'

    if ((!existingToken || !existingToken.includes('.')) && hasMockFlag) {
      authApi.login({ identifier: '0918234567', password: 'Password@123' })
        .then((res) => {
          localStorage.setItem(TOKEN_KEY, res.accessToken)
          setIsAuthenticated(true)
        })
        .catch(() => {
          localStorage.setItem(STORAGE_KEY, '0')
          setIsAuthenticated(false)
        })
    }
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAuthenticated(false)
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem(STORAGE_KEY, '1')
      // Sync profile from backend if available
      profileApi.getProfile()
        .then((prof) => {
          setFarmer((prev) => ({
            ...prev,
            id: prof.userId,
            name: prof.fullName,
            phone: prof.phoneNumber || prev.phone,
            initials: prof.fullName ? prof.fullName.split(' ').map((n) => n[0]).slice(-2).join('') : prev.initials,
          }))
        })
        .catch(() => {
          // Ignore background sync error
        })
    } else {
      localStorage.setItem(STORAGE_KEY, '0')
      localStorage.removeItem(TOKEN_KEY)
    }
  }, [isAuthenticated])

  const login = async (contact: string, password: string) => {
    const res = await authApi.login({ identifier: contact, password })
    localStorage.setItem(TOKEN_KEY, res.accessToken)
    localStorage.setItem(STORAGE_KEY, '1')
    setIsAuthenticated(true)
    if (res.user) {
      setFarmer((prev) => ({
        ...prev,
        id: res.user.id,
        name: res.user.fullName || prev.name,
        phone: res.user.phoneNumber || prev.phone,
        initials: res.user.fullName ? res.user.fullName.split(' ').map((n) => n[0]).slice(-2).join('') : prev.initials,
      }))
    }
  }

  const register = async (fullName: string, contact: string, password: string) => {
    const isEmail = contact.includes('@')
    const res = await authApi.register({
      fullName,
      phoneNumber: isEmail ? '' : contact,
      email: isEmail ? contact : undefined,
      password,
    })
    localStorage.setItem(TOKEN_KEY, res.accessToken)
    localStorage.setItem(STORAGE_KEY, '1')
    setIsAuthenticated(true)
    if (res.user) {
      setFarmer((prev) => ({
        ...prev,
        id: res.user.id,
        name: res.user.fullName || fullName,
        phone: res.user.phoneNumber || (!isEmail ? contact : prev.phone),
        initials: fullName ? fullName.split(' ').map((n) => n[0]).slice(-2).join('') : prev.initials,
      }))
    }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('agrisage_token')
    localStorage.setItem(STORAGE_KEY, '0')
    setIsAuthenticated(false)
  }

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
