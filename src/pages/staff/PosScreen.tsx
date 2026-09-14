function StaffCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: string
}) {
  return (
    <div className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-black uppercase tracking-wide text-text-muted">
            {title}
          </div>
          <div className="mt-3 text-2xl font-black text-text-primary">
            {value}
          </div>
        </div>
        <span className="material-symbols-outlined rounded-lg bg-primary-light p-2 text-[20px] text-primary">
          {icon}
        </span>
      </div>
    </div>
  )
}

export default function PosScreen() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <StaffCard title="Đơn đang mở" value="12" icon="point_of_sale" />
        <StaffCard title="Doanh thu ca" value="18.2tr" icon="payments" />
        <StaffCard title="Khách chờ tư vấn" value="6" icon="support_agent" />
        <StaffCard title="VietQR chờ khớp" value="3" icon="qr_code_2" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-black text-text-primary">
                Bàn làm việc POS
              </h1>
              <p className="mt-1 text-sm text-text-muted">
                Tạo đơn nhanh, quét sản phẩm, kiểm tồn kho và thu tiền tại
                quầy.
              </p>
            </div>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-black text-white">
              Tạo đơn mới
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
            <label className="flex items-center gap-2 rounded-lg border border-border-subtle bg-surface-subtle px-3 py-3">
              <span className="material-symbols-outlined text-[20px] text-primary">
                barcode_scanner
              </span>
              <input
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Quét mã vạch hoặc tìm sản phẩm..."
              />
            </label>
            <button className="rounded-lg border border-border-subtle px-4 py-3 text-sm font-black text-primary">
              Thêm khách hàng
            </button>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="border-y border-border-subtle bg-surface-subtle text-xs uppercase text-text-muted">
                <tr>
                  {["Sản phẩm", "Tồn", "Đơn giá", "SL", "Thành tiền"].map(
                    (h) => (
                      <th key={h} className="px-4 py-3">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {[
                  [
                    "Ridomil Gold 68WG",
                    "860 gói",
                    "48.000 đ",
                    "5",
                    "240.000 đ",
                  ],
                  [
                    "Đầu Trâu NPK 20-20-15",
                    "142 bao",
                    "920.000 đ",
                    "2",
                    "1.840.000 đ",
                  ],
                  [
                    "King Root Humic 1L",
                    "74 chai",
                    "125.000 đ",
                    "3",
                    "375.000 đ",
                  ],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) => (
                      <td
                        key={cell}
                        className={`px-4 py-4 ${
                          index === 0
                            ? "font-black text-primary"
                            : "font-bold text-text-secondary"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-border-subtle bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-text-primary">
            Thanh toán nhanh
          </h2>
          <div className="mt-5 rounded-xl bg-primary-light p-4 text-center">
            <div className="text-xs font-black uppercase text-text-muted">
              Tổng tạm tính
            </div>
            <div className="mt-2 text-3xl font-black text-primary">
              2.455.000 đ
            </div>
            <div className="mt-1 text-xs text-primary">
              Đã áp dụng voucher mùa vụ
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            <button className="rounded-lg bg-primary px-4 py-3 text-sm font-black text-white">
              Thu VietQR
            </button>
            <button className="rounded-lg border border-border-subtle px-4 py-3 text-sm font-black text-primary">
              Ghi sổ AgriCredit
            </button>
            <button className="rounded-lg border border-border-subtle px-4 py-3 text-sm font-black text-text-secondary">
              In phiếu bán hàng
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
