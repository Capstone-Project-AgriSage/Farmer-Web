import ProductCard from '../../../components/ui/ProductCard'
import type { Product } from '../../../types'

export default function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="w-full py-12 bg-white border-b border-border-subtle" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
              SẢN PHẨM CHÍNH HÃNG
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Vật Tư &amp; Nông Dược Bán Chạy Nhất
            </h2>
          </div>
          <span className="text-xs text-text-muted font-medium">
            Cam kết 100% hóa đơn VAT &amp; tem chống hàng giả
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
