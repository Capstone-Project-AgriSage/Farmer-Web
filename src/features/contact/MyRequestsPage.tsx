import Breadcrumb from '../../components/ui/Breadcrumb'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

const myRequests = [
  {
    id: 'YC-3021',
    date: '10/10/2024 · 08:12',
    requestType: 'Kỹ thuật canh tác',
    status: 'Đang xử lý',
    statusClass: 'border border-brand-dark/20 text-brand-dark/70',
    message: 'Cây cà phê xuất hiện lá vàng và rụng nhiều ở khu vực gần suối, đã bón NPK 2 tuần nhưng chưa cải thiện.',
  },
  {
    id: 'YC-2988',
    date: '02/10/2024 · 14:30',
    requestType: 'Sổ nợ mùa vụ',
    status: 'Đã xử lý',
    statusClass: 'bg-brand-light border border-brand-dark/10 text-brand-dark',
    message: 'Nhờ kiểm tra lại số nợ hiện tại của đơn hàng Virtako 40WG tuần trước.',
  },
  {
    id: 'YC-2915',
    date: '20/09/2024 · 09:05',
    requestType: 'Đặt vật tư',
    status: 'Đã xử lý',
    statusClass: 'bg-brand-light border border-brand-dark/10 text-brand-dark',
    message: 'Đặt thêm 20 bao NPK Đầu Trâu 20-20-15 giao trong tuần.',
  },
]

export default function MyRequestsPage() {
  useDocumentTitle('Yêu cầu đã gửi')

  return (
    <div className="bg-brand-cream text-brand-dark">
      <Breadcrumb
        items={[
          { label: 'Trang chủ', to: '/' },
          { label: 'Liên hệ', to: '/contact' },
          { label: 'Yêu cầu đã gửi' },
        ]}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-14">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-2 font-helvetica-neue">
            Hỗ trợ nông dân &amp; đại lý
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-helvetica-neue tracking-tight text-brand-dark leading-[1.15]">
            Yêu cầu hỗ trợ đã gửi
          </h1>
          <p className="text-base text-brand-dark/60 mt-3 leading-relaxed">
            Danh sách các yêu cầu bà con đã gửi cho đội ngũ AgriSage và trạng thái xử lý hiện tại.
          </p>
        </div>

        <div className="max-w-3xl mt-10 border border-brand-dark/10 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-brand-dark/10 bg-brand-light/50">
            <h2 className="text-sm font-helvetica-neue tracking-tight text-brand-dark">Lịch sử yêu cầu</h2>
            <span className="text-xs text-brand-dark/50">{myRequests.length} yêu cầu đã gửi</span>
          </div>
          <div className="divide-y divide-brand-dark/10">
            {myRequests.map((request) => (
              <div key={request.id} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-brand-dark text-sm">#{request.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] tracking-wide ${request.statusClass}`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-brand-dark/60 mt-2 max-w-md leading-relaxed">{request.message}</p>
                  <span className="text-xs text-brand-dark/45 mt-2 block">
                    {request.requestType} · Gửi ngày {request.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
