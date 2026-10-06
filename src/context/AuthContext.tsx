import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { FarmerUser, StoreInfo } from '../types'
import { authApi } from '../api/authApi'
import { profileApi } from '../api/profileApi'
import { ApiError } from '../api/client'

const STORAGE_KEY = 'agrisage.farmer_auth.v1'
const TOKEN_KEY = 'agrisage.farmer_token'

// Filled from the login response and GET /api/me/profile; credit and addresses have their own APIs.
const EMPTY_FARMER: FarmerUser = { id: '', name: '', phone: '', initials: '' }

const initialsOf = (fullName: string | null | undefined) =>
  fullName ? fullName.trim().split(/\s+/).map((n) => n[0]).slice(-2).join('').toUpperCase() : ''

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
  const [farmer, setFarmer] = useState<FarmerUser>(EMPTY_FARMER)

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
            initials: initialsOf(prof.fullName) || prev.initials,
          }))
        })
        .catch(() => {
          // Ignore background sync error
        })
    } else {
      localStorage.setItem(STORAGE_KEY, '0')
      localStorage.removeItem(TOKEN_KEY)
      setFarmer(EMPTY_FARMER)
    }
  }, [isAuthenticated])

  const login = async (contact: string, password: string) => {
    const res = await authApi.login({ identifier: contact, password })
    // Store staff sign in to the management web; this app only serves farmers.
    if (res.user && res.user.role !== 'FARMER') {
      throw new ApiError(403, 'Forbidden', 'Tài khoản nhân viên không dùng được trang nông dân. Vui lòng đăng nhập trang quản lý.')
    }
    localStorage.setItem(TOKEN_KEY, res.accessToken)
    localStorage.setItem(STORAGE_KEY, '1')
    setIsAuthenticated(true)
    if (res.user) {
      setFarmer((prev) => ({
        ...prev,
        id: res.user.id,
        name: res.user.fullName || prev.name,
        phone: res.user.phoneNumber || prev.phone,
        initials: initialsOf(res.user.fullName) || prev.initials,
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
        initials: initialsOf(fullName) || prev.initials,
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
