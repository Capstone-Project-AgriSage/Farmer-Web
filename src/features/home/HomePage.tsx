import { Link } from 'react-router-dom'
import { products } from '../../data/mockProducts'
import { articles } from '../../data/mockArticles'
import ProductCard from '../../components/ui/ProductCard'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { handleImageError } from '../../utils/image'

const categories = [
  {
    name: 'Phân bón NPK & Vi lượng',
    count: '240+ sản phẩm',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDYmybezoPoW8Q0kw6qlNb7qmrnn81U2mlCdY-5moBP8pZ0oPAFNioXvUSiqET75q9YjH6p7QE_iyePkrq2EPZDNgK0nbajjAhCzLTG3hjwICpkR9H7C_UADkxgClolZ1Kx8CwfEQbrIKDZTA9kNAxQYKN-sXY0qaemwpRdsm7jb361K9E1F4swV59f3cpeoOkzWj4JtuXs4pPvLJ7lWb5IeqxWz0mf4vYOauQYGuDl14onnIN_aqGtYA',
  },
  {
    name: 'Thuốc BVTV & Diệt nấm',
    count: '180+ sản phẩm',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBdvH_lxZg8MmWyHRofuVOl3EBjF2COAfJmFymc8iX0I3ymk4lw3RVVZI82ldIJ8N6tnkpvDQRuiEts5mdK0n7rpQpVvxNPwse1mjYEfdmowMM3GxwNIAM1K_ZdTCfmrHw765nj0QwnCTr587TA238Nzhf8E2TB2tYat0XPtxHNGej9J8Fo397GlhLwhBSZlIWlRnVHK0p5lQxHWWXKr5iW62TNlhy7NdZivu69o1ZFeu2Inc1aQ9rQKg',
  },
  {
    name: 'Phân hữu cơ vi sinh',
    count: '95+ sản phẩm',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB6xHTmGPYX6eOH405EBRdW8GpVLU3-WhPklDiOB4lj_l66DgdttXUdGfigbeXsRH2voR1eRvPpfDlby8L6CiTv_3PWW_l0FRh90oOPqZ5vJ4mzPz1IU-rr9w4rNqRQyIr8sR-gyl0qcnlqYampHcFoYl0thcasTehjH1PAQBQrpl5wj_ixa90N8TzQ16_kecJkdW2qPAFLRSWXyCtmdLr7hw57hlM6nsGvaPqRmdncd9sGiA9Il9FBog',
  },
  {
    name: 'Hạt giống & Cây giống',
    count: '120+ loại',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDxZLqcP4I86jommObcgqLggCaJKZJ76ZenDeNuaD1OaDK7uMadQo0D0uMK6zTJkNu3sgyd0nwxgzn4lIhD9TaSI42sRMOUmG_xZ9mjhyFRa-sXzeiVbZLxS0t5xHxnp91v1gJbr6noR75jHUjk-GIwFifs1oM4rG9p8S_-Gw-ZctjebQmT5MSbopHtakySZeQvxO_whz2o6ACOA-5PAUivmpaT4Hu1ewx3ONTiS5mGW6OeU4idRwVJQQ',
  },
  {
    name: 'Tưới nhỏ giọt & Thiết bị',
    count: '70+ phụ kiện',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBxwj_jTVWCDREkFcAO0KUE40gsvX5LON-58qg4XaqWOKBvE3QZ5nqyr7pIPEsR2coLU8SxJ_ShNUj_IkGjJI57yarc5kBfYgX97m0eSiZyB0Jzc8ZkpwZTnNfJlNT2D7v0-i9OFO8s3O8eSvqjG338yHJYqA3OpOdYLEEvhY4JcXS70vqovOxBbclRYz7mOMV68RaKLaBci4K-K-SByr_13CT2CXCIDe0VV-gvpb-JSe97nEV_iT8u4g',
  },
  {
    name: 'Thuốc trừ sâu sinh học',
    count: '110+ sản phẩm',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAN1PbFltd1JOOqMkpL3EGwZsT0ac-hByg8MSXeI6Pt0DELvx-cVUB-QHYb4EPpMMeLdK3-OcDYajiu6lif0uAVM2iYxNTj96kFLe8z9DgxZn4gAckRVaCgI7o2ifXX59e47CTEJSjXhVv3NzZuHX5-coltgWtlnrpShV6mwwUojMkBWKRVgUBy3qyaqCOe3hUoHEICLh9CDwpKd0dQgvhGA-Ng1myS0EWoQ-bc6cTuPz1dEMowQzBtmw',
  },
]

