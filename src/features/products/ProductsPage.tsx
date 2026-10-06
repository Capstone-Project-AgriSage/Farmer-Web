import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import ProductCard from '../../components/ui/ProductCard'
import AiDiagnosisCallout from '../../components/ui/AiDiagnosisCallout'
import { catalogApi } from '../../api/catalogApi'
import { describeApiError } from '../../api/client'
import type { CatalogCategory } from '../../api/types'
import type { Product } from '../../types'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { toProductCard } from './catalogMapping'

type SortOption = 'default' | 'price-asc' | 'price-desc'

// Old links (home page, about page) still pass ?group=<display group>; map them onto a catalog category.
const LEGACY_GROUP_KEYWORDS: [string, string][] = [
  ['thuốc', 'thuốc'],
  ['phân', 'phân bón'],
  ['giống', 'giống'],
]

function categoryFromLegacyGroup(group: string, categories: CatalogCategory[]): string {
  const lowered = group.toLowerCase()
  const keyword = LEGACY_GROUP_KEYWORDS.find(([needle]) => lowered.includes(needle))?.[1]
  if (!keyword) return ''
  return categories.find((c) => c.name.toLowerCase().includes(keyword))?.id ?? ''
}

// One store's catalog is small; load it in one call (API max page size) and page on the client.
const CATALOG_FETCH_SIZE = 100
const PAGE_SIZE = 8
const SEARCH_DEBOUNCE_MS = 350

