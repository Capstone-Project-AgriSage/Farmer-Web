const tips = [
  'Chụp cận cảnh vùng lá/cành/rễ có dấu hiệu bất thường rõ nhất',
  'Chụp dưới ánh sáng tự nhiên, tránh ngược sáng hoặc quá tối',
  'Giữ máy ổn định, lấy nét rõ vào vùng bị bệnh',
]

export default function PhotoTipsCard() {
  return (
    <div className="bg-brand-light border border-brand-dark/10 p-5 space-y-3">
      <h4 className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 flex items-center gap-1.5">
        <span className="material-symbols-outlined text-brand-green text-[18px]">tips_and_updates</span>
        <span>Mẹo chụp ảnh chuẩn xác</span>
      </h4>
      <ul className="space-y-2 text-xs text-brand-dark/60">
        {tips.map((tip) => (
          <li key={tip} className="flex items-start gap-2">
            <span className="material-symbols-outlined text-brand-green text-[16px] flex-shrink-0">
              check_circle
            </span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
