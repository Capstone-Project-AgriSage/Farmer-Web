import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    // The login page sends the farmer back here (an opened notification, a diagnosis case) after signing in.
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