export default function ProductsPage() {
  useDocumentTitle('Sản phẩm vật tư nông nghiệp')
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') ?? '')
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const [categoryId, setCategoryId] = useState(searchParams.get('category') ?? '')
  const [categories, setCategories] = useState<CatalogCategory[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sort, setSort] = useState<SortOption>('default')
  const [page, setPage] = useState(1)
  const [reloadKey, setReloadKey] = useState(0)

  const searchParamsKey = searchParams.toString()

  useEffect(() => {
    catalogApi.getCategories()
      .then((list) => setCategories(list.filter((c) => c.isActive).sort((a, b) => a.displayOrder - b.displayOrder)))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    const q = searchParams.get('q') ?? ''
    setSearch(q)
    setDebouncedSearch(q)
    const group = searchParams.get('group')
    setCategoryId(searchParams.get('category') ?? (group ? categoryFromLegacyGroup(group, categories) : ''))
    setPage(1)
  }, [searchParamsKey, categories])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)
    catalogApi.getProducts({ search: debouncedSearch || undefined, categoryId: categoryId || undefined, pageSize: CATALOG_FETCH_SIZE })
      .then((res) => {
        if (!cancelled) setProducts(res.items.map(toProductCard))
      })
      .catch((err) => {
        if (!cancelled) setError(describeApiError(err, 'Không tải được danh sách sản phẩm.'))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [debouncedSearch, categoryId, reloadKey])

  const resetFilters = () => {
    setSearch('')
    setDebouncedSearch('')
    setCategoryId('')
    setSort('default')
    setPage(1)
  }

  const sorted = useMemo(() => {
    if (sort === 'default') return products
    // Products without a price go last whatever the direction.
    const priced = products.filter((p) => p.isAvailable)
    const unpriced = products.filter((p) => !p.isAvailable)
    priced.sort((a, b) => (sort === 'price-asc' ? a.price - b.price : b.price - a.price))
    return [...priced, ...unpriced]
  }, [products, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const categoryChips = [{ label: 'Tất cả vật tư', value: '' }, ...categories.map((c) => ({ label: c.name, value: c.id }))]

  const handleSelectCategory = (value: string) => {
    setCategoryId(value)
    setPage(1)
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Trang chủ', to: '/' },
          { label: 'Danh mục sản phẩm', to: '/products' },
          { label: 'Tất cả vật tư nông nghiệp' },
        ]}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-14 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.25em]  text-brand-dark/50 mb-2 font-helvetica-neue">
              Cửa hàng vật tư
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-helvetica-neue tracking-tight text-brand-dark leading-[1.15]">
              Vật Tư Nông Dược Chính Hãng
            </h1>
            <p className="text-sm text-brand-dark/60 mt-2 max-w-xl">
              Phân bón NPK, lúa giống và thuốc BVTV đạt chuẩn VietGAP từ Đại lý Hai Thắng.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-light text-brand-dark/70 border border-brand-dark/10 text-xs tracking-wide self-start md:self-auto">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>100% Chính Hãng • Tem VAT</span>
          </div>
        </div>

        {/* Filter Toolbar: Category Chips + Search + Sort */}
        <div className="border border-brand-dark/10 bg-white p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Horizontal Category Chips */}
            <div className="flex flex-wrap items-center gap-2">
              {categoryChips.map((chip) => {
                const isActive = categoryId === chip.value
                return (
                  <button
                    key={chip.value || 'all'}
                    type="button"
                    onClick={() => handleSelectCategory(chip.value)}
                    className={`px-3.5 py-1.5 rounded-full text-xs tracking-wide transition-colors ${
                      isActive
                        ? 'bg-brand-dark text-white'
                        : 'border border-brand-dark/15 text-brand-dark/70 hover:border-brand-dark/30'
                    }`}
                  >
                    {chip.label}
                  </button>
                )
              })}
            </div>

            {/* Sort & Count */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-dark/50 tracking-wide">Sắp xếp:</span>
              <select
                className="text-xs text-brand-dark bg-brand-cream border border-brand-dark/15 rounded-full px-3 py-1.5 focus:outline-none focus:border-brand-dark/40"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
              >
                <option value="default">Mặc định</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
              </select>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-brand-dark/40 text-[18px]">
              search
            </span>
            <input
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm text-brand-dark placeholder:text-brand-dark/40 bg-brand-cream border border-brand-dark/15 focus:outline-none focus:border-brand-dark/40"
              placeholder="Tìm theo tên sản phẩm hoặc mã SKU..."
              type="search"
              aria-label="Tìm sản phẩm"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[380px] rounded-[20px] border border-brand-dark/10 bg-white animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="border border-brand-dark/10 bg-white p-12 text-center">
            <span className="material-symbols-outlined text-status-error text-5xl">cloud_off</span>
            <h3 className="text-base font-helvetica-neue tracking-tight text-brand-dark mt-3">{error}</h3>
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="mt-5 px-6 py-2.5 rounded-full bg-brand-dark text-white hover:bg-brand-green tracking-wide text-sm transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : pageItems.length > 0 ? (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
              {pageItems.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-brand-dark/15 text-brand-dark disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-cream transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                        currentPage === p 
                          ? 'bg-brand-dark text-white border border-brand-dark' 
                          : 'border border-brand-dark/15 text-brand-dark hover:bg-brand-cream'
                      }`}
                    >
                      {p}
                    </button>
                  )
                })}
                
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-brand-dark/15 text-brand-dark disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-cream transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="border border-brand-dark/10 bg-white p-12 text-center">
            <span className="material-symbols-outlined text-brand-dark/40 text-5xl">search_off</span>
            <h3 className="text-base font-helvetica-neue tracking-tight text-brand-dark mt-3">
              Không tìm thấy sản phẩm phù hợp
            </h3>
            <p className="text-xs text-brand-dark/55 mt-1">
              Thử từ khóa tìm kiếm hoặc bấm chọn danh mục khác.
            </p>
            <button
              onClick={resetFilters}
              className="mt-5 px-6 py-2.5 rounded-full bg-brand-dark text-white hover:bg-brand-green tracking-wide  text-sm transition-colors"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        )}

        <AiDiagnosisCallout
          title="Chưa rõ ruộng lúa bị bệnh gì để chọn thuốc?"
          subtitle="Chụp ảnh lá gửi Bác sĩ AI chẩn đoán tức thì trong 3 giây và nhận ngay đơn thuốc chuẩn xác."
        />
      </div>
    </>
  )
}
