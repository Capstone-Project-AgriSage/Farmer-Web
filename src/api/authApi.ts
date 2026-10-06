import { api } from './client'

export interface LoginRequest {
  identifier: string
  password: string
}

export interface RegisterFarmerRequest {
  fullName: string
  phoneNumber: string
  email?: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  expiresAt: string
  user: {
    id: string
    fullName: string
    phoneNumber: string
    email: string
    role: string
  }
}

export interface CurrentUserResponse {
  id: string
  fullName: string
  phoneNumber: string
  email: string
  role: string
  status: string
  phoneVerified: boolean
  emailVerified: boolean
}

export const authApi = {
  login: (data: LoginRequest) =>
    api<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: RegisterFarmerRequest) =>
    api<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMe: () => api<CurrentUserResponse>('/api/auth/me'),
}
