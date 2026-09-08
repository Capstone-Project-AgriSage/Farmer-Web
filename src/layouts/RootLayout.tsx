import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Toast from '../components/ui/Toast'
import ScrollToTop from '../components/ScrollToTop'
import PageLoader from '../components/PageLoader'
import { useCart } from '../context/CartContext'

export default function RootLayout() {
  const { itemCount } = useCart()

  return (
    <div className="bg-surface-subtle font-sans text-text-primary min-h-screen flex flex-col justify-between selection:bg-primary-light selection:text-primary-dark">
      <ScrollToTop />
      <Header cartCount={itemCount} />
      <main className="flex-1 w-full bg-surface-subtle">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <Toast />
    </div>
  )
}
