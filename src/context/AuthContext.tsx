import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'agrisage.farmer_auth.v1'

export interface FarmerUser {
  name: string
  phone: string
  area: string
}

const DEFAULT_USER: FarmerUser = {
  name: 'Nguyễn Văn Hùng',
  phone: '0918 234 567',
  area: 'Xã Đinh Lạc, Huyện Di Linh, Lâm Đồng',
}

interface AuthContextValue {
  isAuthenticated: boolean
  user: FarmerUser
  login: (contact: string, password: string) => Promise<void>
  register: (fullName: string, contact: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(STORAGE_KEY) === '1',
  )

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem(STORAGE_KEY, '1')
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [isAuthenticated])

  const login = async (_contact: string, _password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 900))
    setIsAuthenticated(true)
  }

  const register = async (_fullName: string, _contact: string, _password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 900))
    setIsAuthenticated(true)
  }

  const logout = () => setIsAuthenticated(false)

  return (
    <AuthContext.Provider value={{ isAuthenticated, user: DEFAULT_USER, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
