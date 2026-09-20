import { Link } from 'react-router-dom'
import type { Product } from '../../../types'

const tabs = [
  { id: 'specs', label: 'Thông số kỹ thuật & Hoạt chất', icon: 'science' },
  { id: 'dosage', label: 'Phác đồ điều trị & Liều lượng phun xịt', icon: 'spa' },
  { id: 'ai', label: 'Bác sĩ cây trồng AI - Chẩn đoán tích hợp', icon: 'psychology' },
] as const

export type ProductTabId = (typeof tabs)[number]['id']

const dosageGuides = [
  {
    crop: 'Lúa Đẻ Nhánh (20 - 35 NSS)',
    tag: 'Đặc trị Đạo ôn & Sâu cuốn lá',
    disease: 'Đạo ôn lá (cháy lá), sâu cuốn lá nhỏ, sâu đục thân giai đoạn đẻ nhánh rộ.',
    guide: [
      'Phun lá: Pha 25 - 30g thuốc trừ bệnh cho bình 25 lít nước, phun ướt đều tán lúa.',
      'Thời điểm: Phun khi vết bệnh chớm xuất hiện chấm kim hoặc mật độ bướm rộ 2-3 ngày.',
    ],
  },
  {
    crop: 'Lúa Làm Đòng - Trổ Lẹt Xẹt (45 - 60 NSS)',
    tag: 'Bảo vệ Đòng & Cổ bông',
    disease: 'Đạo ôn cổ bông, cháy bìa lá vi khuẩn, khô vằn ăn lên bẹ lá đòng.',
    guide: [
      'Phun đón đòng: Phun kết hợp phòng trừ đạo ôn cổ bông và đốm sọc vi khuẩn.',
      'Phun lại lần 2: Khi lúa trổ đều (sau trổ lẹt xẹt 5 - 7 ngày) để bảo vệ hạt sáng mẩy.',
    ],
  },
  {
    crop: 'Lúa Cong Trái Me - Chín Sáp (70 - 85 NSS)',
    tag: 'Chống Lem Lép Hạt & Đốm Nâu',
    disease: 'Đốm nâu, lem lép hạt do nấm và vi khuẩn, vàng lá chín sớm.',
    guide: [
      'Liều dùng: Pha 40ml - 50ml chế phẩm đặc trị cho bình 25 lít nước sạch.',
      'Cách ly: Đảm bảo thời gian cách ly (PHI) tối thiểu 14 ngày trước ngày gặt thu hoạch.',
    ],
  },
]


interface ProductTabsProps {
  product: Product
  activeTab: ProductTabId
  onActiveTabChange: (tab: ProductTabId) => void
}

export default function ProductTabs({ product, activeTab, onActiveTabChange }: ProductTabsProps) {
  return (
    <div className="mt-12 bg-white border border-brand-dark/10 overflow-hidden">
      <div className="flex border-b border-brand-dark/10 bg-brand-light overflow-x-auto text-xs sm:text-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onActiveTabChange(tab.id)}
            className={`py-3.5 px-6 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors tracking-wide ${
              activeTab === tab.id
                ? 'border-brand-dark text-brand-dark bg-white'
                : 'border-transparent text-brand-dark/55 hover:text-brand-dark hover:bg-white/50'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="p-6 sm:p-8 space-y-8">
        {activeTab === 'specs' && (
          <div>
            <h3 className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-dark/60 text-[18px]">biotech</span>
              <span>Bảng thành phần hóa học &amp; Đặc tính sinh học</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="border border-brand-dark/10 overflow-hidden">
                <table className="w-full">
                  <tbody className="divide-y divide-brand-dark/10 text-brand-dark/60">
                    <tr className="bg-brand-cream">
                      <td className="py-2.5 px-4 text-brand-dark w-1/3">Hoạt chất chính</td>
                      <td className="py-2.5 px-4 text-brand-dark">{product.activeIngredient}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 text-brand-dark">Cơ chế tác động</td>
                      <td className="py-2.5 px-4">Nội hấp, lưu dẫn 2 chiều (từ rễ lên ngọn và từ lá xuống cành)</td>
                    </tr>
                    <tr className="bg-brand-cream">
                      <td className="py-2.5 px-4 text-brand-dark">Dạng thuốc phẩm</td>
                      <td className="py-2.5 px-4">WG (Cốm phân tán trong nước - ít sinh bụi khi pha)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 text-brand-dark">Độ độc GHS</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-brand-light text-brand-dark/70 border border-brand-dark/10 tracking-wide">
                          Nhóm 5 - Rất ít độc với ong và gia súc
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="border border-brand-dark/10 overflow-hidden">
                <table className="w-full">
                  <tbody className="divide-y divide-brand-dark/10 text-brand-dark/60">
                    <tr className="bg-brand-cream">
                      <td className="py-2.5 px-4 text-brand-dark w-1/3">Thời gian cách ly (PHI)</td>
                      <td className="py-2.5 px-4 text-brand-dark">7 ngày trước khi thu hoạch</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 text-brand-dark">Nhà sản xuất</td>
                      <td className="py-2.5 px-4">{product.brand}</td>
                    </tr>
                    <tr className="bg-brand-cream">
                      <td className="py-2.5 px-4 text-brand-dark">Đóng gói &amp; Phân phối</td>
                      <td className="py-2.5 px-4">Kho Đại lý Hai Thắng (Thị trấn Thới Lai, TP. Cần Thơ)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 text-brand-dark">Hạn sử dụng</td>
                      <td className="py-2.5 px-4 text-brand-green">
                        24 tháng kể từ ngày sản xuất (Lô mới T05/2024)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'dosage' && (
          <div>
            <h3 className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-dark/60 text-[18px]">water_drop</span>
              <span>Phác đồ điều trị thực tế theo nhóm cây trồng Tây Nguyên &amp; ĐBSCL</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {dosageGuides.map((item) => (
                <div key={item.crop} className="p-4 border border-brand-dark/10 bg-brand-light space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-helvetica-neue tracking-tight text-brand-dark text-sm">
                      {item.crop}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-brand-dark text-white text-[10px] tracking-wide shrink-0">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-brand-dark/60 leading-relaxed">
                    <span className="text-brand-dark">Bệnh hại:</span> {item.disease}
                  </p>
                  <div className="p-2.5 bg-white border border-brand-dark/10 space-y-1 text-brand-dark/70">
                    {item.guide.map((line) => (
                      <p key={line}>• {line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'ai' && (
          <div className="bg-brand-light border border-brand-dark/10 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-dark text-white flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[26px]">psychology</span>
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-helvetica-neue tracking-tight text-brand-dark">
                  Vườn của bạn đang có biểu hiện lạ nhưng chưa dám chắc chắn?
                </h4>
                <p className="text-xs text-brand-dark/60 mt-0.5">
                  Chụp ảnh lá hoặc vỏ thân rỉ mủ gửi cho Bác sĩ AI chẩn đoán ngay sau 3 giây,
                  nhận hướng dẫn pha kèm bám dính hoặc phân vi lượng thích hợp.
                </p>
              </div>
            </div>
            <Link
              to="/ai-doctor"
              className="px-5 py-2.5 rounded-full bg-brand-dark text-white hover:bg-brand-green tracking-wide uppercase text-xs transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              <span>Quét lá chẩn đoán ngay</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
