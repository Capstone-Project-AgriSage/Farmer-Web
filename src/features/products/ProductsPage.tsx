import { useMemo, useState } from 'react'
import Breadcrumb from '../../components/ui/Breadcrumb'
import ProductCard from '../../components/ui/ProductCard'
import Pagination from '../../components/ui/Pagination'
import AiDiagnosisCallout from '../../components/ui/AiDiagnosisCallout'
import { products } from '../../data/mockProducts'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import FilterSidebar from './components/FilterSidebar'

type SortOption = 'best-selling' | 'newest' | 'price-asc' | 'price-desc'

const PAGE_SIZE_OPTIONS = [12, 24, 48]

function parsePriceInput(value: string): number | null {
  const digits = value.replace(/[^\d]/g, '')
  return digits ? Number(digits) : null
}

function toggleInSet(set: Set<string>, value: string): Set<string> {
  const next = new Set(set)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  return next
}

export default function ProductsPage() {
  useDocumentTitle('Sản phẩm vật tư nông nghiệp')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('best-selling')
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set())
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set())
  const [selectedDiseases, setSelectedDiseases] = useState<Set<string>>(new Set())
  const [minPriceInput, setMinPriceInput] = useState('')
  const [maxPriceInput, setMaxPriceInput] = useState('')
  const [onlyWarehouse, setOnlyWarehouse] = useState(false)
  const [onlyCredit, setOnlyCredit] = useState(false)
  const [onlyExpress, setOnlyExpress] = useState(false)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0])
  const [page, setPage] = useState(1)

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

  const resetFilters = () => {
    setSearch('')
    setSelectedGroups(new Set())
    setSelectedBrands(new Set())
    setSelectedDiseases(new Set())
    setMinPriceInput('')
    setMaxPriceInput('')
    setOnlyWarehouse(false)
    setOnlyCredit(false)
    setOnlyExpress(false)
    setSort('best-selling')
    setPage(1)
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    const minPrice = parsePriceInput(minPriceInput)
    const maxPrice = parsePriceInput(maxPriceInput)

    let result = products.filter((p) => {
      if (query) {
        const haystack = `${p.name} ${p.activeIngredient} ${p.brand}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      if (selectedGroups.size > 0 && !selectedGroups.has(p.group)) return false
      if (selectedBrands.size > 0 && !selectedBrands.has(p.brand)) return false
      if (selectedDiseases.size > 0) {
        const tags = p.diseaseTags ?? []
        const matches = tags.some((t) => selectedDiseases.has(t))
        if (!matches) return false
      }
      if (minPrice !== null && p.price < minPrice) return false
      if (maxPrice !== null && p.price > maxPrice) return false
      if (onlyWarehouse && !p.stockLabel.includes('Di Linh')) return false
      if (onlyCredit && !(p.tag?.includes('nợ') || p.wholesalePrice)) return false
      if (onlyExpress && !p.tag?.includes('2 giờ')) return false
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
  }, [
    search,
    selectedGroups,
    selectedBrands,
    selectedDiseases,
    minPriceInput,
    maxPriceInput,
    onlyWarehouse,
    onlyCredit,
    onlyExpress,
    sort,
  ])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const rangeEnd = Math.min(currentPage * pageSize, filtered.length)

  const updateAndResetPage = <T,>(setter: (v: T) => void) => (value: T) => {
    setter(value)
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
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
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
            selectedGroups={selectedGroups}
            onToggleGroup={(v) => updateAndResetPage(setSelectedGroups)(toggleInSet(selectedGroups, v))}
            selectedBrands={selectedBrands}
            onToggleBrand={(v) => updateAndResetPage(setSelectedBrands)(toggleInSet(selectedBrands, v))}
            selectedDiseases={selectedDiseases}
            onToggleDisease={(v) => updateAndResetPage(setSelectedDiseases)(toggleInSet(selectedDiseases, v))}
            minPriceInput={minPriceInput}
            onMinPriceChange={updateAndResetPage(setMinPriceInput)}
            maxPriceInput={maxPriceInput}
            onMaxPriceChange={updateAndResetPage(setMaxPriceInput)}
            onlyWarehouse={onlyWarehouse}
            onOnlyWarehouseChange={updateAndResetPage(setOnlyWarehouse)}
            onlyCredit={onlyCredit}
            onOnlyCreditChange={updateAndResetPage(setOnlyCredit)}
            onlyExpress={onlyExpress}
            onOnlyExpressChange={updateAndResetPage(setOnlyExpress)}
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
