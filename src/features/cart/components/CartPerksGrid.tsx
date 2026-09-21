const perks: [string, string, string][] = [
  ['local_shipping', 'Giao xe tải tận vườn', 'Miễn phí cho đơn từ 2.000.000 đ'],
  ['assignment_return', 'Đổi trả miễn phí 7 ngày', 'Bao đổi bao bể vỡ do vận chuyển'],
  ['inventory_2', 'Hỗ trợ bốc dỡ kho bãi', 'Nhân viên khiêng xếp vào kho vườn'],
]

export default function CartPerksGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      {perks.map(([icon, title, desc]) => (
        <div
          key={title}
          className="p-3.5 bg-brand-light border border-brand-dark/10 flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-full bg-white text-brand-dark/70 flex items-center justify-center flex-shrink-0 border border-brand-dark/10">
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
          </div>
          <div className="text-xs">
            <div className="font-helvetica-neue tracking-tight text-brand-dark">{title}</div>
            <div className="text-brand-dark/50 text-[11px]">{desc}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
