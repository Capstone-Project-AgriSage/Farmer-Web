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

  /** Sends a 6-digit code by SMS to the account's phone (202, also when a code was sent less than a minute ago). */
  requestPhoneVerification: () =>
    api<void>('/api/auth/phone-verification/request', { method: 'POST' }),

  /** 204 when the code matches; 422 for a wrong, used or expired code (5 wrong tries kill the code). */
  confirmPhone: (code: string) =>
    api<void>('/api/auth/phone-verification/confirm', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  /**
   * Password reset, anonymous. 202 whether or not the account exists (nothing is revealed): a phone gets a 6-digit SMS
   * code, an email gets a long token. 503 when the message channel is not configured.
   */
  forgotPassword: (identifier: string) =>
    api<void>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    }),

  /** Checks an SMS code without using it: 204 right, 422 wrong/expired/unknown phone (a wrong one spends 1 of 5 tries). */
  verifyResetCode: (identifier: string, code: string) =>
    api<void>('/api/auth/reset-password/verify-code', {
      method: 'POST',
      body: JSON.stringify({ identifier, code }),
    }),

  /** SMS reset: the phone and the 6-digit code, checked again here. 204 done; 422 wrong, used up or expired. */
  resetPasswordWithCode: (identifier: string, code: string, newPassword: string) =>
    api<void>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ identifier, code, newPassword }),
    }),

  /** Email reset: the long token the email carries. */
  resetPasswordWithToken: (token: string, newPassword: string) =>
    api<void>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),
}
