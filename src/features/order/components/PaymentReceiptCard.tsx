export default function PaymentReceiptCard() {
  return (
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
  )
}
