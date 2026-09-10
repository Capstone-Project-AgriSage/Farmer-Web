import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import RouteErrorBoundary from './components/RouteErrorBoundary'

const HomePage = lazy(() => import('./features/home/HomePage'))
const LoginPage = lazy(() => import('./features/auth/LoginPage'))
const RegisterPage = lazy(() => import('./features/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./features/auth/ForgotPasswordPage'))
const ProductsPage = lazy(() => import('./features/products/ProductsPage'))
const ProductDetailPage = lazy(() => import('./features/products/ProductDetailPage'))
const CartPage = lazy(() => import('./features/cart/CartPage'))
const CheckoutPage = lazy(() => import('./features/checkout/CheckoutPage'))
const OrderSuccessPage = lazy(() => import('./features/order/OrderSuccessPage'))
const AboutPage = lazy(() => import('./features/about/AboutPage'))
const KnowledgePage = lazy(() => import('./features/knowledge/KnowledgePage'))
const ArticleDetailPage = lazy(() => import('./features/knowledge/ArticleDetailPage'))
const ContactPage = lazy(() => import('./features/contact/ContactPage'))
const MyRequestsPage = lazy(() => import('./features/contact/MyRequestsPage'))
const AccountPage = lazy(() => import('./features/account/AccountPage'))
const AiDoctorPage = lazy(() => import('./features/ai-doctor/AiDoctorPage'))
const NotFoundPage = lazy(() => import('./features/misc/NotFoundPage'))

const routes = [
  { index: true, element: <HomePage /> },
  { path: 'login', element: <LoginPage /> },
  { path: 'register', element: <RegisterPage /> },
  { path: 'forgot-password', element: <ForgotPasswordPage /> },
  { path: 'products', element: <ProductsPage /> },
  { path: 'products/:slug', element: <ProductDetailPage /> },
  { path: 'cart', element: <CartPage /> },
  { path: 'checkout', element: <CheckoutPage /> },
  { path: 'order-success', element: <OrderSuccessPage /> },
  { path: 'about', element: <AboutPage /> },
  { path: 'knowledge', element: <KnowledgePage /> },
  { path: 'knowledge/:slug', element: <ArticleDetailPage /> },
  { path: 'contact', element: <ContactPage /> },
  { path: 'contact/requests', element: <MyRequestsPage /> },
  { path: 'account', element: <AccountPage /> },
  { path: 'ai-doctor', element: <AiDoctorPage /> },
  { path: '*', element: <NotFoundPage /> },
].map((route) => ({ ...route, errorElement: <RouteErrorBoundary /> }))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: routes,
  },
])
