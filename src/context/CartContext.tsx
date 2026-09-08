import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { CartItem, Product } from '../types'
import { initialCart } from '../data/mockCart'
import { getProductBySlug } from '../data/mockProducts'

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  subtotal: number
  toastMessage: string | null
  addToCart: (product: Product, quantity?: number) => void
  updateQuantity: (slug: string, quantity: number) => void
  removeFromCart: (slug: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const TOAST_DURATION_MS = 2200
const STORAGE_KEY = 'agrisage.cart.v1'

interface StoredCartEntry {
  slug: string
  quantity: number
}

function loadStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialCart

    const parsed = JSON.parse(raw) as StoredCartEntry[]
    if (!Array.isArray(parsed)) return initialCart

    const items = parsed
      .map((entry) => {
        const product = getProductBySlug(entry.slug)
        if (!product || !Number.isFinite(entry.quantity) || entry.quantity < 1) return null
        return { product, quantity: entry.quantity }
      })
      .filter((item): item is CartItem => item !== null)

    return items
  } catch {
    return initialCart
  }
}

function persistCart(items: CartItem[]) {
  try {
    const toStore: StoredCartEntry[] = items.map((item) => ({
      slug: item.product.slug,
      quantity: item.quantity,
    }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore))
  } catch {
    // localStorage unavailable (private browsing, quota exceeded, etc.) — cart just won't persist.
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadStoredCart)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    persistCart(items)
  }, [items])

  const showToast = (message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToastMessage(message)
    toastTimer.current = setTimeout(() => setToastMessage(null), TOAST_DURATION_MS)
  }

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.slug === product.slug)
      if (existing) {
        return prev.map((item) =>
          item.product.slug === product.slug
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }
      return [...prev, { product, quantity }]
    })
    showToast(`Đã thêm "${product.name}" vào giỏ hàng`)
  }

  const updateQuantity = (slug: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.slug === slug ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    )
  }

  const removeFromCart = (slug: string) => {
    setItems((prev) => prev.filter((item) => item.product.slug !== slug))
  }

  const clearCart = () => setItems([])

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  )

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        toastMessage,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
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
