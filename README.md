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

## Thông báo cá nhân

Trang `/notifications` và chuông trên thanh điều hướng dùng dữ liệu thật từ backend:

| Thao tác | API |
| --- | --- |
| Danh sách, phân trang, lọc trạng thái | `GET /api/me/notifications?page=1&pageSize=20&status=UNREAD` |
| Badge chưa đọc | `GET /api/me/notifications/unread-count` |
| Đánh dấu một thông báo đã đọc | `POST /api/me/notifications/{id}/read` |
| Đánh dấu tất cả đã đọc | `POST /api/me/notifications/read-all` |
| Lưu trữ thông báo | `DELETE /api/me/notifications/{id}` |

Không truyền user ID; API client hiện có gửi JWT của người đăng nhập. Bộ lọc mặc định bỏ qua thông báo đã lưu trữ;
`UNREAD`, `READ`, `ARCHIVED` được lọc và phân trang ở server. Lưu trữ không xóa dữ liệu.
Badge cập nhật ngay sau thao tác thành công, kiểm tra lại mỗi 30 giây khi tab hiển thị và khi cửa sổ nhận focus.
Phản hồi cũ bị hủy khi chuyển bộ lọc/trang hoặc đổi người đăng nhập; thao tác thất bại giữ nguyên dữ liệu đã xác nhận.
Thông báo đơn hàng/công nợ/giao hàng/tồn kho có liên kết đến màn hình phù hợp khi vai trò và metadata hỗ trợ.

Backend cần migration Auth/Notifications đã áp dụng và `BackgroundJobs__Enabled=true` để tự chuyển sự kiện outbox
thành thông báo/cảnh báo. Frontend hiển thị trạng thái rỗng khi tài khoản chưa có thông báo.

### Kiểm tra thông báo

- TypeScript: `node node_modules/typescript/bin/tsc -b`
- Production build: `npm run build`
- Lint: `npm run lint` (project hiện có một số cảnh báo ngoài phần thông báo).
- Browser regression: khởi động dev server, cấu hình `NOTIFICATION_TEST_URL` trỏ tới server đó rồi chạy
  `node scripts/test-notifications.mjs`. Cần Playwright trong môi trường kiểm thử; có thể truyền đường dẫn
  module `index.mjs` bằng `NOTIFICATION_PLAYWRIGHT_MODULE`. Dùng `NOTIFICATION_BROWSER_CHANNEL=msedge`
  hoặc `chrome` để kiểm tra bằng browser cài sẵn, hoặc dùng Chromium của Playwright mặc định.

Browser test dùng JWT giả và chặn toàn bộ request `/api/*`; không gửi thao tác tới backend/Supabase.
Các tình huống bao gồm phân trang/badge, đọc một mục/tất cả, lưu trữ, API lỗi/retry, phản hồi đến sai thứ tự,
hết phiên và mobile/99+. Management còn kiểm tra trang cá nhân cho Admin, chủ cửa hàng và nhân viên giao hàng.

### Mở rộng thông báo Owner/Sale/Farmer (2026-10-09)

Các loại mới gồm thanh toán thất bại, thanh toán công nợ, công nợ mới, đơn cần giao/giao thất bại,
trả hàng/hoàn tiền, hết hàng và biến động kho. Bộ phát backend lọc tài khoản/role/membership đang
hoạt động tại đúng cửa hàng và chống gửi trùng. Khi số chưa đọc thay đổi, hộp thư đang mở tự tải lại.
`data.orderId` do server xác định giúp Farmer mở đúng đơn hàng từ thông báo thanh toán/giao hàng/trả hàng.
Nhắc công nợ và cảnh báo kho cần `BackgroundJobs__DebtReminders=true`, `BackgroundJobs__InventoryAlerts=true`;
chạy theo `AlertSeconds` (mặc định một giờ), chống lặp trong cùng ngày Việt Nam. Outbox và bộ đọc phiếu kho/
kết quả AI đã lưu chạy theo `NotificationSeconds` (mặc định 15 giây).

Thông báo AI/xét duyệt/khuyến nghị yêu cầu kết quả thật đã lưu, review hiện hành và quyền `can_review_ai`.
Backend chưa có API xử lý AI; trang lịch sử AI của Farmer vẫn dùng demo nên thông báo chưa liên kết tới trang đó.
Không tạo kết quả AI hoặc khuyến nghị mẫu để giả lập thông báo thật.