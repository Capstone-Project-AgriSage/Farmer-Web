export type AddressType = 'HOME' | 'FARM' | 'OTHER'

export interface AddressRequest {
  recipientName: string;
  recipientPhone: string;
  addressLine: string;
  province: string;
  ward?: string | null;
  district?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  addressType: AddressType;
  isDefault?: boolean;
}

export interface AddressResponse extends Required<Omit<AddressRequest, 'isDefault'>> {
  id: string;
  isDefault: boolean;
  createdAt: string;
}

export interface FarmerProfile {
  farmerProfileId: string;
  userId: string;
  fullName: string;
  phoneNumber: string | null;
  email: string | null;
  dateOfBirth: string | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
  customerGroup: { id: string; code: string; name: string } | null;
  createdAt: string;
}

export interface CartItem {
  id: string;
  storeProductId: string;
  productPackagingId: string;
  sku: string;
  productName: string;
  packagingName: string;
  imageUrl: string | null;
  quantity: number;
  unitPrice: number | null;
  lineTotalAmount: number | null;
  isAvailable: boolean;
  unavailableReason: 'NOT_SELLABLE' | 'NO_PRICE' | null;
}

export interface Cart {
  id: string | null;
  items: CartItem[];
  subtotalAmount: number;
  priceListId: string | null;
}

export interface CheckoutRequest {
  source: 'FARMER_WEB' | 'FARMER_MOBILE';
  settlementType: 'FULL_PAYMENT' | 'CREDIT';
  fulfillmentType: 'PICKUP' | 'DELIVERY';
  addressId?: string | null;
  deliveryAddress?: Omit<AddressRequest, 'addressType' | 'isDefault'> | null;
  note?: string | null;
}

export interface PayOsPaymentRequest {
  paymentContext: 'ORDER_PAYMENT' | 'DEBT_REPAYMENT';
  orderId?: string | null;
  amount?: number | null;
}

export interface PayOsPaymentResponse {
  paymentId: string;
  paymentNumber: string;
  amount: number;
  checkoutUrl: string;
  qrCode: string | null;
  providerOrderCode: number;
  expiresAt: string | null;
  status: PaymentStatus;
}

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'PARTIALLY_REFUNDED' | 'REFUNDED'

export type OrderStatus = 'PENDING_CONFIRMATION' | 'CONFIRMED' | 'PREPARING' | 'READY_FOR_FULFILLMENT' | 'PARTIALLY_FULFILLED' | 'COMPLETED' | 'CANCELLED' | 'PARTIALLY_CANCELLED'

export type SettlementType = 'FULL_PAYMENT' | 'CREDIT'
export type FulfillmentType = 'PICKUP' | 'DELIVERY'

export interface DeliveryAddressResponse {
  recipientName: string | null;
  recipientPhone: string | null;
  addressLine: string | null;
  ward: string | null;
  district: string | null;
  province: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface OrderItemResponse {
  id: string;
  storeProductId: string;
  productPackagingId: string;
  sku: string | null;
  productName: string;
  packagingName: string;
  quantity: number;
  conversionToBase: number;
  baseQuantity: number;
  unitPrice: number;
  lineTotalAmount: number;
  fulfilledBaseQuantity: number;
  cancelledBaseQuantity: number;
  remainingBaseQuantity: number;
  status: string | null;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  source: string;
  settlementType: SettlementType;
  fulfillmentType: FulfillmentType;
  status: OrderStatus;
  deliveryAddress: DeliveryAddressResponse | null;
  subtotalAmount: number;
  totalAmount: number;
  note: string | null;
  createdAt: string;
  confirmedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  items: OrderItemResponse[];
}

/** Row of GET /api/me/orders — summary only, the lines come with the single-order call. */
export interface OrderListItem {
  id: string;
  orderNumber: string;
  settlementType: SettlementType;
  fulfillmentType: FulfillmentType;
  status: OrderStatus;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  confirmedAt: string | null;
}

export interface PaymentListItem {
  id: string;
  paymentNumber: string;
  paymentContext: string;
  paymentMethod: string;
  amount: number;
  status: PaymentStatus;
  payerName: string | null;
  confirmedAt: string | null;
  initiatedAt: string;
}

export interface RefundResponse {
  id: string;
  refundNumber: string;
  refundMethod: string | null;
  amount: number;
  status: string;
  requestedAt: string;
  completedAt: string | null;
}

export interface OrderPaymentSummary {
  orderId: string;
  orderTotal: number;
  paidAmount: number;
  remainingToPay: number;
  payments: PaymentListItem[];
  refunds: RefundResponse[];
}

/** GET /api/me/payments/{id} and POST /api/payments/{id}/sync. */
export interface PaymentResponse {
  id: string;
  paymentNumber: string;
  paymentMethod: string;
  amount: number;
  status: PaymentStatus;
  checkoutUrl: string | null;
  providerOrderCode: number | null;
  confirmedAt: string | null;
  allocations: { orderId: string | null; orderNumber: string | null; allocatedAmount: number }[] | null;
}

export type DeliveryStatus = 'DRAFT' | 'ASSIGNED' | 'OUT_FOR_DELIVERY' | 'PARTIALLY_DELIVERED' | 'RETRY_PENDING' | 'DELIVERED' | 'CANCELLED'
export type DeliveryAttemptStatus = 'IN_PROGRESS' | 'SUCCESS' | 'PARTIAL_SUCCESS' | 'FAILED' | 'CANCELLED'

export interface MyDeliveryAttempt {
  attemptNumber: number;
  status: DeliveryAttemptStatus;
  startedAt: string;
  completedAt: string | null;
  receiverName: string | null;
  proofImageUrl: string | null;
  failureReasonCode: string | null;
}

export interface MyDelivery {
  id: string;
  deliveryNumber: string;
  status: DeliveryStatus;
  scheduledAt: string | null;
  dispatchedAt: string | null;
  completedAt: string | null;
  assignedTo: { fullName: string | null; phoneNumber: string | null } | null;
  items: {
    orderItemId: string;
    productName: string;
    packagingName: string;
    plannedQuantity: number;
    deliveredQuantity: number;
    remainingQuantity: number;
  }[];
  attempts: MyDeliveryAttempt[];
}

export interface MyCreditSummary {
  status: string | null;
  creditLimit: number;
  availableCredit: number;
  outstandingReceivable: number;
  paymentTermDays: number | null;
}

export interface CatalogProductListItem {
  id: string;
  sku: string | null;
  name: string;
  imageUrl: string | null;
  categoryId: string;
  categoryName: string | null;
  brandName: string | null;
  fromPrice: number | null;
}

export interface CatalogPackaging {
  id: string;
  unitName: string | null;
  symbol: string | null;
  packagingName: string | null;
  conversionToBase: number;
  isBaseUnit: boolean;
  price: number | null;
}

export interface CatalogProduct {
  id: string;
  sku: string | null;
  name: string;
  description: string | null;
  usageInstructions: string | null;
  imageUrl: string | null;
  categoryId: string;
  categoryName: string | null;
  brandName: string | null;
  packagings: CatalogPackaging[];
  ingredients: { name: string | null; concentration: string | null }[];
}

export interface CatalogCategory {
  id: string;
  name: string;
  displayOrder: number;
  isActive: boolean;
  children: CatalogCategory[];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
