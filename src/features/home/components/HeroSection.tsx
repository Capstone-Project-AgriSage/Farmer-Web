import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function HeroSection() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const query = searchTerm.trim()
    navigate(query ? `/products?q=${encodeURIComponent(query)}` : '/products')
  }

  return (
    <section className="relative w-full overflow-hidden text-white py-12 lg:py-16">
      <img
        alt=""
        aria-hidden="true"
        src="/images/misc/hero-rice-field.jpg"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1c3809]/95 via-[#23460c]/80 to-[#2c4b0e]/30"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl space-y-4 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-emerald-200 backdrop-blur-sm">
            <span className="material-symbols-outlined text-[15px] text-emerald-300">
              eco
            </span>
            <span>Vụ Đông Xuân 2025 • Đại Lý Hai Thắng Liên Kết</span>
          </div>

          <h1 className="font-brand text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug text-white">
            Vật Tư Nông Nghiệp Chính Hãng &amp; Bác Sĩ Cây Trồng AI
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed font-normal max-w-xl">
            Cung cấp phân bón, thuốc BVTV chuẩn VietGAP, hỗ trợ bảo lãnh công nợ mùa vụ 0% lãi suất và chẩn đoán bệnh lúa trong 3 giây.
          </p>

          <form
            className="bg-white p-1.5 rounded-xl shadow-lg flex flex-col sm:flex-row items-center gap-2 max-w-xl"
            onSubmit={handleSearchSubmit}
          >
            <div className="flex items-center flex-1 w-full px-3 gap-2">
              <span className="material-symbols-outlined text-[20px] text-slate-400">
                search
              </span>
              <input
                className="w-full text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent py-2"
                placeholder="Tìm thuốc BVTV, phân bón, hoạt chất hoặc bệnh lúa..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm flex-shrink-0"
              type="submit"
            >
              <span>Tìm kiếm</span>
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/products"
              className="px-5 py-2.5 bg-white text-primary-dark hover:bg-emerald-50 text-sm font-bold rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">
                shopping_bag
              </span>
              <span>Khám phá sản phẩm</span>
            </Link>
            <Link
              to="/ai-doctor"
              className="px-5 py-2.5 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm font-semibold rounded-lg backdrop-blur-sm transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px] text-emerald-300">
                photo_camera
              </span>
              <span>Chẩn đoán bệnh AI</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
