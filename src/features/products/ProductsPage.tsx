import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import ProductCard from '../../components/ui/ProductCard'
import AiDiagnosisCallout from '../../components/ui/AiDiagnosisCallout'
import { products } from '../../data/mockProducts'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { createEmptyFilterValues, type FilterValues } from './components/FilterSidebar'

type SortOption = 'best-selling' | 'newest' | 'price-asc' | 'price-desc'

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
  const [pageSize] = useState(48)
  const [page, setPage] = useState(1)

  const searchParamsKey = searchParams.toString()

  useEffect(() => {
    setFilters(filtersFromSearchParams(searchParams))
    setPage(1)
  }, [searchParamsKey])

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
      if (filters.onlyWarehouse && !p.stockLabel.includes('Thới Lai')) return false
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

  const categoryChips = [
    { label: 'Tất cả vật tư', value: '' },
    { label: 'Thuốc BVTV', value: 'Thuốc đặc trị nấm & diệt khuẩn' },
    { label: 'Phân bón NPK', value: 'Phân bón NPK & Dinh dưỡng lúa' },
    { label: 'Lúa giống', value: 'Lúa giống xác nhận' },
  ]

  const currentGroup = Array.from(filters.groups)[0] ?? ''

  const handleSelectGroup = (groupVal: string) => {
    patchFilters({ groups: groupVal ? new Set([groupVal]) : new Set() })
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
            <p className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-2 font-helvetica-neue">
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
                const isActive = currentGroup === chip.value
                return (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => handleSelectGroup(chip.value)}
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
                <option value="best-selling">Bán chạy nhất</option>
                <option value="newest">Mới nhất</option>
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
              placeholder="Tìm theo tên thuốc (Beam 75WP, Anvil 5SC), hoạt chất hoặc loại phân bón..."
              type="text"
              value={filters.search}
              onChange={(e) => patchFilters({ search: e.target.value })}
            />
          </div>
        </div>

        {/* Product Grid */}
        {pageItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {pageItems.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
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
              className="mt-5 px-6 py-2.5 rounded-full bg-brand-dark text-white hover:bg-brand-green tracking-wide uppercase text-sm transition-colors"
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
