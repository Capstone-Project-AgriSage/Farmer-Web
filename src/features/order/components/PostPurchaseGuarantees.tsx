const guarantees = [
  ['verified', 'Cam kết 100% vật tư nông dược chính hãng, quét mã QR truy xuất nguồn gốc.'],
  ['autorenew', 'Đổi trả miễn phí trong 7 ngày nếu bao bì bị rách bể do vận chuyển.'],
]

export default function PostPurchaseGuarantees() {
  return (
    <div className="bg-white rounded-xl p-5 border border-[#E1E8E2] shadow-sm space-y-3 text-xs text-[#465348]">
      {guarantees.map(([icon, text]) => (
        <div key={text} className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-base text-[#2E7D32]">{icon}</span>
          <span>{text}</span>
        </div>
      ))}
      <div className="flex items-center gap-2.5">
        <span className="material-symbols-outlined text-base text-[#2E7D32]">psychology</span>
        <span>
          Được dùng miễn phí tính năng <strong>Bác sĩ AI quét lá nhận phác đồ</strong> trọn
          đời.
        </span>
      </div>
    </div>
  )
}
