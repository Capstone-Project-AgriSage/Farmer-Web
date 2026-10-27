import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { usePermissions } from '../context/PermissionContext'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Toast from '../components/ui/Toast'
import ScrollToTop from '../components/ScrollToTop'
import PageLoader from '../components/PageLoader'
import { useCart } from '../context/CartContext'

export default function RootLayout() {
  const { itemCount } = useCart()
  const location = useLocation()
  const { refreshPermissions } = usePermissions()
  useEffect(() => { void refreshPermissions() }, [location.pathname, refreshPermissions])

  return (
    <div className="bg-brand-cream font-helvetica-neue text-brand-dark min-h-screen flex flex-col justify-between selection:bg-brand-light selection:text-brand-dark antialiased">
      <ScrollToTop />
      <Header cartCount={itemCount} />
      <main className="flex-1 w-full bg-brand-cream">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <Toast />
    </div>
  )
}
