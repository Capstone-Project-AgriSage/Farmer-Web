import Breadcrumb from '../../components/ui/Breadcrumb'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

const myRequests = [
  {
    id: 'YC-3021',
    date: '10/10/2024 · 08:12',
    requestType: 'Kỹ thuật canh tác',
    status: 'Đang xử lý',
    statusClass: 'bg-status-info-surface text-status-info',
    message: 'Cây cà phê xuất hiện lá vàng và rụng nhiều ở khu vực gần suối, đã bón NPK 2 tuần nhưng chưa cải thiện.',
  },
  {
    id: 'YC-2988',
    date: '02/10/2024 · 14:30',
    requestType: 'Sổ nợ mùa vụ',
    status: 'Đã xử lý',
    statusClass: 'bg-status-success-surface text-status-success',
    message: 'Nhờ kiểm tra lại số nợ hiện tại của đơn hàng Virtako 40WG tuần trước.',
  },
  {
    id: 'YC-2915',
    date: '20/09/2024 · 09:05',
    requestType: 'Đặt vật tư',
    status: 'Đã xử lý',
    statusClass: 'bg-status-success-surface text-status-success',
    message: 'Đặt thêm 20 bao NPK Đầu Trâu 20-20-15 giao trong tuần.',
  },
]

export default function MyRequestsPage() {
  useDocumentTitle('Yêu cầu đã gửi')

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Trang chủ', to: '/' },
          { label: 'Liên hệ', to: '/contact' },
          { label: 'Yêu cầu đã gửi' },
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
            HỖ TRỢ NÔNG DÂN &amp; ĐẠI LÝ
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Yêu cầu hỗ trợ đã gửi
          </h1>
          <p className="text-sm text-text-secondary mt-2">
            Danh sách các yêu cầu bà con đã gửi cho đội ngũ AgriSage và trạng thái xử lý hiện tại.
          </p>
        </div>

        <div className="max-w-3xl mt-8 bg-white rounded-2xl border border-border-subtle shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
            <h2 className="text-sm font-bold text-text-primary">Lịch sử yêu cầu</h2>
            <span className="text-xs text-text-muted">{myRequests.length} yêu cầu đã gửi</span>
          </div>
          <div className="divide-y divide-border-subtle">
            {myRequests.map((request) => (
              <div key={request.id} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-text-primary text-sm">#{request.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${request.statusClass}`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1 max-w-md">{request.message}</p>
                  <span className="text-[11px] text-text-muted">{request.requestType} · Gửi ngày {request.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
