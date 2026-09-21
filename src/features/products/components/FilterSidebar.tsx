import { products } from '../../../data/mockProducts'
import type { ProductGroup } from '../../../types'

export const groupOptions: ProductGroup[] = [
  'Thuốc đặc trị nấm & diệt khuẩn',
  'Phân bón NPK & Dinh dưỡng lúa',
  'Lúa giống xác nhận',
]

export const diseaseOptions = [
  'Đạo ôn lá',
  'Bạc lá vi khuẩn',
  'Đốm nâu',
  'Khô vằn',
]

export const brandOptions = Array.from(new Set(products.map((p) => p.brand))).sort()

export interface FilterValues {
  groups: Set<string>
  brands: Set<string>
  diseases: Set<string>
  minPrice: string
  maxPrice: string
  onlyWarehouse: boolean
  onlyCredit: boolean
  onlyExpress: boolean
}

export function createEmptyFilterValues(): FilterValues {
  return {
    groups: new Set(),
    brands: new Set(),
    diseases: new Set(),
    minPrice: '',
    maxPrice: '',
    onlyWarehouse: false,
    onlyCredit: false,
    onlyExpress: false,
  }
}

function toggleInSet(set: Set<string>, value: string): Set<string> {
  const next = new Set(set)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  return next
}

interface FilterSidebarProps {
  filters: FilterValues
  onFilterChange: (patch: Partial<FilterValues>) => void
  groupCounts: Map<string, number>
  brandCounts: Map<string, number>
  onReset: () => void
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  groupCounts,
  brandCounts,
  onReset,
}: FilterSidebarProps) {
  return (
    <aside className="lg:col-span-3 space-y-5">
      <div className="bg-white border border-brand-dark/10 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-brand-dark/10 mb-4">
          <h2 className="text-sm font-helvetica-neue tracking-tight text-brand-dark flex items-center gap-1.5">
            <span className="material-symbols-outlined text-brand-dark/60 text-[18px]">filter_alt</span>
            <span>Bộ lọc tìm kiếm</span>
          </h2>
          <button
            onClick={onReset}
            className="text-[11px] text-brand-dark/60 hover:text-brand-dark tracking-wide transition-colors"
          >
            Thiết lập lại
          </button>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <h3 className="text-xs tracking-[0.25em] uppercase text-brand-dark/50">
              Danh mục sản phẩm
            </h3>
            <div className="space-y-1.5 text-xs text-brand-dark/60">
              {groupOptions.map((label) => (
                <label
                  key={label}
                  className="flex items-center justify-between hover:text-brand-dark cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      checked={filters.groups.has(label)}
                      onChange={() => onFilterChange({ groups: toggleInSet(filters.groups, label) })}
                      className="rounded border-brand-dark/20 text-brand-dark focus:ring-brand-dark/30 h-3.5 w-3.5"
                      type="checkbox"
                    />
                    <span>{label}</span>
                  </div>
                  <span className="text-[11px] text-brand-dark/40">({groupCounts.get(label) ?? 0})</span>
                </label>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-brand-dark/10 space-y-2">
            <h3 className="text-xs tracking-[0.25em] uppercase text-brand-dark/50">
              Thương hiệu nổi bật
            </h3>
            <div className="space-y-1.5 text-xs text-brand-dark/60">
              {brandOptions.map((label) => (
                <label
                  key={label}
                  className="flex items-center justify-between hover:text-brand-dark cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      checked={filters.brands.has(label)}
                      onChange={() => onFilterChange({ brands: toggleInSet(filters.brands, label) })}
                      className="rounded border-brand-dark/20 text-brand-dark focus:ring-brand-dark/30 h-3.5 w-3.5"
                      type="checkbox"
                    />
                    <span>{label}</span>
                  </div>
                  <span className="text-[11px] text-brand-dark/40">({brandCounts.get(label) ?? 0})</span>
                </label>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-brand-dark/10 space-y-2">
            <h3 className="text-xs tracking-[0.25em] uppercase text-brand-dark/50">
              Phòng trị bệnh cây trồng
            </h3>
            <div className="space-y-1.5 text-xs text-brand-dark/60">
              {diseaseOptions.map((label) => (
                <label
                  key={label}
                  className="flex items-center gap-2 hover:text-brand-dark cursor-pointer transition-colors"
                >
                  <input
                    checked={filters.diseases.has(label)}
                    onChange={() => onFilterChange({ diseases: toggleInSet(filters.diseases, label) })}
                    className="rounded border-brand-dark/20 text-brand-dark focus:ring-brand-dark/30 h-3.5 w-3.5"
                    type="checkbox"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="pt-3 border-t border-brand-dark/10 space-y-2">
            <h3 className="text-xs tracking-[0.25em] uppercase text-brand-dark/50">
              Khoảng giá (VND)
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <input
                className="w-full px-2.5 py-1.5 bg-brand-cream border border-brand-dark/15 text-brand-dark focus:outline-none focus:border-brand-dark/40"
                placeholder="0 đ"
                type="text"
                value={filters.minPrice}
                onChange={(e) => onFilterChange({ minPrice: e.target.value })}
              />
              <input
                className="w-full px-2.5 py-1.5 bg-brand-cream border border-brand-dark/15 text-brand-dark focus:outline-none focus:border-brand-dark/40"
                placeholder="1.500.000 đ"
                type="text"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
              />
            </div>
          </div>
          <div className="pt-3 border-t border-brand-dark/10 space-y-2">
            <h3 className="text-xs tracking-[0.25em] uppercase text-brand-dark/50">
              Tiện ích &amp; Dịch vụ
            </h3>
            <div className="space-y-1.5 text-xs text-brand-dark/60">
              <label className="flex items-center gap-2 hover:text-brand-dark cursor-pointer transition-colors">
                <input
                  checked={filters.onlyWarehouse}
                  onChange={(e) => onFilterChange({ onlyWarehouse: e.target.checked })}
                  className="rounded border-brand-dark/20 text-brand-dark focus:ring-brand-dark/30 h-3.5 w-3.5"
                  type="checkbox"
                />
                <span>Sẵn hàng tại kho Thới Lai</span>
              </label>
              <label className="flex items-center gap-2 hover:text-brand-dark cursor-pointer transition-colors">
                <input
                  checked={filters.onlyCredit}
                  onChange={(e) => onFilterChange({ onlyCredit: e.target.checked })}
                  className="rounded border-brand-dark/20 text-brand-dark focus:ring-brand-dark/30 h-3.5 w-3.5"
                  type="checkbox"
                />
                <span>Hỗ trợ nợ vụ (AgriCredit)</span>
              </label>
              <label className="flex items-center gap-2 hover:text-brand-dark cursor-pointer transition-colors">
                <input
                  checked={filters.onlyExpress}
                  onChange={(e) => onFilterChange({ onlyExpress: e.target.checked })}
                  className="rounded border-brand-dark/20 text-brand-dark focus:ring-brand-dark/30 h-3.5 w-3.5"
                  type="checkbox"
                />
                <span>Giao hỏa tốc 2-4h</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