const commitments = [
  {
    title: 'Tăng năng suất đạt 60-70%',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDnD1zNIWCtZGr-GT2cIHN-qWTree5rhLe7e11fKvg8lUwoMJFXovfpiKNPYqThIKUbBJElGhc8kCQvvgwiuWkXNpKP2ZSWBdehNNkYwmTtX_ltKZCyCFd1bSV1j306tYLTC-PzDui3BQ9IB62NNKVrcwpeCRRkoIHpg-ZHZFuQuYFW_mztKu07edFj1nNKO_cuU-Bb1ffLscBgBP3V3QRu4cGe_O9FVxM_aqvVwHP-iv1jOLpLcDLsgQ',
  },
  {
    title: 'Sản phẩm hữu cơ An Toàn Tuyệt Đối',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDKO2yryFUM7PQyK6WkylC1tYxrHYP3alhrIoTvV2JnNJRsgC8Mz86x7Q3yqFPIzTL4J9wK50Pn-HNxvhZJcY3f36GX9aWz30mLXBNjrAE1V4QVn9AUydKUGbjCK8DoSrDVsEVLO3AW_UGwt7dOOyA4faCa943GHi6c2oeI_LhjFZh3xjdzZR8AZSckuTCILf2g0h2c1kmFUyAVmkM1v0Q2-D-uNSmWVC2XEaGEkye9U-YcOQa1Yc-VBQ',
  },
  {
    title: 'Tăng giá bán nông sản 4-6 giá',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDOTpgpFjTqUURu0p_dyMWrtJ8VBJazv2frIbmAn2qLl8ovfqAfcc7NeKnXbSOpi0IWKOdZyzexZ74kXG17st_Rbl420KKRhzPdBZPvcmF1QB-3Lizr4DqAdhzhyucpM2Aay4Ova81NcPLeCpJRRu8H9-brLU_thU7jiitvBDor8_uXqW2Ei-PrZ93Hno9f2YsCtRgb7N5-grANyc0ebeDS1BFPMSgUz94vOcEbMa6FYKQWvOC1TuhTYw',
  },
  {
    title: 'Hỗ Trợ kỹ thuật 24/7',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC2WI5zu9f5QIWiVbmNlGkuYPhlme17fZaDCuXmKwD-KQj3nFDr2Hv9QN_xljioXgNy4NR7-KnyhYPEezw5K7qzoPFyJfaYknUYmL_rA9cSeW3qwyXERWXvYQJFe4EUhrwx3lF7LL6rh4LmhIpSLl6Oa0EZFKT6fT_DwC-RnL4LGMksB8IQ8Iwy9kVF0bptBsoJQ98g4A4hNR9o13npVOg7oGXgGMvL_G56AoK72uPnATyBOE1EpmcdCg',
  },
]

