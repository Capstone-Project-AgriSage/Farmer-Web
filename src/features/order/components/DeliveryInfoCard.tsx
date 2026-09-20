export default function DeliveryInfoCard() {
  return (
    <div className="bg-white border border-brand-dark/10 p-6">
      <div className="flex items-center justify-between pb-3 border-b border-brand-dark/10 mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-brand-green text-xl">person_pin_circle</span>
          <h2 className="font-helvetica-neue tracking-tight text-base text-brand-dark">
            Thông tin giao nhận &amp; Địa chỉ vườn
          </h2>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-brand-light text-brand-green text-xs tracking-wide uppercase">
          Giao tận vườn
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="flex flex-col">
          <span className="text-xs tracking-[0.15em] uppercase text-brand-dark/50">Người nhận hàng:</span>
          <span className="text-brand-dark text-base mt-0.5 font-helvetica-neue tracking-tight">
            Nguyễn Văn Hùng
          </span>
          <span className="text-xs text-brand-dark/60 mt-0.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-brand-green">phone</span>
            <strong className="text-brand-dark">0918 234 567</strong> (Đã đăng ký nhận SMS lái xe)
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs tracking-[0.15em] uppercase text-brand-dark/50">Kho hàng xuất phát:</span>
          <span className="text-brand-dark mt-0.5">Kho Đại lý Vật tư Hai Thắng</span>
          <span className="text-xs text-brand-dark/50">Thị trấn Thới Lai, Huyện Thới Lai, Cần Thơ</span>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-brand-dark/10">
        <span className="text-xs tracking-[0.15em] uppercase text-brand-dark/50 block">
          Địa chỉ nhận hàng &amp; Vị trí ruộng lúa:
        </span>
        <p className="text-brand-dark text-sm mt-1">
          Ấp Thới Phước 1, Xã Tân Thạnh, Huyện Thới Lai, TP. Cần Thơ (Khu vực Kênh Xáng).
        </p>
      </div>
      <div className="mt-3 p-3 bg-brand-light border border-brand-dark/10 text-xs text-brand-dark/70 flex items-start gap-2">
        <span className="material-symbols-outlined text-base mt-0.5 text-brand-green">local_shipping</span>
        <div>
          <strong className="text-brand-dark">Ghi chú giao vật tư ruộng lúa:</strong>
          <p className="mt-0.5 text-brand-dark/60">
            &quot;Giao phân bón và thuốc BVTV tận chòi ruộng lúa ST25, gọi điện thoại trước 15 phút để ra mở cổng đón ghe/xe.&quot;
          </p>
        </div>
      </div>
    </div>
  )
}
