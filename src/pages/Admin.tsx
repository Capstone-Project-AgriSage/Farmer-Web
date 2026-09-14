import { type FormEvent, type ReactNode, useMemo, useState } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router"
import { useAuth } from "../context/AuthContext"

type AdminSection =
  | "overview"
  | "ai"
  | "stock"
  | "orders"
  | "debt"
  | "vietqr"
  | "dealer"

type Tone = "green" | "amber" | "blue" | "red" | "gray"
type WorkState = "ready" | "loading" | "error"
type ModalMode = "create" | "edit" | "view" | "approve" | "export" | null

type AdminRecord = {
  id: string
  title: string
  subtitle: string
  category: string
  status: string
  statusTone: Tone
  time: string
  amount: string
  owner: string
  note: string
}

type SectionConfig = {
  eyebrow: string
  title: string
  description: string
  primaryLabel: string
  secondaryLabel: string
  exportLabel: string
  searchPlaceholder: string
  categories: string[]
  statuses: string[]
  timeOptions: string[]
  columns: string[]
  records: AdminRecord[]
  formTitle: string
  formFields: {
    key: keyof Pick<
      AdminRecord,
      "title" | "subtitle" | "category" | "status" | "time" | "amount" | "owner" | "note"
    >
    label: string
    required?: boolean
    type?: "text" | "date" | "number" | "textarea" | "select"
    options?: string[]
  }[]
}

const menu: {
  id: AdminSection
  slug: string
  label: string
  icon: string
  badge?: string
}[] = [
  { id: "overview", slug: "dashboard", label: "Tổng quan", icon: "dashboard" },
  { id: "ai", slug: "ai", label: "Hàng đợi AI", icon: "psychology", badge: "4" },
  { id: "stock", slug: "stock", label: "Quản lý kho", icon: "inventory_2" },
  { id: "orders", slug: "orders", label: "Đơn hàng", icon: "shopping_bag" },
  {
    id: "debt",
    slug: "debt",
    label: "Sổ nợ 2 chiều",
    icon: "account_balance_wallet",
    badge: "2",
  },
  { id: "vietqr", slug: "vietqr", label: "VietQR cửa hàng", icon: "qr_code_2" },
  { id: "dealer", slug: "profile", label: "Hồ sơ đại lý", icon: "storefront" },
]

const sectionBySlug = Object.fromEntries(
  menu.map((item) => [item.slug, item.id]),
) as Record<string, AdminSection>

function record(
  id: string,
  title: string,
  subtitle: string,
  category: string,
  status: string,
  statusTone: Tone,
  time: string,
  amount: string,
  owner: string,
  note: string,
): AdminRecord {
  return {
    id,
    title,
    subtitle,
    category,
    status,
    statusTone,
    time,
    amount,
    owner,
    note,
  }
}

function sharedFields(
  titleLabel: string,
  subtitleLabel: string,
  categoryLabel: string,
  categoryOptions: string[],
): SectionConfig["formFields"] {
  return [
    { key: "title", label: titleLabel, required: true },
    { key: "subtitle", label: subtitleLabel, required: true, type: "textarea" },
    {
      key: "category",
      label: categoryLabel,
      required: true,
      type: "select",
      options: categoryOptions,
    },
    { key: "amount", label: "Giá trị / số lượng", required: true },
    { key: "owner", label: "Phụ trách", required: true },
    { key: "time", label: "Mốc thời gian", required: true },
    { key: "note", label: "Ghi chú", type: "textarea" },
  ]
}

const metricsBySection: Record<
  AdminSection,
  {
    label: string
    value: string
    icon: string
    tone?: "primary" | "amber" | "blue" | "red"
  }[]
> = {
  overview: [
    { label: "Tổng doanh thu (T10)", value: "482.65tr", icon: "trending_up" },
    { label: "Lợi nhuận gộp", value: "115.84tr", icon: "payments" },
    {
      label: "Dòng tiền thực thu",
      value: "346.25tr",
      icon: "account_balance",
      tone: "blue",
    },
    { label: "Gối đầu vụ mùa", value: "136.4tr", icon: "cycle", tone: "amber" },
  ],
  ai: [
    { label: "Ca đang chờ duyệt", value: "24", icon: "pending_actions", tone: "amber" },
    { label: "Ca khẩn cấp", value: "4", icon: "priority_high", tone: "red" },
    { label: "Độ chính xác AI TB", value: "92.8%", icon: "verified" },
    { label: "Thời gian phản hồi", value: "14 phút", icon: "timer", tone: "blue" },
  ],
  stock: [
    { label: "Tổng SKU đang bán", value: "428", icon: "inventory_2" },
    {
      label: "Sắp hết hàng",
      value: "17",
      icon: "production_quantity_limits",
      tone: "amber",
    },
    { label: "Cận hạn dùng", value: "9 lô", icon: "event_busy", tone: "red" },
    { label: "Giá trị tồn kho", value: "2.84 tỷ", icon: "warehouse", tone: "blue" },
  ],
  orders: [
    { label: "Đơn hôm nay", value: "36", icon: "shopping_bag" },
    { label: "Chờ xuất kho", value: "8", icon: "inventory", tone: "amber" },
    { label: "Đang giao", value: "14", icon: "local_shipping", tone: "blue" },
    { label: "Doanh số hôm nay", value: "52.8tr", icon: "payments" },
  ],
  debt: [
    {
      label: "Tổng công nợ",
      value: "136.4tr",
      icon: "account_balance_wallet",
      tone: "amber",
    },
    { label: "Nợ cần nhắc", value: "48.5tr", icon: "notifications_active", tone: "red" },
    { label: "Nông hộ mở sổ", value: "17 hộ", icon: "groups" },
    { label: "Tỷ lệ thu đúng hạn", value: "91%", icon: "verified", tone: "blue" },
  ],
  vietqr: [
    { label: "Thu qua VietQR", value: "201.6tr", icon: "qr_code_2" },
    { label: "Giao dịch hôm nay", value: "42", icon: "receipt_long", tone: "blue" },
    { label: "Tự khớp đơn", value: "96%", icon: "rule" },
    { label: "Cần đối soát", value: "3", icon: "sync_problem", tone: "amber" },
  ],
  dealer: [
    { label: "Nông hộ liên kết", value: "284 hộ", icon: "groups" },
    { label: "Kỹ sư phụ trách", value: "12", icon: "engineering", tone: "blue" },
    { label: "Kho vận hành", value: "3 kho", icon: "warehouse" },
    { label: "Cấu hình cần duyệt", value: "2", icon: "rule_settings", tone: "amber" },
  ],
}

