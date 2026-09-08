import { Link } from 'react-router-dom'

export default function SuccessHeroBanner() {
  return (
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
  )
}
