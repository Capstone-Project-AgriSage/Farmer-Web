export default function OrderTimeline() {
  return (
    <div className="bg-white border border-brand-dark/10 p-6">
      <div className="flex items-center justify-between pb-4 border-b border-brand-dark/10 mb-5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-brand-green text-xl">route</span>
          <h2 className="font-helvetica-neue tracking-tight text-base text-brand-dark">
            Lộ trình giao hàng vật tư AgriExpress
          </h2>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-brand-light text-brand-green text-xs tracking-wide uppercase flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span> Đang xử lý tại kho
        </span>
      </div>
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-brand-dark/15">
        <div className="relative">
          <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-brand-dark text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-xs">check</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-dark">
                Đơn hàng được khởi tạo &amp; Đã duyệt thanh toán VietQR
              </span>
              <span className="text-xs font-mono text-brand-dark/40">Hôm nay, 14:32</span>
            </div>
            <p className="text-xs text-brand-dark/60 mt-1">
              Hệ thống đã khớp giao dịch 2.600.000 đ từ Vietcombank Napas247, mã GD:{' '}
              <span className="font-mono text-brand-dark">VCB-998271</span>.
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-brand-green text-white flex items-center justify-center ring-4 ring-brand-light">
            <span className="material-symbols-outlined text-xs animate-spin">sync</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-green">
                Kho Hai Thắng (Thới Lai) đang bốc xếp vật tư &amp; niêm phong lô
              </span>
              <span className="text-xs font-mono text-brand-green">Đang tiến hành</span>
            </div>
            <p className="text-xs text-brand-dark/60 mt-1">
              Nhân viên kho đang kiểm tra tem QR chống giả, bao bì lúa giống và hạn dùng thuốc BVTV lúa.
            </p>
          </div>
        </div>
        <div className="relative opacity-60">
          <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full border border-brand-dark/20 bg-brand-cream text-brand-dark/50 flex items-center justify-center">
            <span className="material-symbols-outlined text-xs">local_shipping</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-dark">
                Điều xe tải giao vật tư nông nghiệp tận bờ ruộng
              </span>
              <span className="text-xs text-brand-dark/40">Dự kiến: 07:30 sáng mai</span>
            </div>
            <p className="text-xs text-brand-dark/50 mt-0.5">
              Tài xế Nguyễn Văn Lực (SĐT: 0984 112 345) phụ trách lộ trình tuyến Kênh Xáng - Thới Lai.
            </p>
          </div>
        </div>
        <div className="relative opacity-60">
          <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full border border-brand-dark/20 bg-brand-cream text-brand-dark/50 flex items-center justify-center">
            <span className="material-symbols-outlined text-xs">inventory</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-dark">
                Bác nông dân nghiệm thu &amp; Hỗ trợ bốc xuống kho vườn
              </span>
              <span className="text-xs text-brand-dark/40">Dự kiến: Trước 11:00</span>
            </div>
            <p className="text-xs text-brand-dark/50 mt-0.5">
              Được đồng kiểm tra hàng, đối chiếu số bao phân và tem niêm phong thuốc trước khi
              ký biên bản.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