const configs: Record<AdminSection, SectionConfig> = {
  overview: {
    eyebrow: "Điều hành tổng quan",
    title: "Bảng điều phối vận hành",
    description:
      "Theo dõi doanh thu, đơn hàng, kho, công nợ và tác vụ cần xử lý trong ngày.",
    primaryLabel: "Tạo tác vụ",
    secondaryLabel: "Lập báo cáo ngày",
    exportLabel: "Xuất báo cáo",
    searchPlaceholder: "Tìm đơn hàng, nông hộ, tác vụ...",
    categories: ["Tài chính", "Kho vận", "Kỹ thuật", "Công nợ"],
    statuses: ["Cần xử lý", "Đang xử lý", "Hoàn tất"],
    timeOptions: ["Hôm nay", "7 ngày qua", "Tháng này", "Quý này"],
    columns: ["Tác vụ", "Nhóm", "Phụ trách", "Thời gian", "Giá trị", "Trạng thái"],
    records: [
      record(
        "OV-01",
        "Đối soát doanh thu tuần",
        "Số liệu từ các đơn hoàn tất và thanh toán đã đối soát",
        "Tài chính",
        "Đang xử lý",
        "blue",
        "Hôm nay",
        "482.65tr",
        "Kế toán",
        "Chốt số trước 17:00",
      ),
      record(
        "OV-02",
        "Xuất kho đơn HTX Di Linh",
        "Đơn lớn cần ưu tiên phương tiện giao sáng",
        "Kho vận",
        "Cần xử lý",
        "amber",
        "Hôm nay",
        "18.5tr",
        "Kho Lâm Đồng",
        "Chuẩn bị biên bản xuất",
      ),
      record(
        "OV-03",
        "Duyệt 4 ca AI thán thư",
        "Các ca vượt SLA cần kỹ sư xác nhận",
        "Kỹ thuật",
        "Cần xử lý",
        "red",
        "Hôm nay",
        "4 ca",
        "KS. Phạm Thị Lan",
        "Ưu tiên sầu riêng Ri6",
      ),
      record(
        "OV-04",
        "Nhắc nợ đến hạn",
        "5 nông hộ cần gửi Zalo nhắc thanh toán",
        "Công nợ",
        "Hoàn tất",
        "green",
        "7 ngày qua",
        "48.5tr",
        "AgriCredit",
        "Đã gửi 3/5 nhắc nợ",
      ),
    ],
    formTitle: "tác vụ vận hành",
    formFields: sharedFields("Tên tác vụ", "Mô tả", "Nhóm", [
      "Tài chính",
      "Kho vận",
      "Kỹ thuật",
      "Công nợ",
    ]),
  },
  ai: {
    eyebrow: "Kiểm duyệt chẩn đoán",
    title: "Hàng đợi chẩn đoán cần kỹ sư xác nhận",
    description:
      "Sắp xếp theo mức độ rủi ro mùa vụ, thời gian gửi ảnh và số lần tái phát.",
    primaryLabel: "Tạo ca kiểm duyệt",
    secondaryLabel: "Duyệt ca ưu tiên",
    exportLabel: "Xuất biên bản AI",
    searchPlaceholder: "Tìm mã ca, nông hộ, cây trồng, bệnh hại...",
    categories: ["Sầu riêng", "Cà phê", "Hồ tiêu", "Lúa"],
    statuses: ["Khẩn cấp", "Cần xem lại", "Ưu tiên", "Theo dõi"],
    timeOptions: ["30 phút qua", "Hôm nay", "7 ngày qua", "Tháng này"],
    columns: ["Ca chẩn đoán", "Cây trồng", "Nông hộ", "Thời gian", "Độ tin cậy", "Trạng thái"],
    records: [
      record(
        "AI-1842",
        "Sầu riêng nghi thán thư",
        "Ảnh lá và trái non có vết cháy mép",
        "Sầu riêng",
        "Khẩn cấp",
        "red",
        "30 phút qua",
        "96%",
        "Nguyễn Văn Đức",
        "Sầu riêng Ri6",
      ),
      record(
        "AI-1841",
        "Cà phê vàng lá rễ",
        "Cần kỹ sư xác nhận nguyên nhân tuyến trùng",
        "Cà phê",
        "Cần xem lại",
        "amber",
        "30 phút qua",
        "88%",
        "HTX Di Linh",
        "Cà phê Catimor",
      ),
      record(
        "AI-1838",
        "Tiêu chết nhanh",
        "Nghi bệnh rễ sau mưa kéo dài",
        "Hồ tiêu",
        "Ưu tiên",
        "green",
        "Hôm nay",
        "91%",
        "Vườn Chú Năm",
        "Hồ tiêu",
      ),
      record(
        "AI-1835",
        "Lúa lem lép hạt",
        "Đề xuất phác đồ Nativo 750WG",
        "Lúa",
        "Theo dõi",
        "blue",
        "Hôm nay",
        "84%",
        "Đại lý Thanh Hà",
        "Lúa",
      ),
    ],
    formTitle: "ca chẩn đoán",
    formFields: sharedFields("Tên ca", "Triệu chứng", "Cây trồng", [
      "Sầu riêng",
      "Cà phê",
      "Hồ tiêu",
      "Lúa",
    ]),
  },
  stock: {
    eyebrow: "Quản lý tồn kho",
    title: "Tồn kho theo lô và hạn dùng",
    description: "Theo dõi số lượng, tốc độ bán, hạn dùng và đề xuất nhập bổ sung.",
    primaryLabel: "Nhập kho",
    secondaryLabel: "Xuất kho",
    exportLabel: "Xuất kiểm kê",
    searchPlaceholder: "Tìm sản phẩm, lô hàng, nhà cung cấp...",
    categories: ["Phân bón", "Thuốc BVTV", "Kích rễ", "Vật tư"],
    statuses: ["Ổn định", "Sắp nhập thêm", "Cảnh báo thấp", "Theo dõi hạn"],
    timeOptions: ["Còn hạn", "Dưới 6 tháng", "Dưới 3 tháng", "Hết hạn"],
    columns: ["Sản phẩm", "Danh mục", "Lô hàng", "Hạn dùng", "Tồn kho", "Trạng thái"],
    records: [
      record(
        "BD-1024-A",
        "Đầu Trâu NPK 20-20-15+TE",
        "18 bao/ngày",
        "Phân bón",
        "Sắp nhập thêm",
        "green",
        "Còn hạn",
        "142 bao",
        "Lô BD-1024-A",
        "Còn 12 tháng",
      ),
      record(
        "SYN-0924-RG",
        "Ridomil Gold 68WG",
        "96 gói/ngày",
        "Thuốc BVTV",
        "Ổn định",
        "green",
        "Còn hạn",
        "860 gói",
        "Lô SYN-0924-RG",
        "Còn 18 tháng",
      ),
      record(
        "LT-0824-HM",
        "Humic King Root 1L",
        "21 chai/ngày",
        "Kích rễ",
        "Cảnh báo thấp",
        "red",
        "Dưới 6 tháng",
        "74 chai",
        "Lô LT-0824-HM",
        "Còn 9 tháng",
      ),
      record(
        "BAY-0724-NA",
        "Nativo 750WG",
        "14 gói/ngày",
        "Thuốc BVTV",
        "Theo dõi hạn",
        "amber",
        "Dưới 6 tháng",
        "318 gói",
        "Lô BAY-0724-NA",
        "Còn 6 tháng",
      ),
    ],
    formTitle: "phiếu kho",
    formFields: sharedFields("Tên sản phẩm", "Lô hàng / tốc độ bán", "Danh mục", [
      "Phân bón",
      "Thuốc BVTV",
      "Kích rễ",
      "Vật tư",
    ]),
  },
  orders: {
    eyebrow: "Vận hành đơn hàng",
    title: "Danh sách đơn hàng đang xử lý",
    description: "Theo dõi xuất kho, giao vận, thanh toán và chứng từ hóa đơn.",
    primaryLabel: "Tạo đơn nhanh",
    secondaryLabel: "Xuất hóa đơn",
    exportLabel: "Xuất báo cáo đơn",
    searchPlaceholder: "Tìm mã đơn, khách hàng, phương thức thanh toán...",
    categories: ["VietQR", "Tiền mặt", "AgriCredit", "Sổ nợ mùa vụ"],
    statuses: ["Chờ xuất kho", "Đang soạn hàng", "Đang vận chuyển", "Đã thanh toán"],
    timeOptions: ["Hôm nay", "7 ngày qua", "Tháng này", "Quý này"],
    columns: ["Mã đơn", "Thanh toán", "Khách hàng", "Thời gian", "Tổng tiền", "Trạng thái"],
    records: [
      record(
        "DH-8921",
        "#DH-8921",
        "Xe tải LD-028.42",
        "VietQR",
        "Đang vận chuyển",
        "blue",
        "Hôm nay",
        "2.215.000 đ",
        "Nguyễn Văn Đức",
        "VietQR đã thu",
      ),
      record(
        "DH-8920",
        "#DH-8920",
        "Kho Lâm Đồng",
        "Sổ nợ mùa vụ",
        "Chờ xuất kho",
        "amber",
        "Hôm nay",
        "18.500.000 đ",
        "HTX Di Linh",
        "Cần xuất kho",
      ),
      record(
        "DH-8916",
        "#DH-8916",
        "Chờ hóa đơn",
        "Tiền mặt",
        "Đã thanh toán",
        "green",
        "7 ngày qua",
        "4.800.000 đ",
        "Đại lý Thanh Hà",
        "Đã thu tiền mặt",
      ),
      record(
        "DH-8912",
        "#DH-8912",
        "Ưu tiên giao sáng mai",
        "AgriCredit",
        "Đang soạn hàng",
        "amber",
        "7 ngày qua",
        "7.650.000 đ",
        "Vườn Chú Năm",
        "Gối đầu vụ mùa",
      ),
    ],
    formTitle: "đơn hàng",
    formFields: sharedFields("Mã đơn / tên đơn", "Ghi chú vận hành", "Thanh toán", [
      "VietQR",
      "Tiền mặt",
      "AgriCredit",
      "Sổ nợ mùa vụ",
    ]),
  },
  debt: {
    eyebrow: "Sổ nợ 2 chiều",
    title: "Sổ nợ nông hộ liên kết",
    description: "Quản lý hạn mức, dư nợ, lịch nhắc thanh toán và bảo lãnh HTX.",
    primaryLabel: "Tạo phiếu ghi nợ",
    secondaryLabel: "Ghi nhận thu nợ",
    exportLabel: "Xuất biên bản nợ",
    searchPlaceholder: "Tìm nông hộ, bảo lãnh, hạn mức...",
    categories: ["HTX Di Linh", "Đại lý bảo lãnh", "Không bảo lãnh"],
    statuses: ["An toàn", "Cần nhắc", "Vượt ngưỡng", "Tốt"],
    timeOptions: ["Đến hạn 7 ngày", "Đến hạn tháng này", "Quý này", "Quá hạn"],
    columns: ["Nông hộ", "Bảo lãnh", "Phụ trách", "Đến hạn", "Dư nợ", "Trạng thái"],
    records: [
      record(
        "NO-001",
        "Nguyễn Văn Đức",
        "Hạn mức 100.000.000 đ",
        "HTX Di Linh",
        "An toàn",
        "green",
        "Đến hạn tháng này",
        "48.500.000 đ",
        "AgriCredit",
        "30/12/2024",
      ),
      record(
        "NO-002",
        "Vườn Chú Năm",
        "Hạn mức 80.000.000 đ",
        "Đại lý bảo lãnh",
        "Cần nhắc",
        "amber",
        "Đến hạn 7 ngày",
        "64.800.000 đ",
        "AgriCredit",
        "15/11/2024",
      ),
      record(
        "NO-003",
        "Trần Thị Mai",
        "Hạn mức 60.000.000 đ",
        "HTX Di Linh",
        "Tốt",
        "green",
        "Quý này",
        "12.400.000 đ",
        "Kế toán",
        "05/01/2025",
      ),
      record(
        "NO-004",
        "Phạm Văn Hòa",
        "Hạn mức 45.000.000 đ",
        "Không bảo lãnh",
        "Vượt ngưỡng",
        "red",
        "Quá hạn",
        "39.200.000 đ",
        "Chủ đại lý",
        "28/10/2024",
      ),
    ],
    formTitle: "phiếu công nợ",
    formFields: sharedFields("Tên nông hộ", "Hạn mức / điều khoản", "Bảo lãnh", [
      "HTX Di Linh",
      "Đại lý bảo lãnh",
      "Không bảo lãnh",
    ]),
  },
  vietqr: {
    eyebrow: "Đối soát thanh toán",
    title: "Đối soát giao dịch gần đây",
    description: "Tự khớp tiền về với đơn hàng, sổ nợ hoặc thanh toán một phần.",
    primaryLabel: "Tạo mã QR",
    secondaryLabel: "Đối soát thủ công",
    exportLabel: "Xuất sao kê",
    searchPlaceholder: "Tìm nội dung chuyển khoản, mã đơn, số tiền...",
    categories: ["Đơn hàng", "Sổ nợ", "Thanh toán một phần", "Khác"],
    statuses: ["Đã khớp", "Chờ xử lý", "Đã xuất hóa đơn"],
    timeOptions: ["Hôm nay", "7 ngày qua", "Tháng này", "Quý này"],
    columns: ["Giao dịch", "Nguồn tiền", "Nội dung", "Thời gian", "Số tiền", "Trạng thái"],
    records: [
      record(
        "QR-1042",
        "AGR8842",
        "Đã khớp đơn #DH-8921",
        "Đơn hàng",
        "Đã khớp",
        "green",
        "Hôm nay",
        "2.600.000 đ",
        "10:42",
        "VCB tự khớp",
      ),
      record(
        "QR-1018",
        "SN2024-884 TRA NO",
        "Đã ghi giảm sổ nợ",
        "Sổ nợ",
        "Đã khớp",
        "green",
        "Hôm nay",
        "15.000.000 đ",
        "10:18",
        "Giảm dư nợ",
      ),
      record(
        "QR-0956",
        "NGUYEN VAN DUC",
        "Cần chọn đơn liên quan",
        "Thanh toán một phần",
        "Chờ xử lý",
        "amber",
        "Hôm nay",
        "920.000 đ",
        "09:56",
        "Thiếu mã đơn",
      ),
      record(
        "QR-0921",
        "AGR8916",
        "Đã xuất hóa đơn điện tử",
        "Đơn hàng",
        "Đã xuất hóa đơn",
        "blue",
        "Hôm nay",
        "4.800.000 đ",
        "09:21",
        "Hóa đơn đã gửi",
      ),
    ],
    formTitle: "mã QR / giao dịch",
    formFields: sharedFields("Nội dung QR", "Ghi chú đối soát", "Nguồn tiền", [
      "Đơn hàng",
      "Sổ nợ",
      "Thanh toán một phần",
      "Khác",
    ]),
  },
  dealer: {
    eyebrow: "Hồ sơ đại lý",
    title: "Cấu hình vận hành cửa hàng",
    description:
      "Quản lý thông tin chi nhánh, nhân sự trực ca, chính sách và tài khoản đối soát.",
    primaryLabel: "Cập nhật hồ sơ",
    secondaryLabel: "Thêm nhân sự",
    exportLabel: "Xuất hồ sơ",
    searchPlaceholder: "Tìm cấu hình, nhân sự, khu vực, tài khoản...",
    categories: ["Cửa hàng", "Nhân sự", "Kho vận", "Tài chính", "Chính sách"],
    statuses: ["Đang dùng", "Chờ duyệt", "Cần cập nhật"],
    timeOptions: ["Mới cập nhật", "7 ngày qua", "Tháng này", "Tất cả"],
    columns: ["Cấu hình", "Nhóm", "Phụ trách", "Cập nhật", "Giá trị", "Trạng thái"],
    records: [
      record(
        "DL-001",
        "Giờ phục vụ",
        "07:00 - 20:00 hằng ngày",
        "Cửa hàng",
        "Đang dùng",
        "green",
        "Mới cập nhật",
        "07:00 - 20:00",
        "Trần Minh Đức",
        "Áp dụng mọi ngày",
      ),
      record(
        "DL-002",
        "Tổng đài kỹ sư",
        "1900 6828",
        "Nhân sự",
        "Đang dùng",
        "green",
        "7 ngày qua",
        "1900 6828",
        "KS. Phạm Thị Lan",
        "Tư vấn cây trồng",
      ),
      record(
        "DL-003",
        "Ngân hàng đối soát",
        "Vietcombank 190068289999",
        "Tài chính",
        "Chờ duyệt",
        "amber",
        "Tháng này",
        "VCB",
        "Kế toán",
        "Cần xác thực chủ tài khoản",
      ),
      record(
        "DL-004",
        "Chính sách giao hàng",
        "Miễn phí đơn từ 2.000.000 đ",
        "Chính sách",
        "Cần cập nhật",
        "red",
        "Tháng này",
        ">= 2.000.000 đ",
        "Điều phối kho",
        "Rà lại theo khu vực",
      ),
    ],
    formTitle: "cấu hình đại lý",
    formFields: sharedFields("Tên cấu hình", "Giá trị / mô tả", "Nhóm cấu hình", [
      "Cửa hàng",
      "Nhân sự",
      "Kho vận",
      "Tài chính",
      "Chính sách",
    ]),
  },
}

