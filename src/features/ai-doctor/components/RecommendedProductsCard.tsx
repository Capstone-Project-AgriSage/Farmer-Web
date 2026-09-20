import ProductCard from '../../../components/ui/ProductCard'
import type { Product } from '../../../types'

interface RecommendedProductsCardProps {
  diseaseName: string
  reviewerName?: string
  reviewerNote?: string
  products: Product[]
  isVerified?: boolean
}

export default function RecommendedProductsCard({
  diseaseName,
  reviewerName,
  reviewerNote,
  products,
  isVerified = false,
}: RecommendedProductsCardProps) {
  if (!isVerified) {
    return (
      <div className="bg-white border border-brand-dark/10 p-5 space-y-3">
        <div className="flex items-center gap-2 text-brand-dark">
          <span className="material-symbols-outlined text-[20px] text-amber-700">hourglass_top</span>
          <h4 className="text-sm font-helvetica-neue tracking-tight">Phác đồ thương mại: Chờ thẩm định</h4>
        </div>
        <p className="text-xs text-brand-dark/60 leading-relaxed">
          Đại lý Hai Thắng đang đối chiếu hình ảnh lá lúa với hoạt chất phòng trừ tối ưu. Thuốc BVTV phù hợp sẽ được mở ngay khi thẩm định hoàn tất.
        </p>
        <div className="p-3 bg-brand-light border border-brand-dark/10 text-[11px] text-brand-dark/50 flex items-center justify-between">
          <span>Tiêu chuẩn mô hình: Rice-V2.1</span>
          <span className="text-brand-green">Tự động đồng bộ</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-brand-dark/10 p-5 space-y-4">
      <div className="border-b border-brand-dark/10 pb-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 text-xs tracking-[0.25em] uppercase text-brand-dark/50">
            <span className="material-symbols-outlined text-[14px] text-brand-green">verified</span>
            <span>Đã thẩm định chuyên môn</span>
          </div>
          <span className="text-[11px] text-brand-dark/50">Kho Thới Lai</span>
        </div>
        <h4 className="text-sm font-helvetica-neue tracking-tight text-brand-dark mt-2">
          Thuốc đặc trị được duyệt cho "{diseaseName}"
        </h4>
        {reviewerName && (
          <p className="text-xs text-brand-green mt-0.5">
            Thẩm định bởi: {reviewerName}
          </p>
        )}
      </div>

      {reviewerNote && (
        <div className="p-3 bg-brand-light border border-brand-dark/10 text-xs text-brand-dark/60 leading-relaxed">
          <strong className="text-brand-dark">Chỉ dẫn từ đại lý:</strong> {reviewerNote}
        </div>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-xs text-brand-dark/60">
          Chưa có sản phẩm phù hợp trong danh mục hiện tại, vui lòng liên hệ đại lý Hai Thắng.
        </p>
      )}
    </div>
  )
}
