import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

const orderItems = [
  { icon: 'medication', iconColor: 'text-[#2E7D32]', name: 'Thuốc trừ bệnh Ridomil Gold 68WG', spec: 'Gói 100g (Pha 40-50L)', qty: 'x5 gói', price: '240.000 đ', tag: 'Syngenta Thụy Sĩ', tagClass: 'bg-[#E8F5E9] text-[#1B5E20]' },
  { icon: 'compost', iconColor: 'text-[#E65100]', name: 'Đầu Trâu NPK 20-20-15+TE Nuôi Trái Lớn', spec: 'Bao 50kg (Chống ẩm)', qty: 'x2 bao', price: '1.840.000 đ', tag: 'Bình Điền • Có bốc xếp tận kho', tagClass: 'bg-[#FFF3E0] text-[#E65100]' },
  { icon: 'water_drop', iconColor: 'text-[#0277BD]', name: 'Kích Rễ King Root Humic 1L - Tái Sinh Rễ', spec: 'Chai 1L đậm đặc', qty: 'x3 chai', price: '375.000 đ', tag: 'Lộc Trời Group', tagClass: 'bg-[#E1F5FE] text-[#0277BD]' },
  { icon: 'pest_control', iconColor: 'text-[#2E7D32]', name: 'Thuốc trừ nấm bệnh Nativo 750WG', spec: 'Gói 120g (Thán thư & thối trái)', qty: 'x1 gói', price: '195.000 đ', tag: 'Bayer CropScience Đức', tagClass: 'bg-[#E8F5E9] text-[#1B5E20]' },
]

