const guarantees = [
  ['verified', 'Cam kết 100% vật tư nông dược chính hãng, quét mã QR truy xuất nguồn gốc.'],
  ['autorenew', 'Đổi trả miễn phí trong 7 ngày nếu bao bì bị rách bể do vận chuyển.'],
]

export default function PostPurchaseGuarantees() {
  return (
    <div className="bg-white border border-brand-dark/10 p-5 space-y-3 text-xs text-brand-dark/60">
      {guarantees.map(([icon, text]) => (
        <div key={text} className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-base text-brand-green">{icon}</span>
          <span>{text}</span>
        </div>
      ))}
      <div className="flex items-center gap-2.5">
        <span className="material-symbols-outlined text-base text-brand-green">psychology</span>
        <span>
          Được dùng miễn phí tính năng <strong className="text-brand-dark">Bác sĩ AI quét lá nhận phác đồ</strong> trọn
          đời.
        </span>
      </div>
    </div>
  )
}
