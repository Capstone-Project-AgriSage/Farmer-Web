import { products } from '../../../data/mockProducts'
import type { ProductGroup } from '../../../types'

export const groupOptions: ProductGroup[] = [
  'Thuốc BVTV & Trừ nấm',
  'Phân bón NPK & Vi lượng',
  'Phân hữu cơ vi sinh',
  'Hạt giống & Cây giống',
  'Thuốc trừ sâu sinh học',
  'Tưới nhỏ giọt & Thiết bị',
]

export const diseaseOptions = [
  'Thán thư, xì mủ sầu riêng',
  'Rỉ sắt, nấm hồng cà phê',
  'Rệp sáp & Tuyến trùng rễ',
  'Vàng lá, thối rễ mùa mưa',
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
      <div className="bg-white rounded-xl border border-border-subtle p-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-3">
          <h2 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">filter_alt</span>
            <span>Bộ lọc tìm kiếm</span>
          </h2>
          <button onClick={onReset} className="text-[11px] text-primary hover:underline font-semibold">
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
                      checked={filters.groups.has(label)}
                      onChange={() => onFilterChange({ groups: toggleInSet(filters.groups, label) })}
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
                      checked={filters.brands.has(label)}
                      onChange={() => onFilterChange({ brands: toggleInSet(filters.brands, label) })}
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
                    checked={filters.diseases.has(label)}
                    onChange={() => onFilterChange({ diseases: toggleInSet(filters.diseases, label) })}
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
                value={filters.minPrice}
                onChange={(e) => onFilterChange({ minPrice: e.target.value })}
              />
              <input
                className="w-full px-2 py-1.5 rounded border border-border-subtle bg-surface-subtle text-text-primary focus:outline-none focus:border-primary"
                placeholder="1.500.000 đ"
                type="text"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
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
                  checked={filters.onlyWarehouse}
                  onChange={(e) => onFilterChange({ onlyWarehouse: e.target.checked })}
                  className="rounded text-primary focus:ring-primary h-3.5 w-3.5"
                  type="checkbox"
                />
                <span>Sẵn hàng tại kho Di Linh</span>
              </label>
              <label className="flex items-center gap-2 hover:text-primary cursor-pointer">
                <input
                  checked={filters.onlyCredit}
                  onChange={(e) => onFilterChange({ onlyCredit: e.target.checked })}
                  className="rounded text-primary focus:ring-primary h-3.5 w-3.5"
                  type="checkbox"
                />
                <span>Hỗ trợ nợ vụ (AgriCredit)</span>
              </label>
              <label className="flex items-center gap-2 hover:text-primary cursor-pointer">
                <input
                  checked={filters.onlyExpress}
                  onChange={(e) => onFilterChange({ onlyExpress: e.target.checked })}
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
  )
}
