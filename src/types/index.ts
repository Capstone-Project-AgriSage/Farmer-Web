export type ProductGroup =
  | 'Thuốc BVTV & Trừ nấm'
  | 'Phân bón NPK & Vi lượng'
  | 'Phân hữu cơ vi sinh'
  | 'Hạt giống & Cây giống'
  | 'Thuốc trừ sâu sinh học'
  | 'Tưới nhỏ giọt & Thiết bị'

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
