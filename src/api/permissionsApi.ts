import { api } from './client'

export interface CurrentPermissions {
  role: string
  storeId: string | null
  roleVersion: number
  memberVersion: number | null
  permissions: string[]
}

export const permissionsApi = {
  current: (signal?: AbortSignal) => api<CurrentPermissions>('/api/me/permissions', { signal }),
}
