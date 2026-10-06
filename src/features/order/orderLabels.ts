import type {
  DeliveryAddressResponse,
  DeliveryAttemptStatus,
  DeliveryStatus,
  OrderStatus,
  PaymentStatus,
} from '../../api/types'

export type Tone = 'neutral' | 'pending' | 'progress' | 'success' | 'danger'

export const TONE_CLASSES: Record<Tone, string> = {
  neutral: 'border-brand-dark/10 text-brand-dark/70 bg-brand-cream',
  pending: 'border-amber-200 text-amber-800 bg-amber-50',
  progress: 'border-blue-200 text-blue-800 bg-blue-50',
  success: 'border-brand-green/30 text-brand-green bg-brand-light',
  danger: 'border-rose-200 text-rose-700 bg-rose-50',
}

// Labels follow FE_GUIDE_FLOW_2 §2: order, payment and delivery are three separate states.
export const ORDER_STATUS: Record<OrderStatus, { label: string; tone: Tone }> = {
  PENDING_CONFIRMATION: { label: 'Chờ xác nhận', tone: 'pending' },
  CONFIRMED: { label: 'Đã xác nhận', tone: 'progress' },
  PREPARING: { label: 'Đang chuẩn bị', tone: 'progress' },
  READY_FOR_FULFILLMENT: { label: 'Sẵn sàng giao', tone: 'progress' },
  PARTIALLY_FULFILLED: { label: 'Đã giao một phần', tone: 'progress' },
  COMPLETED: { label: 'Hoàn thành', tone: 'success' },
  CANCELLED: { label: 'Đã huỷ', tone: 'danger' },
  PARTIALLY_CANCELLED: { label: 'Huỷ phần còn lại', tone: 'danger' },
}

export const DELIVERY_STATUS: Record<DeliveryStatus, { label: string; tone: Tone }> = {
  DRAFT: { label: 'Nháp', tone: 'neutral' },
  ASSIGNED: { label: 'Đã phân công', tone: 'pending' },
  OUT_FOR_DELIVERY: { label: 'Đang giao', tone: 'progress' },
  PARTIALLY_DELIVERED: { label: 'Đã giao một phần', tone: 'progress' },
  RETRY_PENDING: { label: 'Chờ giao lại', tone: 'pending' },
  DELIVERED: { label: 'Đã giao', tone: 'success' },
  CANCELLED: { label: 'Đã huỷ', tone: 'danger' },
}

export const ATTEMPT_STATUS: Record<DeliveryAttemptStatus, { label: string; tone: Tone }> = {
  IN_PROGRESS: { label: 'Đang giao', tone: 'progress' },
  SUCCESS: { label: 'Thành công', tone: 'success' },
  PARTIAL_SUCCESS: { label: 'Giao một phần', tone: 'pending' },
  FAILED: { label: 'Không thành công', tone: 'danger' },
  CANCELLED: { label: 'Đã huỷ', tone: 'neutral' },
}

export const PAYMENT_STATUS: Record<PaymentStatus, { label: string; tone: Tone }> = {
  PENDING: { label: 'Chờ thanh toán', tone: 'pending' },
  PAID: { label: 'Đã thanh toán', tone: 'success' },
  FAILED: { label: 'Thất bại / hết hạn', tone: 'danger' },
  CANCELLED: { label: 'Đã huỷ', tone: 'neutral' },
  PARTIALLY_REFUNDED: { label: 'Hoàn tiền một phần', tone: 'neutral' },
  REFUNDED: { label: 'Đã hoàn tiền', tone: 'neutral' },
}

export const FAILURE_REASON: Record<string, string> = {
  CUSTOMER_ABSENT: 'Khách vắng nhà',
  UNREACHABLE: 'Không liên lạc được',
  CUSTOMER_REFUSED: 'Khách từ chối nhận',
  DAMAGED: 'Hàng hư hỏng',
  WEATHER: 'Thời tiết',
  VEHICLE_ISSUE: 'Sự cố xe',
  ADDRESS_ISSUE: 'Sai / khó tìm địa chỉ',
  OTHER: 'Khác',
}

export const PAYMENT_METHOD: Record<string, string> = {
  PAYOS: 'payOS (VietQR)',
  CASH: 'Tiền mặt',
  BANK_TRANSFER: 'Chuyển khoản',
}

/** Unknown codes fall back to the raw value instead of breaking the page. */
export function labelOf<K extends string>(map: Record<K, { label: string; tone: Tone }>, key: string | null | undefined) {
  return (key && (map as Record<string, { label: string; tone: Tone }>)[key]) || { label: key || '—', tone: 'neutral' as Tone }
}

export function formatAddress(a: DeliveryAddressResponse | null | undefined): string {
  if (!a) return ''
  return [a.addressLine, a.ward, a.district, a.province].filter(Boolean).join(', ')
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Date(iso).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
}
