import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import ProductCard from '../../components/ui/ProductCard'
import ProductSkeleton from '../../components/ui/ProductSkeleton'
import { useMotionPolicy } from '../../motion/useMotionPolicy'
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

/** Page numbers with gaps (null) so long lists stay short: 1 … 4 5 6 … 12. */
function pageNumbers(current: number, total: number): (number | null)[] {
  const wanted = new Set([1, total, current - 1, current, current + 1])
  const pages = [...wanted].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const out: (number | null)[] = []
  pages.forEach((p, i) => {
    // A single missing page is shown instead of an ellipsis, so the dots never hide just one number.
    if (i > 0 && p - pages[i - 1] === 2) out.push(p - 1)
    else if (i > 0 && p - pages[i - 1] > 2) out.push(null)
    out.push(p)
  })
  return out
}

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
  const gridRef = useRef<HTMLDivElement>(null)
  const motionPolicy = useMotionPolicy()

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

  const goToPage = (next: number) => {
    setPage(next)
    // Bring the top of the grid back into view after changing page.
    requestAnimationFrame(() => gridRef.current?.scrollIntoView({ behavior: motionPolicy === 'none' ? 'auto' : 'smooth', block: 'start' }))
  }

  const isSearching = search.trim() !== debouncedSearch || (isLoading && debouncedSearch !== '')
  const activeCategory = categoryChips.find((chip) => chip.value === categoryId)

  const chipClass = (active: boolean) =>
    `focus-ring shrink-0 whitespace-nowrap min-h-[44px] px-4 rounded-full text-[15px] tracking-wide transition-colors duration-[var(--dur-micro)] ${
      active ? 'bg-brand-dark text-white' : 'border border-brand-dark/25 text-text-primary hover:border-brand-dark/60'
    }`

  const pageButtonClass = (active: boolean) =>
    `focus-ring w-11 h-11 flex items-center justify-center rounded-full text-[15px] transition-colors duration-[var(--dur-micro)] ${
      active ? 'bg-brand-dark text-white' : 'border border-brand-dark/25 text-text-primary hover:border-brand-dark/60'
    }`

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
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <p className="text-[13px] uppercase tracking-[0.16em] text-text-secondary mb-3">Cửa hàng vật tư</p>
            <h1 className="text-[length:var(--type-h1)] leading-[var(--type-h1-lh)] font-light tracking-tight text-text-primary">Vật Tư Nông Dược Chính Hãng</h1>
            <p className="text-base text-text-secondary mt-3 max-w-xl leading-relaxed">
              Phân bón NPK, lúa giống và thuốc BVTV đạt chuẩn VietGAP từ Đại lý Hai Thắng.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-brand-dark/20 rounded-full text-[15px] text-text-primary self-start md:self-auto">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }} aria-hidden="true">
              verified
            </span>
            <span>100% Chính Hãng • Tem VAT</span>
          </div>
        </div>

        {/* Filters: category chips, sort and search */}
        <div className="border-y border-brand-dark/15 py-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto sm:flex-wrap sm:overflow-visible -mx-6 px-6 sm:mx-0 sm:px-0 pb-1 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label="Lọc theo danh mục">
              {categoryChips.map((chip) => {
                const isActive = categoryId === chip.value
                return (
                  <button key={chip.value || 'all'} type="button" aria-pressed={isActive} onClick={() => handleSelectCategory(chip.value)} className={chipClass(isActive)}>
                    {chip.label}
                  </button>
                )
              })}
            </div>

            <label className="flex items-center gap-3 text-[15px] text-text-secondary">
              <span>Sắp xếp</span>
              <select
                className="focus-ring min-h-[44px] text-[15px] text-text-primary bg-white border border-brand-dark/25 rounded-[var(--radius-input)] px-3 hover:border-brand-dark/60 transition-colors"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as SortOption)
                  setPage(1)
                }}
              >
                <option value="default">Mặc định</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
              </select>
            </label>
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" style={{ fontSize: 22 }} aria-hidden="true">
              search
            </span>
            <input
              className="focus-ring w-full min-h-[52px] pl-12 pr-12 text-base text-text-primary placeholder:text-text-muted bg-white border border-brand-dark/25 rounded-[var(--radius-input)] hover:border-brand-dark/60 focus:border-brand-dark transition-colors [&::-webkit-search-cancel-button]:hidden"
              placeholder="Tìm theo tên hoặc mã SKU"
              type="search"
              aria-label="Tìm sản phẩm"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
              {isSearching ? (
                <span className="material-symbols-outlined animate-spin text-text-secondary" style={{ fontSize: 22 }} aria-hidden="true">
                  progress_activity
                </span>
              ) : (
                search && (
                  <button type="button" onClick={() => { setSearch(''); setDebouncedSearch(''); setPage(1) }} aria-label="Xóa nội dung tìm kiếm" className="focus-ring w-11 h-11 flex items-center justify-center text-text-secondary hover:text-text-primary">
                    <span className="material-symbols-outlined" style={{ fontSize: 22 }} aria-hidden="true">
                      close
                    </span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Result count (announced to screen readers when it changes) */}
        <p className="text-[15px] text-text-secondary min-h-[24px]" role="status" aria-live="polite">
          {!isLoading && !error && (
            <>
              {sorted.length} sản phẩm
              {activeCategory && activeCategory.value ? ` trong "${activeCategory.label}"` : ''}
              {debouncedSearch ? ` cho "${debouncedSearch}"` : ''}
            </>
          )}
        </p>

        {/* Product grid */}
        <div ref={gridRef} className="scroll-mt-28">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6" aria-busy="true" aria-label="Đang tải sản phẩm">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div role="alert" className="border border-brand-dark/15 bg-white p-12 text-center rounded-[var(--radius-surface)]">
              <span className="material-symbols-outlined text-status-error" style={{ fontSize: 48 }} aria-hidden="true">
                cloud_off
              </span>
              <h3 className="text-lg tracking-tight text-text-primary mt-3">{error}</h3>
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className="focus-ring mt-6 min-h-[44px] px-7 rounded-full bg-brand-dark text-white hover:bg-brand-green tracking-wide text-[15px] transition-colors"
              >
                Thử lại
              </button>
            </div>
          ) : pageItems.length > 0 ? (
            <div className="space-y-12">
              <div key={`${categoryId}|${debouncedSearch}|${sort}|${currentPage}`} className="fade-swap grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                {pageItems.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav aria-label="Phân trang" className="flex justify-center items-center gap-2 flex-wrap">
                  <button type="button" onClick={() => goToPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} aria-label="Trang trước" className={`${pageButtonClass(false)} disabled:opacity-35 disabled:cursor-not-allowed`}>
                    <span className="material-symbols-outlined" style={{ fontSize: 22 }} aria-hidden="true">
                      chevron_left
                    </span>
                  </button>
                  {pageNumbers(currentPage, totalPages).map((item, i) =>
                    item === null ? (
                      <span key={`gap-${i}`} className="w-8 text-center text-text-secondary" aria-hidden="true">
                        …
                      </span>
                    ) : (
                      <button key={item} type="button" onClick={() => goToPage(item)} aria-label={`Trang ${item}`} aria-current={currentPage === item ? 'page' : undefined} className={pageButtonClass(currentPage === item)}>
                        {item}
                      </button>
                    ),
                  )}
                  <button type="button" onClick={() => goToPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} aria-label="Trang sau" className={`${pageButtonClass(false)} disabled:opacity-35 disabled:cursor-not-allowed`}>
                    <span className="material-symbols-outlined" style={{ fontSize: 22 }} aria-hidden="true">
                      chevron_right
                    </span>
                  </button>
                </nav>
              )}
            </div>
          ) : (
            <div className="border border-brand-dark/15 bg-white p-12 text-center rounded-[var(--radius-surface)]">
              <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 48 }} aria-hidden="true">
                search_off
              </span>
              <h3 className="text-lg tracking-tight text-text-primary mt-3">Không tìm thấy sản phẩm phù hợp</h3>
              <p className="text-[15px] text-text-secondary mt-2">Thử từ khóa tìm kiếm hoặc bấm chọn danh mục khác.</p>
              <button
                type="button"
                onClick={resetFilters}
                className="focus-ring mt-6 min-h-[44px] px-7 rounded-full bg-brand-dark text-white hover:bg-brand-green tracking-wide text-[15px] transition-colors"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          )}
        </div>

        <AiDiagnosisCallout
          title="Chưa rõ ruộng lúa bị bệnh gì để chọn thuốc?"
          subtitle="Chụp ảnh lá gửi Bác sĩ AI chẩn đoán tức thì trong 3 giây và nhận ngay đơn thuốc chuẩn xác."
        />
      </div>
    </>
  )
}
