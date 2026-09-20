import { Link } from 'react-router-dom'
import ProductCard from '../../../components/ui/ProductCard'
import type { Product } from '../../../types'

export default function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="w-full py-16 md:py-20 bg-brand-cream" id="products">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-2 font-helvetica-neue">
              Sản phẩm chính hãng
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-brand-dark tracking-tight font-helvetica-neue leading-[1.15]">
              Vật tư &amp; nông dược bán chạy
            </h2>
          </div>
          <div className="flex flex-col sm:items-end gap-2">
            <span className="text-xs text-brand-dark/50 font-helvetica-neue tracking-wide">
              100% hóa đơn VAT &amp; tem chống hàng giả
            </span>
            <Link
              to="/products"
              className="text-sm text-brand-dark/70 hover:text-brand-dark transition-colors tracking-wide"
            >
              Xem toàn bộ cửa hàng →
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
