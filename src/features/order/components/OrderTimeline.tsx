export default function OrderTimeline() {
  return (
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
  )
}
