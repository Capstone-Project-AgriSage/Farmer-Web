import { Link } from 'react-router-dom'
import { handleImageError } from '../../../utils/image'
import type { ProductGroup } from '../../../types'

const categories: { name: string; group: ProductGroup; count: string; image: string }[] = [
  {
    name: 'Phân bón NPK & Vi lượng',
    group: 'Phân bón NPK & Vi lượng',
    count: '240+ sản phẩm',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDYmybezoPoW8Q0kw6qlNb7qmrnn81U2mlCdY-5moBP8pZ0oPAFNioXvUSiqET75q9YjH6p7QE_iyePkrq2EPZDNgK0nbajjAhCzLTG3hjwICpkR9H7C_UADkxgClolZ1Kx8CwfEQbrIKDZTA9kNAxQYKN-sXY0qaemwpRdsm7jb361K9E1F4swV59f3cpeoOkzWj4JtuXs4pPvLJ7lWb5IeqxWz0mf4vYOauQYGuDl14onnIN_aqGtYA',
  },
  {
    name: 'Thuốc BVTV & Diệt nấm',
    group: 'Thuốc BVTV & Trừ nấm',
    count: '180+ sản phẩm',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBdvH_lxZg8MmWyHRofuVOl3EBjF2COAfJmFymc8iX0I3ymk4lw3RVVZI82ldIJ8N6tnkpvDQRuiEts5mdK0n7rpQpVvxNPwse1mjYEfdmowMM3GxwNIAM1K_ZdTCfmrHw765nj0QwnCTr587TA238Nzhf8E2TB2tYat0XPtxHNGej9J8Fo397GlhLwhBSZlIWlRnVHK0p5lQxHWWXKr5iW62TNlhy7NdZivu69o1ZFeu2Inc1aQ9rQKg',
  },
  {
    name: 'Phân hữu cơ vi sinh',
    group: 'Phân hữu cơ vi sinh',
    count: '95+ sản phẩm',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB6xHTmGPYX6eOH405EBRdW8GpVLU3-WhPklDiOB4lj_l66DgdttXUdGfigbeXsRH2voR1eRvPpfDlby8L6CiTv_3PWW_l0FRh90oOPqZ5vJ4mzPz1IU-rr9w4rNqRQyIr8sR-gyl0qcnlqYampHcFoYl0thcasTehjH1PAQBQrpl5wj_ixa90N8TzQ16_kecJkdW2qPAFLRSWXyCtmdLr7hw57hlM6nsGvaPqRmdncd9sGiA9Il9FBog',
  },
  {
    name: 'Hạt giống & Cây giống',
    group: 'Hạt giống & Cây giống',
    count: '120+ loại',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDxZLqcP4I86jommObcgqLggCaJKZJ76ZenDeNuaD1OaDK7uMadQo0D0uMK6zTJkNu3sgyd0nwxgzn4lIhD9TaSI42sRMOUmG_xZ9mjhyFRa-sXzeiVbZLxS0t5xHxnp91v1gJbr6noR75jHUjk-GIwFifs1oM4rG9p8S_-Gw-ZctjebQmT5MSbopHtakySZeQvxO_whz2o6ACOA-5PAUivmpaT4Hu1ewx3ONTiS5mGW6OeU4idRwVJQQ',
  },
  {
    name: 'Tưới nhỏ giọt & Thiết bị',
    group: 'Tưới nhỏ giọt & Thiết bị',
    count: '70+ phụ kiện',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBxwj_jTVWCDREkFcAO0KUE40gsvX5LON-58qg4XaqWOKBvE3QZ5nqyr7pIPEsR2coLU8SxJ_ShNUj_IkGjJI57yarc5kBfYgX97m0eSiZyB0Jzc8ZkpwZTnNfJlNT2D7v0-i9OFO8s3O8eSvqjG338yHJYqA3OpOdYLEEvhY4JcXS70vqovOxBbclRYz7mOMV68RaKLaBci4K-K-SByr_13CT2CXCIDe0VV-gvpb-JSe97nEV_iT8u4g',
  },
  {
    name: 'Thuốc trừ sâu sinh học',
    group: 'Thuốc trừ sâu sinh học',
    count: '110+ sản phẩm',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAN1PbFltd1JOOqMkpL3EGwZsT0ac-hByg8MSXeI6Pt0DELvx-cVUB-QHYb4EPpMMeLdK3-OcDYajiu6lif0uAVM2iYxNTj96kFLe8z9DgxZn4gAckRVaCgI7o2ifXX59e47CTEJSjXhVv3NzZuHX5-coltgWtlnrpShV6mwwUojMkBWKRVgUBy3qyaqCOe3hUoHEICLh9CDwpKd0dQgvhGA-Ng1myS0EWoQ-bc6cTuPz1dEMowQzBtmw',
  },
]

export default function CategoryGrid() {
  return (
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
              to={`/products?group=${encodeURIComponent(cat.group)}`}
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
  )
}
