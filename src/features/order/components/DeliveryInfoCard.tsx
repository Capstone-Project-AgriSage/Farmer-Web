export default function DeliveryInfoCard() {
  return (
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
          <span className="font-semibold text-[#172118] mt-0.5">Kho Đại lý Vật tư Hai Thắng</span>
          <span className="text-xs text-[#7A8A7C]">Thị trấn Thới Lai, Huyện Thới Lai, Cần Thơ</span>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-[#E1E8E2]/60">
        <span className="text-xs text-[#7A8A7C] block">Địa chỉ nhận hàng &amp; Vị trí ruộng lúa:</span>
        <p className="font-medium text-[#172118] text-sm mt-1">
          Ấp Thới Phước 1, Xã Tân Thạnh, Huyện Thới Lai, TP. Cần Thơ (Khu vực Kênh Xáng).
        </p>
      </div>
      <div className="mt-3 p-3 rounded-lg bg-[#FFF3E0] border border-[#FFE0B2] text-xs text-[#BF360C] flex items-start gap-2">
        <span className="material-symbols-outlined text-base mt-0.5 text-[#E65100]">local_shipping</span>
        <div>
          <strong className="font-semibold">Ghi chú giao vật tư ruộng lúa:</strong>
          <p className="mt-0.5 text-[#7c2d12]">
            "Giao phân bón và thuốc BVTV tận chòi ruộng lúa ST25, gọi điện thoại trước 15 phút để ra mở cổng đón ghe/xe."
          </p>
        </div>
      </div>
    </div>
  )
}
