import { api } from './client'
import type { FarmerProfile, AddressRequest, AddressResponse } from './types'

export const profileApi = {
  getProfile: () => api<FarmerProfile>('/api/me/profile'),
  
  updateProfile: (data: Partial<FarmerProfile>) => api<FarmerProfile>('/api/me/profile', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  getAddresses: () => api<AddressResponse[]>('/api/me/addresses'),
  
  createAddress: (data: AddressRequest) => api<AddressResponse>('/api/me/addresses', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  updateAddress: (id: string, data: AddressRequest) => api<AddressResponse>(`/api/me/addresses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  deleteAddress: (id: string) => api<void>(`/api/me/addresses/${id}`, {
    method: 'DELETE'
  }),

  setDefaultAddress: (id: string) => api<AddressResponse>(`/api/me/addresses/${id}/set-default`, {
    method: 'POST'
  })
}
