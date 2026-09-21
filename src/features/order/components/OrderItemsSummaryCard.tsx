const orderItems = [
  {
    icon: 'medication',
    iconColor: 'text-brand-green',
    name: 'Thuốc trừ đạo ôn Beam 75WP',
    spec: 'Gói 100g (Pha bình 25L)',
    qty: 'x5 gói',
    price: '240.000 đ',
    tag: 'Đặc trị đạo ôn lá & cổ bông',
    tagClass: 'bg-brand-light text-brand-green',
  },
  {
    icon: 'compost',
    iconColor: 'text-brand-dark/60',
    name: 'Phân NPK Đầu Trâu 20-20-15+TE',
    spec: 'Bao 50kg',
    qty: 'x2 bao',
    price: '1.450.000 đ',
    tag: 'Bình Điền • Bón đòng lúa ST25',
    tagClass: 'bg-brand-cream text-brand-dark/70 border border-brand-dark/10',
  },
  {
    icon: 'medication',
    iconColor: 'text-brand-green',
    name: 'Thuốc trừ bệnh Map Lotus 125WP',
    spec: 'Gói 100g',
    qty: 'x3 gói',
    price: '270.000 đ',
    tag: 'Map Pacific • Trị đạo ôn lá',
    tagClass: 'bg-brand-light text-brand-dark/70',
  },
  {
    icon: 'science',
    iconColor: 'text-brand-green',
    name: 'Phân Urê Cà Mau (Đạm hạt trong)',
    spec: 'Bao 50kg',
    qty: 'x1 bao',
    price: '640.000 đ',
    tag: 'Đạm Cà Mau • Bón đẻ nhánh',
    tagClass: 'bg-brand-light text-brand-green',
  },
]

export default function OrderItemsSummaryCard() {
  return (
    <div className="bg-white border border-brand-dark/10 p-6">
      <div className="flex items-center justify-between pb-3 border-b border-brand-dark/10 mb-4">
        <h2 className="font-helvetica-neue tracking-tight text-base text-brand-dark">
          Danh sách vật tư đặt mua (4 sản phẩm)
        </h2>
        <span className="font-mono text-xs text-brand-dark/40">Mã: #DH-2024-8842</span>
      </div>
      <div className="divide-y divide-brand-dark/10">
        {orderItems.map((item) => (
          <div key={item.name} className="py-3.5 flex items-start gap-3">
            <div className="w-14 h-14 bg-brand-cream border border-brand-dark/10 flex-shrink-0 flex items-center justify-center p-1 overflow-hidden">
              <span className={`material-symbols-outlined text-2xl ${item.iconColor}`}>{item.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm text-brand-dark truncate">{item.name}</h3>
                <span className="text-sm text-brand-dark whitespace-nowrap">{item.price}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-brand-dark/50 mt-1">
                <span>Quy cách: {item.spec}</span>
                <span className="text-brand-dark/60">
                  Số lượng: <strong className="text-brand-dark">{item.qty}</strong>
                </span>
              </div>
              <span className={`inline-block mt-1 text-[11px] px-1.5 py-0.5 tracking-wide ${item.tagClass}`}>
                {item.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-brand-dark/10 space-y-2 text-xs">
        <div className="flex justify-between text-brand-dark/60">
          <span>Tạm tính (4 sản phẩm):</span>
          <span className="text-brand-dark">2.650.000 đ</span>
        </div>
        <div className="flex justify-between text-brand-green">
          <span>Giảm giá Voucher mùa vụ (&quot;VUMUA2024&quot;):</span>
          <span>-50.000 đ</span>
        </div>
        <div className="flex justify-between text-brand-dark/60">
          <span>Phí vận chuyển xe tải tận vườn:</span>
          <span className="text-brand-green uppercase tracking-wide">Miễn phí</span>
        </div>
        <div className="flex justify-between text-brand-dark/40">
          <span>Thuế VAT (Hóa đơn điện tử):</span>
          <span>Đã bao gồm</span>
        </div>
        <div className="pt-3 border-t border-brand-dark/10 flex items-baseline justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-helvetica-neue tracking-tight text-brand-dark">
              Tổng tiền thanh toán:
            </span>
            <span className="text-[11px] text-brand-green">Đã tiết kiệm 50.000 đ cho mùa vụ</span>
          </div>
          <span className="text-2xl font-helvetica-neue tracking-tight text-brand-dark font-mono">
            2.600.000 đ
          </span>
        </div>
      </div>
    </div>
  )
}
