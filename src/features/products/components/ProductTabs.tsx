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
    crop: 'Cây Sầu Riêng',
    tag: 'Đặc trị Phytophthora',
    disease: 'Nứt thân xì mủ, thối cổ rễ, cháy lá mùa mưa.',
    guide: [
      'Phun lá: Pha 100g cho 40 - 50 lít nước sạch, phun ướt đều tán.',
      'Quét vết nứt: Cạo sạch vết thối, pha sệt 100g với 0.5L nước quét trực tiếp.',
    ],
  },
  {
    crop: 'Cà Phê & Hồ Tiêu',
    tag: 'Chống rụng quả non',
    disease: 'Rỉ sắt nấm hồng trên cà phê, bệnh chết nhanh tiêu mùa mưa lũ.',
    guide: [
      'Tưới gốc: Pha 100g cho 50 lít nước, tưới 3 - 5 lít quanh tán gốc mỗi trụ.',
      'Phun phòng: Định kỳ 15 - 20 ngày trong mùa mưa cao điểm Lâm Đồng.',
    ],
  },
  {
    crop: 'Rau Màu & Cây Có Múi',
    tag: 'Lưu dẫn 2 chiều',
    disease: 'Mốc sương cà chua, sương mai dưa hấu, vàng lá thối rễ cam quýt.',
    guide: ['Liều dùng: Pha 40g - 50g cho bình 25 lít nước.', 'Lưu ý: Phun khi tỷ lệ bệnh chớm xuất hiện 5% trên ruộng.'],
  },
]

interface ProductTabsProps {
  product: Product
  activeTab: ProductTabId
  onActiveTabChange: (tab: ProductTabId) => void
}

export default function ProductTabs({ product, activeTab, onActiveTabChange }: ProductTabsProps) {
  return (
    <div className="mt-12 bg-white rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
      <div className="flex border-b border-border-subtle bg-surface-subtle overflow-x-auto text-xs sm:text-sm font-semibold">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onActiveTabChange(tab.id)}
            className={`py-3.5 px-6 border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary bg-white'
                : 'border-transparent text-text-secondary hover:text-primary hover:bg-white/50'
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
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">biotech</span>
              <span>Bảng thành phần hóa học &amp; Đặc tính sinh học</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="border border-border-subtle rounded-xl overflow-hidden">
                <table className="w-full">
                  <tbody className="divide-y divide-border-subtle text-text-secondary">
                    <tr className="bg-surface-subtle">
                      <td className="py-2.5 px-4 font-semibold text-text-primary w-1/3">Hoạt chất chính</td>
                      <td className="py-2.5 px-4 font-medium text-text-primary">{product.activeIngredient}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-text-primary">Cơ chế tác động</td>
                      <td className="py-2.5 px-4">Nội hấp, lưu dẫn 2 chiều (từ rễ lên ngọn và từ lá xuống cành)</td>
                    </tr>
                    <tr className="bg-surface-subtle">
                      <td className="py-2.5 px-4 font-semibold text-text-primary">Dạng thuốc phẩm</td>
                      <td className="py-2.5 px-4">WG (Cốm phân tán trong nước - ít sinh bụi khi pha)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-text-primary">Độ độc GHS</td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-status-success font-semibold">
                          Nhóm 5 - Rất ít độc với ong và gia súc
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="border border-border-subtle rounded-xl overflow-hidden">
                <table className="w-full">
                  <tbody className="divide-y divide-border-subtle text-text-secondary">
                    <tr className="bg-surface-subtle">
                      <td className="py-2.5 px-4 font-semibold text-text-primary w-1/3">Thời gian cách ly (PHI)</td>
                      <td className="py-2.5 px-4 font-medium text-text-primary">7 ngày trước khi thu hoạch</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-text-primary">Nhà sản xuất</td>
                      <td className="py-2.5 px-4">{product.brand}</td>
                    </tr>
                    <tr className="bg-surface-subtle">
                      <td className="py-2.5 px-4 font-semibold text-text-primary">Đóng gói &amp; Phân phối</td>
                      <td className="py-2.5 px-4">Hệ thống kho vận AgriSage Logistics Di Linh &amp; Cần Thơ</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-text-primary">Hạn sử dụng</td>
                      <td className="py-2.5 px-4 font-medium text-status-success">
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
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">water_drop</span>
              <span>Phác đồ điều trị thực tế theo nhóm cây trồng Tây Nguyên &amp; ĐBSCL</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {dosageGuides.map((item) => (
                <div key={item.crop} className="p-4 rounded-xl border border-border-subtle bg-surface-subtle/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text-primary text-sm">{item.crop}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-primary font-semibold text-[10px]">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-text-secondary leading-relaxed">
                    <strong>Bệnh hại:</strong> {item.disease}
                  </p>
                  <div className="p-2.5 rounded-lg bg-white border border-border-subtle space-y-1 text-text-primary">
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
          <div className="rounded-xl bg-gradient-to-r from-emerald-50 via-surface-secondary to-primary-light border border-primary/20 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-md flex-shrink-0">
                <span className="material-symbols-outlined text-[26px]">psychology</span>
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-text-primary">
                  Vườn của bạn đang có biểu hiện lạ nhưng chưa dám chắc chắn?
                </h4>
                <p className="text-xs text-text-secondary mt-0.5">
                  Chụp ảnh lá hoặc vỏ thân rỉ mủ gửi cho Bác sĩ AI chẩn đoán ngay sau 3 giây,
                  nhận hướng dẫn pha kèm bám dính hoặc phân vi lượng thích hợp.
                </p>
              </div>
            </div>
            <Link
              to="/ai-doctor"
              className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2 whitespace-nowrap"
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
