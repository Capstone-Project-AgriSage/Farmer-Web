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
      <div className="bg-white rounded-xl border border-border-subtle p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-amber-800">
          <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
          <h4 className="text-sm font-bold">Phác đồ thương mại: Chờ thẩm định</h4>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          Đại lý Hai Thắng đang đối chiếu hình ảnh lá lúa với hoạt chất phòng trừ tối ưu. Thuốc BVTV phù hợp sẽ được mở ngay khi thẩm định hoàn tất.
        </p>
        <div className="p-3 bg-surface-subtle rounded-lg text-[11px] text-text-muted flex items-center justify-between">
          <span>Tiêu chuẩn mô hình: Rice-V2.1</span>
          <span className="font-semibold text-primary">Tự động đồng bộ</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-primary/30 p-5 shadow-sm space-y-4">
      <div className="border-b border-border-subtle pb-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            <span>Đã thẩm định chuyên môn</span>
          </div>
          <span className="text-[11px] text-text-muted">Kho Thới Lai</span>
        </div>
        <h4 className="text-sm font-bold text-text-primary mt-2">
          Thuốc đặc trị được duyệt cho "{diseaseName}"
        </h4>
        {reviewerName && (
          <p className="text-xs text-primary font-medium mt-0.5">
            Thẩm định bởi: {reviewerName}
          </p>
        )}
      </div>

      {reviewerNote && (
        <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 leading-relaxed">
          <strong>Chỉ dẫn từ đại lý:</strong> {reviewerNote}
        </div>
      )}

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-xs text-text-secondary">
          Chưa có sản phẩm phù hợp trong danh mục hiện tại, vui lòng liên hệ đại lý Hai Thắng.
        </p>
      )}
    </div>
  )
}
