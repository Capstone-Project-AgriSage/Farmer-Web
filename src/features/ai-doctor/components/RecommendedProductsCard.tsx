import ProductCard from '../../../components/ui/ProductCard'
import type { Product } from '../../../types'

interface RecommendedProductsCardProps {
  diseaseName: string
  products: Product[]
}

export default function RecommendedProductsCard({ diseaseName, products }: RecommendedProductsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-border-subtle p-5 shadow-sm">
      <h4 className="text-sm font-bold text-text-primary mb-1">Sản phẩm điều trị được gợi ý</h4>
      <p className="text-xs text-text-muted mb-4">Phù hợp với chẩn đoán "{diseaseName}"</p>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-xs text-text-secondary">
          Chưa có sản phẩm phù hợp trong danh mục hiện tại, vui lòng liên hệ hotline để được tư
          vấn.
        </p>
      )}
    </div>
  )
}
