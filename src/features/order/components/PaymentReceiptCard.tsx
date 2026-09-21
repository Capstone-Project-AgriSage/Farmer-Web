export default function PaymentReceiptCard() {
  return (
    <div className="bg-white border border-brand-dark/10 p-6">
      <div className="flex items-center justify-between pb-3 border-b border-brand-dark/10 mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-brand-green text-xl">receipt_long</span>
          <h2 className="font-helvetica-neue tracking-tight text-base text-brand-dark">
            Chứng từ &amp; Trạng thái thanh toán
          </h2>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-brand-light text-brand-dark/70 text-xs tracking-wide uppercase flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse"></span>
          Chờ đại lý Hai Thắng đối soát VietQR
        </span>
      </div>
      <div className="p-4 bg-brand-cream border border-brand-dark/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white border border-brand-dark/10 flex items-center justify-center p-2 text-brand-green">
            <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs tracking-[0.15em] uppercase text-brand-dark/50">
              Tài khoản thụ hưởng đại lý:
            </span>
            <span className="text-brand-dark text-sm">NGUYEN VAN THANG · 19006828999</span>
            <span className="text-xs text-brand-dark/60">Vietcombank - Chi nhánh Cần Thơ (PGD Thới Lai)</span>
          </div>
        </div>
        <div className="text-right sm:border-l sm:border-brand-dark/10 sm:pl-6 w-full sm:w-auto">
          <span className="text-xs tracking-[0.15em] uppercase text-brand-dark/50 block">
            Số tiền thanh toán:
          </span>
          <span className="font-mono text-xl font-helvetica-neue tracking-tight text-brand-dark">
            2.600.000 đ
          </span>
          <span className="text-[11px] text-brand-dark/50 flex items-center justify-end gap-1 mt-0.5">
            <span className="material-symbols-outlined text-xs">schedule</span> Đại lý sẽ xác nhận sau khi nhận tiền
          </span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-brand-dark/50">
        <span>
          Mã hóa đơn điện tử: <strong className="font-mono text-brand-dark">VAT-2024-AGR-09821</strong>
        </span>
        <a href="#" className="text-brand-green hover:text-brand-dark transition-colors tracking-wide uppercase flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">download</span> Tải hóa đơn đỏ điện tử (.PDF)
        </a>
      </div>
    </div>
  )
}
