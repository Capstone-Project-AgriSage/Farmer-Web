import { Link } from 'react-router-dom'

export default function SuccessHeroBanner() {
  return (
    <div className="bg-white border border-brand-dark/10 p-6 sm:p-8 text-center mb-8 relative overflow-hidden">
      <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-brand-light pointer-events-none"></div>
      <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-brand-cream pointer-events-none"></div>
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-brand-light text-brand-green flex items-center justify-center mb-4 border border-brand-dark/10">
          <span className="material-symbols-outlined text-5xl">check_circle</span>
        </div>
        <span className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-3">
          Xác nhận thành công • Đã ghi nhận vào kho Hai Thắng (Thới Lai)
        </span>
        <h1 className="text-2xl sm:text-3xl font-helvetica-neue tracking-tight text-brand-dark">
          Cảm ơn Bác nông dân Nguyễn Văn Hùng!
        </h1>
        <p className="text-sm sm:text-base text-brand-dark/60 mt-2 leading-relaxed">
          Đơn hàng <strong className="text-brand-dark font-mono text-base">#DH-2024-8842</strong> của
          Bác đã được tiếp nhận thành công trên hệ sinh thái AgriSage. Bộ phận kho vận đang xuất
          bao bì và chuẩn bị điều phương tiện giao vật tư đến tận bờ ruộng lúa.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-6 pt-6 border-t border-brand-dark/10">
          <div className="bg-brand-cream p-3 border border-brand-dark/10 text-left">
            <span className="text-[11px] tracking-[0.15em] uppercase text-brand-dark/50 block">Mã đơn hàng</span>
            <span className="font-mono text-sm text-brand-dark">#DH-2024-8842</span>
          </div>
          <div className="bg-brand-cream p-3 border border-brand-dark/10 text-left">
            <span className="text-[11px] tracking-[0.15em] uppercase text-brand-dark/50 block">Tổng thanh toán</span>
            <span className="text-sm text-brand-dark">2.600.000 đ</span>
          </div>
          <div className="bg-brand-cream p-3 border border-brand-dark/10 text-left">
            <span className="text-[11px] tracking-[0.15em] uppercase text-brand-dark/50 block">Phương thức</span>
            <span className="text-sm text-brand-dark flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-brand-green">qr_code_2</span> VietQR Napas
            </span>
          </div>
          <div className="bg-brand-cream p-3 border border-brand-dark/10 text-left">
            <span className="text-[11px] tracking-[0.15em] uppercase text-brand-dark/50 block">Dự kiến giao</span>
            <span className="text-sm text-brand-green">Sáng mai (trước 11h)</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-full border border-brand-dark/20 bg-white hover:bg-brand-light text-brand-dark text-xs tracking-wide uppercase flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-lg text-brand-dark/60">print</span>
            <span>In phiếu giao nhận &amp; hóa đơn</span>
          </button>
          <a
            href="#"
            className="px-5 py-2.5 rounded-full bg-brand-dark text-white hover:bg-brand-green text-xs tracking-wide uppercase flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">local_shipping</span>
            <span>Theo dõi xe giao hàng</span>
          </a>
          <Link
            to="/products"
            className="px-5 py-2.5 rounded-full border border-brand-dark text-brand-dark hover:bg-brand-light text-xs tracking-wide uppercase flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">storefront</span>
            <span>Tiếp tục mua hàng</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
