# Bài viết và liên hệ — 12/11/2026

- Trang chủ (Kiến thức mới), `/knowledge` và `/knowledge/:slug` dùng `/api/articles`; chỉ bài PUBLISHED.
- Ảnh đại diện do Admin/Owner tải lên được hiển thị trong thẻ bài viết và trang chi tiết; nội dung giữ xuống dòng, không render HTML.
- `/contact` gửi thật tới POST `/api/contact-requests`. Chỉ hiện mã tiếp nhận sau HTTP 201; lỗi giữ nguyên form để thử lại.
- Địa chỉ/khu vực được lưu cùng message vì schema hiện tại không có trường area.
- Khách chưa đăng nhập được gửi; yêu cầu này không nằm trong lịch sử tài khoản, phản hồi qua thông tin liên hệ.
- `/contact/requests` cần đăng nhập và MY_CONTACT_REQUESTS.READ, dùng `/api/me/contact-requests`; không gửi userId từ client.
- Lịch sử hiển thị đúng trạng thái, phản hồi và thời gian từ server; có phân trang, tải lại, cập nhật khi focus và mỗi 30 giây khi hiện.
- Backend cần migration `20261112151319_ContentContactPermissions` để cấp quyền mới trước khi sử dụng lịch sử.

Contract: `Backend-Agrisage/docs/reference/api-flows/CONTENT_CONTACT.md`.
Không còn dùng `mockArticles`, lịch sử yêu cầu giả hay timer giả lập gửi form.

```powershell
npm run build
npm run lint
# Cần Playwright; có thể đặt UI_PLAYWRIGHT_MODULE trỏ tới playwright/index.mjs.
$env:UI_BROWSER_CHANNEL = 'chrome'
node scripts/test-content.mjs
```

Browser suite dùng production build và chặn API bằng fixture, không gửi yêu cầu tới dữ liệu thật.
