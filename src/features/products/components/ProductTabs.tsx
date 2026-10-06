import { Link } from 'react-router-dom'
import { formatVnd } from '../../../data/format'
import type { CatalogProduct } from '../../../api/types'
import { packagingLabel } from '../catalogMapping'

const tabs = [
  { id: 'specs', label: 'Thông tin sản phẩm', icon: 'science' },
  { id: 'usage', label: 'Hướng dẫn sử dụng', icon: 'spa' },
  { id: 'ai', label: 'Bác sĩ cây trồng AI', icon: 'psychology' },
] as const

export type ProductTabId = (typeof tabs)[number]['id']

interface ProductTabsProps {
  product: CatalogProduct
  activeTab: ProductTabId
  onActiveTabChange: (tab: ProductTabId) => void
}

function InfoRow({ label, value, striped }: { label: string; value: string; striped?: boolean }) {
  return (
    <tr className={striped ? 'bg-brand-cream' : undefined}>
      <td className="py-2.5 px-4 text-brand-dark w-1/3">{label}</td>
      <td className="py-2.5 px-4">{value}</td>
    </tr>
  )
}

export default function ProductTabs({ product, activeTab, onActiveTabChange }: ProductTabsProps) {
  const ingredients = product.ingredients.filter((i) => i.name)
  const packagings = [...product.packagings].sort((a, b) => a.conversionToBase - b.conversionToBase)
  const baseUnit = product.packagings.find((p) => p.isBaseUnit)

  return (
    <div className="mt-12 bg-white border border-brand-dark/10 overflow-hidden">
      <div role="tablist" className="flex border-b border-brand-dark/10 bg-brand-light overflow-x-auto text-xs sm:text-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => onActiveTabChange(tab.id)}
            className={`py-3.5 px-6 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors tracking-wide ${
              activeTab === tab.id
                ? 'border-brand-dark text-brand-dark bg-white'
                : 'border-transparent text-brand-dark/55 hover:text-brand-dark hover:bg-white/50'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="p-6 sm:p-8 space-y-8">
        {activeTab === 'specs' && (
          <div className="space-y-6">
            {product.description && (
              <p className="text-sm text-brand-dark/75 leading-relaxed max-w-3xl">{product.description}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="border border-brand-dark/10 overflow-hidden">
                <table className="w-full">
                  <tbody className="divide-y divide-brand-dark/10 text-brand-dark/60">
                    <InfoRow striped label="Danh mục" value={product.categoryName || '—'} />
                    <InfoRow label="Thương hiệu" value={product.brandName || '—'} />
                    <InfoRow striped label="Mã SKU" value={product.sku || '—'} />
                    <InfoRow
                      label="Thành phần"
                      value={
                        ingredients.length > 0
                          ? ingredients.map((i) => [i.name, i.concentration].filter(Boolean).join(' ')).join(', ')
                          : '—'
                      }
                    />
                  </tbody>
                </table>
              </div>
              <div className="border border-brand-dark/10 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-brand-cream text-brand-dark">
                    <tr>
                      <th className="py-2.5 px-4 text-left font-normal">Quy cách</th>
                      <th className="py-2.5 px-4 text-left font-normal">Quy đổi</th>
                      <th className="py-2.5 px-4 text-right font-normal">Giá</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-dark/10 text-brand-dark/60">
                    {packagings.map((p) => (
                      <tr key={p.id}>
                        <td className="py-2.5 px-4 text-brand-dark">{packagingLabel(p)}</td>
                        <td className="py-2.5 px-4">
                          {p.isBaseUnit || !baseUnit ? 'Đơn vị cơ sở' : `${p.conversionToBase} ${baseUnit.symbol || packagingLabel(baseUnit)}`}
                        </td>
                        <td className="py-2.5 px-4 text-right text-brand-dark">
                          {p.price != null ? formatVnd(p.price) : 'Chưa có giá'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'usage' && (
          <div className="max-w-3xl">
            {product.usageInstructions ? (
              <p className="text-sm text-brand-dark/75 leading-relaxed whitespace-pre-line">{product.usageInstructions}</p>
            ) : (
              <p className="text-sm text-brand-dark/55">
                Cửa hàng chưa cập nhật hướng dẫn sử dụng. Bác vui lòng đọc kỹ nhãn trên bao bì hoặc hỏi kỹ sư nông học
                trước khi dùng.
              </p>
            )}
          </div>
        )}
        {activeTab === 'ai' && (
          <div className="bg-brand-light border border-brand-dark/10 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-dark text-white flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[26px]">psychology</span>
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-helvetica-neue tracking-tight text-brand-dark">
                  Ruộng của bác đang có biểu hiện lạ nhưng chưa dám chắc chắn?
                </h4>
                <p className="text-xs text-brand-dark/60 mt-0.5">
                  Chụp ảnh lá gửi Bác sĩ AI để được chẩn đoán và gợi ý vật tư phù hợp.
                </p>
              </div>
            </div>
            <Link
              to="/ai-doctor"
              className="px-5 py-2.5 rounded-full bg-brand-dark text-white hover:bg-brand-green tracking-wide text-xs transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              <span>Quét lá chẩn đoán ngay</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
