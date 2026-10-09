import { Link } from 'react-router-dom'
import { useNotificationInbox } from '../../hooks/useNotificationInbox'
import { notificationFilters, notificationIcon, notificationTarget, notificationTime } from './notificationLabels'
import Breadcrumb from '../../components/ui/Breadcrumb'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export default function NotificationsPage() {
  useDocumentTitle('Thông báo của tôi')
  const inbox = useNotificationInbox()
  return (
    <div className="bg-brand-cream min-h-screen text-brand-dark">
      <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Thông báo' }]} />
      <div className="max-w-3xl px-4 sm:px-6 py-8 mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-helvetica-neue tracking-tight">Thông báo</h1>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded border border-brand-dark/10 px-3 py-2 text-xs hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed" onClick={inbox.reload} disabled={inbox.loading || Boolean(inbox.busy)}>Tải lại</button>
            <button type="button" className="rounded border border-brand-dark/10 px-3 py-2 text-xs hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed" disabled={inbox.disabled || inbox.unreadCount === 0} onClick={() => void inbox.markAllRead()}>
              {inbox.busy === 'all' ? 'Đang cập nhật...' : 'Đánh dấu tất cả đã đọc'}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2" aria-label="Lọc thông báo">
          {notificationFilters.map((filter) => <button key={filter.value} type="button" aria-pressed={inbox.filter === filter.value}
            disabled={Boolean(inbox.busy)} className={'rounded border border-brand-dark/10 px-3 py-2 text-xs hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed ' + (inbox.filter === filter.value ? 'bg-brand-light/30 text-brand-green font-medium' : 'text-brand-dark/60')}
            onClick={() => inbox.changeFilter(filter.value)}>{filter.label}</button>)}
        </div>
        {inbox.actionError && <div role="alert" className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">{inbox.actionError}</div>}
        <div className="bg-white border border-brand-dark/10 divide-y divide-brand-dark/10" aria-busy={inbox.loading}>
          {inbox.loading ? <p role="status" className="p-10 text-center text-brand-dark/60">Đang tải thông báo...</p>
            : inbox.loadError ? <div role="alert" className="p-8 text-center space-y-3"><p className="text-red-700">{inbox.loadError}</p><button type="button" className="rounded border border-brand-dark/10 px-3 py-2 text-xs hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed" onClick={inbox.reload}>Thử lại</button></div>
            : inbox.items.length === 0 ? <p role="status" className="p-10 text-center text-brand-dark/60">{inbox.filter ? 'Không có thông báo trong bộ lọc này.' : 'Bạn chưa có thông báo nào.'}</p>
            : inbox.items.map((item) => {
              const unread = item.status === 'UNREAD'
              const target = notificationTarget(item)
              return <article key={item.id} data-notification-id={item.id} className={'p-4 sm:p-5 flex gap-4 ' + (unread ? 'bg-brand-light/30' : '')}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-brand-light/30 text-brand-green"><span className="material-symbols-outlined text-[20px]" aria-hidden="true">{notificationIcon(item.notificationType)}</span></div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <h2 className={'text-sm break-words ' + (unread ? 'font-semibold' : 'font-normal')}>{item.title}</h2>
                    <time dateTime={item.createdAt} className="text-xs text-brand-dark/60">{notificationTime(item.createdAt)}</time>
                  </div>
                  <p className="text-sm text-brand-dark/60 leading-relaxed whitespace-pre-wrap break-words">{item.message}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="text-brand-dark/60">{unread ? 'Chưa đọc' : item.status === 'ARCHIVED' ? 'Đã lưu trữ' : 'Đã đọc'}</span>
                    {unread && <button type="button" className="text-brand-green hover:underline disabled:opacity-40" disabled={inbox.disabled} onClick={() => void inbox.markRead(item.id)}>Đánh dấu đã đọc</button>}
                    {target && <Link className="text-brand-green hover:underline" to={target}>Xem chi tiết</Link>}
                    {item.status !== 'ARCHIVED' && <button type="button" className="text-brand-dark/60 hover:underline disabled:opacity-40" disabled={inbox.disabled} onClick={() => void inbox.archive(item.id)}>Lưu trữ</button>}
                    {inbox.busy === item.id && <span role="status" className="text-brand-dark/60">Đang cập nhật...</span>}
                  </div>
                </div>
                {unread && <span className="w-2 h-2 rounded-full bg-brand-green self-center shrink-0" aria-label="Thông báo chưa đọc" />}
              </article>
            })}
        </div>
        {!inbox.loading && !inbox.loadError && <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-brand-dark/60">
          <p>{inbox.totalCount} thông báo · Trang {inbox.page}/{inbox.totalPages}</p>
          <div className="flex gap-2">
            <button type="button" className="rounded border border-brand-dark/10 px-3 py-2 text-xs hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed" disabled={inbox.disabled || inbox.page <= 1} onClick={() => inbox.setPage(inbox.page - 1)}>Trang trước</button>
            <button type="button" className="rounded border border-brand-dark/10 px-3 py-2 text-xs hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed" disabled={inbox.disabled || inbox.page >= inbox.totalPages} onClick={() => inbox.setPage(inbox.page + 1)}>Trang sau</button>
          </div>
        </div>}
      </div>
    </div>
  )
}
