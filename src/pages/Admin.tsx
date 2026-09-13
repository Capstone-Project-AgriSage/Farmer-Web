import { type ReactNode, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import { useAuth } from "../context/AuthContext";

type AdminSection = "overview" | "ai" | "stock" | "orders" | "debt" | "vietqr" | "dealer";

const menu: { id: AdminSection; slug: string; label: string; icon: string; badge?: string }[] = [
  { id: "overview", slug: "dashboard", label: "Tổng quan", icon: "dashboard" },
  { id: "ai", slug: "ai", label: "Hàng đợi AI", icon: "psychology", badge: "4" },
  { id: "stock", slug: "stock", label: "Quản lý kho", icon: "inventory_2" },
  { id: "orders", slug: "orders", label: "Đơn hàng", icon: "shopping_bag" },
  { id: "debt", slug: "debt", label: "Sổ nợ 2 chiều", icon: "account_balance_wallet", badge: "2" },
  { id: "vietqr", slug: "vietqr", label: "VietQR cửa hàng", icon: "qr_code_2" },
  { id: "dealer", slug: "profile", label: "Hồ sơ đại lý", icon: "storefront" },
];

const sectionBySlug = Object.fromEntries(menu.map((item) => [item.slug, item.id])) as Record<string, AdminSection>;

const stats = [
  { label: "Tổng doanh thu (T10)", value: "482.650.000 đ", sub: "+12.8% so với T9", icon: "trending_up", accent: "text-text-primary" },
  { label: "Lợi nhuận gộp", value: "115.836.000 đ", sub: "Biên lợi nhuận 24.0%", icon: "payments", accent: "text-primary" },
  { label: "Dòng tiền thực thu", value: "346.250.000 đ", sub: "VietQR 58% - Tiền mặt 42%", icon: "account_balance", accent: "text-text-primary" },
  { label: "Gối đầu vụ mùa", value: "136.400.000 đ", sub: "Tỷ trọng công nợ 28.3%", icon: "cycle", accent: "text-orange-600" },
  { label: "Giá trị đơn TB", value: "1.485.000 đ", sub: "+8.5% so kỳ trước", icon: "receipt", accent: "text-text-primary" },
];

const orders = [
  ["#DH-8921", "Nguyễn Văn Đức", "Đang vận chuyển", "2.215.000 đ"],
  ["#DH-8920", "HTX Di Linh", "Chờ xuất kho", "18.500.000 đ"],
  ["#DH-8916", "Đại lý Thanh Hà", "Đã thanh toán", "4.800.000 đ"],
];

const stock = [
  ["Đầu Trâu NPK 20-20-15+TE", "142 bao", "Sắp nhập thêm", "Còn 12 ngày"],
  ["Ridomil Gold 68WG", "860 gói", "Ổn định", "Còn 18 tháng"],
  ["Humic King Root 1L", "74 chai", "Bán nhanh", "Còn 9 tháng"],
];

function StatCard({ label, value, sub, icon, accent }: (typeof stats)[number]) {
  return (
    <div className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="text-[11px] font-black uppercase tracking-wide text-text-muted">{label}</div>
        <span className="material-symbols-outlined text-[18px] text-primary">{icon}</span>
      </div>
      <div className={`text-2xl font-black ${accent}`}>{value}</div>
      <div className="mt-5 text-xs font-bold text-primary">{sub}</div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-secondary">
        <div className="h-full w-2/3 rounded-full bg-primary" />
      </div>
    </div>
  );
}

function MiniMetric({ label, value, icon, tone = "primary" }: { label: string; value: string; icon: string; tone?: "primary" | "amber" | "blue" | "red" }) {
  const toneClass = {
    primary: "bg-primary-light text-primary",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-sky-50 text-sky-700",
    red: "bg-red-50 text-red-600",
  }[tone];

  return (
    <div className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-black uppercase tracking-wide text-text-muted">{label}</div>
          <div className="mt-3 text-2xl font-black text-text-primary">{value}</div>
        </div>
        <span className={`material-symbols-outlined rounded-lg p-2 text-[20px] ${toneClass}`}>{icon}</span>
      </div>
    </div>
  );
}

function StatusPill({ children, tone = "green" }: { children: ReactNode; tone?: "green" | "amber" | "blue" | "red" | "gray" }) {
  const toneClass = {
    green: "bg-emerald-50 text-primary",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-sky-50 text-sky-700",
    red: "bg-red-50 text-red-600",
    gray: "bg-surface-secondary text-text-secondary",
  }[tone];

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${toneClass}`}>{children}</span>;
}

export function SectionPanel({ section }: { section: AdminSection }) {
  if (section === "ai") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          <MiniMetric label="Ca đang chờ duyệt" value="24" icon="pending_actions" tone="amber" />
          <MiniMetric label="Ca khẩn cấp" value="4" icon="priority_high" tone="red" />
          <MiniMetric label="Độ chính xác AI TB" value="92.8%" icon="verified" />
          <MiniMetric label="Thời gian phản hồi" value="14 phút" icon="timer" tone="blue" />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm xl:col-span-2">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-text-primary">Hàng đợi chẩn đoán cần kỹ sư xác nhận</h2>
                <p className="mt-1 text-xs text-text-muted">Sắp xếp theo mức độ rủi ro mùa vụ, thời gian gửi ảnh và số lần tái phát.</p>
              </div>
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-black text-white">Duyệt ca ưu tiên</button>
            </div>
            <div className="space-y-3">
              {[
                ["#AI-1842", "Sầu riêng nghi thán thư", "Nguyễn Văn Đức", "Sầu riêng Ri6", "96%", "Khẩn cấp", "12 phút trước"],
                ["#AI-1841", "Cà phê vàng lá rễ", "HTX Di Linh", "Cà phê Catimor", "88%", "Cần xem lại", "18 phút trước"],
                ["#AI-1838", "Tiêu chết nhanh", "Vườn Chú Năm", "Hồ tiêu", "91%", "Ưu tiên", "31 phút trước"],
                ["#AI-1835", "Lúa lem lép hạt", "Đại lý Thanh Hà", "Lúa", "84%", "Theo dõi", "46 phút trước"],
              ].map(([code, title, farmer, crop, confidence, status, time], index) => (
                <article key={code} className="grid gap-4 rounded-xl border border-border-subtle bg-surface-subtle p-4 md:grid-cols-[88px_1fr_auto] md:items-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-border-subtle bg-white">
                    <span className="material-symbols-outlined text-[38px] text-primary">image_search</span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-primary">{code}</span>
                      <StatusPill tone={index === 0 ? "red" : index === 1 ? "amber" : "green"}>{status}</StatusPill>
                      <span className="text-xs font-bold text-text-muted">{time}</span>
                    </div>
                    <h3 className="mt-2 text-base font-black text-text-primary">{title}</h3>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
                      <span>Nông hộ: <strong>{farmer}</strong></span>
                      <span>Cây trồng: <strong>{crop}</strong></span>
                      <span>AI tự tin: <strong className="text-primary">{confidence}</strong></span>
                    </div>
                  </div>
                  <div className="flex gap-2 md:flex-col">
                    <button className="rounded-lg bg-primary px-4 py-2 text-xs font-black text-white">Mở ca</button>
                    <button className="rounded-lg border border-border-subtle bg-white px-4 py-2 text-xs font-black text-text-secondary">Gán kỹ sư</button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-text-primary">Quy trình kiểm duyệt</h2>
            <div className="mt-5 space-y-4">
              {[
                ["AI phân tích ảnh", "Đã lọc 137 ảnh mờ trong hôm nay"],
                ["Kỹ sư xác nhận", "4 ca vượt SLA 30 phút"],
                ["Gửi phác đồ", "SMS/Zalo đến nông hộ sau khi duyệt"],
                ["Đề xuất vật tư", "Tự ghép sản phẩm phù hợp tồn kho"],
              ].map(([title, desc], index) => (
                <div key={title} className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-white">{index + 1}</div>
                  <div>
                    <div className="font-black text-text-primary">{title}</div>
                    <div className="mt-1 text-xs text-text-muted">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (section === "stock") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          <MiniMetric label="Tổng SKU đang bán" value="428" icon="inventory_2" />
          <MiniMetric label="Sắp hết hàng" value="17" icon="production_quantity_limits" tone="amber" />
          <MiniMetric label="Cận hạn dùng" value="9 lô" icon="event_busy" tone="red" />
          <MiniMetric label="Giá trị tồn kho" value="2.84 tỷ" icon="warehouse" tone="blue" />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm xl:col-span-2">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-text-primary">Tồn kho theo lô và hạn dùng</h2>
                <p className="mt-1 text-xs text-text-muted">Theo dõi số lượng, tốc độ bán, hạn dùng và đề xuất nhập bổ sung.</p>
              </div>
              <div className="flex gap-2">
                <button className="rounded-lg border border-border-subtle px-4 py-2 text-sm font-black text-text-secondary">Nhập kho</button>
                <button className="rounded-lg bg-primary px-4 py-2 text-sm font-black text-white">Xuất kiểm kê</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="border-y border-border-subtle bg-surface-subtle text-xs uppercase text-text-muted">
                  <tr>{["Sản phẩm", "Lô hàng", "Tồn kho", "Tốc độ bán", "Hạn dùng", "Trạng thái"].map((h) => <th key={h} className="px-4 py-3 font-black">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {[
                    ["Đầu Trâu NPK 20-20-15+TE", "BD-1024-A", "142 bao", "18 bao/ngày", "Còn 12 tháng", "Sắp nhập thêm"],
                    ["Ridomil Gold 68WG", "SYN-0924-RG", "860 gói", "96 gói/ngày", "Còn 18 tháng", "Bán nhanh"],
                    ["Humic King Root 1L", "LT-0824-HM", "74 chai", "21 chai/ngày", "Còn 9 tháng", "Cảnh báo thấp"],
                    ["Nativo 750WG", "BAY-0724-NA", "318 gói", "14 gói/ngày", "Còn 6 tháng", "Theo dõi hạn"],
                  ].map((row, index) => (
                    <tr key={row[1]}>
                      <td className="px-4 py-4 font-black text-text-primary">{row[0]}</td>
                      <td className="px-4 py-4 text-text-secondary">{row[1]}</td>
                      <td className="px-4 py-4 font-black">{row[2]}</td>
                      <td className="px-4 py-4 text-text-secondary">{row[3]}</td>
                      <td className="px-4 py-4 text-text-secondary">{row[4]}</td>
                      <td className="px-4 py-4"><StatusPill tone={index === 2 ? "red" : index === 3 ? "amber" : "green"}>{row[5]}</StatusPill></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-text-primary">Cảnh báo kho thông minh</h2>
            <div className="mt-5 space-y-3">
              {[
                ["Humic King Root 1L", "Dự kiến hết trong 4 ngày nếu giữ tốc độ bán hiện tại", "red"],
                ["Nativo 750WG", "Có 48 gói cần ưu tiên bán trước vì hạn dùng dưới 6 tháng", "amber"],
                ["Đầu Trâu NPK", "Đề xuất đặt thêm 220 bao cho đợt nuôi trái tuần sau", "green"],
              ].map(([title, desc, tone]) => (
                <div key={title} className="rounded-lg border border-border-subtle bg-surface-subtle p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-black text-text-primary">{title}</div>
                    <StatusPill tone={tone as "red" | "amber" | "green"}>{tone === "red" ? "Gấp" : tone === "amber" ? "Theo dõi" : "Đề xuất"}</StatusPill>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-text-secondary">{desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (section === "orders") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          <MiniMetric label="Đơn hôm nay" value="36" icon="shopping_bag" />
          <MiniMetric label="Chờ xuất kho" value="8" icon="inventory" tone="amber" />
          <MiniMetric label="Đang giao" value="14" icon="local_shipping" tone="blue" />
          <MiniMetric label="Doanh số hôm nay" value="52.8tr" icon="payments" />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm xl:col-span-2">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-text-primary">Danh sách đơn hàng đang xử lý</h2>
                <p className="mt-1 text-xs text-text-muted">Theo dõi xuất kho, giao vận, thanh toán và chứng từ hóa đơn.</p>
              </div>
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-black text-white">Tạo đơn nhanh</button>
            </div>
            <div className="space-y-3">
              {[
                ["#DH-8921", "Nguyễn Văn Đức", "2.215.000 đ", "Đang vận chuyển", "Xe tải LD-028.42", "VietQR đã thu"],
                ["#DH-8920", "HTX Di Linh", "18.500.000 đ", "Chờ xuất kho", "Kho Lâm Đồng", "Sổ nợ mùa vụ"],
                ["#DH-8916", "Đại lý Thanh Hà", "4.800.000 đ", "Đã thanh toán", "Chờ hóa đơn", "Tiền mặt"],
                ["#DH-8912", "Vườn Chú Năm", "7.650.000 đ", "Đang soạn hàng", "Ưu tiên giao sáng mai", "AgriCredit"],
              ].map(([code, customer, total, status, note, payment], index) => (
                <article key={code} className="rounded-xl border border-border-subtle bg-surface-subtle p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <div className="min-w-[92px] font-black text-primary">{code}</div>
                    <div className="flex-1">
                      <div className="font-black text-text-primary">{customer}</div>
                      <div className="mt-1 text-xs text-text-muted">{note} · {payment}</div>
                    </div>
                    <StatusPill tone={index === 1 ? "amber" : index === 0 ? "blue" : "green"}>{status}</StatusPill>
                    <div className="text-lg font-black text-text-primary">{total}</div>
                    <button className="rounded-lg border border-border-subtle bg-white px-4 py-2 text-xs font-black text-primary">Chi tiết</button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-text-primary">Pipeline hôm nay</h2>
            <div className="mt-5 space-y-4">
              {[
                ["Tiếp nhận", "36 đơn", "100%"],
                ["Soạn hàng", "18 đơn", "72%"],
                ["Đang giao", "14 đơn", "54%"],
                ["Hoàn tất", "9 đơn", "38%"],
              ].map(([label, value, width]) => (
                <div key={label}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-black">{label}</span>
                    <span className="font-bold text-text-muted">{value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-secondary">
                    <div className="h-full rounded-full bg-primary" style={{ width }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (section === "debt") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          <MiniMetric label="Tổng công nợ" value="136.4tr" icon="account_balance_wallet" tone="amber" />
          <MiniMetric label="Nợ cần nhắc" value="48.5tr" icon="notifications_active" tone="red" />
          <MiniMetric label="Nông hộ mở sổ" value="17 hộ" icon="groups" />
          <MiniMetric label="Tỷ lệ thu đúng hạn" value="91%" icon="verified" tone="blue" />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm xl:col-span-2">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-text-primary">Sổ nợ nông hộ liên kết</h2>
                <p className="mt-1 text-xs text-text-muted">Quản lý hạn mức, dư nợ, lịch nhắc thanh toán và bảo lãnh HTX.</p>
              </div>
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-black text-white">Tạo phiếu ghi nợ</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="border-y border-border-subtle bg-surface-subtle text-xs uppercase text-text-muted">
                  <tr>{["Nông hộ", "Hạn mức", "Dư nợ", "Đến hạn", "Bảo lãnh", "Trạng thái"].map((h) => <th key={h} className="px-4 py-3 font-black">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {[
                    ["Nguyễn Văn Đức", "100.000.000 đ", "48.500.000 đ", "30/12/2024", "HTX Di Linh", "An toàn"],
                    ["Vườn Chú Năm", "80.000.000 đ", "64.800.000 đ", "15/11/2024", "Đại lý bảo lãnh", "Cần nhắc"],
                    ["Trần Thị Mai", "60.000.000 đ", "12.400.000 đ", "05/01/2025", "HTX Di Linh", "Tốt"],
                    ["Phạm Văn Hòa", "45.000.000 đ", "39.200.000 đ", "28/10/2024", "Không", "Vượt ngưỡng"],
                  ].map((row, index) => (
                    <tr key={row[0]}>
                      <td className="px-4 py-4 font-black text-text-primary">{row[0]}</td>
                      <td className="px-4 py-4 text-text-secondary">{row[1]}</td>
                      <td className="px-4 py-4 font-black text-orange-600">{row[2]}</td>
                      <td className="px-4 py-4 text-text-secondary">{row[3]}</td>
                      <td className="px-4 py-4 text-text-secondary">{row[4]}</td>
                      <td className="px-4 py-4"><StatusPill tone={index === 3 ? "red" : index === 1 ? "amber" : "green"}>{row[5]}</StatusPill></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-text-primary">Tác vụ thu hồi & nhắc nợ</h2>
            <div className="mt-5 space-y-3">
              {[
                ["Gửi Zalo nhắc nợ", "5 hộ đến hạn trong 7 ngày"],
                ["Tạo mã VietQR trả góp", "Tự khớp vào sổ nợ khi nhận tiền"],
                ["Gia hạn sau thu hoạch", "2 hồ sơ cần chủ đại lý duyệt"],
              ].map(([title, desc]) => (
                <button key={title} className="w-full rounded-lg border border-border-subtle bg-surface-subtle p-4 text-left hover:border-primary">
                  <div className="font-black text-text-primary">{title}</div>
                  <div className="mt-1 text-xs text-text-muted">{desc}</div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (section === "vietqr") {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          <MiniMetric label="Thu qua VietQR" value="201.6tr" icon="qr_code_2" />
          <MiniMetric label="Giao dịch hôm nay" value="42" icon="receipt_long" tone="blue" />
          <MiniMetric label="Tự khớp đơn" value="96%" icon="rule" />
          <MiniMetric label="Cần đối soát" value="3" icon="sync_problem" tone="amber" />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section className="rounded-xl border border-border-subtle bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-text-primary">VietQR cửa hàng</h2>
            <p className="mt-1 text-xs text-text-muted">Mã QR tĩnh cho Chi nhánh Lâm Đồng, tự nhận diện nội dung đơn hàng.</p>
            <div className="mt-5 rounded-2xl border border-primary bg-primary-light p-5 text-center">
              <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-xl bg-white shadow-sm">
                <span className="material-symbols-outlined text-[116px] text-primary">qr_code_2</span>
              </div>
              <div className="mt-4 font-black text-primary">VCB · AGRISAGE LÂM ĐỒNG</div>
              <div className="mt-1 text-xs text-text-muted">STK 190068289999 · Nội dung: mã đơn</div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-black text-white">Tải QR</button>
              <button className="flex-1 rounded-lg border border-border-subtle px-4 py-2 text-sm font-black text-primary">In để quầy</button>
            </div>
          </section>

          <section className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm xl:col-span-2">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-text-primary">Đối soát giao dịch gần đây</h2>
                <p className="mt-1 text-xs text-text-muted">Tự khớp tiền về với đơn hàng, sổ nợ hoặc thanh toán một phần.</p>
              </div>
              <button className="rounded-lg bg-primary px-4 py-2 text-sm font-black text-white">Xuất sao kê</button>
            </div>
            <div className="space-y-3">
              {[
                ["10:42", "AGR8842", "2.600.000 đ", "Đã khớp đơn #DH-8921", "green"],
                ["10:18", "SN2024-884 TRA NO", "15.000.000 đ", "Đã ghi giảm sổ nợ", "green"],
                ["09:56", "NGUYEN VAN DUC", "920.000 đ", "Cần chọn đơn liên quan", "amber"],
                ["09:21", "AGR8916", "4.800.000 đ", "Đã xuất hóa đơn điện tử", "blue"],
              ].map(([time, content, amount, status, tone]) => (
                <div key={`${time}-${content}`} className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-surface-subtle p-4 md:flex-row md:items-center">
                  <div className="font-black text-text-muted md:w-16">{time}</div>
                  <div className="flex-1">
                    <div className="font-black text-text-primary">{content}</div>
                    <div className="mt-1 text-xs text-text-muted">{status}</div>
                  </div>
                  <div className="text-lg font-black text-primary">{amount}</div>
                  <StatusPill tone={tone as "green" | "amber" | "blue"}>{tone === "amber" ? "Chờ xử lý" : "Đã khớp"}</StatusPill>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (section === "dealer") {
    return (
      <div className="space-y-6">
        <section className="overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm">
          <div className="bg-primary px-6 py-8 text-white">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
                  <span className="material-symbols-outlined text-[38px]">storefront</span>
                </div>
                <div>
                  <div className="text-2xl font-black">Chi nhánh Lâm Đồng (Trung tâm)</div>
                  <div className="mt-1 text-sm text-emerald-100">142 Hùng Vương, TT. Di Linh, Lâm Đồng · Mã đại lý AGR-LD-001</div>
                </div>
              </div>
              <button className="rounded-lg bg-white px-4 py-2 text-sm font-black text-primary">Cập nhật hồ sơ</button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-4">
            {[
              ["Chủ đại lý", "Trần Minh Đức"],
              ["Nông hộ liên kết", "284 hộ"],
              ["Kỹ sư phụ trách", "12 người"],
              ["Khu vực phủ sóng", "Di Linh · Bảo Lộc · Đức Trọng"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-surface-subtle p-4">
                <div className="text-xs font-black uppercase text-text-muted">{label}</div>
                <div className="mt-2 font-black text-text-primary">{value}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm xl:col-span-2">
            <h2 className="text-lg font-black text-text-primary">Cấu hình vận hành cửa hàng</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                ["Giờ phục vụ", "07:00 - 20:00 hằng ngày"],
                ["Tổng đài kỹ sư", "1900 6828"],
                ["Kho mặc định", "Kho Lâm Đồng - khu A"],
                ["Ngân hàng đối soát", "Vietcombank · 190068289999"],
                ["Chính sách giao hàng", "Miễn phí đơn từ 2.000.000 đ"],
                ["Hạn mức AgriCredit", "Tối đa 100.000.000 đ / nông hộ"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-border-subtle p-4">
                  <div className="text-xs font-black uppercase text-text-muted">{label}</div>
                  <div className="mt-2 font-black text-text-primary">{value}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-text-primary">Nhân sự trực ca</h2>
            <div className="mt-5 space-y-3">
              {[
                ["Trần Minh Đức", "Chủ đại lý / Quản trị viên", "Đang trực"],
                ["KS. Phạm Thị Lan", "Kỹ sư cây trồng", "Online"],
                ["Lê Hoàng Nam", "Điều phối kho vận", "Đang giao"],
              ].map(([name, role, status]) => (
                <div key={name} className="flex items-center gap-3 rounded-lg bg-surface-subtle p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light font-black text-primary">{name.charAt(0)}</div>
                  <div className="flex-1">
                    <div className="font-black text-text-primary">{name}</div>
                    <div className="text-xs text-text-muted">{role}</div>
                  </div>
                  <StatusPill tone={status === "Đang giao" ? "blue" : "green"}>{status}</StatusPill>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-black uppercase text-primary">Niên vụ 2024 - 2025</span>
            <h1 className="mt-4 text-3xl font-black leading-tight text-text-primary">Báo cáo & Phân tích<br />Doanh thu Tài chính</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Hôm nay", "7 ngày qua", "Tháng này (T10/2024)", "Quý 3", "Tùy chọn"].map((item, index) => (
              <button key={item} className={`rounded-lg px-4 py-2 text-sm font-bold ${index === 2 ? "bg-primary-light text-primary" : "bg-surface-subtle text-text-secondary"}`}>{item}</button>
            ))}
            <button className="rounded-lg border border-border-subtle px-4 py-2 text-sm font-bold text-text-secondary">Xuất Excel / PDF</button>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white">Tạo đơn nhanh (F2)</button>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-black text-text-primary">Doanh thu theo tuần</h2>
          <div className="mt-6 flex h-64 items-end gap-3 rounded-xl bg-surface-subtle p-5">
            {[48, 66, 52, 88, 74, 95, 82].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-lg bg-primary" style={{ height: `${height}%` }} />
                <span className="text-xs font-bold text-text-muted">T{index + 2}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-text-primary">Cảnh báo cần xử lý</h2>
          <div className="mt-5 space-y-3">
            {["2 đơn nợ vượt 80% hạn mức", "4 ca AI chờ kỹ sư duyệt", "7 mã thuốc sắp hết tồn kho"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg bg-amber-50 p-3 text-sm font-bold text-amber-800">
                <span className="material-symbols-outlined text-[18px]">warning</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-text-primary">Lịch vận hành cần xử lý hôm nay</h2>
              <p className="mt-1 text-xs text-text-muted">Các đầu việc ảnh hưởng trực tiếp đến đơn hàng, kho và sổ nợ mùa vụ.</p>
            </div>
            <button className="rounded-lg border border-border-subtle px-4 py-2 text-sm font-black text-primary">Xem lịch tuần</button>
          </div>
          <div className="space-y-3">
            {[
              ["08:30", "Xuất kho đơn HTX Di Linh", "18.500.000 đ", "Kho vận"],
              ["10:00", "Duyệt 4 ca AI thán thư sầu riêng", "SLA 30 phút", "Kỹ thuật"],
              ["14:00", "Nhắc nợ 5 nông hộ đến hạn", "48.500.000 đ", "AgriCredit"],
              ["16:30", "Đối soát VietQR cuối ngày", "42 giao dịch", "Kế toán"],
            ].map(([time, title, meta, team]) => (
              <div key={title} className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-surface-subtle p-4 md:flex-row md:items-center">
                <div className="font-black text-primary md:w-16">{time}</div>
                <div className="flex-1">
                  <div className="font-black text-text-primary">{title}</div>
                  <div className="mt-1 text-xs text-text-muted">{team}</div>
                </div>
                <StatusPill tone="blue">{meta}</StatusPill>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-text-primary">Hiệu suất đội ngũ</h2>
          <div className="mt-5 space-y-4">
            {[
              ["Kỹ thuật AI", "92%", "4 ca quá SLA"],
              ["Kho vận", "81%", "8 đơn chờ xuất"],
              ["Kế toán", "96%", "3 giao dịch cần khớp"],
            ].map(([team, width, note]) => (
              <div key={team}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-black">{team}</span>
                  <span className="font-bold text-text-muted">{note}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-secondary">
                  <div className="h-full rounded-full bg-primary" style={{ width }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default function Admin() {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { adminPage } = useParams();
  const section = adminPage ? sectionBySlug[adminPage] : undefined;
  const current = menu.find((item) => item.id === section);

  if (user?.role !== "admin") {
    return <Navigate to="/dang-nhap" replace />;
  }

  if (!adminPage || !section || !current) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-surface-subtle text-text-primary">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border-subtle bg-white lg:block">
        <Link to="/" className="flex h-16 items-center gap-3 border-b border-border-subtle px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
            <span className="material-symbols-outlined">psychiatry</span>
          </div>
          <div>
            <div className="text-lg font-black text-primary-dark">AgriSage</div>
            <div className="text-[11px] font-black uppercase tracking-wide text-text-muted">Quản trị đại lý</div>
          </div>
        </Link>
        <nav className="px-3 py-6">
          <div className="mb-3 px-3 text-xs font-black uppercase tracking-wide text-text-muted">Hệ thống nghiệp vụ</div>
          <div className="space-y-2">
            {menu.map((item) => (
              <Link
                key={item.id}
                to={`/admin/${item.slug}`}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-black transition-colors ${
                  section === item.id ? "bg-primary text-white" : "text-text-secondary hover:bg-primary-light hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge && <span className={`rounded-full px-2 py-0.5 text-xs ${section === item.id ? "bg-white text-primary" : "bg-red-100 text-red-600"}`}>{item.badge}</span>}
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 border-b border-border-subtle bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-subtle px-4 py-2 text-sm font-bold text-text-secondary">
                <span className="material-symbols-outlined text-[18px]">store</span>
                Chi nhánh Lâm Đồng (Trung tâm)
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>
              <label className="hidden flex-1 items-center gap-2 rounded-lg bg-surface-subtle px-3 py-2 md:flex">
                <span className="material-symbols-outlined text-[18px] text-text-muted">search</span>
                <input className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted" placeholder="Tìm thuốc BVTV, phân bón, nông dân, mã đơn..." />
              </label>
            </div>
            <button className="relative rounded-full p-2 text-text-secondary hover:bg-surface-subtle">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="relative border-l border-border-subtle pl-4">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-subtle"
                aria-expanded={profileOpen}
              >
                <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
                <div className="hidden text-left sm:block">
                  <div className="text-sm font-black">{user.name}</div>
                  <div className="text-xs text-text-muted">Quản trị viên / Chủ đại lý</div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-text-muted">expand_more</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-lg border border-border-subtle bg-white py-1 shadow-floating">
                  <Link
                    to="/admin/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-text-secondary hover:bg-primary-light hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-[17px]">account_circle</span>
                    Hồ sơ
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-text-secondary hover:bg-status-error-surface hover:text-status-error"
                  >
                    <span className="material-symbols-outlined text-[17px]">logout</span>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="border-b border-border-subtle bg-white px-4 py-3 lg:hidden">
          <div className="mb-3 text-xs font-black uppercase text-text-muted">Màn hình admin</div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {menu.map((item) => (
              <Link key={item.id} to={`/admin/${item.slug}`} className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold ${section === item.id ? "bg-primary text-white" : "bg-surface-subtle text-text-secondary"}`}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <main className="px-4 py-7 sm:px-6 lg:px-8">
          {section !== "overview" && (
            <div className="mb-6 rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
              <div className="text-xs font-black uppercase tracking-wide text-primary">AgriSage Admin</div>
              <h1 className="mt-2 flex items-center gap-2 text-3xl font-black text-text-primary">
                <span className="material-symbols-outlined text-[30px] text-primary">{current.icon}</span>
                {current.label}
              </h1>
            </div>
          )}
          <SectionPanel section={section} />
        </main>
      </div>
    </div>
  );
}
