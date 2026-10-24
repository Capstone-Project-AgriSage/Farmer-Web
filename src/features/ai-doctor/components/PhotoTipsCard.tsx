// Same advice as the Farmer app: the AI was trained on single close leaves, so a whole-plant photo is often UNCERTAIN.
const tips = [
  'Chụp một lá bệnh, để lá chiếm gần hết khung hình',
  'Chụp gần vết bệnh, không chụp cả cây hay cả ruộng',
  'Chụp dưới ánh sáng tự nhiên, tránh ngược sáng hoặc quá tối',
  'Giữ máy ổn định, lấy nét rõ vào vùng bị bệnh',
]

export default function PhotoTipsCard() {
  return (
    <div className="bg-brand-light border border-brand-dark/15 rounded-[var(--radius-surface)] p-6">
      <h4 className="text-[13px] uppercase tracking-[0.16em] text-text-secondary flex items-center gap-2">
        <span className="material-symbols-outlined text-primary-dark" style={{ fontSize: 20 }} aria-hidden="true">
          tips_and_updates
        </span>
        Mẹo chụp ảnh để AI nhận đúng bệnh
      </h4>
      <ul className="mt-4 space-y-3">
        {tips.map((tip, index) => (
          <li key={tip} className="flex items-start gap-3 text-[15px] text-text-primary leading-relaxed">
            <span className="shrink-0 w-6 h-6 rounded-full border border-brand-dark/30 text-[13px] flex items-center justify-center mt-0.5" aria-hidden="true">
              {index + 1}
            </span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  )
}
