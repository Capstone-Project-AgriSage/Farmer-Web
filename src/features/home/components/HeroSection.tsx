import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const suggestedKeywords = ['Beam 75WP', 'Đặc trị đạo ôn lá', 'Anvil 5SC trị khô vằn', 'Lúa giống ST25', 'Bạc lá vi khuẩn']

export default function HeroSection() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const query = searchTerm.trim()
    navigate(query ? `/products?q=${encodeURIComponent(query)}` : '/products')
  }

  return (
    <section className="relative w-full overflow-hidden text-white py-8 lg:py-14">
      <img
        alt=""
        aria-hidden="true"
        src="/images/misc/hero-rice-field.jpg"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay tints sampled from the photo's own corners (top ~#b1c8dd sky, bottom
          ~#2c4b0e field) instead of the brand green, so the scrim reads as the photo
          darkening naturally rather than a flat color sitting on top of it. */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#2c4b0e]/90 via-[#2c4b0e]/60 to-[#2c4b0e]/10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#b1c8dd]/20 via-transparent to-[#2c4b0e]/40"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl space-y-4 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] font-semibold text-emerald-200 backdrop-blur-[1px]">
            <span className="material-symbols-outlined text-[14px] text-emerald-300 animate-pulse">
              eco
            </span>
            <span>Nền tảng Nông nghiệp Số 4.0 Hàng Đầu Việt Nam</span>
          </div>
          <h1 className="font-brand text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Đồng hành cùng nhà nông nâng tầm năng suất &amp; Số hóa mùa vụ
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed font-normal max-w-2xl">
            Hệ sinh thái vật tư nông nghiệp chính hãng, bảo lãnh công nợ mùa vụ linh hoạt và
            trợ lý Trí tuệ Nhân tạo (AI) nhận diện bệnh hại cây trồng qua ảnh chụp tức thì.
          </p>
          <div className="pt-1">
            <form
              className="bg-white p-1.5 rounded-lg shadow-xl flex flex-col sm:flex-row items-center gap-1.5 border border-border-subtle max-w-2xl"
              onSubmit={handleSearchSubmit}
            >
              <div className="flex items-center flex-1 w-full px-2.5 gap-2">
                <span className="material-symbols-outlined text-[18px] text-text-muted">
                  search
                </span>
                <input
                  className="w-full text-sm text-text-primary placeholder:text-text-muted focus:outline-none bg-transparent py-1.5"
                  placeholder="Tìm phân bón, thuốc BVTV, hoạt chất hoặc bệnh cây..."
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="w-full sm:w-auto px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all shadow-sm flex-shrink-0"
                type="submit"
              >
                <span>Tìm kiếm</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </form>
            <div className="flex flex-wrap items-center gap-1.5 pt-2 text-[11px] text-emerald-100/80">
              <span className="font-medium text-emerald-200">Gợi ý tìm kiếm:</span>
              {suggestedKeywords.map((keyword) => (
                <Link
                  key={keyword}
                  to={`/products?q=${encodeURIComponent(keyword)}`}
                  className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors"
                >
                  {keyword}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <Link
              to="/products"
              className="px-4 py-2 bg-white text-primary-dark hover:bg-emerald-50 text-sm font-bold rounded-md shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">
                shopping_bag
              </span>
              <span>Khám phá sản phẩm ngay</span>
            </Link>
            <Link
              to="/ai-doctor"
              className="px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm font-semibold rounded-md backdrop-blur-[1px] transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px] text-emerald-300">
                photo_camera
              </span>
              <span>Bác sĩ cây trồng AI (Quét lá bệnh)</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
