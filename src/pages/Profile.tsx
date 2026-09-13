import { Link, Navigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const ledgerRows = [
  ["18/10/2024", "#SN-2024-884", "Mua chịu vật tư NPK Đầu Trâu + Humic", "+ 2.215.000 đ", "48.500.000 đ", "Đã xác nhận HTX"],
  ["05/10/2024", "#TT-QR-4102", "Thanh toán chuyển khoản VietQR", "- 15.000.000 đ", "46.285.000 đ", "Đã thanh toán"],
  ["22/09/2024", "#SN-2024-741", "Mua thuốc BVTV Ridomil Gold & Nativo 750WG", "+ 4.800.000 đ", "61.285.000 đ", "Đã ký điện tử"],
  ["10/08/2024", "#SN-2024-602", "Mua đợt phân bón đón hoa sầu riêng", "+ 18.500.000 đ", "56.485.000 đ", "Đã ký điện tử"],
];

const orders = [
  {
    code: "#DH-8921",
    date: "18/10/2024",
    title: "Đầu Trâu NPK 20-20-15+TE Nuôi Trái (2 bao) + Kích rễ Humic King Root 1L (3 chai)",
    desc: "Giao đến: Thôn 4, Đinh Trang Hòa, Di Linh",
    total: "2.215.000 đ",
    status: "Đang vận chuyển xe tải",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIJRMDcGAPWGywpLSXudP5IofmsFo-AHtWQCJMoaY7aFQ61PqvSal7kjBCg67QF3skFdWe0PCVV1Oa-pskS-2SIEemRXmjzEAknkScoCyQVf94o-d8_TUBj9okhVylEt9fZ_cNAZiyhESsUR0TeMIOJJhMPZ5WjmM4eZG4JkvW4yJgSFUeM3GTiKWfcJuhNOt3rBo8ZVKzAYmOe_WFHHAiZNebiC9kuCmVb8R5T5ow_JPu5oxHHSATsQ",
  },
  {
    code: "#DH-8610",
    date: "22/09/2024",
    title: "Thuốc Đặc Trị Nấm Bệnh Ridomil Gold 68WG Syngenta (10 gói) + Nativo 750WG",
    desc: "Đã kiểm định tem cào bảo hành chính hãng Thụy Sĩ",
    total: "4.800.000 đ",
    status: "Đã giao thành công",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyheWf6HpAuLp0c2kf-8RjXcOKNgCQ1K2f8x4COv176vGWDPgtKgjAqEeDXS8lociOxvbtfRw9Voz1i4yByNwjPml4FZuJT0xwiieFI8jT89oOh_aZgNV0MFBmN4t_e5bKSkDeJgPTEVI16cjGxMT5kH6rtiCwPCiByBkcpHLSGQGFd3fVgV7e-G3IiiQnIDU3SYTA8COSSJoFJw71Oxf2iHddRxAdNEg9T80s1eikQlWtMO-dqukaJw",
  },
  {
    code: "#DH-8205",
    date: "12/08/2024",
    title: "Combo 10 chai King Root Humic Sinh Học + Vi Lượng Bo Kẽm",
    desc: "Đã tư vấn pha loãng 1.000l nước tưới gốc",
    total: "1.250.000 đ",
    status: "Hoàn tất",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOi79nL6X0ZBkqfu4eRoXJz2fPz53z7Z9qw3Mepq50AjyeVuAJb3BjIY03nECwGbfFUXLtOKqSKU66dR-SZPjAeNnkPk6nDVi93Ouh0LNm3dsvtLDBpsU5Ds0Led2XXa-saRx0M83IPlKLu7hfjWkxuMhQQSu6mN5VcFqE7LEnxFReL8Hx9Agvp_Kz0KWtG6fmEy_kbnmHnofdVDb4JnSXBwggy4UdDTtwreIF1FRu9n1XPFZ-xVDCJg",
  },
];

function MetricCard({ label, value, note, icon, accent = "text-primary" }: { label: string; value: string; note: string; icon: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between">
        <div className="text-[11px] font-bold uppercase tracking-wide text-text-secondary">{label}</div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-light">
          <span className="material-symbols-outlined text-[18px] text-primary">{icon}</span>
        </div>
      </div>
      <div className={`text-2xl font-black ${accent}`}>{value}</div>
      <div className="mt-3 rounded-md bg-primary-light px-3 py-1.5 text-xs font-semibold text-primary">{note}</div>
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "credit" | "orders" | "ai">("credit");
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);

  if (!user) {
    return <Navigate to="/dang-nhap" replace />;
  }

  return (
    <div className="min-h-screen bg-surface-subtle">
      <div className="border-b border-border-subtle bg-white/60">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 text-xs text-text-muted sm:px-6 lg:px-8">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span>Tài khoản nông hộ</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="font-semibold text-text-primary">Hồ sơ & Sổ nợ mùa vụ AgriCredit</span>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img src={user.avatar} alt={user.name} className="h-24 w-24 rounded-xl border border-border-subtle object-cover shadow-sm" />
                <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-white bg-status-success" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-black text-text-primary">Nguyễn Văn Đức (Bác Ba Đức)</h1>
                  <span className="rounded-md border border-border-subtle bg-surface-subtle px-3 py-1 text-[11px] font-bold text-text-secondary">#ND-84926</span>
                  <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-700">Nông hộ liên kết Vàng - HTX Di Linh</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-secondary">
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-primary">call</span>SĐT: 0918 345 678</span>
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-primary">yard</span>Quy mô: 3.2 ha (Sầu riêng Ri6 & Cà phê Catimor)</span>
                  <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-primary">location_on</span>Thôn 4, xã Đinh Trang Hòa, huyện Di Linh, tỉnh Lâm Đồng</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setProfilePopupOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-subtle bg-white px-4 py-2 text-sm font-bold text-text-secondary hover:border-primary hover:text-primary"
            >
              <span className="material-symbols-outlined text-[17px]">edit</span>
              Sửa hồ sơ
            </button>
          </div>
        </section>

        <nav className="mt-6 grid grid-cols-2 gap-2 border-b border-border-subtle text-sm font-bold text-text-muted md:flex md:gap-8">
          {[
            ["overview", "dashboard", "Tổng quan & Hồ sơ canh tác", ""],
            ["credit", "credit_score", "Sổ nợ mùa vụ (AgriCredit)", "Đang dùng 48.5%"],
            ["orders", "receipt_long", "Lịch sử đơn hàng vật tư", "4 đơn"],
            ["ai", "psychology", "Lịch sử quét chẩn đoán AI", "12 ca"],
          ].map(([tab, icon, label, tag]) => (
            <button
              key={label}
              type="button"
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`flex items-center gap-2 border-b-2 px-2 py-3 text-left transition-colors ${activeTab === tab ? "border-primary text-primary" : "border-transparent hover:text-primary"}`}
            >
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
              <span>{label}</span>
              {tag && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] text-amber-700">{tag}</span>}
            </button>
          ))}
        </nav>

        {activeTab === "overview" && (
          <section className="mt-7 space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <MetricCard label="Diện tích canh tác" value="3.2 ha" note="Sầu riêng Ri6 & Cà phê Catimor" icon="yard" accent="text-text-primary" />
              <MetricCard label="Nông hộ liên kết" value="Vàng" note="HTX Di Linh xác minh hồ sơ" icon="verified_user" />
              <MetricCard label="Sức khỏe vườn gần nhất" value="95%" note="AI đánh giá phục hồi tốt" icon="health_and_safety" />
            </div>
            <section className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-black text-text-primary">
                <span className="material-symbols-outlined text-[20px] text-primary">dashboard</span>
                Tổng quan hồ sơ canh tác
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  ["Chủ hộ", "Nguyễn Văn Đức (Bác Ba Đức)"],
                  ["Khu vực", "Thôn 4, xã Đinh Trang Hòa, Di Linh, Lâm Đồng"],
                  ["Cây trồng chính", "Sầu riêng Ri6, Cà phê Catimor"],
                  ["Đại lý phụ trách", "Chi nhánh Lâm Đồng (Trung tâm)"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-surface-subtle p-4">
                    <div className="text-xs font-bold uppercase text-text-muted">{label}</div>
                    <div className="mt-2 font-black text-text-primary">{value}</div>
                  </div>
                ))}
              </div>
            </section>
          </section>
        )}

        {activeTab === "credit" && (
          <>
        <section className="mt-7">
          <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-black text-text-primary">
                <span className="material-symbols-outlined text-[22px] text-primary">account_balance</span>
                Bảo Lãnh Tín Dụng Mùa Vụ AgriCredit
              </h2>
              <p className="mt-1 text-sm text-text-muted">Chương trình liên kết Đại lý Di Linh & HTX Nông nghiệp: Cung cấp vật tư trước, quyết toán sau vụ thu hoạch.</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-primary">
              <span className="h-2 w-2 rounded-full bg-status-success" />
              Hạn mức hợp lệ Niên vụ 2024 - 2025
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <MetricCard label="Hạn mức tín dụng mùa vụ" value="100.000.000 đ" note="Lãi suất 0% bảo lãnh vụ mùa" icon="shield" accent="text-text-primary" />
            <MetricCard label="Dư nợ tạm tính hiện tại" value="48.500.000 đ" note="Tỷ lệ an toàn 48.5%" icon="request_quote" accent="text-amber-600" />
            <MetricCard label="Hạn mức có thể mua tiếp" value="51.500.000 đ" note="Thời hạn quyết toán: 30/12/2024" icon="add_shopping_cart" />
          </div>

          <div className="mt-5 rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
            <div className="mb-2 flex justify-between text-xs font-bold text-text-secondary">
              <span>Thước đo sử dụng hạn mức tín dụng mùa vụ</span>
              <span>Đã giải ngân: <strong className="text-amber-600">48.500.000 đ</strong> / 100.000.000 đ</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-surface-secondary">
              <div className="h-full w-[48.5%] rounded-full bg-gradient-to-r from-primary to-amber-400" />
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-text-muted">
              <span>0 đ (Bắt đầu vụ)</span>
              <span className="font-bold text-amber-600">Ngưỡng cảnh báo: 80.000.000 đ</span>
              <span>100.000.000 đ</span>
            </div>
            <div className="mt-5 flex flex-wrap justify-between gap-3">
              <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary-hover">
                <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                Thanh toán nợ qua VietQR
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-subtle px-4 py-2 text-sm font-bold text-text-secondary">
                <span className="material-symbols-outlined text-[18px]">print</span>
                In sao kê sổ nợ
              </button>
              <span className="ml-auto flex items-center gap-2 text-xs font-semibold text-primary">
                <span className="material-symbols-outlined text-[16px]">support_agent</span>
                Gặp kỹ sư hỗ trợ gia hạn sổ nợ vụ sau
              </span>
            </div>
          </div>
        </section>

        <section className="mt-7 rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-black text-text-primary">
                <span className="material-symbols-outlined text-[20px] text-primary">receipt_long</span>
                Lịch Sử Giao Dịch Sổ Nợ Mùa Vụ
              </h2>
              <p className="mt-1 text-xs text-text-muted">Mọi biến động giao dịch vật tư và trả góp đều được ký điện tử lưu vết với HTX.</p>
            </div>
            <span className="rounded-full bg-surface-secondary px-3 py-1 text-xs font-bold text-text-secondary">Niên vụ 2024</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead className="border-y border-border-subtle bg-surface-subtle text-text-muted">
                <tr>
                  {["Ngày giao dịch", "Mã chứng từ / đơn", "Loại giao dịch & nội dung vật tư", "Biến động nợ", "Dư nợ sau giao dịch", "Trạng thái"].map((h) => (
                    <th key={h} className="px-3 py-3 font-bold uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {ledgerRows.map((row) => (
                  <tr key={row[1]}>
                    {row.map((cell, index) => (
                      <td key={cell} className={`px-3 py-4 ${index === 3 ? (cell.startsWith("+") ? "font-bold text-orange-600" : "font-bold text-primary") : "text-text-secondary"} ${index === 4 ? "font-black text-text-primary" : ""}`}>
                        {index === 5 ? <span className="rounded-full bg-emerald-50 px-3 py-1 font-bold text-primary">{cell}</span> : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
          </>
        )}

        {activeTab === "orders" && (
        <section className="mt-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-black text-text-primary">
              <span className="material-symbols-outlined text-[20px] text-primary">inventory_2</span>
              Đơn Hàng Vật Tư Nông Nghiệp Gần Đây
            </h2>
            <Link to="/gio-hang" className="text-sm font-bold text-primary hover:underline">Xem tất cả 4 đơn hàng</Link>
          </div>
          <div className="space-y-4">
            {orders.map((order) => (
              <article key={order.code} className="rounded-xl border border-border-subtle bg-white p-4 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3 text-xs text-text-muted">
                  <span className="rounded bg-surface-subtle px-2 py-1 font-bold text-text-secondary">Mã đơn: {order.code}</span>
                  <span>Ngày đặt: {order.date}</span>
                  <span className="rounded-full bg-sky-50 px-3 py-1 font-bold text-sky-700">{order.status}</span>
                </div>
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <img src={order.image} alt={order.title} className="h-16 w-16 rounded-lg border border-border-subtle object-contain p-2" />
                  <div className="flex-1">
                    <h3 className="text-sm font-black text-text-primary">{order.title}</h3>
                    <p className="mt-1 text-xs text-text-muted">{order.desc}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-text-muted">Tổng thanh toán:</div>
                    <div className="text-lg font-black text-primary">{order.total}</div>
                  </div>
                  <button className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white">Theo dõi</button>
                  <button className="rounded-lg border border-border-subtle px-4 py-2 text-sm font-bold text-text-secondary">Chi tiết</button>
                </div>
              </article>
            ))}
          </div>
        </section>
        )}

        {activeTab === "ai" && (
        <section className="mt-7 rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-black text-text-primary">
                <span className="material-symbols-outlined text-[20px] text-primary">psychology</span>
                Chẩn Đoán Bác Sĩ AI Gần Nhất Cho Vườn Bác Ba Đức
              </h2>
              <p className="mt-1 text-xs text-text-muted">Hệ thống theo dõi sức khỏe cây sầu riêng và cà phê quanh lô định kỳ.</p>
            </div>
            <Link to="/bac-si-ai" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white">
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              Quét kiểm tra lại sức khỏe vườn
            </Link>
          </div>
          <div className="flex flex-col gap-4 rounded-lg border border-border-subtle bg-surface-subtle p-4 md:flex-row md:items-center">
            <img src="https://lh3.googleusercontent.com/aida/AEtjO1X4PNGtFdGdTKuP_q5b4AxicP1QuZ5rEfbRjSKcjG2Cau2keKYL7yK6vxf3bWj4B7RBcVkEYhAnX19LtgqmiRIJnkcPEYgL6UjJDWzBVEqxCesa9A3M6R-zplqVJ_ZSgDC1N3HrzfOouUsYU6BOv43eC6pPG6ldp0OYrMnWWA2AdI2Z83DoW7pyWDjoBjC9KQ7GJ4jBuJC8_nyE9ElFzykX9Pj4_KAJ5qTFPXbPpvFNMQFrvw934RML9tGd" alt="Vườn sầu riêng" className="h-24 w-24 rounded-lg object-cover" />
            <div className="flex-1">
              <div className="text-xs font-bold text-text-muted">Ca quét ngày 12/10/2024</div>
              <h3 className="mt-1 font-black text-text-primary">Kết quả: Bệnh Đốm Mắt Cua (Thán thư lá non)</h3>
              <p className="mt-1 text-xs text-text-secondary">Phác đồ đã thực hiện: Phun Score 250EC kết hợp Humic dưỡng đọt. Trạng thái hiện tại: Cây đã phục hồi hoàn toàn.</p>
            </div>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">Độ tin cậy 95%</span>
            <Link to="/bac-si-ai" className="rounded-lg border border-border-subtle bg-white px-4 py-2 text-sm font-bold text-primary">Xem bệnh án chi tiết</Link>
          </div>
        </section>
        )}
      </main>

      {profilePopupOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 px-4 py-6">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-floating">
            <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
              <div>
                <h2 className="text-lg font-black text-text-primary">Sửa hồ sơ nông hộ</h2>
                <p className="mt-1 text-xs text-text-muted">Cập nhật thông tin liên hệ, địa chỉ vườn và quy mô canh tác.</p>
              </div>
              <button
                type="button"
                onClick={() => setProfilePopupOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:bg-surface-subtle hover:text-text-primary"
                aria-label="Đóng popup sửa hồ sơ"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
              <div className="mb-5 flex items-center gap-4 rounded-xl bg-primary-light/60 p-4">
                <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-xl border border-white object-cover shadow-sm" />
                <div>
                  <div className="font-black text-text-primary">Nguyễn Văn Đức (Bác Ba Đức)</div>
                  <div className="mt-1 text-xs font-semibold text-text-muted">Mã nông hộ: #ND-84926</div>
                </div>
                <button type="button" className="ml-auto rounded-lg border border-border-subtle bg-white px-3 py-2 text-xs font-bold text-primary hover:bg-primary-light">
                  Đổi ảnh
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  ["Họ tên", "Nguyễn Văn Đức (Bác Ba Đức)"],
                  ["Số điện thoại", "0918 345 678"],
                  ["Quy mô canh tác", "3.2 ha"],
                  ["Cây trồng chính", "Sầu riêng Ri6 & Cà phê Catimor"],
                ].map(([label, value]) => (
                  <label key={label} className="text-xs font-black text-text-primary">
                    {label}
                    <input
                      defaultValue={value}
                      className="mt-1.5 w-full rounded-lg border border-border-subtle bg-surface-subtle px-3 py-2.5 text-sm font-medium outline-none focus:border-primary focus:bg-white"
                    />
                  </label>
                ))}
                <label className="text-xs font-black text-text-primary md:col-span-2">
                  Địa chỉ vườn
                  <input
                    defaultValue="Thôn 4, xã Đinh Trang Hòa, huyện Di Linh, tỉnh Lâm Đồng"
                    className="mt-1.5 w-full rounded-lg border border-border-subtle bg-surface-subtle px-3 py-2.5 text-sm font-medium outline-none focus:border-primary focus:bg-white"
                  />
                </label>
                <label className="text-xs font-black text-text-primary md:col-span-2">
                  Ghi chú hồ sơ
                  <textarea
                    defaultValue="Nông hộ liên kết Vàng - HTX Di Linh. Ưu tiên tư vấn kỹ thuật sầu riêng mùa mưa."
                    rows={3}
                    className="mt-1.5 w-full rounded-lg border border-border-subtle bg-surface-subtle px-3 py-2.5 text-sm font-medium outline-none focus:border-primary focus:bg-white"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border-subtle bg-surface-subtle px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setProfilePopupOpen(false)}
                className="rounded-lg border border-border-subtle bg-white px-5 py-2.5 text-sm font-bold text-text-secondary hover:border-primary hover:text-primary"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => setProfilePopupOpen(false)}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-hover"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
