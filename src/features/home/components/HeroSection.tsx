import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'

const RicePlantScene = lazy(() => import('./RicePlantScene'))

const suggestedKeywords = ['NPK 20-20-15', 'Trừ thán thư sầu riêng', 'Ridomil Gold', 'Tuyến trùng cà phê']

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[calc(100vh-4rem)] lg:min-h-[640px] bg-gradient-to-br from-primary-dark via-[#1a5b22] to-primary overflow-visible text-white">
      <div className="absolute -left-32 top-1/4 w-[28rem] h-[28rem] rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-[36rem] h-[36rem] rounded-full bg-white/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center min-h-[calc(100vh-4rem)] lg:min-h-[640px] py-12 lg:py-16">
          <div className="lg:col-span-6 xl:col-span-5 space-y-6 text-left relative z-10">
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-emerald-200/90 uppercase">
              Nền tảng nông nghiệp số · AgriSage
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold tracking-tight leading-[1.15] text-white">
              Đồng hành cùng nhà nông nâng tầm năng suất
            </h1>
            <p className="text-emerald-100/85 text-base sm:text-lg leading-relaxed max-w-xl">
              Hệ sinh thái vật tư chính hãng, bảo lãnh công nợ mùa vụ và trợ lý AI nhận diện
              bệnh hại cây trồng qua ảnh chụp.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/products"
                className="px-6 py-3 bg-white text-primary-dark hover:bg-emerald-50 text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Khám phá sản phẩm
              </Link>
              <Link
                to="/ai-doctor"
                className="px-6 py-3 bg-transparent hover:bg-white/10 border border-white/30 text-white text-sm font-semibold rounded-lg transition-all"
              >
                Bác sĩ cây trồng AI
              </Link>
            </div>

            <form
              className="bg-white/95 p-1.5 rounded-xl shadow-xl flex flex-col sm:flex-row items-center gap-2 border border-white/20 max-w-xl mt-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex items-center flex-1 w-full px-3 gap-2">
                <span className="material-symbols-outlined text-[22px] text-text-muted">
                  search
                </span>
                <input
                  className="w-full text-sm text-text-primary placeholder:text-text-muted focus:outline-none bg-transparent py-2"
                  placeholder="Tìm phân bón, thuốc BVTV, bệnh cây..."
                  type="text"
                />
              </div>
              <button
                className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all flex-shrink-0"
                type="submit"
              >
                <span>Tìm kiếm</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-100/75">
              <span className="font-medium text-emerald-200/90">Gợi ý:</span>
              {suggestedKeywords.map((keyword) => (
                <Link
                  key={keyword}
                  to="/products"
                  className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors"
                >
                  {keyword}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 xl:col-span-7 relative h-[420px] sm:h-[420px] lg:h-[560px] xl:h-[600px] -mx-4 sm:mx-0">
            <div className="absolute inset-0 lg:scale-120 lg:translate-x-6 xl:translate-x-10 pointer-events-none lg:pointer-events-auto">
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-25 h-16 rounded-full border-2 border-emerald-200/30 border-t-emerald-200 animate-spin" />
                  </div>
                }
              >
                <RicePlantScene />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
