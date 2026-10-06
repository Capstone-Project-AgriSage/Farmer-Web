import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { cartApi, type AddToCartRequest } from '../api/cartApi'
import { ApiError, describeApiError } from '../api/client'
import type { Cart, CartItem } from '../api/types'
import { useAuth } from './AuthContext'

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
    if (!localStorage.getItem('agrisage.farmer_token')) {
      setCart(EMPTY_CART)
      return
    }
    setIsLoading(true)
    try {
      const data = await cartApi.getCart()
      setCart(data)
    } catch (err: any) {
      if (err?.status !== 401) {
        console.error('Failed to load cart', err)
      }
      setCart(EMPTY_CART)
    } finally {
      setIsLoading(false)
    }
  }

  // The cart lives on the server per farmer: reload it whenever the session changes.
  useEffect(() => {
    refreshCart()
  }, [isAuthenticated])

  const cartErrorMessage = (err: unknown, fallback: string) =>
    err instanceof ApiError && err.status === 401
      ? 'Bác vui lòng đăng nhập để mua hàng.'
      : describeApiError(err, fallback)

  const addToCart = async (request: AddToCartRequest, productName: string) => {
    if (!isAuthenticated) {
      showToast('Bác vui lòng đăng nhập để mua hàng.')
      return false
    }
    setIsLoading(true)
    try {
      const data = await cartApi.addItem(request)
      setCart(data)
      showToast(`Đã thêm "${productName}" vào giỏ hàng`)
      return true
    } catch (err) {
      showToast(cartErrorMessage(err, 'Không thêm được vào giỏ hàng'))
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    setIsLoading(true)
    try {
      const data = await cartApi.updateItemQuantity(itemId, quantity)
      setCart(data)
    } catch (err) {
      showToast(cartErrorMessage(err, 'Không cập nhật được số lượng'))
      await refreshCart()
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (itemId: string) => {
    setIsLoading(true)
    try {
      const data = await cartApi.removeItem(itemId)
      setCart(data)
    } catch (err) {
      showToast(cartErrorMessage(err, 'Không xoá được sản phẩm'))
      await refreshCart()
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    setIsLoading(true)
    try {
      await cartApi.clearCart()
      setCart(EMPTY_CART)
    } catch (err) {
      showToast(cartErrorMessage(err, 'Không làm trống được giỏ hàng'))
    } finally {
      setIsLoading(false)
    }
  }

  const items = cart?.items || []
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart?.subtotalAmount || 0

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