export default function HomePage() {
  useDocumentTitle()
  const featured = products.slice(0, 4)

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative w-full bg-gradient-to-b from-primary-dark via-[#1a5b22] to-primary overflow-hidden text-white py-12 lg:py-20">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 -bottom-20 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-emerald-200 backdrop-blur-[1px]">
                <span className="material-symbols-outlined text-[16px] text-emerald-300 animate-pulse">
                  eco
                </span>
                <span>Nền tảng Nông nghiệp Số 4.0 Hàng Đầu Việt Nam</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-white">
                Đồng hành cùng nhà nông nâng tầm năng suất &amp; Số hóa mùa vụ
              </h1>
              <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed font-normal max-w-2xl">
                Hệ sinh thái vật tư nông nghiệp chính hãng, bảo lãnh công nợ mùa vụ linh hoạt và
                trợ lý Trí tuệ Nhân tạo (AI) nhận diện bệnh hại cây trồng qua ảnh chụp tức thì.
              </p>
              <div className="pt-2">
                <form
                  className="bg-white p-2 rounded-xl shadow-xl flex flex-col sm:flex-row items-center gap-2 border border-border-subtle max-w-2xl"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="flex items-center flex-1 w-full px-3 gap-2">
                    <span className="material-symbols-outlined text-[22px] text-text-muted">
                      search
                    </span>
                    <input
                      className="w-full text-sm text-text-primary placeholder:text-text-muted focus:outline-none bg-transparent py-2"
                      placeholder="Tìm phân bón, thuốc BVTV, hoạt chất hoặc bệnh cây..."
                      type="text"
                    />
                  </div>
                  <button
                    className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm flex-shrink-0"
                    type="submit"
                  >
                    <span>Tìm kiếm</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </form>
                <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-emerald-100/80">
                  <span className="font-medium text-emerald-200">Gợi ý tìm kiếm:</span>
                  {['NPK 20-20-15', 'Trừ thán thư sầu riêng', 'Ridomil Gold', 'Tuyến trùng cà phê'].map(
                    (keyword) => (
                      <Link
                        key={keyword}
                        to="/products"
                        className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors"
                      >
                        {keyword}
                      </Link>
                    ),
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/products"
                  className="px-6 py-3 bg-white text-primary-dark hover:bg-emerald-50 text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px] text-primary">
                    shopping_bag
                  </span>
                  <span>Khám phá sản phẩm ngay</span>
                </Link>
                <Link
                  to="/ai-doctor"
                  className="px-6 py-3 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm font-semibold rounded-lg backdrop-blur-[1px] transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px] text-emerald-300">
                    photo_camera
                  </span>
                  <span>Bác sĩ cây trồng AI (Quét lá bệnh)</span>
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-primary-dark/80 group">
                <img
                  alt="Đồng hành cùng nhà nông mùa vụ"
                  className="w-full h-80 sm:h-96 object-cover transform scale-105 group-hover:scale-100 transition-transform duration-700 brightness-90"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1XGezutwBLujRfYYW-Oq6ctBIapuCwRvY30-mP-XpcHzfzN7wBQeDVLZdeim9H7kj9EprfP5hiU2nLcLyKAds_HQRuePA4DT_1x7K6ofveh7v1TTLK-IoCAbKulEm0z8StHrLQWLK_F-VbNXV4G2nQJOGwbMU8YjrcJcCoKq2mrskEC_d1Fq6XxL0Sut3ouArJ14wPGJlLJ_AlQ7pKrIlRlLPhl1YsFBxjGuqFANU0NE_ZNXVA8zcnkCbjs"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/40 to-transparent"></div>
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
                    <span className="material-symbols-outlined text-emerald-300 text-[22px]">
                      credit_score
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">
                        Bảo lãnh công nợ mùa vụ
                      </div>
                      <div className="text-[11px] text-emerald-100/90">
                        Hạn mức lên tới 200 triệu / nhà vườn
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-emerald-300 text-[18px]">
                    chevron_right
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI DIAGNOSIS BANNER */}
      <section className="w-full py-12 bg-white border-b border-border-subtle" id="ai-diagnosis">
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
                  Không còn lo lắng cây trồng suy thoái. Chỉ cần chụp ảnh vùng lá, cành hoặc rễ bị
                  tổn thương, hệ thống AI của AgriSage sẽ lập tức phân tích mầm bệnh và gợi ý đơn
                  thuốc điều trị chuẩn xác.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
                  {[
                    ['Chụp ảnh cây trồng', 'Chụp rõ nét vị trí lá đốm, cháy bìa hay rễ thối'],
                    ['AI phân tích mẫu', 'Nhận diện chủng nấm, sâu bệnh hại và mức độ'],
                    ['Nhận phác đồ ngay', 'Kê đơn thuốc chính xác & chỉ định cách phun'],
                  ].map(([title, desc], i) => (
                    <div
                      key={title}
                      className="flex items-start gap-3 p-3 bg-white rounded-xl border border-border-subtle shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-text-primary">{title}</div>
                        <div className="text-[11px] text-text-muted mt-0.5">{desc}</div>
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
                  <h3 className="font-bold text-text-primary text-base">
                    Bắt đầu khám bệnh cho vườn
                  </h3>
                  <p className="text-xs text-text-muted mt-1">
                    Hoàn toàn miễn phí cho bà con nông dân
                  </p>
                </div>
                <Link
                  to="/ai-doctor"
                  className="w-full py-3 px-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
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
              <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                DANH MỤC VẬT TƯ CHỦ LỰC
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                Trang Bị Toàn Diện Cho Mọi Mùa Vụ
              </h2>
            </div>
            <Link
              to="/products"
              className="text-sm font-semibold text-primary hover:text-primary-dark flex items-center gap-1 hover:underline"
            >
              <span>Xem tất cả danh mục</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to="/products"
                className="group bg-white p-5 rounded-xl border border-border-subtle hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md text-center flex flex-col items-center justify-between"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  onError={handleImageError}
                  className="w-16 h-16 object-contain mb-3 group-hover:scale-110 transition-transform duration-300"
                />
                <h3 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-primary transition-colors leading-snug">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-text-muted mt-1">{cat.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
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
            {featured.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* COMMITMENT CARDS */}
      <section className="w-full py-12 bg-surface-subtle border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text-primary uppercase tracking-tight mb-2">
              CAM KẾT VỚI NGƯỜI TIÊU DÙNG
            </h2>
            <div className="text-sm sm:text-base font-bold text-text-primary tracking-wider uppercase mb-3">
              KHÔNG PHẢI LÀ TỐT - MÀ LÀ TỐT NHẤT
            </div>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-normal">
              Chúng tôi luôn tâm niệm: không ngừng cải thiện chất lượng sản phẩm, để sản phẩm ngày
              càng tốt hơn. Đáp ứng tốt nhất nhu cầu cũng như tiêu chí: Năng suất - An toàn - Tiết
              Kiệm của bà con.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 justify-items-center max-w-6xl mx-auto">
            {commitments.map((item) => (
              <div
                key={item.title}
                className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden shadow-lg border-4 border-white mx-auto group"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  onError={handleImageError}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent flex items-end justify-center pb-5 px-3 text-center">
                  <span className="text-white font-bold text-sm sm:text-base md:text-lg leading-tight drop-shadow-md">
                    {item.title}
                  </span>
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
              <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                BẢN TIN NÔNG NGHIỆP &amp; DỊCH BỆNH VÙNG
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                Cập Nhật Kỹ Thuật Mùa Vụ Mới Nhất
              </h2>
            </div>
            <Link
              to="/knowledge"
              className="text-sm font-semibold text-primary hover:text-primary-dark flex items-center gap-1 hover:underline"
            >
              <span>Xem tất cả bài viết</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((article) => (
              <div
                key={article.title}
                className="bg-surface-subtle rounded-xl border border-border-subtle overflow-hidden hover:shadow-card transition-all group flex flex-col justify-between"
              >
                <div className="p-5">
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold mb-3 ${article.badge.className}`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {article.badge.icon}
                    </span>
                    <span>{article.badge.label}</span>
                  </div>
                  <h3 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors leading-snug mb-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{article.summary}</p>
                </div>
                <div className="px-5 py-3 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted">
                  <span>{article.date}</span>
                  <span className="text-primary font-semibold flex items-center gap-0.5 group-hover:underline">
                    Chi tiết <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
