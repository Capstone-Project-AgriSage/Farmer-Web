import { api } from './client'
import type { CatalogCategory, CatalogProduct, CatalogProductListItem, PagedResult } from './types'

export interface CatalogQuery {
  categoryId?: string
  search?: string
  page?: number
  pageSize?: number
}

export const catalogApi = {
  getProducts: (params: CatalogQuery = {}) => {
    const searchParams = new URLSearchParams()
    if (params.categoryId) searchParams.append('CategoryId', params.categoryId)
    if (params.search) searchParams.append('Search', params.search)
    if (params.page) searchParams.append('Page', params.page.toString())
    if (params.pageSize) searchParams.append('PageSize', params.pageSize.toString())
    const qs = searchParams.toString()
    return api<PagedResult<CatalogProductListItem>>(`/api/catalog/products${qs ? `?${qs}` : ''}`)
  },

  // The product id in the catalog is the storeProductId the cart expects.
  getProduct: (id: string) => api<CatalogProduct>(`/api/catalog/products/${id}`),

  getCategories: () => api<CatalogCategory[]>('/api/catalog/categories'),
}
