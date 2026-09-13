import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { products } from "../data/products";
import { articles } from "../data/articles";

function formatPrice(n: number) {
  return n.toLocaleString("vi-VN") + " đ";
}

export default function Home() {
  const { addItem, items } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/san-pham?q=${encodeURIComponent(search.trim())}`);
  };

  const handleAdd = (p: (typeof products)[0]) => {
    addItem({ id: p.id, name: p.name, price: p.price, originalPrice: p.originalPrice, image: p.image, brand: p.brand, unit: p.unit });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const featured = products.slice(0, 4);
  const latestArticles = articles.slice(0, 3);

  const categoryBadgeStyle = (cat: string) => {
    if (cat === "Cảnh báo dịch hại") return "bg-status-warning-surface text-status-warning";
    if (cat === "Kỹ thuật canh tác") return "bg-primary-light text-primary";
    return "bg-blue-50 text-status-info";
  };
  const categoryIcon = (cat: string) => {
    if (cat === "Cảnh báo dịch hại") return "warning";
    if (cat === "Kỹ thuật canh tác") return "eco";
    return "store";
  };

  return (
    <div className="bg-surface-subtle">
      {/* HERO */}
      <section className="relative w-full bg-gradient-to-b from-primary-dark via-[#1a5b22] to-primary overflow-hidden text-white py-12 lg:py-20">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-emerald-200 backdrop-blur-[1px]">
                <span className="material-symbols-outlined text-[16px] text-emerald-300 animate-pulse">eco</span>
                <span>Nền tảng Nông nghiệp Số 4.0 Hàng Đầu Việt Nam</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-white">
                Đồng hành cùng nhà nông nâng tầm năng suất & Số hóa mùa vụ
              </h1>
              <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed max-w-2xl">
                Hệ sinh thái vật tư nông nghiệp chính hãng, bảo lãnh công nợ mùa vụ linh hoạt và trợ lý Trí tuệ Nhân tạo (AI) nhận diện bệnh hại cây trồng qua ảnh chụp tức thì.
              </p>
              <div className="pt-2">
                <form onSubmit={handleSearch} className="bg-white p-2 rounded-xl shadow-xl flex flex-col sm:flex-row items-center gap-2 border border-border-subtle max-w-2xl">
                  <div className="flex items-center flex-1 w-full px-3 gap-2">
                    <span className="material-symbols-outlined text-[22px] text-text-muted">search</span>
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full text-sm text-text-primary placeholder:text-text-muted focus:outline-none bg-transparent py-2"
                      placeholder="Tìm phân bón, thuốc BVTV, hoạt chất hoặc bệnh cây..."
                    />
                  </div>
                  <button type="submit" className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm flex-shrink-0">
                    <span>Tìm kiếm</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </form>
                <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-emerald-100/80">
                  <span className="font-medium text-emerald-200">Gợi ý tìm kiếm:</span>
                  {["NPK 20-20-15", "Trừ thán thư sầu riêng", "Ridomil Gold", "Tuyến trùng cà phê"].map((kw) => (
                    <button key={kw} onClick={() => { setSearch(kw); navigate(`/san-pham?q=${encodeURIComponent(kw)}`); }} className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors">
                      {kw}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/san-pham" className="px-6 py-3 bg-white text-primary-dark hover:bg-emerald-50 text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-primary">shopping_bag</span>
                  <span>Khám phá sản phẩm ngay</span>
                </Link>
                <Link to="/bac-si-ai" className="px-6 py-3 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm font-semibold rounded-lg backdrop-blur-[1px] transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-emerald-300">photo_camera</span>
                  <span>Bác sĩ cây trồng AI (Quét lá bệnh)</span>
                </Link>
              </div>
            </div>

            {/* Hero image card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-primary-dark/80 group">
                <img
                  src="https://lh3.googleusercontent.com/aida/AEtjO1XGezutwBLujRfYYW-Oq6ctBIapuCwRvY30-mP-XpcHzfzN7wBQeDVLZdeim9H7kj9EprfP5hiU2nLcLyKAds_HQRuePA4DT_1x7K6ofveh7v1TTLK-IoCAbKulEm0z8StHrLQWLK_F-VbNXV4G2nQJOGwbMU8YjrcJcCoKq2mrskEC_d1Fq6XxL0Sut3ouArJ14wPGJlLJ_AlQ7pKrIlRlLPhl1YsFBxjGuqFANU0NE_ZNXVA8zcnkCbjs"
                  alt="Đồng hành cùng nhà nông mùa vụ"
                  className="w-full h-80 sm:h-96 object-cover transform scale-105 group-hover:scale-100 transition-transform duration-700 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/40 to-transparent" />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-border-subtle flex items-center gap-2.5 text-text-primary">
                  <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">verified</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-primary">98% AI chính xác</div>
                    <div className="text-[10px] text-text-muted">Chẩn đoán hơn 120 bệnh</div>
                  </div>
                </div>
                <div className="absolute bottom-20 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-border-subtle flex items-center gap-2.5 text-text-primary">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-primary-dark">
                    <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text-primary">Giao vật tư tận vườn</div>
                    <div className="text-[10px] text-text-muted">Nhanh chóng trong 2-4h</div>
                  </div>
                </div>
                <div className="absolute bottom-4 inset-x-4 bg-primary/90 backdrop-blur-md p-3 rounded-xl border border-white/20 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-emerald-300 text-[22px]">credit_score</span>
                    <div>
                      <div className="text-xs font-bold text-white">Bảo lãnh công nợ mùa vụ</div>
                      <div className="text-[11px] text-emerald-100/90">Hạn mức lên tới 200 triệu / nhà vườn</div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-emerald-300 text-[18px]">chevron_right</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI DIAGNOSIS BANNER */}
      <section className="w-full py-12 bg-white border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-surface-subtle via-emerald-50/50 to-surface-secondary border border-primary/20 p-6 sm:p-10 relative overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[16px]">psychology</span>
                  <span>Đột phá Trí Tuệ Nhân Tạo</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                  Bác sĩ cây trồng AI - Chẩn đoán bệnh trong 3 giây
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed max-w-2xl">
                  Không còn lo lắng cây trồng suy thoái. Chỉ cần chụp ảnh vùng lá, cành hoặc rễ bị tổn thương, hệ thống AI của AgriSage sẽ lập tức phân tích mầm bệnh và gợi ý đơn thuốc điều trị chuẩn xác.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
                  {[
                    { step: 1, title: "Chụp ảnh cây trồng", desc: "Chụp rõ nét vị trí lá đốm, cháy bìa hay rễ thối" },
                    { step: 2, title: "AI phân tích mẫu", desc: "Nhận diện chủng nấm, sâu bệnh hại và mức độ" },
                    { step: 3, title: "Nhận phác đồ ngay", desc: "Kê đơn thuốc chính xác & chỉ định cách phun" },
                  ].map((s) => (
                    <div key={s.step} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-border-subtle shadow-sm">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">{s.step}</div>
                      <div>
                        <div className="text-xs font-bold text-text-primary">{s.title}</div>
                        <div className="text-[11px] text-text-muted mt-0.5">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-4 flex flex-col items-center justify-center bg-white p-6 rounded-xl border border-border-subtle shadow-md text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-primary ring-8 ring-primary-light/50">
                  <span className="material-symbols-outlined text-[32px]">document_scanner</span>
                </div>
                <div>
                  <h3 className="font-bold text-text-primary text-base">Bắt đầu khám bệnh cho vườn</h3>
                  <p className="text-xs text-text-muted mt-1">Hoàn toàn miễn phí cho bà con nông dân</p>
                </div>
                <Link to="/bac-si-ai" className="w-full py-3 px-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
                  <span>Tải ảnh quét bệnh ngay</span>
                </Link>
                <div className="text-[11px] text-text-muted pt-1 flex items-center gap-1.5 justify-center">
                  <span className="w-2 h-2 rounded-full bg-status-success"></span>
                  <span>Vừa chẩn đoán: Sầu riêng đốm mắt cua (Lâm Đồng)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="w-full py-12 bg-surface-subtle border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">DANH MỤC VẬT TƯ CHỦ LỰC</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">Trang Bị Toàn Diện Cho Mọi Mùa Vụ</h2>
            </div>
            <Link to="/san-pham" className="text-sm font-semibold text-primary hover:text-primary-dark flex items-center gap-1 hover:underline">
              <span>Xem tất cả danh mục</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYmybezoPoW8Q0kw6qlNb7qmrnn81U2mlCdY-5moBP8pZ0oPAFNioXvUSiqET75q9YjH6p7QE_iyePkrq2EPZDNgK0nbajjAhCzLTG3hjwICpkR9H7C_UADkxgClolZ1Kx8CwfEQbrIKDZTA9kNAxQYKN-sXY0qaemwpRdsm7jb361K9E1F4swV59f3cpeoOkzWj4JtuXs4pPvLJ7lWb5IeqxWz0mf4vYOauQYGuDl14onnIN_aqGtYA", name: "Phân bón NPK & Vi lượng", count: "240+ sản phẩm", cat: "" },
              { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdvH_lxZg8MmWyHRofuVOl3EBjF2COAfJmFymc8iX0I3ymk4lw3RVVZI82ldIJ8N6tnkpvDQRuiEts5mdK0n7rpQpVvxNPwse1mjYEfdmowMM3GxwNIAM1K_ZdTCfmrHw765nj0QwnCTr587TA238Nzhf8E2TB2tYat0XPtxHNGej9J8Fo397GlhLwhBSZlIWlRnVHK0p5lQxHWWXKr5iW62TNlhy7NdZivu69o1ZFeu2Inc1aQ9rQKg", name: "Thuốc BVTV & Diệt nấm", count: "180+ sản phẩm", cat: "thuoc-bvtv" },
              { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6xHTmGPYX6eOH405EBRdW8GpVLU3-WhPklDiOB4lj_l66DgdttXUdGfigbeXsRH2voR1eRvPpfDlby8L6CiTv_3PWW_l0FRh90oOPqZ5vJ4mzPz1IU-rr9w4rNqRQyIr8sR-gyl0qcnlqYampHcFoYl0thcasTehjH1PAQBQrpl5wj_ixa90N8TzQ16_kecJkdW2qPAFLRSWXyCtmdLr7hw57hlM6nsGvaPqRmdncd9sGiA9Il9FBog", name: "Phân hữu cơ vi sinh", count: "95+ sản phẩm", cat: "phan-huu-co" },
              { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxZLqcP4I86jommObcgqLggCaJKZJ76ZenDeNuaD1OaDK7uMadQo0D0uMK6zTJkNy42sRMOUmG_xZ9mjhyFRa-sXzeiVbZLxS0t5xHxnp91v1gJbr6noR75jHUjk-GIwFifs1oM4rG9p8S_-Gw-ZctjebQmT5MSbopHtakySZeQvxO_whz2o6ACOA-5PAUivmpaT4Hu1ewx3ONTiS5mGW6OeU4idRwVJQQ", name: "Hạt giống & Cây giống", count: "120+ loại", cat: "hat-giong" },
              { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxwj_jTVWCDREkFcAO0KUE40gsvX5LON-58qg4XaqWOKBvE3QZ5nqyr7pIPEsR2coLU8SxJ_ShNUj_IkGjJI57yarc5kBfYgX97m0eSiZyB0Jzc8ZkpwZTnNfJlNT2D7v0-i9OFO8s3O8eSvqjG338yHJYqA3OpOdYLEEvhY4JcXS70vqovOxBbclRYz7mOMV68RaKLaBci4K-K-SByr_13CT2CXCIDe0VV-gvpb-JSe97nEV_iT8u4g", name: "Tưới nhỏ giọt & Thiết bị", count: "70+ phụ kiện", cat: "thiet-bi" },
              { img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAN1PbFltd1JOOqMkpL3EGwZsT0ac-hByg8MSXeI6Pt0DELvx-cVUB-QHYb4EPpMMeLdK3-OcDYajiu6lif0uAVM2iYxNTj96kFLe8z9DgxZn4gAckRVaCgI7o2ifXX59e47CTEJSjXhVv3NzZuHX5-coltgWtlnrpShV6mwwUojMkBWKRVgUBy3qyaqCOe3hUoHEICLh9CDwpKd0dQgvhGA-Ng1myS0EWoQ-bc6cTuPz1dEMowQzBtmw", name: "Thuốc trừ sâu sinh học", count: "110+ sản phẩm", cat: "thuoc-tru-sau" },
            ].map((cat) => (
              <Link key={cat.name} to={`/san-pham${cat.cat ? `?cat=${cat.cat}` : ""}`} className="group bg-white p-5 rounded-xl border border-border-subtle hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md text-center flex flex-col items-center justify-between">
                <img src={cat.img} alt={cat.name} className="w-16 h-16 object-contain mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-primary transition-colors leading-snug">{cat.name}</h3>
                <span className="text-[11px] text-text-muted mt-1">{cat.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="w-full py-12 bg-white border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">SẢN PHẨM CHÍNH HÃNG</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">Vật Tư & Nông Dược Bán Chạy Nhất</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted font-medium">Cam kết 100% hóa đơn VAT & tem chống hàng giả</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-border-subtle hover:border-primary hover:shadow-card transition-all duration-300 overflow-hidden flex flex-col justify-between group">
                <Link to={`/san-pham/${p.slug}`} className="relative p-4 bg-white flex items-center justify-center h-48 overflow-hidden block">
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded z-10">{p.brand}</span>
                  <img src={p.image} alt={p.name} className="w-full h-full object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-status-success-surface text-status-success text-[10px] font-semibold rounded flex items-center gap-1 z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-success"></span> Còn hàng
                  </span>
                </Link>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-text-muted uppercase font-semibold tracking-wider mb-1">{p.category}</div>
                    <Link to={`/san-pham/${p.slug}`}>
                      <h3 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2 leading-snug">{p.name}</h3>
                    </Link>
                    <p className="text-xs text-text-secondary mt-1">Hoạt chất: {p.activeIngredient}</p>
                    <p className="text-xs text-text-muted mt-0.5">Quy cách: {p.packaging}</p>
                  </div>
                  <div className="pt-4 border-t border-border-subtle mt-4 flex items-center justify-between">
                    <div>
                      {p.originalPrice && <div className="text-xs text-text-muted line-through">{formatPrice(p.originalPrice)}</div>}
                      {p.creditSupport && <div className="text-xs text-text-muted">Hỗ trợ nợ vụ</div>}
                      <div className="text-base font-bold text-primary">{formatPrice(p.price)}</div>
                    </div>
                    <button
                      onClick={() => handleAdd(p)}
                      className={`p-2 rounded-lg text-white shadow-sm transition-colors flex items-center justify-center ${addedId === p.id ? "bg-status-success" : "bg-primary hover:bg-primary-hover"}`}
                      title="Thêm vào giỏ"
                    >
                      <span className="material-symbols-outlined text-[18px]">{addedId === p.id ? "check" : "add_shopping_cart"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/san-pham" className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-all shadow-sm">
              <span>Xem tất cả sản phẩm</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* COMMITMENT */}
      <section className="w-full py-12 bg-surface-subtle border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text-primary uppercase tracking-tight mb-2">CAM KẾT VỚI NGƯỜI TIÊU DÙNG</h2>
            <div className="text-sm sm:text-base font-bold text-text-primary tracking-wider uppercase mb-3">KHÔNG PHẢI LÀ TỐT - MÀ LÀ TỐT NHẤT</div>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">Chúng tôi luôn tâm niệm: không ngừng cải thiện chất lượng sản phẩm, để sản phẩm ngày càng tốt hơn. Đáp ứng tốt nhất nhu cầu cũng như tiêu chí: Năng suất - An toàn - Tiết Kiệm của bà con.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 justify-items-center items-center max-w-6xl mx-auto">
            {[
              { img: "https://lh3.googleusercontent.com/aida/AEtjO1XgZ7DLtWlYgMhh9WINlbSPHx-PT5tCrn9siVvaQfzJS671Ur0e7bX6B3WOa0LNawIMRO5fcAm37JdZH-vnNjP7caTGFbkZxu5srBAQIL4O5f2JkxBhCwdocGbMvvnOstwKf-LYwf3zifftx0KOeRv3rw9Ke1dYKBwJ7L5rp4f1Upsgqu_Y1BgUpc0qO68vqIyLpAYMDuy4H68oUlHIGX83GBszJIEri0396SMHZLjf0RzBfpot0UtoEkI", label: "Tăng năng suất\nđạt 60-70%" },
              { img: "https://lh3.googleusercontent.com/aida/AEtjO1Uf9i7Tco-GWZVZdcp3f8hyddCRymsPSTL2ckJ8E6WBJIOVk8Y5COvQUuJ9ZGhWAQ5wQR9FESZmYMkRG13H7JJ3jBI7qhL-xO5O2JW32IRAR2xU7jIYIKp4zJXwJcoOl0MBpqqoen83yK19cKxarJP1kazufYjQjwQsuE_L28MypzBViCeJ1V9wMU5eHH3h0b3p2bEKSi-Rob57Lf98oPSRIiwCJWtFHndRofNRasNsoet9Zy3PHn5nqcM-", label: "Sản phẩm hữu cơ\nAn Toàn Tuyệt Đối" },
              { img: "https://lh3.googleusercontent.com/aida/AEtjO1VRA05tP7UFl5TbHAD5H5WgkbXGONH7EqnwUNe4AXW3nRN-wkqPaPHGIqPtQaDukH8pnqYXm2y6QMedDuBDLBRFUuDxl7mb8gTgLbu92Xo5Mu3fEQhwiL0Nt9TO7bfP9L80EigSGVd2R3gwADd6tVlfFxWarx8SI5U_8KC6e1AGgw1-T__AkapDsSJc7YJaYa7ni_724FMtl-C8tqYXRjOV43XfSRyoobG0s0X3RRd3TWe1KLmi5-hR4Q6A", label: "Tăng giá bán nông sản\n4-6 giá" },
              { img: "https://lh3.googleusercontent.com/aida/AEtjO1Wgs9o0X-zKJQ0fZzRAIifV_5oZW5aivn_HMJ6TLz0zdqmmynuxkX_9O_LL15KLj1E1yjBqbB5_nKfI63nFnqKQ4cc12tGdGvXikUq1_Qx7Rq-nSgpuu-YM2YO9TbGDXHBX0_dSUgWVukZRm-48sgGxZpTmdipzF4Nwws5rBLIdipO_IPR8La9oCGck6edVM7Uc9xsUS4edcdjjUtXBc43NY3Ei2YoPSg1GwmPOFtcRRboDaFCmrNz4PXE-", label: "Hỗ Trợ kỹ thuật\n24/7" },
            ].map((item) => (
              <div key={item.label} className="relative w-56 h-56 sm:w-60 sm:h-60 md:w-64 md:h-64 rounded-full overflow-hidden shadow-lg border-4 border-white group transition-transform duration-300 hover:scale-105">
                <img src={item.img} alt={item.label} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/50 to-transparent flex items-center justify-center text-center px-4 pb-2">
                  <span className="font-bold text-white text-base md:text-lg leading-snug drop-shadow-md text-center whitespace-pre-line">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section className="w-full py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">BẢN TIN NÔNG NGHIỆP & DỊCH BỆNH VÙNG</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">Cập Nhật Kỹ Thuật Mùa Vụ Mới Nhất</h2>
            </div>
            <Link to="/kien-thuc" className="text-sm font-semibold text-primary hover:text-primary-dark flex items-center gap-1 hover:underline">
              <span>Xem tất cả bài viết</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestArticles.map((a) => (
              <div key={a.id} className="bg-surface-subtle rounded-xl border border-border-subtle overflow-hidden hover:shadow-card transition-all group flex flex-col">
                <Link to={`/kien-thuc/${a.slug}`} className="w-full h-48 overflow-hidden block">
                  <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </Link>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold mb-3 ${categoryBadgeStyle(a.category)}`}>
                      <span className="material-symbols-outlined text-[14px]">{categoryIcon(a.category)}</span>
                      <span>{a.category}</span>
                    </div>
                    <Link to={`/kien-thuc/${a.slug}`}>
                      <h3 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors leading-snug mb-2">{a.title}</h3>
                    </Link>
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">{a.excerpt}</p>
                  </div>
                </div>
                <div className="px-5 py-3 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted">
                  <span>{a.date} · {a.readTime} phút đọc</span>
                  <Link to={`/kien-thuc/${a.slug}`} className="text-primary font-semibold flex items-center gap-0.5 hover:underline">
                    Chi tiết <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
