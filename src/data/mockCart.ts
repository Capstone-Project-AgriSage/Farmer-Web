import type { CartItem } from '../types'
import { products } from './mockProducts'

export const initialCart: CartItem[] = [
  { product: products[0], quantity: 5 }, // Ridomil Gold 68WG
  { product: products[2], quantity: 2 }, // Đầu Trâu NPK
  { product: products[3], quantity: 3 }, // Humic King Root
  { product: products[1], quantity: 1 }, // Nativo 750WG
]
