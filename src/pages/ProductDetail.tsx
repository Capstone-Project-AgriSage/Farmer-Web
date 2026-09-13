import { useParams, Link, useNavigate } from "react-router";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { products } from "../data/products";

function formatPrice(n: number) {
  return n.toLocaleString("vi-VN") + " đ";
}

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState<"desc" | "usage" | "reviews">("desc");

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface-subtle">
        <span className="material-symbols-outlined text-[64px] text-text-muted">inventory_2</span>
        <div className="text-xl font-bold text-text-primary">Không tìm thấy sản phẩm</div>
        <button onClick={() => navigate("/san-pham")} className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm">
          Quay lại cửa hàng
        </button>
      </div>
    );
  }

  const related = products.filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug).slice(0, 4);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.image, brand: product.brand, unit: product.unit });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const reviews = [
    { name: "Nguyễn Văn Bình", date: "10/10/2024", rating: 5, comment: "Sản phẩm rất hiệu quả, sử dụng 1 tuần là thấy cây hồi phục rõ rệt. Sẽ mua lại!" },
    { name: "Trần Thị Hoa", date: "08/10/2024", rating: 5, comment: "Hàng chính hãng, đóng gói cẩn thận. Giao hàng nhanh, còn kèm hướng dẫn sử dụng tiếng Việt." },
    { name: "Lê Minh Đức", date: "05/10/2024", rating: 4, comment: "Giá hợp lý, hiệu quả tốt với bệnh thán thư sầu riêng. Phun 3 lần là sạch bệnh hoàn toàn." },
  ];

  return (
    <div className="bg-surface-subtle min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Link to="/" className="hover:text-primary">Trang chủ</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link to="/san-pham" className="hover:text-primary">Sản phẩm</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-text-primary font-medium line-clamp-1 max-w-xs">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Image */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-border-subtle p-8 flex items-center justify-center aspect-square shadow-sm relative">
              <span className="absolute top-4 left-4 px-2.5 py-1 bg-primary text-white text-xs font-bold rounded">{product.brand}</span>
              {discount > 0 && (
                <span className="absolute top-4 right-4 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded">-{discount}%</span>
              )}
              <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">{product.category}</div>
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary leading-snug mb-3">{product.name}</h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className={`material-symbols-outlined fill text-[16px] ${i <= Math.round(product.rating) ? "text-yellow-400" : "text-border-strong"}`}>star</span>
                  ))}
                </div>
                <span className="text-sm font-semibold text-text-primary">{product.rating}</span>
                <span className="text-sm text-text-muted">({product.reviewCount} đánh giá)</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-surface-subtle rounded-xl p-4 border border-border-subtle">
              <div className="flex items-end gap-3">
                <div className="text-3xl font-extrabold text-primary">{formatPrice(product.price)}</div>
                {product.originalPrice && (
                  <div className="text-base text-text-muted line-through pb-0.5">{formatPrice(product.originalPrice)}</div>
                )}
              </div>
              <div className="text-xs text-text-muted mt-1">/{product.unit}</div>
              {product.creditSupport && (
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary-light px-2.5 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[14px]">credit_score</span>
                  Hỗ trợ nợ vụ - Trả sau mùa thu hoạch
                </div>
              )}
            </div>

            {/* Specs */}
            <div className="space-y-2 text-sm">
              {[
                { label: "Thương hiệu", value: product.brand },
                { label: "Hoạt chất", value: product.activeIngredient },
                { label: "Quy cách đóng gói", value: product.packaging },
                { label: "Tình trạng", value: product.inStock ? "Còn hàng" : "Hết hàng", green: product.inStock },
              ].map((row) => (
                <div key={row.label} className="flex gap-3">
                  <span className="text-text-muted w-40 flex-shrink-0">{row.label}:</span>
                  <span className={`font-medium ${row.green ? "text-status-success" : "text-text-primary"}`}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Crops/diseases */}
            {product.crops.length > 0 && (
              <div>
                <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Cây trồng áp dụng</div>
                <div className="flex flex-wrap gap-2">
                  {product.crops.map((c) => (
                    <span key={c} className="px-2.5 py-1 bg-primary-light text-primary text-xs font-medium rounded-full">{c}</span>
                  ))}
                </div>
              </div>
            )}
            {product.diseases.length > 0 && (
              <div>
                <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Phòng trị bệnh</div>
                <div className="flex flex-wrap gap-2">
                  {product.diseases.map((d) => (
                    <span key={d} className="px-2.5 py-1 bg-status-warning-surface text-status-warning text-xs font-medium rounded-full">{d}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Add */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center border border-border-subtle rounded-lg overflow-hidden bg-white">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-surface-subtle transition-colors">
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <span className="w-12 text-center text-sm font-bold text-text-primary">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center text-text-secondary hover:bg-surface-subtle transition-colors">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
              <button
                onClick={handleAdd}
                className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${added ? "bg-status-success text-white" : "bg-primary hover:bg-primary-hover text-white"}`}
              >
                <span className="material-symbols-outlined text-[20px]">{added ? "check_circle" : "add_shopping_cart"}</span>
                <span>{added ? "Đã thêm vào giỏ!" : "Thêm vào giỏ hàng"}</span>
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              {[
                { icon: "verified", label: "Hàng chính hãng 100%" },
                { icon: "local_shipping", label: "Giao tận vườn 2-4h" },
                { icon: "receipt_long", label: "Hóa đơn VAT đầy đủ" },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-1.5 text-center p-3 bg-surface-subtle rounded-lg border border-border-subtle">
                  <span className="material-symbols-outlined text-[20px] text-primary">{b.icon}</span>
                  <span className="text-[11px] text-text-secondary font-medium">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 bg-white rounded-2xl border border-border-subtle overflow-hidden shadow-sm">
          <div className="flex border-b border-border-subtle">
            {([["desc", "Mô tả sản phẩm"], ["usage", "Hướng dẫn sử dụng"], ["reviews", "Đánh giá"]] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-6 py-4 text-sm font-semibold transition-colors ${tab === key ? "border-b-2 border-primary text-primary" : "text-text-secondary hover:text-text-primary"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="p-6">
            {tab === "desc" && (
              <div className="prose prose-sm max-w-none text-text-secondary leading-relaxed">
                <p>{product.description}</p>
              </div>
            )}
            {tab === "usage" && (
              <div className="bg-primary-light rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[24px] text-primary mt-0.5">science</span>
                  <div>
                    <div className="font-bold text-text-primary mb-2">Hướng dẫn sử dụng</div>
                    <p className="text-sm text-text-secondary leading-relaxed">{product.usage}</p>
                  </div>
                </div>
              </div>
            )}
            {tab === "reviews" && (
              <div className="space-y-4">
                {reviews.map((r, i) => (
                  <div key={i} className="border-b border-border-subtle pb-4 last:border-b-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-sm">{r.name[0]}</div>
                      <div>
                        <div className="text-sm font-semibold text-text-primary">{r.name}</div>
                        <div className="text-xs text-text-muted">{r.date}</div>
                      </div>
                      <div className="flex items-center gap-0.5 ml-auto">
                        {[1,2,3,4,5].map(i => (
                          <span key={i} className={`material-symbols-outlined fill text-[14px] ${i <= r.rating ? "text-yellow-400" : "text-border-strong"}`}>star</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-bold text-text-primary mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link key={p.id} to={`/san-pham/${p.slug}`} className="bg-white rounded-xl border border-border-subtle hover:border-primary hover:shadow-sm transition-all overflow-hidden group">
                  <div className="p-4 h-36 flex items-center justify-center bg-white">
                    <img src={p.image} alt={p.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-3 border-t border-border-subtle">
                    <div className="text-xs font-bold text-text-primary group-hover:text-primary line-clamp-2">{p.name}</div>
                    <div className="text-sm font-bold text-primary mt-1">{formatPrice(p.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
