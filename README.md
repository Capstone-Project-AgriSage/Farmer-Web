# AgriSage — Farmer Web

Giao diện web dành cho **nông dân/đại lý** trong hệ sinh thái nông nghiệp số AgriSage: mua vật tư nông nghiệp (phân bón, thuốc BVTV, hạt giống...), chẩn đoán bệnh cây bằng AI qua ảnh chụp, quản lý giỏ hàng và đặt hàng.

Đây là 1 trong nhiều repo độc lập của dự án AgriSage (mỗi thư mục dưới `AgriSage/` là 1 repo Git riêng, không phải monorepo).

## Công nghệ

- **React 19** + **TypeScript** + **Vite**
- **React Router v7** (`createBrowserRouter`, route-based code-splitting bằng `React.lazy`)
- **Tailwind CSS v4** (qua `@tailwindcss/vite`, không cần PostCSS config riêng)
- Font tự host bằng **Fontsource** (Inter + Material Symbols Outlined) — không phụ thuộc Google Fonts CDN
- State giỏ hàng lưu qua `localStorage` (chưa có backend, xem phần Dữ liệu mock bên dưới)

## Bắt đầu

```bash
npm install
npm run dev
```

Mặc định chạy tại `http://localhost:5173` (hoặc cổng kế tiếp nếu đã bận).

### Các lệnh khác

```bash
npm run build      # typecheck (tsc -b) + build production vào dist/
npm run preview    # xem thử bản build production
npm run lint       # chạy oxlint
```

## Cấu trúc thư mục

```
src/
  main.tsx            # entry point
  router.tsx           # khai báo route + lazy-load từng trang + error boundary
  index.css            # Tailwind directives + design tokens (@theme)
  layouts/
    RootLayout.tsx      # khung chung: Header + <Outlet/> + Footer
  components/
    layout/             # Header, Footer dùng chung mọi trang
    ui/                  # component tái sử dụng đa tính năng (Button, Pagination, ProductCard, Spinner...)
    RouteErrorBoundary.tsx  # màn hình lỗi khi 1 route crash
    PageLoader.tsx       # màn hình chờ khi lazy-load route
  features/
    <domain>/
      <Ten>Page.tsx      # page orchestrator: giữ state + logic, gọi các component con
      components/        # component con chỉ dùng riêng cho domain này
  context/
    CartContext.tsx      # state giỏ hàng toàn cục, đồng bộ localStorage
  hooks/                # hook dùng chung (useDocumentTitle, useClipboard...)
  data/                 # dữ liệu mock (xem phần bên dưới)
  types/
    index.ts             # Product, CartItem, Order — hợp đồng dữ liệu dùng chung toàn app
  utils/                # hàm tiện ích thuần (xử lý ảnh lỗi...)
```

**Quy ước:** mỗi trang trong `features/<domain>/` là 1 orchestrator mỏng (giữ state, xử lý logic), phần hiển thị UI tách thành các component con trong `features/<domain>/components/`. Component nào dùng được ở nhiều domain thì đưa lên `components/ui/`.

## Luồng màn hình

```
Trang chủ (/) 
  → Đăng nhập (/login) ↔ Đăng ký (/register) ↔ Quên mật khẩu (/forgot-password)
  → Sản phẩm (/products) → Chi tiết sản phẩm (/products/:slug)
  → Giỏ hàng (/cart) → Thanh toán (/checkout) → Đặt hàng thành công (/order-success)
  → Bác sĩ cây trồng AI (/ai-doctor)
  → Tài khoản (/account), Giới thiệu (/about), Kiến thức (/knowledge), Liên hệ (/contact)
```

## Dữ liệu mock

Dự án **chưa kết nối backend thật**. Toàn bộ dữ liệu sản phẩm/bài viết/giỏ hàng nằm ở `src/data/` (`mockProducts.ts`, `mockArticles.ts`, `mockCart.ts`), được import trực tiếp bởi các trang cần dùng.

Khi có API thật, cần lưu ý:
- `types/index.ts` đã tách riêng khỏi mock data — dùng làm hợp đồng dữ liệu (data contract) để khớp với response backend, không cần đổi.
- `ProductsPage.tsx` hiện lọc/sắp xếp/phân trang **bằng JavaScript trên toàn bộ mảng sản phẩm trong bộ nhớ** — khi có API thật cần chuyển logic này thành query param gửi lên server (không thể tải hết sản phẩm về client).
- Các thao tác lấy dữ liệu hiện là đồng bộ (`getProductBySlug`...) — API thật sẽ bất đồng bộ, cần thêm state loading/error ở những nơi đang gọi mock data trực tiếp.

## Việc còn tồn đọng (đã biết)

- 1 số link `href="#"` chưa có trang đích thật (Footer, điều khoản/chính sách ở trang Đăng ký, theo dõi vận chuyển ở trang Đặt hàng thành công) — chờ có trang/tính năng tương ứng.
- Chưa có test tự động (Vitest/RTL) — mọi thay đổi cần verify thủ công qua trình duyệt.
- Ảnh sản phẩm/bài viết đang trỏ vào domain demo (`lh3.googleusercontent.com`) — sẽ thay bằng CDN thật khi có backend.
