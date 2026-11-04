import type { DebtEntryStatus, DueRule, DueState, PaymentStatus } from '../../api/types'
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
  ROLLOVER: 'Đại lý gia hạn hạn trả',
}

// Why the store moved a due date or changed a debt. The server sends the code; the words are ours.
export const REASON_CODE_LABEL: Record<string, string> = {
  MAT_MUA: 'Mất mùa',
  THIEN_TAI: 'Thiên tai',
  KHO_KHAN: 'Gia đình khó khăn',
  TRI_AN: 'Tri ân khách hàng',
  SAI_SOT: 'Đại lý ghi nhầm',
  KHONG_THU_HOI: 'Khó thu hồi',
  KHAC: 'Lý do khác',
}

// Whether a debt is still within its due date. Text and icon always go with the colour.
export const DUE_STATE: Record<DueState, { label: string; tone: Tone; icon: string }> = {
  NOT_DUE: { label: 'Chưa đến hạn', tone: 'neutral', icon: 'schedule' },
  DUE_SOON: { label: 'Sắp đến hạn', tone: 'pending', icon: 'history' },
  OVERDUE: { label: 'Đã qua hạn', tone: 'danger', icon: 'error' },
}

export const DUE_STATE_FILTERS: { value: DueState | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Mọi hạn trả' },
  { value: 'NOT_DUE', label: 'Chưa đến hạn' },
  { value: 'DUE_SOON', label: 'Sắp đến hạn' },
  { value: 'OVERDUE', label: 'Đã qua hạn' },
]

// How the due date of a credit order is worked out.
export const DUE_RULE_LABEL: Record<DueRule, string> = {
  SEASON: 'theo hạn trả của vụ',
  CAPPED: 'theo hạn trả của vụ, trong giới hạn kỳ hạn của đại lý',
  TERM_DAYS: 'theo số ngày kỳ hạn của hạng tín dụng',
  MANUAL: 'do đại lý chọn',
  NONE: 'chưa có tín dụng',
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
