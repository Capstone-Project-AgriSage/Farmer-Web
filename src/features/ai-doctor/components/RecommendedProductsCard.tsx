import ProductCard from '../../../components/ui/ProductCard'
import type { Product } from '../../../types'

interface RecommendedProductsCardProps {
  diseaseName: string
  reviewerName?: string
  reviewerNote?: string
  products: Product[]
  isVerified?: boolean
}

export default function RecommendedProductsCard({ diseaseName, reviewerName, reviewerNote, products, isVerified = false }: RecommendedProductsCardProps) {
  if (!isVerified) {
    return (
      <div className="bg-white border border-brand-dark/15 rounded-[var(--radius-surface)] p-6">
        <h4 className="flex items-center gap-2 text-lg font-medium text-text-primary">
          <span className="material-symbols-outlined text-status-warning" style={{ fontSize: 24 }} aria-hidden="true">
            hourglass_top
          </span>
          Phác đồ thương mại: chờ thẩm định
        </h4>
        <p className="mt-3 text-[15px] text-text-secondary leading-relaxed">
          Đại lý Hai Thắng đối chiếu hình ảnh lá lúa với hoạt chất phòng trừ phù hợp. Thuốc BVTV sẽ được mở ngay khi thẩm định hoàn tất.
        </p>
        <p className="mt-4 pt-4 border-t border-brand-dark/10 flex items-center justify-between text-[13px] text-text-secondary">
          <span>Tiêu chuẩn mô hình: Rice-V2.1</span>
          <span className="text-primary-dark">Tự động đồng bộ</span>
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-brand-dark/15 rounded-[var(--radius-surface)] p-6 space-y-5">
      <div className="pb-4 border-b border-brand-dark/10">
        <p className="flex items-center justify-between text-[13px] uppercase tracking-[0.16em] text-text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary-dark" style={{ fontSize: 18 }} aria-hidden="true">
              verified
            </span>
            Đã thẩm định chuyên môn
          </span>
          <span>Kho Thới Lai</span>
        </p>
        <h4 className="mt-3 text-lg font-medium text-text-primary leading-snug">Thuốc đặc trị được duyệt cho "{diseaseName}"</h4>
        {reviewerName && <p className="mt-1 text-[15px] text-primary-dark">Thẩm định bởi: {reviewerName}</p>}
      </div>

      {reviewerNote && (
        <p className="p-4 bg-brand-light border-l-4 border-primary-dark text-[15px] text-text-secondary leading-relaxed">
          <strong className="text-text-primary">Chỉ dẫn từ đại lý:</strong> {reviewerNote}
        </p>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-[15px] text-text-secondary">Chưa có sản phẩm phù hợp trong danh mục hiện tại, bác vui lòng liên hệ đại lý Hai Thắng.</p>
      )}
    </div>
  )
}
