import type { NotificationItem } from '../../api/notificationsApi'

export const notificationFilters = [
  { value: '', label: 'Tất cả' },
  { value: 'UNREAD', label: 'Chưa đọc' },
  { value: 'READ', label: 'Đã đọc' },
  { value: 'ARCHIVED', label: 'Đã lưu trữ' },
] as const

export function notificationIcon(type: string) {
  switch (type) {
    case 'ORDER_STATUS_CHANGED': return 'task_alt'
    case 'PAYMENT_CONFIRMED': case 'DEBT_PAYMENT_CONFIRMED': return 'payments'
    case 'PAYMENT_FAILED': case 'DELIVERY_FAILED': return 'error_outline'
    case 'RETURN_REQUESTED': case 'RETURN_RESULT': return 'assignment_return'
    case 'REFUND_REQUESTED': case 'REFUND_RESULT': return 'currency_exchange'
    case 'AI_DIAGNOSIS_COMPLETED': case 'DIAGNOSIS_REVIEWED': case 'DIAGNOSIS_RECOMMENDATIONS': return 'psychology'
    case 'DELIVERY_ASSIGNED': case 'DELIVERY_COMPLETED': case 'DELIVERY_REQUIRED': case 'DELIVERY_PARTIAL': return 'local_shipping'
    case 'DEBT_CREATED': case 'DEBT_DISPUTED': case 'DEBT_OVERDUE': case 'DEBT_DUE_SOON': case 'CREDIT_LIMIT_CHANGED': return 'account_balance_wallet'
    case 'OUT_OF_STOCK': case 'STOCK_RECEIVED': case 'STOCK_ISSUED': case 'STOCK_ADJUSTED': case 'LOW_STOCK': return 'inventory_2'
    case 'EXPIRY_WARNING': return 'event_busy'
    default: return 'notifications'
  }
}
export function notificationTime(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh',
  }).format(date)
}
export function notificationTarget(item: NotificationItem): string | null {
  const data = item.data
  if (!data || typeof data.entityId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.entityId)) return null
  const orderId = typeof data.orderId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data.orderId) ? data.orderId : null
  switch (data.entityType) {
    case 'ORDER': return '/orders/' + data.entityId
    case 'PAYMENT': return orderId ? '/orders/' + orderId : data.orderId === null ? '/debt' : '/orders'
    case 'DELIVERY': case 'SALES_RETURN': case 'REFUND': return orderId ? '/orders/' + orderId : '/orders'
    // Diagnosis history still contains demo data; link it after the owned diagnosis API is integrated.
    case 'DEBT_ENTRY': case 'CREDIT_PROFILE': return '/debt'
    default: return null
  }
}
