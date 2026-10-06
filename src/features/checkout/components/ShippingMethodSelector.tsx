// Online orders are always delivered by the store: there is no choice of carrier, no express fee and no promised time slot in
// the API (the order total is the sum of its lines), so this step only explains what happens next.
export default function ShippingMethodSelector() {
  return (
    <div className="bg-white border border-brand-dark/10 p-5 sm:p-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-brand-dark/10 mb-4">
        <div className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center text-sm">
          2
        </div>
        <h2 className="text-base font-helvetica-neue tracking-tight text-brand-dark">
          Giao hàng
        </h2>
      </div>
      <div className="flex items-start justify-between gap-4 p-4 border border-brand-dark bg-brand-light">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-brand-green text-[22px]">local_shipping</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-dark">Đại lý Hai Thắng giao tận nơi</span>
              <span className="px-2 py-0.5 rounded-full bg-brand-dark text-white text-[10px] tracking-wide ">
                Miễn phí
              </span>
            </div>
            <p className="text-xs text-brand-dark/60 mt-1">
              Sau khi bác đặt hàng, đại lý xác nhận đơn rồi liên hệ để hẹn lịch giao. Bác theo dõi từng chuyến giao
              trong mục Đơn hàng.
            </p>
          </div>
        </div>
        <span className="text-xs text-brand-green sm:text-sm tracking-wide">0 đ</span>
      </div>
    </div>
  )
}
