import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import HomePage from './features/home/HomePage'
import LoginPage from './features/auth/LoginPage'
import RegisterPage from './features/auth/RegisterPage'
import ForgotPasswordPage from './features/auth/ForgotPasswordPage'
import ProductsPage from './features/products/ProductsPage'
import ProductDetailPage from './features/products/ProductDetailPage'
import CartPage from './features/cart/CartPage'
import CheckoutPage from './features/checkout/CheckoutPage'
import OrderSuccessPage from './features/order/OrderSuccessPage'
import AboutPage from './features/about/AboutPage'
import KnowledgePage from './features/knowledge/KnowledgePage'
import ContactPage from './features/contact/ContactPage'
import AccountPage from './features/account/AccountPage'
import AiDoctorPage from './features/ai-doctor/AiDoctorPage'
import NotFoundPage from './features/misc/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
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
      { path: 'contact', element: <ContactPage /> },
      { path: 'account', element: <AccountPage /> },
      { path: 'ai-doctor', element: <AiDoctorPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
