import { Link } from 'react-router-dom'

const steps = [
  ['Chụp ảnh cây trồng', 'Chụp rõ nét vị trí lá đốm, cháy bìa hay rễ thối'],
  ['AI phân tích mẫu', 'Nhận diện chủng nấm, sâu bệnh hại và mức độ'],
  ['Nhận phác đồ ngay', 'Kê đơn thuốc chính xác & chỉ định cách phun'],
]

export default function AiDiagnosisBanner() {
  return (
    <section className="w-full py-12 bg-white border-b border-border-subtle" id="ai-diagnosis">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-surface-subtle via-emerald-50/50 to-surface-secondary border border-primary/20 p-6 sm:p-10 relative overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">psychology</span>
                <span>Đột phá Trí Tuệ Nhân Tạo</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                Bác sĩ cây trồng AI - Chẩn đoán bệnh trong 3 giây
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed max-w-2xl">
                Không còn lo lắng cây trồng suy thoái. Chỉ cần chụp ảnh vùng lá, cành hoặc rễ bị
                tổn thương, hệ thống AI của AgriSage sẽ lập tức phân tích mầm bệnh và gợi ý đơn
                thuốc điều trị chuẩn xác.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
                {steps.map(([title, desc], i) => (
                  <div
                    key={title}
                    className="flex items-start gap-3 p-3 bg-white rounded-xl border border-border-subtle shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-text-primary">{title}</div>
                      <div className="text-[11px] text-text-muted mt-0.5">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col items-center justify-center bg-white p-6 rounded-xl border border-border-subtle shadow-md text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-primary ring-8 ring-primary-light/50">
                <span className="material-symbols-outlined text-[32px]">document_scanner</span>
              </div>
              <div>
                <h3 className="font-bold text-text-primary text-base">
                  Bắt đầu khám bệnh cho vườn
                </h3>
                <p className="text-xs text-text-muted mt-1">
                  Hoàn toàn miễn phí cho bà con nông dân
                </p>
              </div>
              <Link
                to="/ai-doctor"
                className="w-full py-3 px-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
                <span>Tải ảnh quét bệnh ngay</span>
              </Link>
              <div className="text-[11px] text-text-muted pt-1 flex items-center gap-1.5 justify-center">
                <span className="w-2 h-2 rounded-full bg-status-success"></span>
                <span>Vừa chẩn đoán: Sầu riêng đốm mắt cua (Lâm Đồng)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
