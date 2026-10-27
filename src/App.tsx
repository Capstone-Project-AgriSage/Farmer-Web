import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PermissionProvider } from './context/PermissionContext'
import { NotificationsProvider } from './context/NotificationsContext'
import { CartProvider } from './context/CartContext'
import { router } from './router'
import { RealtimeProvider } from './context/RealtimeProvider'

function App() {
  return (
    <AuthProvider>
      <RealtimeProvider>
        <PermissionProvider>
          <NotificationsProvider>
            <CartProvider>
              <RouterProvider router={router} />
            </CartProvider>
          </NotificationsProvider>
        </PermissionProvider>
      </RealtimeProvider>
    </AuthProvider>
  )
}

export default App
