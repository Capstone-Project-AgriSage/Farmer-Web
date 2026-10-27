import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { permissionsApi, type CurrentPermissions } from '../api/permissionsApi'
import { profileApi } from '../api/profileApi'
import { useAuth } from './AuthContext'

interface PermissionContextValue {
  status: 'loading' | 'ready' | 'error'
  hasPermission: (code: string) => boolean
  refreshPermissions: () => Promise<void>
}

const PermissionContext = createContext<PermissionContextValue | undefined>(undefined)

export function PermissionProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, updateFarmerProfile } = useAuth()
  const [snapshot, setSnapshot] = useState<CurrentPermissions | null>(null)
  const [status, setStatus] = useState<PermissionContextValue['status']>('loading')
  const request = useRef<AbortController | null>(null)
  const session = useRef<string | null>(null)

  const refreshPermissions = useCallback(async () => {
    const token = localStorage.getItem('agrisage.farmer_token')
    if (!isAuthenticated || !token) return
    // Navigation and focus can arrive together; the most recent response owns the state.
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    try {
      const value = await permissionsApi.current(controller.signal)
      if (controller.signal.aborted || token !== localStorage.getItem('agrisage.farmer_token')) return
      if (value.role !== 'FARMER' || !Array.isArray(value.permissions)) throw new Error('Invalid permission response')
      session.current = token
      setSnapshot(value)
      setStatus('ready')
    } catch {
      if (controller.signal.aborted || token !== localStorage.getItem('agrisage.farmer_token')) return
      setSnapshot(null)
      setStatus('error')
    }
  }, [isAuthenticated])

  useEffect(() => {
    setSnapshot(null)
    setStatus('loading')
    session.current = null
    if (isAuthenticated) void refreshPermissions()
    const refreshVisible = () => {
      if (document.visibilityState === 'visible') void refreshPermissions()
    }
    window.addEventListener('permissions:changed', refreshVisible)
    const realtime = (event: Event) => {
      const topic = (event as CustomEvent<{ topic: string }>).detail?.topic
      if (topic === 'permissions' || topic === 'resync') void refreshPermissions()
    }
    window.addEventListener('agrisage-realtime-change', realtime)
    return () => {
      request.current?.abort()
      window.removeEventListener('agrisage-realtime-change', realtime)
      window.removeEventListener('permissions:changed', refreshVisible)
    }
  }, [isAuthenticated, refreshPermissions])

  const hasPermission = useCallback((code: string) => isAuthenticated
    && status === 'ready'
    && session.current === localStorage.getItem('agrisage.farmer_token')
    && Boolean(snapshot?.permissions.includes(code)), [isAuthenticated, status, snapshot])

  const canReadProfile = hasPermission('MY_PROFILE.READ')
  useEffect(() => {
    if (!canReadProfile) return
    let cancelled = false
    const token = localStorage.getItem('agrisage.farmer_token')
    profileApi.getProfile().then((profile) => {
      if (cancelled || token !== localStorage.getItem('agrisage.farmer_token')) return
      updateFarmerProfile({
        id: profile.userId,
        name: profile.fullName,
        phone: profile.phoneNumber || '',
        initials: profile.fullName.trim().split(/\s+/).map((name) => name[0]).slice(-2).join('').toUpperCase(),
      })
    }).catch(() => {})
    return () => { cancelled = true }
  }, [canReadProfile, updateFarmerProfile])

  return <PermissionContext.Provider value={{ status, hasPermission, refreshPermissions }}>{children}</PermissionContext.Provider>
}

export function usePermissions() {
  const value = useContext(PermissionContext)
  if (!value) throw new Error('usePermissions must be used within PermissionProvider')
  return value
}
