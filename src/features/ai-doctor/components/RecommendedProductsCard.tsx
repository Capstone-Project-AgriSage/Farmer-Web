import { Link } from 'react-router-dom'
import type { DiagnosisResult } from '../../../api/types'
import { PRODUCT_IMAGE_FALLBACK, handleImageError } from '../../../utils/image'
import { diseaseDisplayName } from '../model'

interface RecommendedProductsCardProps {
  result: DiagnosisResult
}

function Heading({ icon, children }: { icon: string; children: string }) {
  return (
    <h4 className="flex items-center gap-2 text-lg font-medium text-text-primary">
      <span className="material-symbols-outlined text-primary-dark" style={{ fontSize: 24 }} aria-hidden="true">
        {icon}
      </span>
      {children}
    </h4>
  )
}

/**
 * Products for the result: only a CONFIDENT, non-healthy AI result (matched by active ingredient, at most 5) or an old
 * store-confirmed case. An UNCERTAIN result never shows a product (AI_DIAGNOSIS.md D2/D13).
 */
export default function RecommendedProductsCard({ result }: RecommendedProductsCardProps) {
  const uncertain = result.certainty === 'UNCERTAIN'
  if (result.disease.isHealthy && !uncertain) return null

  if (uncertain) {
    return (
      <div className="bg-white border border-brand-dark/15 rounded-[var(--radius-surface)] p-6" data-testid="diagnosis-no-products">
        <Heading icon="storefront">Chưa gợi ý thuốc</Heading>
        <p className="mt-3 text-[15px] text-text-secondary leading-relaxed">
          AI chưa chắc chắn nên chưa gợi ý thuốc hay sản phẩm. Bác chụp lại gần một lá bệnh, hoặc hỏi cửa hàng để được tư vấn.
        </p>
      </div>
    )
  }

  const products = [...result.products].sort((a, b) => a.rankOrder - b.rankOrder)
  const disease = diseaseDisplayName(result.disease.code, result.disease.name)

  return (
    <div className="bg-white border border-brand-dark/15 rounded-[var(--radius-surface)] p-6 space-y-4" data-testid="diagnosis-products">
      <div>
        <Heading icon="shopping_bag">Sản phẩm gợi ý</Heading>
        <p className="mt-1 text-[15px] text-text-secondary">Cho bệnh {disease}</p>
      </div>

      {products.length > 0 ? (
        <ul className="divide-y divide-brand-dark/10">
          {products.map((p) => (
            <li key={p.storeProductId}>
              <Link to={`/products/${p.storeProductId}`} className="focus-ring flex items-center gap-4 py-3 rounded-[var(--radius-surface)] hover:bg-brand-light/60 transition-colors">
                <img
                  src={p.imageUrl || PRODUCT_IMAGE_FALLBACK}
                  alt=""
                  onError={handleImageError}
                  className="w-14 h-14 object-contain bg-brand-light rounded-[var(--radius-surface)] shrink-0"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] md:text-base font-medium text-text-primary">{p.name}</span>
                  {p.reason && <span className="block mt-0.5 text-[15px] text-text-secondary">{p.reason}</span>}
                </span>
                <span className="material-symbols-outlined text-text-muted" style={{ fontSize: 22 }} aria-hidden="true">
                  chevron_right
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[15px] text-text-secondary leading-relaxed">Cửa hàng chưa có sản phẩm gợi ý cho bệnh này, bác hỏi cửa hàng để được tư vấn.</p>
      )}

      {products.length > 0 && (
        <p className="pt-4 border-t border-brand-dark/10 text-[15px] text-text-secondary leading-relaxed">
          {result.certainty === 'VERIFIED'
            ? 'Cửa hàng đã chọn các sản phẩm này cho ca của bác.'
            : 'Gợi ý theo hoạt chất trị bệnh. Bác đọc kỹ nhãn thuốc và hỏi cửa hàng trước khi dùng.'}
        </p>
      )}
    </div>
  )
}
