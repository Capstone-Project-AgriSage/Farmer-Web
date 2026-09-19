import { Link } from 'react-router-dom'

const steps = [
  { step: '1', title: 'Chụp ảnh lá lúa', desc: 'Chụp rõ vùng đốm bệnh, cháy bìa' },
  { step: '2', title: 'AI nhận diện sau 3s', desc: 'Nhận diện đạo ôn, bạc lá, khô vằn' },
  { step: '3', title: 'Phác đồ đại lý duyệt', desc: 'Kê đơn thuốc chính hãng Hai Thắng' },
]

export default function AiDiagnosisBanner() {
  return (
    <section className="w-full py-12 bg-white border-b border-border-subtle" id="ai-diagnosis">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-surface-subtle border border-emerald-200/60 p-6 sm:p-10 relative overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[15px]">psychology</span>
                <span>Bác Sĩ Cây Trồng AI</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                Chẩn đoán bệnh lúa qua ảnh chụp trong 3 giây
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed max-w-xl">
                Quét nhận diện 5 bệnh phổ biến trên lúa ĐBSCL. Hệ thống phân tích và gửi kết quả để đại lý kiểm tra trước khi gửi khuyến nghị thuốc cho bà con.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {steps.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-border-subtle shadow-2xs"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-text-primary">{item.title}</div>
                      <div className="text-[11px] text-text-muted mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col items-center justify-center bg-white p-6 rounded-2xl border border-border-subtle shadow-sm text-center space-y-3.5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[30px]">photo_camera</span>
              </div>
              <div>
                <h3 className="font-bold text-text-primary text-base">
                  Khám bệnh đồng ruộng
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Miễn phí 100% cho bà con nông dân
                </p>
              </div>
              <Link
                to="/ai-doctor"
                className="w-full py-2.5 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
                <span>Tải ảnh quét bệnh ngay</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
