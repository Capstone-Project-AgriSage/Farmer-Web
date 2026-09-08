import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import ProductCard from '../../components/ui/ProductCard'
import { products } from '../../data/mockProducts'
import type { ProductGroup } from '../../types'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

const groupOptions: ProductGroup[] = [
  'Thuốc BVTV & Trừ nấm',
  'Phân bón NPK & Vi lượng',
  'Phân hữu cơ vi sinh',
  'Hạt giống & Cây giống',
  'Thuốc trừ sâu sinh học',
  'Tưới nhỏ giọt & Thiết bị',
]

const diseaseOptions = [
  'Thán thư, xì mủ sầu riêng',
  'Rỉ sắt, nấm hồng cà phê',
  'Rệp sáp & Tuyến trùng rễ',
  'Vàng lá, thối rễ mùa mưa',
]

const brandOptions = Array.from(new Set(products.map((p) => p.brand))).sort()

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
          <aside className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-xl border border-border-subtle p-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-3">
                <h2 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">filter_alt</span>
                  <span>Bộ lọc tìm kiếm</span>
                </h2>
                <button onClick={resetFilters} className="text-[11px] text-primary hover:underline font-semibold">
                  Thiết lập lại
                </button>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    Danh mục sản phẩm
                  </h3>
                  <div className="space-y-1.5 text-xs text-text-secondary">
                    {groupOptions.map((label) => (
                      <label key={label} className="flex items-center justify-between hover:text-primary cursor-pointer">
                        <div className="flex items-center gap-2">
                          <input
                            checked={selectedGroups.has(label)}
                            onChange={() => updateAndResetPage(setSelectedGroups)(toggleInSet(selectedGroups, label))}
                            className="rounded text-primary focus:ring-primary h-3.5 w-3.5"
                            type="checkbox"
                          />
                          <span>{label}</span>
                        </div>
                        <span className="text-[11px] text-text-muted">({groupCounts.get(label) ?? 0})</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="pt-3 border-t border-border-subtle space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    Thương hiệu nổi bật
                  </h3>
                  <div className="space-y-1.5 text-xs text-text-secondary">
                    {brandOptions.map((label) => (
                      <label key={label} className="flex items-center justify-between hover:text-primary cursor-pointer">
                        <div className="flex items-center gap-2">
                          <input
                            checked={selectedBrands.has(label)}
                            onChange={() => updateAndResetPage(setSelectedBrands)(toggleInSet(selectedBrands, label))}
                            className="rounded text-primary focus:ring-primary h-3.5 w-3.5"
                            type="checkbox"
                          />
                          <span>{label}</span>
                        </div>
                        <span className="text-[11px] text-text-muted">({brandCounts.get(label) ?? 0})</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="pt-3 border-t border-border-subtle space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    Phòng trị bệnh cây trồng
                  </h3>
                  <div className="space-y-1.5 text-xs text-text-secondary">
                    {diseaseOptions.map((label) => (
                      <label key={label} className="flex items-center gap-2 hover:text-primary cursor-pointer">
                        <input
                          checked={selectedDiseases.has(label)}
                          onChange={() => updateAndResetPage(setSelectedDiseases)(toggleInSet(selectedDiseases, label))}
                          className="rounded text-primary focus:ring-primary h-3.5 w-3.5"
                          type="checkbox"
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="pt-3 border-t border-border-subtle space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    Khoảng giá (VND)
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input
                      className="w-full px-2 py-1.5 rounded border border-border-subtle bg-surface-subtle text-text-primary focus:outline-none focus:border-primary"
                      placeholder="0 đ"
                      type="text"
                      value={minPriceInput}
                      onChange={(e) => updateAndResetPage(setMinPriceInput)(e.target.value)}
                    />
                    <input
                      className="w-full px-2 py-1.5 rounded border border-border-subtle bg-surface-subtle text-text-primary focus:outline-none focus:border-primary"
                      placeholder="1.500.000 đ"
                      type="text"
                      value={maxPriceInput}
                      onChange={(e) => updateAndResetPage(setMaxPriceInput)(e.target.value)}
                    />
                  </div>
                </div>
                <div className="pt-3 border-t border-border-subtle space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                    Tiện ích &amp; Dịch vụ
                  </h3>
                  <div className="space-y-1.5 text-xs text-text-secondary">
                    <label className="flex items-center gap-2 hover:text-primary cursor-pointer">
                      <input
                        checked={onlyWarehouse}
                        onChange={(e) => updateAndResetPage(setOnlyWarehouse)(e.target.checked)}
                        className="rounded text-primary focus:ring-primary h-3.5 w-3.5"
                        type="checkbox"
                      />
                      <span>Sẵn hàng tại kho Di Linh</span>
                    </label>
                    <label className="flex items-center gap-2 hover:text-primary cursor-pointer">
                      <input
                        checked={onlyCredit}
                        onChange={(e) => updateAndResetPage(setOnlyCredit)(e.target.checked)}
                        className="rounded text-primary focus:ring-primary h-3.5 w-3.5"
                        type="checkbox"
                      />
                      <span>Hỗ trợ nợ vụ (AgriCredit)</span>
                    </label>
                    <label className="flex items-center gap-2 hover:text-primary cursor-pointer">
                      <input
                        checked={onlyExpress}
                        onChange={(e) => updateAndResetPage(setOnlyExpress)(e.target.checked)}
                        className="rounded text-primary focus:ring-primary h-3.5 w-3.5"
                        type="checkbox"
                      />
                      <span>Giao hỏa tốc 2-4h</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </aside>

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

            <div className="mt-10 bg-white rounded-xl border border-border-subtle p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span>Hiển thị</span>
                <select
                  className="text-xs font-medium text-text-primary bg-surface-subtle border border-border-subtle rounded px-2 py-1 focus:outline-none focus:border-primary"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setPage(1)
                  }}
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size} sản phẩm / trang
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-lg border border-border-subtle flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition-colors ${
                      p === currentPage
                        ? 'bg-primary text-white shadow-sm'
                        : 'border border-border-subtle text-text-primary hover:bg-surface-subtle font-medium'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="w-8 h-8 rounded-lg border border-border-subtle flex items-center justify-center text-text-primary hover:bg-surface-subtle transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-gradient-to-r from-emerald-50 via-surface-secondary to-primary-light border border-primary/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="material-symbols-outlined text-[26px]">psychology</span>
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-text-primary">
                    Chưa rõ cây trồng bị bệnh gì để chọn thuốc?
                  </h4>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Chụp ảnh lá gửi Bác sĩ AI chẩn đoán bệnh tức thì trong 3 giây và nhận ngay đơn
                    thuốc chuẩn xác.
                  </p>
                </div>
              </div>
              <Link
                to="/ai-doctor"
                className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                <span>Quét lá cây với AI</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
