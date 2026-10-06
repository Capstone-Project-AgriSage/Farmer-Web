import type { DebtEntryStatus, PaymentStatus } from '../../api/types'
import { TONE_CLASSES, type Tone } from '../order/orderLabels'

export { TONE_CLASSES }

// Wording follows what the store does with an entry (FLOW_3 §6): a dispute is reviewed, then the amount is kept, adjusted or cancelled.
export const ENTRY_STATUS: Record<DebtEntryStatus, { label: string; tone: Tone }> = {
  OPEN: { label: 'Chưa trả', tone: 'pending' },
  PARTIALLY_PAID: { label: 'Đã trả một phần', tone: 'progress' },
  PAID: { label: 'Đã tất toán', tone: 'success' },
  DISPUTED: { label: 'Đang khiếu nại', tone: 'danger' },
  ADJUSTED: { label: 'Đã điều chỉnh', tone: 'neutral' },
  CANCELLED: { label: 'Đã hủy', tone: 'neutral' },
}

// Entries the farmer can still dispute: not closed (paid or cancelled) and not already disputed.
export const canDispute = (status: DebtEntryStatus) => status === 'OPEN' || status === 'PARTIALLY_PAID' || status === 'ADJUSTED'

export const ENTRY_FILTERS: { value: DebtEntryStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'OPEN', label: 'Chưa trả' },
  { value: 'PARTIALLY_PAID', label: 'Trả một phần' },
  { value: 'DISPUTED', label: 'Khiếu nại' },
  { value: 'PAID', label: 'Đã tất toán' },
]

export const SOURCE_LABEL: Record<string, string> = {
  DELIVERY: 'Mua chịu, giao hàng',
  PICKUP: 'Mua chịu, lấy tại quầy',
  MANUAL_ADJUSTMENT: 'Ghi nợ thủ công',
}

export const TRANSACTION_LABEL: Record<string, string> = {
  CREDIT_SALE: 'Ghi nợ từ đơn hàng',
  PAYMENT: 'Trả nợ',
  ADJUSTMENT_IN: 'Điều chỉnh tăng nợ',
  ADJUSTMENT_OUT: 'Điều chỉnh giảm nợ',
  RETURN: 'Trả hàng, giảm nợ',
  REVERSAL: 'Hoàn tác',
}

export const ACTION_LABEL: Record<string, string> = {
  DISPUTE: 'Bác đã khiếu nại',
  KEEP: 'Đại lý giữ nguyên số nợ',
  ADJUST: 'Đại lý điều chỉnh số nợ',
  CANCEL: 'Đại lý hủy khoản nợ',
  CHANGE_DUE_DATE: 'Đại lý đổi hạn trả',
}

export const REPAYMENT_STATUS: Record<PaymentStatus, { label: string; tone: Tone }> = {
  PENDING: { label: 'Đang chờ thanh toán', tone: 'pending' },
  PAID: { label: 'Đã thanh toán', tone: 'success' },
  FAILED: { label: 'Không thành công', tone: 'danger' },
  CANCELLED: { label: 'Đã hủy', tone: 'neutral' },
  PARTIALLY_REFUNDED: { label: 'Đã hoàn một phần', tone: 'neutral' },
  REFUNDED: { label: 'Đã hoàn tiền', tone: 'neutral' },
}

export const METHOD_LABEL: Record<string, string> = {
  PAYOS: 'Chuyển khoản qua payOS',
  CASH: 'Tiền mặt tại quầy',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng',
}

export const formatDate = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleDateString('vi-VN') : '')
