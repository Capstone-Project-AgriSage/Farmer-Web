import { Link } from 'react-router-dom'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

const mockNotifications = [
  {
    id: 1,
    title: 'Đơn hàng đã được xác nhận',
    message: 'Đại lý Hai Thắng đã xác nhận đơn hàng #8928 của bác. Đơn hàng đang được đóng gói và chuẩn bị giao.',
    time: '2 giờ trước',
    read: false,
    icon: 'task_alt',
    type: 'success',
  },
  {
    id: 2,
    title: 'Giao hàng thành công',
    message: 'Đơn hàng #8927 đã được giao thành công. Bác nông dân vui lòng kiểm tra lại vật tư.',
    time: '1 ngày trước',
    read: true,
    icon: 'local_shipping',
    type: 'info',
  },
  {
    id: 3,
    title: 'Kết quả chẩn đoán AI',
    message: 'Kỹ sư Hai Thắng đã thẩm định xong ca chẩn đoán AI-2405 của bác. Vui lòng xem phác đồ điều trị.',
    time: '3 ngày trước',
    read: true,
    icon: 'psychology',
    type: 'warning',
  },
]

export default function NotificationsPage() {
  useDocumentTitle('Thông báo của tôi')

  return (
    <div className="bg-brand-cream text-brand-dark min-h-screen">
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Thông báo' }]} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-helvetica-neue tracking-tight text-brand-dark">Thông báo</h1>
          <button className="text-xs text-brand-dark/50 hover:text-brand-dark transition-colors">
            Đánh dấu tất cả đã đọc
          </button>
        </div>

        <div className="bg-white border border-brand-dark/10 divide-y divide-brand-dark/10">
          {mockNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 flex gap-4 transition-colors hover:bg-brand-light/50 ${
                notif.read ? 'opacity-70' : 'bg-brand-light/30'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  notif.type === 'success'
                    ? 'bg-brand-green/10 text-brand-green'
                    : notif.type === 'warning'
                      ? 'bg-amber-500/10 text-amber-600'
                      : 'bg-brand-dark/10 text-brand-dark'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{notif.icon}</span>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <h3 className={`text-sm ${notif.read ? 'font-normal text-brand-dark/80' : 'font-bold text-brand-dark'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-[10px] text-brand-dark/40 whitespace-nowrap">{notif.time}</span>
                </div>
                <p className="text-xs text-brand-dark/60 leading-relaxed">{notif.message}</p>
              </div>
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-brand-green self-center flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
