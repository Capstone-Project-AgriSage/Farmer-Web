const orderItems = [
  {
    icon: 'medication',
    iconColor: 'text-[#2E7D32]',
    name: 'Thuốc trừ bệnh Ridomil Gold 68WG',
    spec: 'Gói 100g (Pha 40-50L)',
    qty: 'x5 gói',
    price: '240.000 đ',
    tag: 'Syngenta Thụy Sĩ',
    tagClass: 'bg-[#E8F5E9] text-[#1B5E20]',
  },
  {
    icon: 'compost',
    iconColor: 'text-[#E65100]',
    name: 'Đầu Trâu NPK 20-20-15+TE Nuôi Trái Lớn',
    spec: 'Bao 50kg (Chống ẩm)',
    qty: 'x2 bao',
    price: '1.840.000 đ',
    tag: 'Bình Điền • Có bốc xếp tận kho',
    tagClass: 'bg-[#FFF3E0] text-[#E65100]',
  },
  {
    icon: 'water_drop',
    iconColor: 'text-[#0277BD]',
    name: 'Kích Rễ King Root Humic 1L - Tái Sinh Rễ',
    spec: 'Chai 1L đậm đặc',
    qty: 'x3 chai',
    price: '375.000 đ',
    tag: 'Lộc Trời Group',
    tagClass: 'bg-[#E1F5FE] text-[#0277BD]',
  },
  {
    icon: 'pest_control',
    iconColor: 'text-[#2E7D32]',
    name: 'Thuốc trừ nấm bệnh Nativo 750WG',
    spec: 'Gói 120g (Thán thư & thối trái)',
    qty: 'x1 gói',
    price: '195.000 đ',
    tag: 'Bayer CropScience Đức',
    tagClass: 'bg-[#E8F5E9] text-[#1B5E20]',
  },
]

export default function OrderItemsSummaryCard() {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#E1E8E2] shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-[#E1E8E2] mb-4">
        <h2 className="font-bold text-base text-[#172118]">Danh sách vật tư đặt mua (4 sản phẩm)</h2>
        <span className="font-mono text-xs text-[#7A8A7C]">Mã: #AGR-8842</span>
      </div>
      <div className="divide-y divide-[#E1E8E2]/70">
        {orderItems.map((item) => (
          <div key={item.name} className="py-3.5 flex items-start gap-3">
            <div className="w-14 h-14 rounded-lg bg-[#EDF4EE] border border-[#E1E8E2] flex-shrink-0 flex items-center justify-center p-1 overflow-hidden">
              <span className={`material-symbols-outlined text-2xl ${item.iconColor}`}>{item.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-sm text-[#172118] truncate">{item.name}</h3>
                <span className="font-bold text-sm text-[#172118] whitespace-nowrap">{item.price}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#7A8A7C] mt-1">
                <span>Quy cách: {item.spec}</span>
                <span className="font-medium text-[#465348]">
                  Số lượng: <strong>{item.qty}</strong>
                </span>
              </div>
              <span className={`inline-block mt-1 text-[11px] px-1.5 py-0.5 rounded font-medium ${item.tagClass}`}>
                {item.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-[#E1E8E2] space-y-2 text-xs">
        <div className="flex justify-between text-[#465348]">
          <span>Tạm tính (4 sản phẩm):</span>
          <span className="font-medium text-[#172118]">2.650.000 đ</span>
        </div>
        <div className="flex justify-between text-[#2E7D32]">
          <span>Giảm giá Voucher mùa vụ ("VUMUA2024"):</span>
          <span className="font-bold">-50.000 đ</span>
        </div>
        <div className="flex justify-between text-[#465348]">
          <span>Phí vận chuyển xe tải tận vườn:</span>
          <span className="font-semibold text-[#2E7D32] uppercase">MIỄN PHÍ</span>
        </div>
        <div className="flex justify-between text-[#7A8A7C]">
          <span>Thuế VAT (Hóa đơn điện tử):</span>
          <span>Đã bao gồm</span>
        </div>
        <div className="pt-3 border-t border-[#E1E8E2] flex items-baseline justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[#172118]">Tổng tiền thanh toán:</span>
            <span className="text-[11px] text-[#2E7D32]">Đã tiết kiệm 50.000 đ cho mùa vụ</span>
          </div>
          <span className="text-2xl font-extrabold text-[#0d631b] font-mono">2.600.000 đ</span>
        </div>
      </div>
    </div>
  )
}
