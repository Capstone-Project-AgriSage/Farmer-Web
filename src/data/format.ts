export function formatVnd(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) return '0 đ'
  return `${amount.toLocaleString('vi-VN')} đ`
}
