import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full bg-brand-dark mt-auto text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          <div className="md:col-span-5 space-y-4">
            <div>
              <span className="text-xl text-white tracking-tight font-helvetica-neue block">AgriSage</span>
              <span className="text-xs tracking-[0.2em] uppercase text-white/50 mt-1 block">
                Nông nghiệp số &amp; chẩn đoán AI
              </span>
            </div>
            <p className="text-sm text-white/65 leading-relaxed max-w-md">
              Nền tảng quản trị vật tư nông nghiệp và trợ lý AI nhận diện bệnh hại cây trồng qua ảnh
              chụp. Đồng hành cùng đại lý và nhà nông ĐBSCL.
            </p>
            <div className="space-y-2 text-xs text-white/60 pt-1">
              <p>
                <span className="text-white/90">Trung tâm điều hành:</span> Tòa nhà AgriTech, Khu Công
                nghệ cao, TP. Hồ Chí Minh.
              </p>
              <p>
                <span className="text-white/90">Đại lý Hai Thắng:</span> Thị trấn Thới Lai, TP. Cần Thơ.
              </p>
            </div>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h3 className="text-xs tracking-[0.25em] uppercase text-white/45">Danh mục</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <Link className="hover:text-white transition-colors" to="/products">
                  Phân bón NPK &amp; hữu cơ
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition-colors" to="/products">
                  Thuốc BVTV trừ bệnh lúa
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition-colors" to="/products">
                  Lúa giống xác nhận
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition-colors" to="/ai-doctor">
                  Chẩn đoán bệnh lá lúa AI
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition-colors" to="/account?tab=credit">
                  Sổ nợ mùa vụ
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-4">
            <h3 className="text-xs tracking-[0.25em] uppercase text-white/45">Hỗ trợ</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                Tổng đài kỹ sư:{' '}
                <span className="text-white">1900 6828</span> (7:00 – 20:00)
              </li>
              <li>
                <Link className="hover:text-white transition-colors" to="/contact">
                  Liên hệ đại lý
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition-colors" to="/knowledge">
                  Kiến thức nông nghiệp
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition-colors" to="/about">
                  Giới thiệu AgriSage
                </Link>
              </li>
            </ul>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/15 text-xs text-white/70 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-white/80"></span>
                <span>Đại lý Hai Thắng đang trực tuyến</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/45 gap-2">
          <p>© 2024 AgriSage. Bản quyền kỹ thuật.</p>
          <p>Phát triển vì nền nông nghiệp số Việt Nam</p>
        </div>
      </div>
    </footer>
  )
}
