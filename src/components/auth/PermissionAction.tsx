import type { ReactNode } from 'react'
import { useAuth } from '../../context/AuthContext'
import { usePermissions } from '../../context/PermissionContext'

export default function PermissionAction({ codes, allowGuest = false, children }: {
  codes: string[]
  allowGuest?: boolean
  children: ReactNode
}) {
  const { isAuthenticated } = useAuth()
  const { hasPermission } = usePermissions()
  return (!isAuthenticated && allowGuest) || codes.every(hasPermission) ? children : null
}
