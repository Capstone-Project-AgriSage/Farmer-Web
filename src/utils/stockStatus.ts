import type { StockStatus } from '../types'

export interface StockStatusTone {
  dot: string
  badgeBg: string
  text: string
}

/** Visual tone for a product's discrete stock status — kept separate from the free-form `stockLabel` copy. */
export function stockStatusTone(status: StockStatus): StockStatusTone {
  switch (status) {
    case 'Sắp hết':
      return { dot: 'bg-status-warning', badgeBg: 'bg-status-warning-surface', text: 'text-status-warning' }
    case 'Hết hàng':
      return { dot: 'bg-status-error', badgeBg: 'bg-status-error-surface', text: 'text-status-error' }
    default:
      return { dot: 'bg-status-success', badgeBg: 'bg-status-success-surface', text: 'text-status-success' }
  }
}
