import Breadcrumb from '../../components/ui/Breadcrumb'
import { formatVnd } from '../../data/format'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

const creditLimit = 50000000
const creditUsed = 2600000
const creditPercent = Math.round((creditUsed / creditLimit) * 100)

const orderHistory = [
  {
    code: '#AGR-8842',
    date: '08/10/2024',
    status: 'Đang giao',
    statusClass: 'bg-status-info-surface text-status-info',
    total: 2600000,
    itemsSummary: 'Ridomil Gold 68WG, Đầu Trâu NPK, Humic King Root, Nativo 750WG',
  },
  {
    code: '#AGR-8791',
    date: '22/09/2024',
    status: 'Hoàn tất',
    statusClass: 'bg-status-success-surface text-status-success',
    total: 1450000,
    itemsSummary: 'Score 250EC, Đạm Phú Mỹ Hạt Đục',
  },
  {
    code: '#AGR-8703',
    date: '30/08/2024',
    status: 'Hoàn tất',
    statusClass: 'bg-status-success-surface text-status-success',
    total: 890000,
    itemsSummary: 'Anvil 5SC, Phân Hữu Cơ Úc Bounce Back',
  },
]

export default function AccountPage() {
  useDocumentTitle('Tài khoản của tôi')

  return (
    <>
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Tài khoản của tôi' }]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-sm text-center">
              <div className="w-20 h-20 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto text-2xl font-bold">
                NH
              </div>
              <h1 className="text-lg font-bold text-text-primary mt-3">Nguyễn Văn Hùng</h1>
              <p className="text-xs text-text-muted mt-0.5">
                Nông hộ liên kết · Xã Đinh Lạc, Huyện Di Linh, Lâm Đồng
              </p>
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border-subtle text-left text-xs">
                <div>
                  <span className="text-text-muted block">Số điện thoại</span>
                  <span className="font-semibold text-text-primary">0918 234 567</span>
                </div>
                <div>
                  <span className="text-text-muted block">Thành viên từ</span>
                  <span className="font-semibold text-text-primary">Tháng 03/2023</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">credit_score</span>
                  <span>Sổ nợ mùa vụ AgriCredit</span>
                </h2>
                <span className="px-2 py-0.5 rounded bg-status-success-surface text-status-success text-[10px] font-bold">
                  0% Lãi suất
                </span>
              </div>
              <div>
                <div className="flex items-baseline justify-between text-xs text-text-secondary mb-1.5">
                  <span>Đã sử dụng: <strong className="text-text-primary">{formatVnd(creditUsed)}</strong></span>
                  <span>Hạn mức: <strong className="text-text-primary">{formatVnd(creditLimit)}</strong></span>
                </div>
                <div className="h-2.5 rounded-full bg-surface-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full ${creditPercent >= 80 ? 'bg-status-warning' : 'bg-primary'}`}
                    style={{ width: `${Math.min(100, creditPercent)}%` }}
                  />
                </div>
                <div className="text-[11px] text-text-muted mt-1.5">
                  Đã dùng {creditPercent}% hạn mức · Thanh toán sau mùa thu hoạch
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-5">
            <div className="bg-white rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
                <h2 className="text-sm font-bold text-text-primary">Lịch sử đơn hàng</h2>
                <span className="text-xs text-text-muted">{orderHistory.length} đơn hàng gần đây</span>
              </div>
              <div className="divide-y divide-border-subtle">
                {orderHistory.map((order) => (
                  <div key={order.code} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-text-primary text-sm">{order.code}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${order.statusClass}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary mt-1 max-w-md">{order.itemsSummary}</p>
                      <span className="text-[11px] text-text-muted">Đặt ngày {order.date}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-extrabold text-primary">{formatVnd(order.total)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
