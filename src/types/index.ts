export type ProductGroup =
  | 'Thuốc BVTV & Trừ nấm'
  | 'Phân bón NPK & Vi lượng'
  | 'Phân hữu cơ vi sinh'
  | 'Hạt giống & Cây giống'
  | 'Thuốc trừ sâu sinh học'
  | 'Tưới nhỏ giọt & Thiết bị'

/** Discrete availability state — matches agent_agrisage's inventory status enum exactly, so the two apps agree on what "in stock" means. Kept separate from `stockLabel`, which is free-form customer-facing copy (warehouse, quantity) and isn't meant to be machine-comparable. */
export type StockStatus = 'Còn hàng' | 'Sắp hết' | 'Hết hàng'

export interface Product {
  slug: string
  name: string
  brand: string
  category: string
  group: ProductGroup
  activeIngredient: string
  packaging: string
  image: string
  price: number
  originalPrice?: number
  wholesalePrice?: number
  wholesaleUnit?: string
  stockLabel: string
  stockStatus: StockStatus
  tag?: string
  rating?: number
  reviewCount?: number
  soldCount?: number
  diseaseTags?: string[]
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  code: string
  items: CartItem[]
  subtotal: number
  discount: number
  shippingFee: number
  total: number
  voucherCode?: string
  recipientName: string
  recipientPhone: string
  address: string
  paymentMethod: string
  estimatedDelivery: string
}
