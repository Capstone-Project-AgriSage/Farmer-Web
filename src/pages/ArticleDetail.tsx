import { useParams, Link, useNavigate } from "react-router";
import { articles } from "../data/articles";

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
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold ${styles[category] || "bg-surface-secondary text-text-secondary"}`}>
      <span className="material-symbols-outlined text-[14px]">{icons[category] || "article"}</span>
      {category}
    </span>
  );
}

function renderContent(content: string) {
  const lines = content.trim().split("\n");
  return lines.map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <br key={i} />;
    if (trimmed.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-text-primary mt-6 mb-3">{trimmed.slice(3)}</h2>;
    if (trimmed.startsWith("### ")) return <h3 key={i} className="text-base font-bold text-text-primary mt-4 mb-2">{trimmed.slice(4)}</h3>;
    if (trimmed.startsWith("- ")) {
      const html = trimmed.slice(2).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/`(.+?)`/g, "<code class='bg-surface-secondary px-1 py-0.5 rounded text-xs font-mono'>$1</code>");
      return <li key={i} className="text-sm text-text-secondary leading-relaxed mb-1 ml-4 list-disc" dangerouslySetInnerHTML={{ __html: html }} />;
    }
    if (/^\d+\./.test(trimmed)) {
      const text = trimmed.replace(/^\d+\.\s*/, "").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      return <li key={i} className="text-sm text-text-secondary leading-relaxed mb-1 ml-4 list-decimal" dangerouslySetInnerHTML={{ __html: text }} />;
    }
    const html = trimmed.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/`(.+?)`/g, "<code class='bg-surface-secondary px-1 py-0.5 rounded text-xs font-mono'>$1</code>");
    return <p key={i} className="text-sm text-text-secondary leading-relaxed mb-3" dangerouslySetInnerHTML={{ __html: html }} />;
  });
}

export default function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface-subtle">
        <span className="material-symbols-outlined text-[64px] text-text-muted">article</span>
        <div className="text-xl font-bold text-text-primary">Bài viết không tồn tại</div>
        <button onClick={() => navigate("/kien-thuc")} className="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold text-sm">
          Quay lại kiến thức
        </button>
      </div>
    );
  }

  const related = articles.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3);
  const others = related.length < 3 ? [...related, ...articles.filter((a) => a.id !== article.id && !related.includes(a)).slice(0, 3 - related.length)] : related;

  return (
    <div className="bg-surface-subtle min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-text-muted flex-wrap">
            <Link to="/" className="hover:text-primary">Trang chủ</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link to="/kien-thuc" className="hover:text-primary">Kiến thức</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-text-primary font-medium line-clamp-1 max-w-xs">{article.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main content */}
          <div className="lg:col-span-8">
            <article className="bg-white rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
              {/* Hero image */}
              <div className="h-72 overflow-hidden">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
              </div>

              <div className="p-6 sm:p-8">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <CategoryBadge category={article.category} />
                  <span className="text-xs text-text-muted">{article.date}</span>
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">schedule</span>
                    {article.readTime} phút đọc
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-text-primary leading-snug mb-4">{article.title}</h1>

                {/* Author */}
                <div className="flex items-center gap-3 pb-5 mb-5 border-b border-border-subtle">
                  <div className="w-9 h-9 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold">
                    {article.author[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-text-primary">{article.author}</div>
                    <div className="text-xs text-text-muted">Chuyên gia Nông nghiệp AgriSage</div>
                  </div>
                </div>

                {/* Excerpt */}
                <div className="bg-surface-subtle rounded-xl p-4 mb-6 border-l-4 border-primary">
                  <p className="text-sm text-text-secondary leading-relaxed italic">{article.excerpt}</p>
                </div>

                {/* Content */}
                <div className="space-y-1">
                  {renderContent(article.content)}
                </div>

                {/* Tags */}
                <div className="mt-8 pt-5 border-t border-border-subtle">
                  <div className="text-xs font-bold text-text-muted mb-3">Từ khóa liên quan</div>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-surface-subtle border border-border-subtle text-xs text-text-secondary rounded-full hover:border-primary hover:text-primary transition-colors cursor-pointer">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-8 p-5 bg-gradient-to-r from-primary-dark to-primary rounded-xl text-white">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="font-bold mb-1">Cần tư vấn thêm về bệnh cây trồng?</div>
                      <div className="text-xs text-emerald-100/90">Thử ngay Bác sĩ AI miễn phí hoặc gọi kỹ sư tư vấn</div>
                    </div>
                    <div className="flex gap-2">
                      <Link to="/bac-si-ai" className="px-4 py-2 bg-white text-primary-dark rounded-lg text-xs font-bold hover:bg-emerald-50 transition-colors whitespace-nowrap">
                        Bác sĩ AI
                      </Link>
                      <a href="tel:19006828" className="px-4 py-2 bg-white/15 border border-white/20 text-white rounded-lg text-xs font-semibold hover:bg-white/25 transition-colors whitespace-nowrap">
                        1900 6828
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-5">
            {/* Related articles */}
            <div className="bg-white rounded-2xl border border-border-subtle shadow-sm p-5">
              <h3 className="font-bold text-text-primary text-sm mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">auto_awesome</span>
                Bài viết liên quan
              </h3>
              <div className="space-y-4">
                {others.map((a) => (
                  <Link key={a.id} to={`/kien-thuc/${a.slug}`} className="flex gap-3 group">
                    <img src={a.image} alt={a.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2 leading-snug">{a.title}</h4>
                      <div className="text-[11px] text-text-muted mt-1">{a.date} · {a.readTime} phút</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* AI Doctor CTA */}
            <div className="bg-gradient-to-br from-primary-dark to-primary rounded-2xl p-5 text-white">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[24px] text-emerald-300">psychology</span>
              </div>
              <h3 className="font-bold text-sm mb-2">Bác sĩ cây trồng AI</h3>
              <p className="text-xs text-emerald-100/90 mb-4 leading-relaxed">Chụp ảnh cây bị bệnh và nhận chẩn đoán AI miễn phí trong vài giây.</p>
              <Link to="/bac-si-ai" className="block w-full py-2 bg-white text-primary-dark text-xs font-bold rounded-lg text-center hover:bg-emerald-50 transition-colors">
                Thử ngay - Miễn phí
              </Link>
            </div>

            {/* Hotline */}
            <div className="bg-white rounded-2xl border border-border-subtle shadow-sm p-5">
              <h3 className="font-bold text-text-primary text-sm mb-3">Đường dây tư vấn kỹ thuật</h3>
              <a href="tel:19006828" className="flex items-center gap-3 p-3 bg-primary-light rounded-xl">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[20px]">support_agent</span>
                </div>
                <div>
                  <div className="text-lg font-extrabold text-primary">1900 6828</div>
                  <div className="text-[11px] text-text-muted">7:00 - 20:00 hàng ngày</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
