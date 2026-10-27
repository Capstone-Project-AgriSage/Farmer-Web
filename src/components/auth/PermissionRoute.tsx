import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { usePermissions } from '../../context/PermissionContext'
import PageLoader from '../PageLoader'

export default function PermissionRoute({ codes, allowGuest = false, children }: {
  codes: string[]
  allowGuest?: boolean
  children: ReactNode
}) {
  const { isAuthenticated } = useAuth()
  const { status, hasPermission, refreshPermissions } = usePermissions()
  if (!isAuthenticated && allowGuest) return children
  if (status === 'loading') return <PageLoader />
  if (codes.every(hasPermission)) return children
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center space-y-5">
      <h1 className="text-2xl text-brand-dark">{status === 'error' ? 'Chưa tải được quyền truy cập' : 'Bác chưa được cấp quyền sử dụng chức năng này'}</h1>
      <p className="text-brand-dark/65">{status === 'error' ? 'Bác vui lòng kiểm tra kết nối rồi thử lại.' : 'Bác có thể liên hệ cửa hàng để được hỗ trợ.'}</p>
      <button type="button" onClick={() => void refreshPermissions()} className="focus-ring min-h-[44px] px-6 rounded-full bg-brand-dark text-white">Tải lại quyền</button>
      <Link to="/" className="focus-ring block underline">Về trang chủ</Link>
    </div>
  )
}
