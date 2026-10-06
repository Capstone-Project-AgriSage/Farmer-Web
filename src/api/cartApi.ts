import { api } from './client'
import type { Cart } from './types'

export interface AddToCartRequest {
  storeProductId: string;
  productPackagingId: string;
  quantity: number;
}

export const cartApi = {
  getCart: () => api<Cart>('/api/me/cart'),

  addItem: (data: AddToCartRequest) => api<Cart>('/api/me/cart/items', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  updateItemQuantity: (itemId: string, quantity: number) => api<Cart>(`/api/me/cart/items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity })
  }),

  removeItem: (itemId: string) => api<Cart>(`/api/me/cart/items/${itemId}`, {
    method: 'DELETE'
  }),

  clearCart: () => api<void>('/api/me/cart', {
    method: 'DELETE'
  })
}
