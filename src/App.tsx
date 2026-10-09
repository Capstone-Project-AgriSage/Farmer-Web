import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotificationsProvider } from './context/NotificationsContext'
import { CartProvider } from './context/CartContext'
import { router } from './router'

function App() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </NotificationsProvider>
    </AuthProvider>
  )
}

export default App
