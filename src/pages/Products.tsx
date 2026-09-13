import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { useCart } from "../context/CartContext";
import { products, categories } from "../data/products";

function formatPrice(n: number) {
  return n.toLocaleString("vi-VN") + " đ";
}

const sortOptions = [
  { label: "Bán chạy nhất", value: "popular" },
  { label: "Giá thấp đến cao", value: "price-asc" },
  { label: "Giá cao đến thấp", value: "price-desc" },
  { label: "Đánh giá cao nhất", value: "rating" },
];

const PAGE_SIZE = 4;

function getPageNumbers(totalPages: number) {
  return Array.from({ length: totalPages }, (_, index) => index + 1);
}

export default function Products() {
  const { addItem } = useCart();
  const [params, setParams] = useSearchParams();
  const [addedId, setAddedId] = useState<string | null>(null);

  const q = params.get("q") || "";
  const cat = params.get("cat") || "";
  const sort = params.get("sort") || "popular";
  const currentPage = Math.max(1, Number(params.get("page")) || 1);

  const [localQ, setLocalQ] = useState(q);

  const filtered = useMemo(() => {
    let list = [...products];
    if (q) {
      const lq = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(lq) ||
          p.activeIngredient.toLowerCase().includes(lq) ||
          p.category.toLowerCase().includes(lq) ||
          p.diseases.some((d) => d.toLowerCase().includes(lq))
      );
    }
    if (cat) list = list.filter((p) => p.categorySlug === cat);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [q, cat, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedProducts = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(params);
    if (localQ) next.set("q", localQ);
    else next.delete("q");
    next.delete("page");
    setParams(next);
  };

  const setFilter = (key: string, val: string) => {
    const next = new URLSearchParams(params);
    if (val) next.set(key, val);
    else next.delete(key);
    next.delete("page");
    setParams(next);
  };

  const setPage = (page: number) => {
    const next = new URLSearchParams(params);
    if (page <= 1) next.delete("page");
    else next.set("page", String(page));
    setParams(next);
  };

  const handleAdd = (p: (typeof products)[0]) => {
    addItem({ id: p.id, name: p.name, price: p.price, originalPrice: p.originalPrice, image: p.image, brand: p.brand, unit: p.unit });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <div className="bg-surface-subtle min-h-screen">
      {/* Page header */}
      <div className="bg-gradient-to-r from-primary-dark to-primary text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">VẬT TƯ NÔNG NGHIỆP</div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Cửa hàng sản phẩm chính hãng</h1>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
            <div className="flex-1 bg-white/10 border border-white/20 rounded-lg flex items-center px-3 gap-2">
              <span className="material-symbols-outlined text-[18px] text-emerald-300">search</span>
              <input
                value={localQ}
                onChange={(e) => setLocalQ(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white placeholder:text-emerald-200/60 focus:outline-none py-2"
                placeholder="Tìm theo tên sản phẩm, hoạt chất, bệnh hại..."
              />
            </div>
            <button type="submit" className="px-5 py-2 bg-white text-primary-dark font-semibold text-sm rounded-lg hover:bg-emerald-50 transition-colors">
              Tìm
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setFilter("cat", c.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${cat === c.value ? "bg-primary text-white border-primary" : "bg-white text-text-secondary border-border-subtle hover:border-primary hover:text-primary"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">Sắp xếp:</span>
            <select
              value={sort}
              onChange={(e) => setFilter("sort", e.target.value)}
              className="text-sm border border-border-subtle rounded-lg px-3 py-1.5 bg-white text-text-primary focus:outline-none focus:border-primary"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-text-muted">
          {q && <span>Kết quả tìm kiếm cho "<strong className="text-text-primary">{q}</strong>": </span>}
          <strong className="text-text-primary">{filtered.length}</strong> sản phẩm
          {filtered.length > PAGE_SIZE && (
            <span className="ml-1">
              - trang <strong className="text-text-primary">{safePage}</strong>/{totalPages}
            </span>
          )}
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-[64px] text-text-muted">search_off</span>
            <div className="text-text-secondary mt-4 text-lg font-semibold">Không tìm thấy sản phẩm</div>
            <p className="text-text-muted text-sm mt-2">Thử tìm với từ khóa khác hoặc xem tất cả sản phẩm.</p>
            <button onClick={() => setParams({})} className="mt-4 px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors">
              Xem tất cả
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pagedProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-border-subtle hover:border-primary hover:shadow-card transition-all duration-300 overflow-hidden flex flex-col group">
                <Link to={`/san-pham/${p.slug}`} className="relative p-4 bg-white flex items-center justify-center h-48 overflow-hidden">
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded z-10">{p.brand}</span>
                  <img src={p.image} alt={p.name} className="w-full h-full object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
                  {p.originalPrice && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded z-10">
                      -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                    </span>
                  )}
                  <span className={`absolute bottom-2 right-2 px-2 py-0.5 text-[10px] font-semibold rounded flex items-center gap-1 z-10 ${p.inStock ? "bg-status-success-surface text-status-success" : "bg-status-error-surface text-status-error"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${p.inStock ? "bg-status-success" : "bg-status-error"}`}></span>
                    {p.inStock ? "Còn hàng" : "Hết hàng"}
                  </span>
                </Link>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="text-[11px] text-text-muted uppercase font-semibold tracking-wider mb-1">{p.category}</div>
                  <Link to={`/san-pham/${p.slug}`}>
                    <h3 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1">{p.name}</h3>
                  </Link>
                  <p className="text-xs text-text-secondary">Hoạt chất: {p.activeIngredient}</p>
                  <p className="text-xs text-text-muted mt-0.5 mb-3">Quy cách: {p.packaging}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className={`material-symbols-outlined fill text-[14px] ${i <= Math.round(p.rating) ? "text-yellow-400" : "text-border-strong"}`}>star</span>
                    ))}
                    <span className="text-[11px] text-text-muted ml-1">({p.reviewCount})</span>
                  </div>

                  <div className="pt-3 border-t border-border-subtle mt-auto flex items-center justify-between">
                    <div>
                      {p.originalPrice && <div className="text-xs text-text-muted line-through">{formatPrice(p.originalPrice)}</div>}
                      {p.creditSupport && <div className="text-xs text-emerald-600 font-medium flex items-center gap-1"><span className="material-symbols-outlined text-[12px]">credit_score</span> Nợ vụ</div>}
                      <div className="text-base font-bold text-primary">{formatPrice(p.price)}</div>
                    </div>
                    <button
                      onClick={() => handleAdd(p)}
                      disabled={!p.inStock}
                      className={`p-2 rounded-lg text-white shadow-sm transition-colors flex items-center justify-center ${addedId === p.id ? "bg-status-success" : p.inStock ? "bg-primary hover:bg-primary-hover" : "bg-text-muted cursor-not-allowed"}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{addedId === p.id ? "check" : "add_shopping_cart"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length > PAGE_SIZE && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage(safePage - 1)}
              disabled={safePage === 1}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border-subtle bg-white px-3 text-sm font-semibold text-text-secondary transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-45"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
              Trước
            </button>
            {getPageNumbers(totalPages).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setPage(page)}
                className={`h-9 min-w-9 rounded-lg border px-3 text-sm font-bold transition-colors ${
                  safePage === page
                    ? "border-primary bg-primary text-white"
                    : "border-border-subtle bg-white text-text-secondary hover:border-primary hover:text-primary"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage(safePage + 1)}
              disabled={safePage === totalPages}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border-subtle bg-white px-3 text-sm font-semibold text-text-secondary transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-45"
            >
              Sau
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
