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

export type OrderStatus = 'PENDING_CONFIRMATION' | 'PENDING_PAYMENT' | 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED'

export type PaymentMethod = 'VIETQR' | 'SEASONAL_CREDIT'

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
}

export interface FarmerUser {
  id: string
  name: string
  phone: string
  address: string
  commune: string
  district: string
  province: string
  landArea: string
  creditLimit: number
  creditUsed: number
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

export interface DebtEntry {
  id: string
  orderCode: string
  orderId: string
  totalDebt: number
  confirmedByFarmer: boolean
  farmerConfirmationStatus: 'AWAITING_CONFIRMATION' | 'CONFIRMED' | 'DISPUTED'
  disputeReason?: string
  createdAt: string
  dueDate: string
  paidAmount: number
  remainingDebt: number
  status: 'ACTIVE' | 'PAID' | 'OVERDUE'
}

export interface DebtPayment {
  id: string
  debtEntryId: string
  orderCode: string
  amount: number
  paymentMethod: 'VIETQR' | 'CASH'
  status: 'PENDING_AGENT_CONFIRMATION' | 'CONFIRMED' | 'REJECTED'
  createdAt: string
  confirmedAt?: string
  note?: string
}
