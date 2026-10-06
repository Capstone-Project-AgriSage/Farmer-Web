import type { CatalogPackaging, CatalogProduct, CatalogProductListItem } from '../../api/types'
import type { Product } from '../../types'

// The catalog has no product photos yet; show an illustrative photo per category until it does.
function fallbackImage(categoryName: string | null): string {
  const name = (categoryName ?? '').toLowerCase()
  if (name.includes('giống')) return '/images/products/corn-seeds.jpg'
  if (name.includes('thuốc')) return '/images/products/fungicide-spray.jpg'
  if (name.includes('phân')) return '/images/products/npk-fertilizer.jpg'
  return '/images/products/organic-fertilizer.jpg'
}

export function packagingLabel(p: CatalogPackaging): string {
  return p.packagingName || p.unitName || p.symbol || 'Đơn vị lẻ'
}

/** Priced packagings first, largest pack first — the order the farmer usually buys in. */
export function sellablePackagings(product: CatalogProduct): CatalogPackaging[] {
  return [...product.packagings]
    .filter((p) => p.price != null)
    .sort((a, b) => b.conversionToBase - a.conversionToBase)
}

/** Maps a catalog row onto the card model; `slug` is the catalog id so /products/:slug resolves via the API. */
export function toProductCard(item: CatalogProductListItem): Product {
  const hasPrice = item.fromPrice != null
  return {
    slug: item.id,
    storeProductId: item.id,
    name: item.name,
    brand: item.brandName || item.categoryName || '',
    category: item.categoryName || '',
    group: item.categoryName || '',
    activeIngredient: '',
    packaging: '',
    image: item.imageUrl || fallbackImage(item.categoryName),
    price: item.fromPrice ?? 0,
    isAvailable: hasPrice,
    priceFrom: true,
    stockLabel: hasPrice ? 'Đang bán' : 'Chưa có giá',
    stockStatus: hasPrice ? 'Còn hàng' : 'Hết hàng',
  }
}

export function toProductDetail(product: CatalogProduct): Product {
  const packs = sellablePackagings(product)
  const hasPrice = packs.length > 0
  return {
    slug: product.id,
    storeProductId: product.id,
    name: product.name,
    brand: product.brandName || product.categoryName || '',
    category: product.categoryName || '',
    group: product.categoryName || '',
    activeIngredient: product.ingredients.map((i) => [i.name, i.concentration].filter(Boolean).join(' ')).join(', '),
    packaging: packs.map(packagingLabel).join(', '),
    image: product.imageUrl || fallbackImage(product.categoryName),
    price: hasPrice ? Math.min(...packs.map((p) => p.price as number)) : 0,
    isAvailable: hasPrice,
    stockLabel: hasPrice ? 'Đang bán' : 'Chưa có giá',
    stockStatus: hasPrice ? 'Còn hàng' : 'Hết hàng',
  }
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isCatalogId(value: string): boolean {
  return UUID_PATTERN.test(value)
}
