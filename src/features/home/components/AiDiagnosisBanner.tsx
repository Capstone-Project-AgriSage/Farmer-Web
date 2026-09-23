import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const steps = [
  { step: '01', title: 'Chụp ảnh lá lúa', desc: 'Chụp rõ vùng đốm bệnh, cháy bìa' },
  { step: '02', title: 'AI nhận diện sau 3s', desc: 'Nhận diện đạo ôn, bạc lá, khô vằn' },
  { step: '03', title: 'Phác đồ đại lý duyệt', desc: 'Kê đơn thuốc chính hãng Hai Thắng' },
]

export default function AiDiagnosisBanner() {
  return (
    <section className="w-full py-16 md:py-20 bg-brand-cream" id="ai-diagnosis">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-7 space-y-5">
            <p className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 font-helvetica-neue">
              Bác sĩ cây trồng AI
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-brand-dark tracking-tight leading-[1.15] font-helvetica-neue max-w-xl">
              Chẩn đoán bệnh lúa qua ảnh chụp trong 3 giây
            </h2>
            <p className="text-brand-dark/65 text-base leading-relaxed max-w-xl font-helvetica-neue">
              Quét nhận diện bệnh phổ biến trên lúa ĐBSCL. Hệ thống đề xuất phác đồ điều trị được
              thẩm định bởi kỹ sư nông học Đại lý Hai Thắng.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-brand-dark/10">
              {steps.map((item) => (
                <div key={item.title} className="pt-4">
                  <div className="text-xs tracking-[0.2em] text-brand-dark/40 font-helvetica-neue mb-2">
                    {item.step}
                  </div>
                  <div className="text-sm font-medium text-brand-dark mb-1">{item.title}</div>
                  <div className="text-sm text-brand-dark/55 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center bg-brand-green rounded-lg p-8 md:p-10 space-y-5">
            <p className="text-xs tracking-[0.25em] uppercase text-white/60 font-helvetica-neue">
              Khám bệnh đồng ruộng
            </p>
            <h3 className="text-xl md:text-2xl text-white tracking-tight font-helvetica-neue leading-snug">
              Miễn phí 100% cho bà con nông dân
            </h3>
            <p className="text-sm text-white/75 leading-relaxed">
              Chỉ cần một tấm ảnh lá lúa — nhận phác đồ và gợi ý thuốc chính hãng ngay trên điện thoại.
            </p>
            <Link
              to="/ai-doctor"
              className="inline-flex items-center justify-center gap-2 self-start mt-2 px-7 py-3 bg-white text-brand-green text-sm tracking-wide uppercase rounded-full hover:bg-brand-light transition-colors"
            >
              Tải ảnh quét bệnh
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
