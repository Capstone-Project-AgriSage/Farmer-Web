import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { getProductBySlug, products } from '../../data/mockProducts'
import { useCart } from '../../context/CartContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import ProductImagePanel from './components/ProductImagePanel'
import PurchasePanel from './components/PurchasePanel'
import ProductTabs, { type ProductTabId } from './components/ProductTabs'
import CrossSellSection from './components/CrossSellSection'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const product = getProductBySlug(slug ?? '')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<ProductTabId>('specs')

  useDocumentTitle(product ? product.name : 'Không tìm thấy sản phẩm')

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-xl font-helvetica-neue tracking-tight text-brand-dark">
          Không tìm thấy sản phẩm
        </h1>
        <Link
          to="/products"
          className="inline-block mt-4 text-sm text-brand-dark/70 hover:text-brand-dark tracking-wide transition-colors"
        >
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    )
  }

  const crossSell = products.filter((p) => p.slug !== product.slug).slice(0, 4)

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Trang chủ', to: '/' },
          { label: 'Danh mục sản phẩm', to: '/products' },
          { label: product.category, to: '/products' },
          { label: product.name },
        ]}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <ProductImagePanel product={product} />
          <PurchasePanel
            product={product}
            quantity={quantity}
            onQuantityChange={setQuantity}
            onAddToCart={() => addToCart(product, quantity)}
            onBuyNow={() => {
              addToCart(product, quantity)
              navigate('/cart')
            }}
          />
        </div>

        <ProductTabs product={product} activeTab={activeTab} onActiveTabChange={setActiveTab} />

        <CrossSellSection products={crossSell} onAddToCart={(p) => addToCart(p)} />
      </div>
    </>
  )
}
