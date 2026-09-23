const tips = [
  'Chụp cận cảnh vùng lá/cành/rễ có dấu hiệu bất thường rõ nhất',
  'Chụp dưới ánh sáng tự nhiên, tránh ngược sáng hoặc quá tối',
  'Giữ máy ổn định, lấy nét rõ vào vùng bị bệnh',
]

export default function PhotoTipsCard() {
  return (
    <div className="bg-amber-50 border border-amber-200 border-l-4 border-l-amber-500 p-5 space-y-3">
      <h4 className="text-xs tracking-[0.25em] uppercase text-amber-900 flex items-center gap-1.5">
        <span className="material-symbols-outlined text-amber-600 text-[18px]">tips_and_updates</span>
        <span>Mẹo chụp ảnh chuẩn xác</span>
      </h4>
      <ul className="space-y-2 text-xs text-amber-950/75">
        {tips.map((tip) => (
          <li key={tip} className="flex items-start gap-2">
            <span className="material-symbols-outlined text-amber-600 text-[16px] flex-shrink-0">
              check_circle
            </span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
