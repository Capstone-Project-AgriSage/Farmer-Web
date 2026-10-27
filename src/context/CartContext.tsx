import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { cartApi, type AddToCartRequest } from '../api/cartApi'
import { ApiError, describeApiError } from '../api/client'
import type { Cart, CartItem } from '../api/types'
import { useAuth } from './AuthContext'
import { usePermissions } from './PermissionContext'

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  subtotal: number
  toastMessage: string | null
  isLoading: boolean
  /** Resolves to true when the server accepted the line. */
  addToCart: (request: AddToCartRequest, productName: string) => Promise<boolean>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
  showToast: (message: string) => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const TOAST_DURATION_MS = 3200
const EMPTY_CART: Cart = { id: null, items: [], subtotalAmount: 0, priceListId: null }

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const { hasPermission } = usePermissions()
  const canRead = hasPermission('MY_CART.READ')
  const requestVersion = useRef(0)
  const [cart, setCart] = useState<Cart | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToastMessage(message)
    toastTimer.current = setTimeout(() => setToastMessage(null), TOAST_DURATION_MS)
  }

  const refreshCart = async () => {
    const version = ++requestVersion.current
    const token = localStorage.getItem('agrisage.farmer_token')
    if (!isAuthenticated || !canRead) {
      setCart(EMPTY_CART)
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    try {
      const data = await cartApi.getCart()
      if (version === requestVersion.current && token === localStorage.getItem('agrisage.farmer_token')) setCart(data)
    } catch (err: any) {
      if (err?.status !== 401) {
        console.error('Failed to load cart', err)
      }
      if (version === requestVersion.current) setCart(EMPTY_CART)
    } finally {
      if (version === requestVersion.current) setIsLoading(false)
    }
  }

  // The cart lives on the server per farmer: reload it whenever the session changes.
  useEffect(() => {
    refreshCart()
    return () => { requestVersion.current++ }
  }, [isAuthenticated, canRead])

  const cartErrorMessage = (err: unknown, fallback: string) =>
    err instanceof ApiError && err.status === 401
      ? 'Bác vui lòng đăng nhập để mua hàng.'
      : describeApiError(err, fallback)

  const addToCart = async (request: AddToCartRequest, productName: string) => {
    if (!isAuthenticated) {
      showToast('Bác vui lòng đăng nhập để mua hàng.')
      return false
    }
    if (!hasPermission('MY_CART.ADD_ITEM')) {
      showToast('Bác chưa được cấp quyền thêm sản phẩm vào giỏ hàng.')
      return false
    }
    const token = localStorage.getItem('agrisage.farmer_token')
    const version = ++requestVersion.current
    setIsLoading(true)
    try {
      const data = await cartApi.addItem(request)
      if (version !== requestVersion.current || token !== localStorage.getItem('agrisage.farmer_token')) return false
      setCart(data)
      showToast(`Đã thêm "${productName}" vào giỏ hàng`)
      return true
    } catch (err) {
      if (version !== requestVersion.current || token !== localStorage.getItem('agrisage.farmer_token')) return false
      showToast(cartErrorMessage(err, 'Không thêm được vào giỏ hàng'))
      return false
    } finally {
      if (version === requestVersion.current) setIsLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!hasPermission('MY_CART.UPDATE')) return
    const token = localStorage.getItem('agrisage.farmer_token')
    const version = ++requestVersion.current
    setIsLoading(true)
    try {
      const data = await cartApi.updateItemQuantity(itemId, quantity)
      if (version === requestVersion.current && token === localStorage.getItem('agrisage.farmer_token')) setCart(data)
    } catch (err) {
      if (version !== requestVersion.current || token !== localStorage.getItem('agrisage.farmer_token')) return
      showToast(cartErrorMessage(err, 'Không cập nhật được số lượng'))
      await refreshCart()
    } finally {
      if (version === requestVersion.current) setIsLoading(false)
    }
  }

  const removeFromCart = async (itemId: string) => {
    if (!hasPermission('MY_CART.DELETE')) return
    const token = localStorage.getItem('agrisage.farmer_token')
    const version = ++requestVersion.current
    setIsLoading(true)
    try {
      const data = await cartApi.removeItem(itemId)
      if (version === requestVersion.current && token === localStorage.getItem('agrisage.farmer_token')) setCart(data)
    } catch (err) {
      if (version !== requestVersion.current || token !== localStorage.getItem('agrisage.farmer_token')) return
      showToast(cartErrorMessage(err, 'Không xoá được sản phẩm'))
      await refreshCart()
    } finally {
      if (version === requestVersion.current) setIsLoading(false)
    }
  }

  const clearCart = async () => {
    if (!hasPermission('MY_CART.DELETE')) return
    const token = localStorage.getItem('agrisage.farmer_token')
    const version = ++requestVersion.current
    setIsLoading(true)
    try {
      await cartApi.clearCart()
      if (version === requestVersion.current && token === localStorage.getItem('agrisage.farmer_token')) setCart(EMPTY_CART)
    } catch (err) {
      if (version !== requestVersion.current || token !== localStorage.getItem('agrisage.farmer_token')) return
      showToast(cartErrorMessage(err, 'Không làm trống được giỏ hàng'))
    } finally {
      if (version === requestVersion.current) setIsLoading(false)
    }
  }

  const items = canRead ? cart?.items || [] : []
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = canRead ? cart?.subtotalAmount || 0 : 0

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        toastMessage,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
