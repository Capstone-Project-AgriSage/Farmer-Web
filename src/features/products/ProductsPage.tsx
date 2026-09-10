import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import ProductCard from '../../components/ui/ProductCard'
import Pagination from '../../components/ui/Pagination'
import AiDiagnosisCallout from '../../components/ui/AiDiagnosisCallout'
import { products } from '../../data/mockProducts'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import FilterSidebar, { createEmptyFilterValues, type FilterValues } from './components/FilterSidebar'

type SortOption = 'best-selling' | 'newest' | 'price-asc' | 'price-desc'

const PAGE_SIZE_OPTIONS = [12, 24, 48]

interface Filters extends FilterValues {
  search: string
}

function filtersFromSearchParams(searchParams: URLSearchParams): Filters {
  const group = searchParams.get('group')
  return {
    ...createEmptyFilterValues(),
    search: searchParams.get('q') ?? '',
    groups: group ? new Set([group]) : new Set(),
  }
}

function parsePriceInput(value: string): number | null {
  const digits = value.replace(/[^\d]/g, '')
  return digits ? Number(digits) : null
}

export default function ProductsPage() {
  useDocumentTitle('Sản phẩm vật tư nông nghiệp')
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState<Filters>(() => filtersFromSearchParams(searchParams))
  const [sort, setSort] = useState<SortOption>('best-selling')
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])
  const [page, setPage] = useState(1)

  const searchParamsKey = searchParams.toString()

  // Re-sync from the URL whenever it changes (e.g. clicking a category card,
  // then a plain "Sản phẩm" nav link) — otherwise these stay stale because a
  // navigation within the same route does not remount this component.
  useEffect(() => {
    setFilters(filtersFromSearchParams(searchParams))
    setPage(1)
  }, [searchParamsKey])

  const groupCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of products) counts.set(p.group, (counts.get(p.group) ?? 0) + 1)
    return counts
  }, [])

  const brandCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of products) counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1)
    return counts
  }, [])

  const patchFilters = (patch: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...patch }))
    setPage(1)
  }

  const resetFilters = () => {
    setFilters({ ...createEmptyFilterValues(), search: '' })
    setSort('best-selling')
    setPage(1)
  }

  const filtered = useMemo(() => {
    const queryWords = filters.search.trim().toLowerCase().split(/\s+/).filter(Boolean)
    const minPrice = parsePriceInput(filters.minPrice)
    const maxPrice = parsePriceInput(filters.maxPrice)

    let result = products.filter((p) => {
      if (queryWords.length > 0) {
        const haystack = `${p.name} ${p.activeIngredient} ${p.brand} ${p.category} ${(p.diseaseTags ?? []).join(' ')}`.toLowerCase()
        if (!queryWords.every((word) => haystack.includes(word))) return false
      }
      if (filters.groups.size > 0 && !filters.groups.has(p.group)) return false
      if (filters.brands.size > 0 && !filters.brands.has(p.brand)) return false
      if (filters.diseases.size > 0) {
        const tags = p.diseaseTags ?? []
        const matches = tags.some((t) => filters.diseases.has(t))
        if (!matches) return false
      }
      if (minPrice !== null && p.price < minPrice) return false
      if (maxPrice !== null && p.price > maxPrice) return false
      if (filters.onlyWarehouse && !p.stockLabel.includes('Di Linh')) return false
      if (filters.onlyCredit && !(p.tag?.includes('nợ') || p.wholesalePrice)) return false
      if (filters.onlyExpress && !p.tag?.includes('2 giờ')) return false
      return true
    })

    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'newest':
          return products.indexOf(b) - products.indexOf(a)
        case 'best-selling':
        default:
          return (b.soldCount ?? 0) - (a.soldCount ?? 0)
      }
    })

    return result
  }, [filters, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const rangeEnd = Math.min(currentPage * pageSize, filtered.length)

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Trang chủ', to: '/' },
          { label: 'Danh mục sản phẩm', to: '/products' },
          { label: 'Tất cả vật tư nông nghiệp' },
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Vật Tư &amp; Nông Dược Chính Hãng Cho Mùa Vụ
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Hệ thống phân phối phân bón NPK, hữu cơ vi sinh, hạt giống và thuốc BVTV đạt chuẩn,
              hỗ trợ bảo lãnh công nợ và giao tận vườn.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-status-success-surface text-status-success rounded-lg border border-primary/20 text-xs font-semibold">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>100% Chính Hãng &amp; Tem VAT</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border-subtle p-3.5 shadow-sm mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted text-[20px]">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted bg-surface-subtle border border-border-subtle rounded-lg focus:outline-none focus:border-primary"
              placeholder="Tìm theo tên thuốc, hoạt chất (Azoxystrobin, Mancozeb...), thương hiệu (Bayer, Syngenta, Lộc Trời)..."
              type="text"
              value={filters.search}
              onChange={(e) => patchFilters({ search: e.target.value })}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-secondary font-medium whitespace-nowrap">Sắp xếp:</span>
              <select
                className="text-xs font-medium text-text-primary bg-surface-subtle border border-border-subtle rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
              >
                <option value="best-selling">Bán chạy nhất</option>
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
              </select>
            </div>
            <div className="text-xs text-text-muted font-medium border-l border-border-subtle pl-3">
              Hiển thị <span className="font-bold text-text-primary">{rangeStart} - {rangeEnd}</span> trên{' '}
              <span className="font-bold text-text-primary">{filtered.length}</span> sản phẩm
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <FilterSidebar
            filters={filters}
            onFilterChange={patchFilters}
            groupCounts={groupCounts}
            brandCounts={brandCounts}
            onReset={resetFilters}
          />

          <div className="lg:col-span-9">
            {pageItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {pageItems.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-border-subtle p-12 text-center">
                <span className="material-symbols-outlined text-text-muted text-5xl">search_off</span>
                <h3 className="text-base font-bold text-text-primary mt-3">
                  Không tìm thấy sản phẩm phù hợp
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm khác.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Xóa toàn bộ bộ lọc
                </button>
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              pageSize={pageSize}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setPage(1)
              }}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
            />

            <AiDiagnosisCallout
              title="Chưa rõ cây trồng bị bệnh gì để chọn thuốc?"
              subtitle="Chụp ảnh lá gửi Bác sĩ AI chẩn đoán bệnh tức thì trong 3 giây và nhận ngay đơn thuốc chuẩn xác."
            />
          </div>
        </div>
      </div>
    </>
  )
}
