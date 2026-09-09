import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { handleImageError } from '../../../utils/image'

const suggestedKeywords = ['NPK 20-20-15', 'Trừ thán thư sầu riêng', 'Ridomil Gold', 'Tuyến trùng cà phê']

export default function HeroSection() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const query = searchTerm.trim()
    navigate(query ? `/products?q=${encodeURIComponent(query)}` : '/products')
  }

  return (
    <section className="relative w-full bg-gradient-to-b from-primary-dark via-[#1a5b22] to-primary overflow-hidden text-white py-12 lg:py-20">
      <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
      <div className="absolute left-1/3 -bottom-20 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-emerald-200 backdrop-blur-[1px]">
              <span className="material-symbols-outlined text-[16px] text-emerald-300 animate-pulse">
                eco
              </span>
              <span>Nền tảng Nông nghiệp Số 4.0 Hàng Đầu Việt Nam</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-white">
              Đồng hành cùng nhà nông nâng tầm năng suất &amp; Số hóa mùa vụ
            </h1>
            <p className="text-emerald-100/90 text-base sm:text-lg leading-relaxed font-normal max-w-2xl">
              Hệ sinh thái vật tư nông nghiệp chính hãng, bảo lãnh công nợ mùa vụ linh hoạt và
              trợ lý Trí tuệ Nhân tạo (AI) nhận diện bệnh hại cây trồng qua ảnh chụp tức thì.
            </p>
            <div className="pt-2">
              <form
                className="bg-white p-2 rounded-xl shadow-xl flex flex-col sm:flex-row items-center gap-2 border border-border-subtle max-w-2xl"
                onSubmit={handleSearchSubmit}
              >
                <div className="flex items-center flex-1 w-full px-3 gap-2">
                  <span className="material-symbols-outlined text-[22px] text-text-muted">
                    search
                  </span>
                  <input
                    className="w-full text-sm text-text-primary placeholder:text-text-muted focus:outline-none bg-transparent py-2"
                    placeholder="Tìm phân bón, thuốc BVTV, hoạt chất hoặc bệnh cây..."
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm flex-shrink-0"
                  type="submit"
                >
                  <span>Tìm kiếm</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </form>
              <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-emerald-100/80">
                <span className="font-medium text-emerald-200">Gợi ý tìm kiếm:</span>
                {suggestedKeywords.map((keyword) => (
                  <Link
                    key={keyword}
                    to={`/products?q=${encodeURIComponent(keyword)}`}
                    className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors"
                  >
                    {keyword}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/products"
                className="px-6 py-3 bg-white text-primary-dark hover:bg-emerald-50 text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px] text-primary">
                  shopping_bag
                </span>
                <span>Khám phá sản phẩm ngay</span>
              </Link>
              <Link
                to="/ai-doctor"
                className="px-6 py-3 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm font-semibold rounded-lg backdrop-blur-[1px] transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px] text-emerald-300">
                  photo_camera
                </span>
                <span>Bác sĩ cây trồng AI (Quét lá bệnh)</span>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-primary-dark/80 group">
              <img
                alt="Đồng hành cùng nhà nông mùa vụ"
                className="w-full h-80 sm:h-96 object-cover transform scale-105 group-hover:scale-100 transition-transform duration-700 brightness-90"
                src="https://lh3.googleusercontent.com/aida/AEtjO1XGezutwBLujRfYYW-Oq6ctBIapuCwRvY30-mP-XpcHzfzN7wBQeDVLZdeim9H7kj9EprfP5hiU2nLcLyKAds_HQRuePA4DT_1x7K6ofveh7v1TTLK-IoCAbKulEm0z8StHrLQWLK_F-VbNXV4G2nQJOGwbMU8YjrcJcCoKq2mrskEC_d1Fq6XxL0Sut3ouArJ14wPGJlLJ_AlQ7pKrIlRlLPhl1YsFBxjGuqFANU0NE_ZNXVA8zcnkCbjs"
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/40 to-transparent"></div>
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-border-subtle flex items-center gap-2.5 text-text-primary">
                <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-primary">98% AI chính xác</div>
                  <div className="text-[10px] text-text-muted">Chẩn đoán hơn 120 bệnh</div>
                </div>
              </div>
              <div className="absolute bottom-20 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-border-subtle flex items-center gap-2.5 text-text-primary">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-primary-dark">
                  <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-text-primary">Giao vật tư tận vườn</div>
                  <div className="text-[10px] text-text-muted">Nhanh chóng trong 2-4h</div>
                </div>
              </div>
              <div className="absolute bottom-4 inset-x-4 bg-primary/90 backdrop-blur-md p-3 rounded-xl border border-white/20 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-emerald-300 text-[22px]">
                    credit_score
                  </span>
                  <div>
                    <div className="text-xs font-bold text-white">
                      Bảo lãnh công nợ mùa vụ
                    </div>
                    <div className="text-[11px] text-emerald-100/90">
                      Hạn mức lên tới 200 triệu / nhà vườn
                    </div>
                  </div>
                </div>
                <span className="material-symbols-outlined text-emerald-300 text-[18px]">
                  chevron_right
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
