export default function Footer() {
  return (
    <footer className="w-full bg-[#144d1a] border-t border-white/10 mt-auto text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg border border-white/20 bg-white p-1 flex items-center justify-center shadow-sm">
                <img
                  alt="AgriCARE-AI"
                  className="w-full h-full object-contain"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1UUh_rMaCKAuHaMgW-rlQEybLDC0yLaiBL84lCqf4i75nqLSFCcM7r6LQBPmwpexG33O1HAqBNtf-6Kuq4uo8JRLFBBc7rBCVHQjRNNXid88YHmMN-I_eRlwwwhg4IYza_9zPQQNoCKQFWmkF3lpMBE_qP3eRRDHs6SvsfTutDXagvCKzVz7ohcKlnYNWZUz9o4B9FxP1JGjBLadtPwoHB8oAVVKq2Ywe4vqvFummLb-xtOsuSmo4eTZR8"
                />
              </div>
              <div>
                <span className="font-bold text-white text-base tracking-tight leading-none block">
                  AgriSage
                </span>
                <span className="text-xs text-emerald-200/80">
                  Hệ sinh thái Nông nghiệp Thông minh
                </span>
              </div>
            </div>
            <p className="text-sm text-emerald-100/80 leading-relaxed">
              Nền tảng quản trị vật tư nông nghiệp toàn diện và trợ lý AI nhận diện bệnh hại cây
              trồng qua ảnh chụp. Giúp đại lý quản lý tồn kho, sổ nợ mùa vụ minh bạch và hỗ trợ
              nông dân canh tác hiệu quả.
            </p>
            <div className="space-y-2 text-xs text-emerald-100/90 pt-1">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-emerald-300 mt-0.5 flex-shrink-0">
                  location_on
                </span>
                <span>
                  <strong className="text-white">Trung tâm điều hành:</strong> Tòa nhà AgriTech,
                  Khu Công nghệ cao, TP. Hồ Chí Minh.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-emerald-300 mt-0.5 flex-shrink-0">
                  store
                </span>
                <span>
                  <strong className="text-white">Chi nhánh Lâm Đồng:</strong> 142 Hùng Vương, TT.
                  Di Linh, Tỉnh Lâm Đồng.
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">
              Danh mục &amp; Giải pháp
            </h3>
            <ul className="space-y-2.5 text-xs text-emerald-100/80">
              <li>
                <a className="hover:text-white transition-colors flex items-center gap-1.5" href="#">
                  <span className="material-symbols-outlined text-[14px] text-emerald-300/60">
                    chevron_right
                  </span>
                  <span>Vật tư phân bón NPK &amp; Hữu cơ</span>
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors flex items-center gap-1.5" href="#">
                  <span className="material-symbols-outlined text-[14px] text-emerald-300/60">
                    chevron_right
                  </span>
                  <span>Thuốc bảo vệ thực vật sinh học</span>
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors flex items-center gap-1.5" href="#">
                  <span className="material-symbols-outlined text-[14px] text-emerald-300 font-medium">
                    psychology
                  </span>
                  <span className="font-medium text-white">Chẩn đoán AI bệnh lá cây</span>
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors flex items-center gap-1.5" href="#">
                  <span className="material-symbols-outlined text-[14px] text-emerald-300/60">
                    chevron_right
                  </span>
                  <span>Quản lý hạn mức công nợ mùa vụ</span>
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors flex items-center gap-1.5" href="#">
                  <span className="material-symbols-outlined text-[14px] text-emerald-300/60">
                    chevron_right
                  </span>
                  <span>Lô hàng &amp; cảnh báo hạn dùng tự động</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">
              Hỗ trợ khách hàng &amp; Nông dân
            </h3>
            <ul className="space-y-2.5 text-xs text-emerald-100/80">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-emerald-300">
                  support_agent
                </span>
                <span>
                  Tổng đài kỹ sư tư vấn mùa vụ:{' '}
                  <strong className="text-white font-semibold">1900 6828</strong> (7:00 - 20:00)
                </span>
              </li>
              <li>
                <a className="hover:text-white transition-colors flex items-center gap-1.5" href="#">
                  <span className="material-symbols-outlined text-[14px] text-emerald-300/60">
                    chevron_right
                  </span>
                  <span>Quy trình giao nhận vật tư tận vườn</span>
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors flex items-center gap-1.5" href="#">
                  <span className="material-symbols-outlined text-[14px] text-emerald-300/60">
                    chevron_right
                  </span>
                  <span>Chính sách bảo mật dữ liệu nông hộ</span>
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors flex items-center gap-1.5" href="#">
                  <span className="material-symbols-outlined text-[14px] text-emerald-300/60">
                    chevron_right
                  </span>
                  <span>Điều khoản sử dụng nền tảng AgriSage</span>
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors flex items-center gap-1.5" href="#">
                  <span className="material-symbols-outlined text-[14px] text-emerald-300/60">
                    chevron_right
                  </span>
                  <span>Tài liệu hướng dẫn đại lý tích hợp POS</span>
                </a>
              </li>
            </ul>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-xs text-emerald-100">
                <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
                <span>Hệ thống chi nhánh Lâm Đồng &amp; ĐBSCL đang trực tuyến</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-100/70 gap-2">
          <p>© 2024 AgriSage. Bản quyền kỹ thuật.</p>
          <p className="text-emerald-200/60">Phát triển vì nền nông nghiệp số Việt Nam</p>
        </div>
      </div>
    </footer>
  )
}
