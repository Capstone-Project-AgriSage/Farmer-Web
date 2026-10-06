import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { catalogApi } from '../../api/catalogApi'
import { ApiError, describeApiError } from '../../api/client'
import type { CatalogProduct } from '../../api/types'
import { getProductBySlug } from '../../data/mockProducts'
import type { Product } from '../../types'
import { useCart } from '../../context/CartContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import ProductImagePanel from './components/ProductImagePanel'
import PurchasePanel from './components/PurchasePanel'
import ProductTabs, { type ProductTabId } from './components/ProductTabs'
import CrossSellSection from './components/CrossSellSection'
import { isCatalogId, sellablePackagings, toProductCard, toProductDetail } from './catalogMapping'

export default function ProductDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [detail, setDetail] = useState<CatalogProduct | null>(null)
  const [crossSell, setCrossSell] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [packagingId, setPackagingId] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [activeTab, setActiveTab] = useState<ProductTabId>('specs')

  // Links built from the old mock data (AI doctor, saved bookmarks) carry a text slug; resolve it to the catalog id.
  const productId = isCatalogId(slug) ? slug : getProductBySlug(slug)?.storeProductId ?? ''

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)
    setDetail(null)
    setQuantity(1)
    if (!productId) {
      setIsLoading(false)
      return
    }
    catalogApi.getProduct(productId)
      .then((product) => {
        if (cancelled) return
        setDetail(product)
        setPackagingId(sellablePackagings(product)[0]?.id ?? '')
        return catalogApi.getProducts({ categoryId: product.categoryId, pageSize: 5 }).then((res) => {
          if (!cancelled) setCrossSell(res.items.filter((p) => p.id !== product.id).slice(0, 4).map(toProductCard))
        })
      })
      .catch((err) => {
        if (cancelled) return
        if (!(err instanceof ApiError && err.status === 404)) setError(describeApiError(err, 'Không tải được sản phẩm.'))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [productId])

  useDocumentTitle(detail ? detail.name : isLoading ? 'Đang tải sản phẩm...' : 'Không tìm thấy sản phẩm')

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-12 gap-8" aria-busy="true">
        <div className="lg:col-span-5 aspect-[3/2] bg-white border border-brand-dark/10 animate-pulse" />
        <div className="lg:col-span-7 space-y-4">
          <div className="h-8 w-2/3 bg-white animate-pulse" />
          <div className="h-40 bg-white animate-pulse" />
        </div>
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-xl font-helvetica-neue tracking-tight text-brand-dark">
          {error ?? 'Không tìm thấy sản phẩm'}
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

  const product = toProductDetail(detail)
  const packagings = sellablePackagings(detail)

  const handleAdd = async (goToCart: boolean) => {
    if (!packagingId) return
    setIsAdding(true)
    const ok = await addToCart({ storeProductId: detail.id, productPackagingId: packagingId, quantity }, detail.name)
    setIsAdding(false)
    if (ok && goToCart) navigate('/cart')
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Trang chủ', to: '/' },
          { label: 'Danh mục sản phẩm', to: '/products' },
          { label: product.category, to: `/products?category=${detail.categoryId}` },
          { label: product.name },
        ]}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <ProductImagePanel product={product} />
          <PurchasePanel
            product={product}
            sku={detail.sku}
            packagings={packagings}
            selectedPackagingId={packagingId}
            onSelectPackaging={setPackagingId}
            quantity={quantity}
            onQuantityChange={setQuantity}
            isAdding={isAdding}
            onAddToCart={() => handleAdd(false)}
            onBuyNow={() => handleAdd(true)}
          />
        </div>

        <ProductTabs product={detail} activeTab={activeTab} onActiveTabChange={setActiveTab} />

        {crossSell.length > 0 && <CrossSellSection products={crossSell} />}
      </div>
    </>
  )
}