export default function OrderSuccessPage() {
  useDocumentTitle('Đặt hàng thành công')
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="w-full bg-white border-b border-[#E1E8E2] py-4 -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 mb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#172118]">1. Giỏ hàng</span>
            </div>
            <div className="flex-1 h-0.5 bg-[#2E7D32] mx-3 sm:mx-6"></div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#172118]">2. Giao nhận &amp; Thanh toán</span>
            </div>
            <div className="flex-1 h-0.5 bg-[#2E7D32] mx-3 sm:mx-6"></div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#0d631b] text-white flex items-center justify-center text-xs font-bold ring-4 ring-[#E8F5E9]">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#0d631b]">3. Hoàn tất</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E1E8E2] shadow-sm text-center mb-8 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#E8F5E9]/50 pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-[#E8F5E9]/40 pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mb-4 shadow-inner ring-8 ring-[#F5FBF4]">
            <span className="material-symbols-outlined text-5xl font-bold">check_circle</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#1B5E20] text-xs font-bold uppercase tracking-wider mb-2">
            Xác nhận thành công • Đã ghi nhận vào kho Di Linh
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172118] tracking-tight">
            Cảm ơn Bác nông dân Nguyễn Văn Hùng!
          </h1>
          <p className="text-sm sm:text-base text-[#465348] mt-2 leading-relaxed">
            Đơn hàng <strong className="text-[#0d631b] font-mono text-base">#AGR-8842</strong> của
            Bác đã được tiếp nhận thành công trên hệ sinh thái AgriSage. Bộ phận kho vận đang xuất
            bao bì và chuẩn bị điều xe tải giao vật tư đến tận vườn.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-6 pt-6 border-t border-[#E1E8E2]">
            <div className="bg-[#F5FBF4] p-3 rounded-xl border border-[#E1E8E2]/60 text-left">
              <span className="text-[11px] font-medium text-[#7A8A7C] uppercase block">Mã đơn hàng</span>
              <span className="font-mono text-sm font-bold text-[#0d631b]">#AGR-8842</span>
            </div>
            <div className="bg-[#F5FBF4] p-3 rounded-xl border border-[#E1E8E2]/60 text-left">
              <span className="text-[11px] font-medium text-[#7A8A7C] uppercase block">Tổng thanh toán</span>
              <span className="text-sm font-bold text-[#172118]">2.600.000 đ</span>
            </div>
            <div className="bg-[#F5FBF4] p-3 rounded-xl border border-[#E1E8E2]/60 text-left">
              <span className="text-[11px] font-medium text-[#7A8A7C] uppercase block">Phương thức</span>
              <span className="text-sm font-semibold text-[#0277BD] flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">qr_code_2</span> VietQR Napas
              </span>
            </div>
            <div className="bg-[#F5FBF4] p-3 rounded-xl border border-[#E1E8E2]/60 text-left">
              <span className="text-[11px] font-medium text-[#7A8A7C] uppercase block">Dự kiến giao</span>
              <span className="text-sm font-bold text-[#2E7D32]">Sáng mai (trước 11h)</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-lg border border-[#B0BEB3] bg-white hover:bg-[#EDF4EE] text-[#172118] text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-lg text-[#465348]">print</span>
              <span>In phiếu giao nhận &amp; hóa đơn</span>
            </button>
            <a
              href="#"
              className="px-5 py-2.5 rounded-lg bg-[#0d631b] hover:bg-[#256628] text-white text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">local_shipping</span>
              <span>Theo dõi xe giao hàng</span>
            </a>
            <Link
              to="/products"
              className="px-4 py-2.5 rounded-lg border border-[#0d631b] text-[#0d631b] hover:bg-[#E8F5E9] text-sm font-semibold flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-lg">storefront</span>
              <span>Tiếp tục mua hàng</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-xl p-6 border border-[#E1E8E2] shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-[#E1E8E2] mb-5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0d631b] text-xl">route</span>
                <h2 className="font-bold text-base text-[#172118]">Lộ trình giao hàng vật tư AgriExpress</h2>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse"></span> Đang xử lý tại kho
              </span>
            </div>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E1E8E2]">
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#2E7D32] text-white flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-xs font-bold">check</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#172118]">
                      Đơn hàng được khởi tạo &amp; Đã duyệt thanh toán VietQR
                    </span>
                    <span className="text-xs font-mono text-[#7A8A7C]">Hôm nay, 14:32</span>
                  </div>
                  <p className="text-xs text-[#465348] mt-1">
                    Hệ thống đã khớp giao dịch 2.600.000 đ từ Vietcombank Napas247, mã GD:{' '}
                    <span className="font-mono font-semibold">VCB-998271</span>.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#0277BD] text-white flex items-center justify-center ring-4 ring-[#E1F5FE]">
                  <span className="material-symbols-outlined text-xs font-bold animate-spin">sync</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#0277BD]">
                      Kho Di Linh đang bốc xếp vật tư &amp; niêm phong lô
                    </span>
                    <span className="text-xs font-mono text-[#0277BD] font-semibold">Đang tiến hành</span>
                  </div>
                  <p className="text-xs text-[#465348] mt-1">
                    Nhân viên kho đang kiểm tra tem QR chống giả của Syngenta, bao bì 50kg Đầu Trâu
                    và hạn dùng thuốc BVTV.
                  </p>
                </div>
              </div>
              <div className="relative opacity-60">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#B0BEB3] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-xs">local_shipping</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-[#172118]">
                      Điều xe tải bán tải nông nghiệp chở tận vườn
                    </span>
                    <span className="text-xs text-[#7A8A7C]">Dự kiến: 07:30 sáng mai</span>
                  </div>
                  <p className="text-xs text-[#7A8A7C] mt-0.5">
                    Tài xế Nguyễn Văn Lực (SĐT: 0984 112 345) phụ trách lộ trình tuyến Di Linh -
                    Đinh Lạc.
                  </p>
                </div>
              </div>
              <div className="relative opacity-60">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#B0BEB3] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-xs">inventory</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-[#172118]">
                      Bác nông dân nghiệm thu &amp; Hỗ trợ bốc xuống kho vườn
                    </span>
                    <span className="text-xs text-[#7A8A7C]">Dự kiến: Trước 11:00</span>
                  </div>
                  <p className="text-xs text-[#7A8A7C] mt-0.5">
                    Được đồng kiểm tra hàng, đối chiếu số bao phân và tem niêm phong thuốc trước khi
                    ký biên bản.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#E1E8E2] shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E8E2] mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0d631b] text-xl">person_pin_circle</span>
                <h2 className="font-bold text-base text-[#172118]">Thông tin giao nhận &amp; Địa chỉ vườn</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-[#EDF4EE] text-[#0d631b] text-xs font-semibold">Giao tận vườn</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-xs text-[#7A8A7C]">Người nhận hàng:</span>
                <span className="font-bold text-[#172118] text-base mt-0.5">Nguyễn Văn Hùng</span>
                <span className="text-xs text-[#465348] mt-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#2E7D32]">phone</span>
                  <strong>0918 234 567</strong> (Đã đăng ký nhận SMS lái xe)
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#7A8A7C]">Kho hàng xuất phát:</span>
                <span className="font-semibold text-[#172118] mt-0.5">Kho Trung Tâm Chi Nhánh Di Linh</span>
                <span className="text-xs text-[#7A8A7C]">142 Hùng Vương, TT. Di Linh, Tỉnh Lâm Đồng</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E1E8E2]/60">
              <span className="text-xs text-[#7A8A7C] block">Địa chỉ chi tiết &amp; Vị trí vườn cây:</span>
              <p className="font-medium text-[#172118] text-sm mt-1">
                Số 45 Thôn Tân Lạc (gần dốc ngã ba vườn sầu riêng Chú Năm), Xã Đinh Lạc, Huyện Di
                Linh, Tỉnh Lâm Đồng.
              </p>
            </div>
            <div className="mt-3 p-3 rounded-lg bg-[#FFF3E0] border border-[#FFE0B2] text-xs text-[#BF360C] flex items-start gap-2">
              <span className="material-symbols-outlined text-base mt-0.5 text-[#E65100]">local_shipping</span>
              <div>
                <strong className="font-semibold">Ghi chú cho lái xe tải AgriExpress:</strong>
                <p className="mt-0.5 text-[#7c2d12]">
                  "Đường bê tông xe tải 5 tấn vào được tận sân kho, vui lòng liên hệ Chú Năm trước
                  khi xuất bến 30 phút."
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#E1E8E2] shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E8E2] mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0d631b] text-xl">receipt_long</span>
                <h2 className="font-bold text-base text-[#172118]">Chứng từ &amp; Trạng thái thanh toán</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#1B5E20] text-xs font-bold uppercase">
                Đã quyết toán 100%
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#F5FBF4] border border-[#E1E8E2] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-white border border-[#E1E8E2] flex items-center justify-center p-2 text-[#0277BD]">
                  <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#7A8A7C]">Cổng thanh toán điện tử:</span>
                  <span className="font-bold text-[#172118] text-sm">Chuyển khoản VietQR / Napas 247</span>
                  <span className="text-xs text-[#465348]">Ngân hàng: Vietcombank - CN Lâm Đồng</span>
                </div>
              </div>
              <div className="text-right sm:border-l sm:border-[#E1E8E2] sm:pl-6 w-full sm:w-auto">
                <span className="text-xs text-[#7A8A7C] block">Số tiền đã chuyển:</span>
                <span className="font-mono text-xl font-extrabold text-[#0d631b]">2.600.000 đ</span>
                <span className="text-[11px] text-[#2E7D32] flex items-center justify-end gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-xs">check_circle</span> Hệ thống tự duyệt tức thì
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[#7A8A7C]">
              <span>
                Mã hóa đơn điện tử: <strong className="font-mono text-[#172118]">VAT-2024-AGR-09821</strong>
              </span>
              <a href="#" className="text-[#0d631b] font-semibold hover:underline flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">download</span> Tải hóa đơn đỏ điện tử (.PDF)
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-xl p-6 border border-[#E1E8E2] shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E8E2] mb-4">
              <h2 className="font-bold text-base text-[#172118]">Danh sách vật tư đặt mua (4 sản phẩm)</h2>
              <span className="font-mono text-xs text-[#7A8A7C]">Mã: #AGR-8842</span>
            </div>
            <div className="divide-y divide-[#E1E8E2]/70">
              {orderItems.map((item) => (
                <div key={item.name} className="py-3.5 flex items-start gap-3">
                  <div className="w-14 h-14 rounded-lg bg-[#EDF4EE] border border-[#E1E8E2] flex-shrink-0 flex items-center justify-center p-1 overflow-hidden">
                    <span className={`material-symbols-outlined text-2xl ${item.iconColor}`}>{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm text-[#172118] truncate">{item.name}</h3>
                      <span className="font-bold text-sm text-[#172118] whitespace-nowrap">{item.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#7A8A7C] mt-1">
                      <span>Quy cách: {item.spec}</span>
                      <span className="font-medium text-[#465348]">
                        Số lượng: <strong>{item.qty}</strong>
                      </span>
                    </div>
                    <span className={`inline-block mt-1 text-[11px] px-1.5 py-0.5 rounded font-medium ${item.tagClass}`}>
                      {item.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[#E1E8E2] space-y-2 text-xs">
              <div className="flex justify-between text-[#465348]">
                <span>Tạm tính (4 sản phẩm):</span>
                <span className="font-medium text-[#172118]">2.650.000 đ</span>
              </div>
              <div className="flex justify-between text-[#2E7D32]">
                <span>Giảm giá Voucher mùa vụ ("VUMUA2024"):</span>
                <span className="font-bold">-50.000 đ</span>
              </div>
              <div className="flex justify-between text-[#465348]">
                <span>Phí vận chuyển xe tải tận vườn:</span>
                <span className="font-semibold text-[#2E7D32] uppercase">MIỄN PHÍ</span>
              </div>
              <div className="flex justify-between text-[#7A8A7C]">
                <span>Thuế VAT (Hóa đơn điện tử):</span>
                <span>Đã bao gồm</span>
              </div>
              <div className="pt-3 border-t border-[#E1E8E2] flex items-baseline justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#172118]">Tổng tiền thanh toán:</span>
                  <span className="text-[11px] text-[#2E7D32]">Đã tiết kiệm 50.000 đ cho mùa vụ</span>
                </div>
                <span className="text-2xl font-extrabold text-[#0d631b] font-mono">2.600.000 đ</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1B5E20] to-[#0d631b] rounded-xl p-6 text-white shadow-md">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20">
                <span className="material-symbols-outlined text-2xl text-green-200">support_agent</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-green-200 uppercase tracking-wider">
                  Kỹ sư nông học phụ trách đơn
                </span>
                <h3 className="text-base font-bold mt-0.5">Kỹ sư Lâm Văn Thành (Lâm Đồng)</h3>
                <p className="text-xs text-green-100 mt-1 leading-relaxed">
                  Đã kiểm tra toa thuốc của Bác Hùng: Phối hợp Ridomil Gold &amp; Humic theo tỷ lệ
                  chuẩn cho vườn sầu riêng sau mưa. Cần hỗ trợ pha chế, vui lòng gọi miễn cước:
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <a
                    href="tel:19006828"
                    className="px-4 py-2 rounded-lg bg-white text-[#1B5E20] font-extrabold text-sm flex items-center gap-1.5 hover:bg-green-50 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-lg">call</span>
                    <span>1900 6828 (Phím 1)</span>
                  </a>
                  <span className="text-xs text-green-200">Tư vấn trực tiếp 24/7</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-[#E1E8E2] shadow-sm space-y-3 text-xs text-[#465348]">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-base text-[#2E7D32]">verified</span>
              <span>Cam kết 100% vật tư nông dược chính hãng, quét mã QR truy xuất nguồn gốc.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-base text-[#2E7D32]">autorenew</span>
              <span>Đổi trả miễn phí trong 7 ngày nếu bao bì bị rách bể do vận chuyển.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-base text-[#2E7D32]">psychology</span>
              <span>
                Được dùng miễn phí tính năng <strong>Bác sĩ AI quét lá nhận phác đồ</strong> trọn
                đời.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