function MiniMetric({
  label,
  value,
  icon,
  tone = "primary",
}: {
  label: string
  value: string
  icon: string
  tone?: "primary" | "amber" | "blue" | "red"
}) {
  const toneClass = {
    primary: "bg-primary-light text-primary",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-sky-50 text-sky-700",
    red: "bg-red-50 text-red-600",
  }[tone]

  return (
    <div className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-black uppercase tracking-wide text-text-muted">
            {label}
          </div>
          <div className="mt-3 text-2xl font-black text-text-primary">{value}</div>
        </div>
        <span
          className={`material-symbols-outlined rounded-lg p-2 text-[20px] ${toneClass}`}
        >
          {icon}
        </span>
      </div>
    </div>
  )
}

function StatusPill({
  children,
  tone = "green",
}: {
  children: ReactNode
  tone?: Tone
}) {
  const toneClass = {
    green: "bg-emerald-50 text-primary",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-sky-50 text-sky-700",
    red: "bg-red-50 text-red-600",
    gray: "bg-surface-secondary text-text-secondary",
  }[tone]

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${toneClass}`}
    >
      {children}
    </span>
  )
}

function IconButton({
  icon,
  label,
  onClick,
  tone = "neutral",
}: {
  icon: string
  label: string
  onClick: () => void
  tone?: "neutral" | "primary" | "danger"
}) {
  const classes = {
    neutral:
      "border-border-subtle bg-white text-text-secondary hover:border-primary hover:text-primary",
    primary: "border-primary bg-primary text-white hover:bg-primary-hover",
    danger: "border-red-100 bg-white text-status-error hover:bg-status-error-surface",
  }[tone]

  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${classes}`}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
    </button>
  )
}

