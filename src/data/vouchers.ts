// Mock voucher "backend" — there is no real voucher/promotions service yet.
// This is the single place that knows which codes are valid and what they're
// worth, so swapping in a real API later only means changing this function.
const VOUCHER_DISCOUNTS: Record<string, number> = {
  VUMUA2024: 50000,
}

export interface VoucherValidationResult {
  code: string
  discount: number
}

export function validateVoucherCode(rawCode: string): VoucherValidationResult | null {
  const code = rawCode.trim().toUpperCase()
  const discount = VOUCHER_DISCOUNTS[code]
  return discount ? { code, discount } : null
}
