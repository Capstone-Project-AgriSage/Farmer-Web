import { useState, useMemo } from "react";
import { Link } from "react-router";
import { articles, articleCategories } from "../data/articles";

const PAGE_SIZE = 3;

function getPageNumbers(totalPages: number) {
  return Array.from({ length: totalPages }, (_, index) => index + 1);
}

function CategoryBadge({ category }: { category: string }) {
  const styles: Record<string, string> = {
    "Cảnh báo dịch hại": "bg-status-warning-surface text-status-warning",
    "Kỹ thuật canh tác": "bg-primary-light text-primary",
    "Dành cho đại lý": "bg-status-info-surface text-status-info",
    "Nông nghiệp hữu cơ": "bg-emerald-50 text-emerald-700",
  };
  const icons: Record<string, string> = {
    "Cảnh báo dịch hại": "warning",
    "Kỹ thuật canh tác": "eco",
    "Dành cho đại lý": "store",
    "Nông nghiệp hữu cơ": "spa",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold ${styles[category] || "bg-surface-secondary text-text-secondary"}`}>
      <span className="material-symbols-outlined text-[14px]">{icons[category] || "article"}</span>
      {category}
    </span>
  );
}

export default function Knowledge() {
  const [activeCat, setActiveCat] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchCat = !activeCat || a.category === activeCat;
      const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCat, search]);

  const featured = articles[0];
  const visibleArticles = filtered.filter((a) => activeCat || search || a.id !== featured.id);
  const totalPages = Math.max(1, Math.ceil(visibleArticles.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedArticles = visibleArticles.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="bg-surface-subtle min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-dark to-primary text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-2">BẢN TIN NÔNG NGHIỆP</div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Kiến thức canh tác & Cảnh báo dịch hại</h1>
          <p className="text-emerald-100/90 text-sm max-w-xl">Cập nhật thông tin nông nghiệp mới nhất, kỹ thuật canh tác tiên tiến và cảnh báo dịch bệnh vùng từ đội ngũ kỹ sư AgriSage.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center">
          <div className="flex-1 max-w-sm relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-text-muted">search</span>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 border border-border-subtle rounded-lg text-sm text-text-primary bg-white focus:outline-none focus:border-primary"
              placeholder="Tìm bài viết..."
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {articleCategories.map((c) => (
              <button
                key={c.value}
                onClick={() => {
                  setActiveCat(c.value);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${activeCat === c.value ? "bg-primary text-white border-primary" : "bg-white text-text-secondary border-border-subtle hover:border-primary hover:text-primary"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured (only when no filter) */}
        {!activeCat && !search && (
          <Link to={`/kien-thuc/${featured.slug}`} className="block mb-8 group">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white rounded-2xl border border-border-subtle overflow-hidden shadow-sm hover:shadow-card transition-all">
              <div className="lg:col-span-5 h-64 lg:h-auto overflow-hidden">
                <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <CategoryBadge category={featured.category} />
                    <span className="text-xs text-text-muted">Bài viết nổi bật</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-text-primary group-hover:text-primary transition-colors leading-snug mb-3">{featured.title}</h2>
                  <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">{featured.excerpt}</p>
                </div>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border-subtle">
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">person</span>
                      {featured.author}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {featured.readTime} phút đọc
                    </div>
                  </div>
                  <span className="text-xs text-text-muted">{featured.date}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Articles grid */}
        {visibleArticles.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-[48px] text-text-muted">article</span>
            <div className="text-text-secondary mt-3">Không có bài viết nào phù hợp</div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-text-muted">
              <strong className="text-text-primary">{visibleArticles.length}</strong> bài viết
              {visibleArticles.length > PAGE_SIZE && (
                <span className="ml-1">
                  - trang <strong className="text-text-primary">{safePage}</strong>/{totalPages}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pagedArticles.map((a) => (
                <article key={a.id} className="bg-white rounded-xl border border-border-subtle overflow-hidden hover:shadow-card transition-all group flex flex-col">
                  <Link to={`/kien-thuc/${a.slug}`} className="block h-48 overflow-hidden">
                    <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="mb-3">
                      <CategoryBadge category={a.category} />
                    </div>
                    <Link to={`/kien-thuc/${a.slug}`}>
                      <h3 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors leading-snug mb-2">{a.title}</h3>
                    </Link>
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-3 flex-1">{a.excerpt}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {a.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-surface-subtle text-text-muted text-[11px] rounded">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="px-5 py-3 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">person</span>
                        {a.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        {a.readTime} phút
                      </span>
                    </div>
                    <Link to={`/kien-thuc/${a.slug}`} className="text-primary font-semibold flex items-center gap-0.5 hover:underline">
                      Đọc thêm <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {visibleArticles.length > PAGE_SIZE && (
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
                {getPageNumbers(totalPages).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`h-9 min-w-9 rounded-lg border px-3 text-sm font-bold transition-colors ${
                      safePage === pageNumber
                        ? "border-primary bg-primary text-white"
                        : "border-border-subtle bg-white text-text-secondary hover:border-primary hover:text-primary"
                    }`}
                  >
                    {pageNumber}
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
          </>
        )}
      </div>
    </div>
  );
}