function FieldControl({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-wide text-text-muted">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  )
}

export function SectionPanel({ section }: { section: AdminSection }) {
  const config = configs[section]
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("Tất cả")
  const [status, setStatus] = useState("Tất cả")
  const [time, setTime] = useState("Tất cả")
  const [page, setPage] = useState(1)
  const [mode, setMode] = useState<ModalMode>(null)
  const [activeRecord, setActiveRecord] = useState<AdminRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminRecord | null>(null)
  const [workState, setWorkState] = useState<WorkState>("ready")
  const [toast, setToast] = useState<{ tone: Tone; message: string } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState<Partial<AdminRecord>>({})

  const pageSize = 3
  const filteredRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return config.records.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        [
          item.id,
          item.title,
          item.subtitle,
          item.category,
          item.status,
          item.owner,
          item.note,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      const matchesCategory = category === "Tất cả" || item.category === category
      const matchesStatus = status === "Tất cả" || item.status === status
      const matchesTime = time === "Tất cả" || item.time === time

      return matchesQuery && matchesCategory && matchesStatus && matchesTime
    })
  }, [category, config, query, status, time])

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize))
  const visibleRecords = filteredRecords.slice((page - 1) * pageSize, page * pageSize)

  const showToast = (toneValue: Tone, message: string) => {
    setToast({ tone: toneValue, message })
    window.setTimeout(() => setToast(null), 2400)
  }

  const resetFilters = () => {
    setQuery("")
    setCategory("Tất cả")
    setStatus("Tất cả")
    setTime("Tất cả")
    setPage(1)
    showToast("gray", "Đã xóa bộ lọc")
  }

  const openModal = (nextMode: Exclude<ModalMode, null>, item?: AdminRecord) => {
    setMode(nextMode)
    setActiveRecord(item ?? null)
    setErrors({})
    setForm(
      item ?? {
        category: config.categories[0],
        status: config.statuses[0],
        time: config.timeOptions[0],
      },
    )
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = Object.fromEntries(
      config.formFields
        .filter((field) => field.required && !String(form[field.key] ?? "").trim())
        .map((field) => [field.key, `${field.label} là bắt buộc`]),
    )
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      showToast("red", "Vui lòng kiểm tra các trường bắt buộc")
      return
    }

    setWorkState("loading")
    window.setTimeout(() => {
      setWorkState("ready")
      setMode(null)
      showToast(
        "green",
        mode === "edit"
          ? "Đã lưu thay đổi"
          : mode === "export"
            ? "Đã tạo báo cáo"
            : "Đã tạo mới thành công",
      )
    }, 650)
  }

  const handleApprove = () => {
    setWorkState("loading")
    window.setTimeout(() => {
      setWorkState("ready")
      setMode(null)
      showToast("green", `Đã duyệt ${activeRecord?.title ?? "mục đã chọn"}`)
    }, 650)
  }

  const confirmDelete = () => {
    setWorkState("loading")
    window.setTimeout(() => {
      setWorkState("ready")
      setDeleteTarget(null)
      showToast("green", "Đã xóa mục khỏi danh sách")
    }, 650)
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className={`fixed right-4 top-20 z-50 max-w-sm rounded-xl p-4 shadow-floating ${
            toast.tone === "red" ? "bg-status-error" : "bg-primary"
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[20px] text-white">
              {toast.tone === "red" ? "error" : "check_circle"}
            </span>
            <div className="text-sm font-black text-white">{toast.message}</div>
          </div>
        </div>
      )}

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metricsBySection[section].map((metric) => (
          <MiniMetric key={metric.label} {...metric} />
        ))}
      </section>

      {section === "overview" && <OverviewInsights />}
      {section === "vietqr" && <VietQrCard onExport={() => openModal("export")} />}
      {section === "dealer" && (
        <DealerHero onEdit={() => openModal("edit", config.records[0])} />
      )}

      <section className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-wide text-primary">
              {config.eyebrow}
            </div>
            <h2 className="mt-2 text-lg font-black text-text-primary">{config.title}</h2>
            <p className="mt-1 text-xs leading-relaxed text-text-muted">
              {config.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <button
              type="button"
              onClick={() => openModal("export")}
              className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-white px-4 py-2 text-sm font-black text-text-secondary hover:border-primary hover:text-primary"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              {config.exportLabel}
            </button>
            <button
              type="button"
              onClick={() => openModal("edit", config.records[0])}
              className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-white px-4 py-2 text-sm font-black text-primary hover:bg-primary-light"
            >
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
              {config.secondaryLabel}
            </button>
            <button
              type="button"
              onClick={() => openModal("create")}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-black text-white hover:bg-primary-hover"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              {config.primaryLabel}
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 xl:flex-row xl:items-center">
          <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-border-subtle bg-surface-subtle px-3">
            <span className="material-symbols-outlined text-[18px] text-text-muted">
              search
            </span>
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted"
              placeholder={config.searchPlaceholder}
            />
          </label>
          <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 xl:overflow-visible xl:pb-0">
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value)
                setPage(1)
              }}
              className="h-10 w-40 shrink-0 rounded-lg border border-border-subtle bg-white px-3 text-sm font-bold text-text-secondary outline-none"
            >
              <option value="Tất cả">Tất cả danh mục</option>
              {config.categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value)
                setPage(1)
              }}
              className="h-10 w-40 shrink-0 rounded-lg border border-border-subtle bg-white px-3 text-sm font-bold text-text-secondary outline-none"
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              {config.statuses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={time}
              onChange={(event) => {
                setTime(event.target.value)
                setPage(1)
              }}
              className="h-10 w-40 shrink-0 rounded-lg border border-border-subtle bg-white px-3 text-sm font-bold text-text-secondary outline-none"
            >
              <option value="Tất cả">Tất cả thời gian</option>
              {config.timeOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-3 text-sm font-black text-text-muted hover:bg-primary-light hover:text-primary"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              Xóa lọc
            </button>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-border-subtle">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="border-b border-border-subtle bg-surface-subtle text-xs uppercase text-text-muted">
                <tr>
                  {config.columns.map((column) => (
                    <th key={column} className="px-4 py-3 font-black">
                      {column}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center font-black">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle bg-white">
                {workState === "error" && (
                  <tr>
                    <td colSpan={config.columns.length + 1} className="px-4 py-10">
                      <StateNotice
                        icon="sync_problem"
                        title="Không tải được dữ liệu"
                        description="Vui lòng thử tải lại hoặc kiểm tra kết nối hệ thống nội bộ."
                        actionLabel="Tải lại"
                        onAction={() => setWorkState("ready")}
                      />
                    </td>
                  </tr>
                )}
                {workState === "loading" && (
                  <tr>
                    <td colSpan={config.columns.length + 1} className="px-4 py-10">
                      <StateNotice
                        icon="progress_activity"
                        title="Đang xử lý"
                        description="Hệ thống đang ghi nhận thao tác, vui lòng chờ trong giây lát."
                      />
                    </td>
                  </tr>
                )}
                {workState === "ready" && visibleRecords.length === 0 && (
                  <tr>
                    <td colSpan={config.columns.length + 1} className="px-4 py-10">
                      <StateNotice
                        icon="inbox"
                        title="Không có dữ liệu phù hợp"
                        description="Thử xóa bộ lọc hoặc tạo mới một bản ghi cho màn hình này."
                        actionLabel="Tạo mới"
                        onAction={() => openModal("create")}
                      />
                    </td>
                  </tr>
                )}
                {workState === "ready" &&
                  visibleRecords.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => openModal("view", item)}
                      className="cursor-pointer align-top transition-colors hover:bg-primary-subtle"
                    >
                      <td className="px-4 py-4">
                        <div className="font-black text-text-primary">{item.title}</div>
                        <div className="mt-1 max-w-[280px] text-xs leading-relaxed text-text-muted">
                          {item.subtitle}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-text-secondary">{item.category}</td>
                      <td className="px-4 py-4 font-bold text-text-secondary">
                        {item.owner}
                      </td>
                      <td className="px-4 py-4 text-text-secondary">{item.time}</td>
                      <td className="px-4 py-4 font-black text-text-primary">
                        {item.amount}
                      </td>
                      <td className="px-4 py-4">
                        <StatusPill tone={item.statusTone}>{item.status}</StatusPill>
                      </td>
                      <td className="px-4 py-4">
                        <div
                          className="flex justify-center gap-2"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <IconButton
                            icon="edit"
                            label="Sửa"
                            onClick={() => openModal("edit", item)}
                          />
                          <IconButton
                            icon="delete"
                            label="Xóa"
                            onClick={() => setDeleteTarget(item)}
                            tone="danger"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 text-sm text-text-muted md:flex-row md:items-center md:justify-between">
          <div>
            Hiển thị <strong className="text-text-primary">{visibleRecords.length}</strong>{" "}
            / <strong className="text-text-primary">{filteredRecords.length}</strong> bản ghi
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-lg border border-border-subtle px-3 py-2 font-black text-text-secondary disabled:cursor-not-allowed disabled:opacity-40"
            >
              Trước
            </button>
            <span className="rounded-lg bg-primary-light px-3 py-2 font-black text-primary">
              {page}/{totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-border-subtle px-3 py-2 font-black text-text-secondary disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sau
            </button>
          </div>
        </div>
      </section>

      {mode && (
        <AdminModal
          title={modalTitle(mode, config.formTitle)}
          subtitle={modalSubtitle(mode, config)}
          onClose={() => setMode(null)}
        >
          {mode === "view" && activeRecord ? (
            <RecordDetails item={activeRecord} onClose={() => setMode(null)} />
          ) : mode === "approve" && activeRecord ? (
            <ConfirmPanel
              title={`Duyệt ${activeRecord.title}`}
              description="Thao tác này sẽ xác nhận bản ghi và ghi nhận vào nhật ký vận hành."
              item={activeRecord}
              loading={workState === "loading"}
              confirmLabel="Duyệt"
              onConfirm={handleApprove}
              onCancel={() => setMode(null)}
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode !== "export" && (
                <FormSummary
                  title={String(form.title ?? `Thông tin ${config.formTitle}`)}
                  subtitle={activeRecord?.id ?? "Tạo mới trong AgriSage Admin"}
                  actionLabel={section === "dealer" ? "Đổi ảnh" : "Đính kèm"}
                />
              )}
              {mode === "export" && (
                <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary-light p-4 text-sm font-bold text-primary">
                  <span className="material-symbols-outlined text-[20px]">summarize</span>
                  <span>
                    Báo cáo sẽ bao gồm dữ liệu theo bộ lọc hiện tại: {filteredRecords.length} bản ghi.
                  </span>
                </div>
              )}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {config.formFields.map((field) => (
                  <div
                    key={field.key}
                    className={field.key === "note" ? "md:col-span-2" : undefined}
                  >
                    <FieldControl label={field.label}>
                    {field.type === "textarea" ? (
                      <textarea
                        value={String(form[field.key] ?? "")}
                        onChange={(event) =>
                          setForm({ ...form, [field.key]: event.target.value })
                        }
                        rows={2}
                        className="w-full rounded-lg border border-border-subtle bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-light"
                      />
                    ) : field.type === "select" ? (
                      <select
                        value={String(form[field.key] ?? "")}
                        onChange={(event) =>
                          setForm({ ...form, [field.key]: event.target.value })
                        }
                        className="h-10 w-full rounded-lg border border-border-subtle bg-white px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-light"
                      >
                        {field.options?.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type ?? "text"}
                        value={String(form[field.key] ?? "")}
                        onChange={(event) =>
                          setForm({ ...form, [field.key]: event.target.value })
                        }
                        className="h-10 w-full rounded-lg border border-border-subtle bg-white px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary-light"
                      />
                    )}
                    {errors[field.key] && (
                      <div className="mt-1 text-xs font-bold text-status-error">
                        {errors[field.key]}
                      </div>
                    )}
                    </FieldControl>
                  </div>
                ))}
              </div>
              <div className="-mx-5 -mb-5 flex flex-col-reverse gap-2 border-t border-border-subtle bg-surface-subtle px-5 py-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setMode(null)}
                  className="h-10 rounded-lg border border-border-subtle bg-white px-5 text-sm font-black text-text-secondary hover:border-primary hover:text-primary"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={workState === "loading"}
                  className="h-10 rounded-lg bg-primary px-6 text-sm font-black text-white hover:bg-primary-hover disabled:opacity-60"
                >
                  {workState === "loading"
                    ? "Đang lưu..."
                    : mode === "export"
                      ? "Tạo báo cáo"
                      : "Lưu"}
                </button>
              </div>
            </form>
          )}
        </AdminModal>
      )}

      {deleteTarget && (
        <AdminModal
          title="Xác nhận xóa"
          subtitle="Kiểm tra lại thông tin trước khi xóa bản ghi khỏi danh sách."
          onClose={() => setDeleteTarget(null)}
        >
          <ConfirmPanel
            title={`Xóa ${deleteTarget.title}`}
            description="Bản ghi sẽ được gỡ khỏi danh sách hiển thị. Hãy xác nhận trước khi tiếp tục."
            item={deleteTarget}
            loading={workState === "loading"}
            confirmLabel="Xóa"
            danger
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        </AdminModal>
      )}
    </div>
  )
}

function OverviewInsights() {
  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-text-primary">Doanh thu theo tuần</h2>
            <p className="mt-1 text-xs text-text-muted">
              Số liệu từ các đơn hoàn tất và thanh toán đã đối soát.
            </p>
          </div>
          <StatusPill tone="green">+12.8%</StatusPill>
        </div>
        <div className="mt-5 flex h-64 items-end gap-3 rounded-xl bg-surface-subtle p-5">
          {[48, 66, 52, 88, 74, 95, 82].map((height, index) => (
            <div key={index} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-lg bg-primary transition-all hover:bg-primary-hover"
                style={{ height: `${height}%` }}
              />
              <span className="text-xs font-bold text-text-muted">T{index + 2}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-black text-text-primary">Cảnh báo cần xử lý</h2>
          <span className="material-symbols-outlined rounded-lg bg-status-warning-surface p-2 text-[20px] text-status-warning">
            notifications_active
          </span>
        </div>
        <div className="mt-5 space-y-3">
          {[
            "2 đơn nợ vượt 80% hạn mức",
            "4 ca AI chờ kỹ sư duyệt",
            "7 mã thuốc sắp hết tồn kho",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-lg border border-amber-100 bg-status-warning-surface p-3 text-sm font-bold text-amber-800"
            >
              <span className="material-symbols-outlined text-[18px]">warning</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function VietQrCard({ onExport }: { onExport: () => void }) {
  return (
    <section className="rounded-xl border border-border-subtle bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_1fr] lg:items-center">
        <div className="rounded-2xl border border-primary bg-primary-light p-5 text-center">
          <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-xl bg-white shadow-sm">
            <span className="material-symbols-outlined text-[116px] text-primary">
              qr_code_2
            </span>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-black text-text-primary">VietQR cửa hàng</h2>
          <p className="mt-1 text-xs text-text-muted">
            Mã QR tĩnh cho Chi nhánh Lâm Đồng, tự nhận diện nội dung đơn hàng.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              ["Chủ tài khoản", "AGRISAGE LÂM ĐỒNG"],
              ["Ngân hàng", "Vietcombank"],
              ["Số tài khoản", "190068289999"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-surface-subtle p-4">
                <div className="text-xs font-black uppercase text-text-muted">{label}</div>
                <div className="mt-2 font-black text-text-primary">{value}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onExport}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-black text-white"
            >
              Tải QR
            </button>
            <button
              type="button"
              onClick={onExport}
              className="rounded-lg border border-border-subtle px-4 py-2 text-sm font-black text-primary"
            >
              In để quầy
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function DealerHero({ onEdit }: { onEdit: () => void }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border-subtle bg-white shadow-sm">
      <div className="bg-primary px-6 py-8 text-white">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
              <span className="material-symbols-outlined text-[38px]">storefront</span>
            </div>
            <div>
              <div className="text-2xl font-black">Chi nhánh Lâm Đồng (Trung tâm)</div>
              <div className="mt-1 text-sm text-emerald-100">
                142 Hùng Vương, TT. Di Linh, Lâm Đồng · Mã đại lý AGR-LD-001
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg bg-white px-4 py-2 text-sm font-black text-primary"
          >
            Cập nhật hồ sơ
          </button>
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
  )
}

function StateNotice({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: string
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center text-center">
      <span className="material-symbols-outlined rounded-xl bg-primary-light p-3 text-[32px] text-primary">
        {icon}
      </span>
      <div className="mt-3 text-base font-black text-text-primary">{title}</div>
      <p className="mt-1 text-sm leading-relaxed text-text-muted">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-black text-white"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

function AdminModal({
  title,
  subtitle,
  children,
  onClose,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-text-primary/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-5">
      <div className="w-full overflow-hidden rounded-t-2xl border border-border-subtle bg-white shadow-floating sm:w-[min(760px,calc(100vw-40px))] sm:rounded-2xl">
        <div className="flex items-start justify-between border-b border-border-subtle bg-white px-5 py-4">
          <div className="min-w-0">
            <h3 className="truncate text-xl font-black text-text-primary">{title}</h3>
            {subtitle && (
              <p className="mt-1 text-sm font-medium text-text-muted">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-lg p-2 text-text-secondary hover:bg-surface-subtle hover:text-primary"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

function FormSummary({
  title,
  subtitle,
  actionLabel,
}: {
  title: string
  subtitle: string
  actionLabel: string
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-primary-subtle p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-white">
          <span className="material-symbols-outlined text-[32px] text-primary">psychiatry</span>
        </div>
        <div className="min-w-0">
          <div className="truncate text-base font-black text-text-primary">{title}</div>
          <div className="mt-1 text-xs font-black uppercase tracking-wide text-text-muted">
            Mã hồ sơ: {subtitle}
          </div>
        </div>
      </div>
      <button
        type="button"
        className="h-9 shrink-0 rounded-lg border border-border-subtle bg-white px-4 text-sm font-black text-primary hover:border-primary"
      >
        {actionLabel}
      </button>
    </div>
  )
}

function RecordDetails({ item, onClose }: { item: AdminRecord; onClose: () => void }) {
  return (
    <div className="space-y-4">
      <FormSummary title={item.title} subtitle={item.id} actionLabel="Hồ sơ" />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {[
          ["Danh mục", item.category],
          ["Phụ trách", item.owner],
          ["Thời gian", item.time],
          ["Giá trị", item.amount],
          ["Ghi chú", item.note],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border-subtle px-4 py-3">
            <div className="text-xs font-black uppercase text-text-muted">{label}</div>
            <div className="mt-1.5 font-black text-text-primary">{value}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-xl bg-surface-subtle px-4 py-3">
        <div>
          <div className="text-xs font-black uppercase tracking-wide text-text-muted">
            Trạng thái
          </div>
          <div className="mt-2">
            <StatusPill tone={item.statusTone}>{item.status}</StatusPill>
          </div>
        </div>
        <div className="text-right text-sm font-bold text-text-secondary">
          {item.subtitle}
        </div>
      </div>
      <div className="-mx-5 -mb-5 flex justify-end border-t border-border-subtle bg-surface-subtle px-5 py-3">
        <button
          type="button"
          onClick={onClose}
          className="h-10 rounded-lg bg-primary px-6 text-sm font-black text-white hover:bg-primary-hover"
        >
          Đóng
        </button>
      </div>
    </div>
  )
}

function ConfirmPanel({
  title,
  description,
  item,
  loading,
  confirmLabel,
  danger,
  onConfirm,
  onCancel,
}: {
  title: string
  description: string
  item?: AdminRecord
  loading: boolean
  confirmLabel: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="space-y-4">
      {item && (
        <FormSummary
          title={item.title}
          subtitle={item.id}
          actionLabel={danger ? "Kiểm tra" : "Hồ sơ"}
        />
      )}
      <div
        className={`flex gap-3 rounded-xl border p-4 ${
          danger
            ? "border-red-100 bg-status-error-surface text-status-error"
            : "border-primary/20 bg-primary-light text-primary"
        }`}
      >
        <span className="material-symbols-outlined text-[24px]">
          {danger ? "warning" : "verified"}
        </span>
        <div>
          <div className="font-black">{title}</div>
          <p className="mt-1 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="-mx-5 -mb-5 flex flex-col-reverse gap-2 border-t border-border-subtle bg-surface-subtle px-5 py-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 rounded-lg border border-border-subtle bg-white px-5 text-sm font-black text-text-secondary hover:border-primary hover:text-primary"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`h-10 rounded-lg px-6 text-sm font-black text-white disabled:opacity-60 ${
            danger ? "bg-status-error" : "bg-primary hover:bg-primary-hover"
          }`}
        >
          {loading ? "Đang xử lý..." : confirmLabel}
        </button>
      </div>
    </div>
  )
}

function modalTitle(mode: Exclude<ModalMode, null>, formTitle: string) {
  if (mode === "create") return `Tạo ${formTitle}`
  if (mode === "edit") return `Sửa ${formTitle}`
  if (mode === "view") return `Chi tiết ${formTitle}`
  if (mode === "approve") return `Duyệt ${formTitle}`
  return `Xuất ${formTitle}`
}

function modalSubtitle(mode: Exclude<ModalMode, null>, config: SectionConfig) {
  if (mode === "create") return `Thêm mới dữ liệu cho ${config.title.toLowerCase()}.`
  if (mode === "edit") return "Cập nhật thông tin, người phụ trách và ghi chú vận hành."
  if (mode === "view") return "Xem nhanh toàn bộ thông tin của bản ghi đã chọn."
  if (mode === "approve") return "Xác nhận bản ghi trước khi đưa vào quy trình vận hành."
  return "Tạo biên bản hoặc báo cáo theo bộ lọc hiện tại."
}

export default function Admin() {
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { adminPage } = useParams()
  const section = adminPage ? sectionBySlug[adminPage] : undefined
  const current = menu.find((item) => item.id === section)

  if (user?.role !== "admin") {
    return <Navigate to="/dang-nhap" replace />
  }

  if (!adminPage || !section || !current) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-surface-subtle text-text-primary">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border-subtle bg-white lg:block">
        <Link
          to="/"
          className="flex h-16 items-center gap-3 border-b border-border-subtle px-5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
            <span className="material-symbols-outlined">psychiatry</span>
          </div>
          <div>
            <div className="text-lg font-black text-primary-dark">AgriSage</div>
            <div className="text-[11px] font-black uppercase tracking-wide text-text-muted">
              Quản trị đại lý
            </div>
          </div>
        </Link>
        <nav className="px-3 py-6">
          <div className="mb-3 px-3 text-xs font-black uppercase tracking-wide text-text-muted">
            Hệ thống nghiệp vụ
          </div>
          <div className="space-y-2">
            {menu.map((item) => (
              <Link
                key={item.id}
                to={`/admin/${item.slug}`}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-black transition-colors ${
                  section === item.id
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:bg-primary-light hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      section === item.id ? "bg-white text-primary" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 border-b border-border-subtle bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <button className="inline-flex min-w-0 items-center gap-2 rounded-lg border border-border-subtle bg-surface-subtle px-4 py-2 text-sm font-bold text-text-secondary">
                <span className="material-symbols-outlined text-[18px]">store</span>
                <span className="truncate">Chi nhánh Lâm Đồng (Trung tâm)</span>
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>
              <label className="hidden flex-1 items-center gap-2 rounded-lg bg-surface-subtle px-3 py-2 md:flex">
                <span className="material-symbols-outlined text-[18px] text-text-muted">
                  search
                </span>
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted"
                  placeholder="Tìm thuốc BVTV, phân bón, nông dân, mã đơn..."
                />
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
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <div className="hidden text-left sm:block">
                  <div className="text-sm font-black">{user.name}</div>
                  <div className="text-xs text-text-muted">
                    Quản trị viên / Chủ đại lý
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-text-muted">
                  expand_more
                </span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-lg border border-border-subtle bg-white py-1 shadow-floating">
                  <Link
                    to="/admin/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-text-secondary hover:bg-primary-light hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-[17px]">
                      account_circle
                    </span>
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
          <div className="mb-3 text-xs font-black uppercase text-text-muted">
            Màn hình admin
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {menu.map((item) => (
              <Link
                key={item.id}
                to={`/admin/${item.slug}`}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold ${
                  section === item.id ? "bg-primary text-white" : "bg-surface-subtle text-text-secondary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <main className="px-4 py-7 sm:px-6 lg:px-8">
          <div className="mb-6 rounded-2xl border border-border-subtle bg-white p-6 shadow-sm">
            <div className="text-xs font-black uppercase tracking-wide text-primary">
              AgriSage Admin
            </div>
            <h1 className="mt-2 flex items-center gap-2 text-3xl font-black text-text-primary">
              <span className="material-symbols-outlined text-[30px] text-primary">
                {current.icon}
              </span>
              {current.label}
            </h1>
          </div>
          <SectionPanel section={section} />
        </main>
      </div>
    </div>
  )
}
