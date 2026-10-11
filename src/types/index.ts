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

