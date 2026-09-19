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
    <section className="relative w-full overflow-hidden text-white py-10 lg:py-14">
      <img
        alt=""
        aria-hidden="true"
        src="/images/misc/hero-rice-field.jpg"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1c3809]/95 via-[#23460c]/85 to-[#2c4b0e]/40"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl space-y-4 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-emerald-200 backdrop-blur-sm">
            <span className="material-symbols-outlined text-[15px] text-emerald-300">
              eco
            </span>
            <span>Đồng hành cùng bà con nông dân trồng lúa ĐBSCL</span>
          </div>

          <h1 className="font-brand text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug text-white">
            Khám Bệnh Lúa Cùng Bác Sĩ AI &amp; Mua Vật Tư Chính Hãng
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed font-normal max-w-xl">
            Chụp ảnh lá lúa nhận ngay phác đồ điều trị được đại lý kiểm tra, đặt thuốc BVTV và phân bón giao tận ruộng.
          </p>

          {/* Hai hành động chính rõ ràng */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              to="/ai-doctor"
              className="px-6 py-3 bg-[#2E7D32] hover:bg-[#256628] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">
                photo_camera
              </span>
              <span>Chẩn đoán bệnh lúa</span>
            </Link>
            <Link
              to="/products"
              className="px-6 py-3 bg-white text-slate-800 hover:bg-slate-100 text-sm font-bold rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px] text-[#2E7D32]">
                shopping_bag
              </span>
              <span>Xem vật tư nông nghiệp</span>
            </Link>
          </div>

          {/* Thanh tìm kiếm nhanh */}
          <form
            className="bg-white/95 backdrop-blur-sm p-1.5 rounded-xl shadow-md flex flex-col sm:flex-row items-center gap-2 max-w-xl mt-3"
            onSubmit={handleSearchSubmit}
          >
            <div className="flex items-center flex-1 w-full px-3 gap-2">
              <span className="material-symbols-outlined text-[20px] text-slate-400">
                search
              </span>
              <input
                className="w-full text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent py-1.5"
                placeholder="Tìm thuốc trừ sâu, phân bón, hoặc tên bệnh..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="w-full sm:w-auto px-5 py-2 bg-[#2E7D32] hover:bg-[#256628] text-white text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm flex-shrink-0"
              type="submit"
            >
              <span>Tìm</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
