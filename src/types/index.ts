export type ProductGroup =
  | 'Thuốc đặc trị nấm & diệt khuẩn'
  | 'Phân bón NPK & Dinh dưỡng lúa'
  | 'Lúa giống xác nhận'
  | 'Thuốc BVTV & Trừ nấm'
  | 'Phân bón NPK & Vi lượng'
  | 'Phân hữu cơ vi sinh'
  | 'Hạt giống & Cây giống'
  | 'Tưới nhỏ giọt & Thiết bị'
  | 'Thuốc trừ sâu sinh học'


/** Discrete availability state — matches agent_agrisage's inventory status enum exactly. */
export type StockStatus = 'Còn hàng' | 'Sắp hết' | 'Hết hàng'

export interface Product {
  slug: string
  storeProductId?: string
  productPackagingId?: string
  name: string
  brand: string
  category: string
  isAvailable?: boolean
  /** Display group; catalog products carry their category name here. */
  group: ProductGroup | string
  activeIngredient: string
  packaging: string
  image: string
  price: number
  originalPrice?: number
  /** The price is the cheapest packaging ("từ …"), not a single fixed price. */
  priceFrom?: boolean
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

export type OrderStatus = 'PENDING_CONFIRMATION' | 'PENDING_PAYMENT' | 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED'

export type PaymentMethod = 'VIETQR' | 'SEASONAL_CREDIT'

export type DeliveryStatus = 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED'

export interface DeliveryPhase {
  id: string
  status: DeliveryStatus
  items: CartItem[]
  deliveryDate?: string
  driverName?: string
  driverPhone?: string
  failReason?: string
}

export interface OrderHallmark {
  certification: string
  traceCode: string
  qrUrl?: string
  description?: string
}

export interface Order {
  code: string
  items: CartItem[]
  subtotal: number
  discount?: number
  shippingFee: number
  total: number
  voucherCode?: string
  recipientName: string
  recipientPhone: string
  address: string
  paymentMethod: PaymentMethod
  status: OrderStatus
  paymentStatus:
    | 'AWAITING_TRANSFER'
    | 'AWAITING_AGENT_VERIFICATION'
    | 'PAID'
    | 'AWAITING_CREDIT_APPROVAL'
    | 'CREDIT_APPROVED'
  createdAt: string
  estimatedDelivery?: string
  notes?: string
  deliveries?: DeliveryPhase[]
  hallmark?: OrderHallmark
}

export interface FarmerUser {
  id: string
  name: string
  phone: string
  initials: string
}

export interface StoreInfo {
  id: string
  name: string
  address: string
  phone: string
  bankName: string
  bankAccountNumber: string
  bankAccountName: string
}

export interface RiceDiseaseClass {
  id: 'leaf_blast' | 'bacterial_leaf_blight' | 'brown_spot' | 'sheath_blight' | 'healthy'
  name: string
  scientificName: string
  vietnameseAliases: string[]
  symptoms: string[]
  activeIngredients: string[]
  preventionSteps: string[]
}

export interface DiagnosisCase {
  id: string
  farmerId: string
  farmerName: string
  imageUrl: string
  cropStage: string
  predictedDiseaseId: string
  predictedDiseaseName: string
  aiConfidence: number
  status: 'PENDING_AGENT_REVIEW' | 'CONFIRMED' | 'CORRECTED' | 'INCONCLUSIVE'
  verifiedDiseaseId?: string
  verifiedDiseaseName?: string
  reviewerNote?: string
  reviewerName?: string
  recommendedProducts: Product[]
  createdAt: string
  reviewedAt?: string
  rejectionReason?: string
}

