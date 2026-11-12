import { useCallback, useEffect, useState } from 'react'
import Breadcrumb from '../../components/ui/Breadcrumb'
import ContentPagination from '../../components/ui/ContentPagination'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { contentApi, contactLabels } from '../../api/contentApi'
import { useContentQuery } from '../../hooks/useContentQuery'

export default function MyRequestsPage() {
  useDocumentTitle('Yêu cầu đã gửi')
  const [page, setPage] = useState(1)
  const load = useCallback((signal: AbortSignal) => contentApi.myContacts(page, signal), [page])
  const { data, error, loading, reload } = useContentQuery(load)
  useEffect(() => { if (data && page > Math.max(1, data.totalPages)) setPage(Math.max(1, data.totalPages)) }, [data, page])
  return <div className="bg-brand-cream text-brand-dark">
    <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Liên hệ', to: '/contact' }, { label: 'Yêu cầu đã gửi' }]} />
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 md:py-14">
      <h1 className="text-2xl sm:text-3xl font-helvetica-neue">Yêu cầu hỗ trợ đã gửi</h1>
      <p className="mt-3 text-brand-dark/60">Theo dõi trạng thái và phản hồi của cửa hàng cho các yêu cầu đã gửi từ tài khoản của bạn.</p>
      <button className="mt-4 underline" onClick={reload}>Tải lại</button>
      {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
      {loading && !data && <p role="status" className="mt-6">Đang tải yêu cầu...</p>}
      {data && <div className="max-w-3xl mt-6 border border-brand-dark/10 bg-white">
        <div className="p-5 bg-brand-light border-b border-brand-dark/10">{data.totalCount} yêu cầu đã gửi</div>
        {!data.items.length && <p className="p-6">Bạn chưa gửi yêu cầu nào khi đăng nhập.</p>}
        {data.items.map(request => <article key={request.id} className="p-5 border-b border-brand-dark/10 space-y-3">
          <div className="flex flex-wrap gap-3 justify-between"><h2 className="font-medium">{request.requestNumber} · {request.subject}</h2><span className="text-sm border rounded-full px-3 py-1">{contactLabels[request.status]}</span></div>
          <p className="whitespace-pre-wrap break-words text-brand-dark/70">{request.message}</p>
          <p className="text-xs text-brand-dark/50">Gửi ngày {new Date(request.createdAt).toLocaleString('vi-VN')}</p>
          {request.resolutionNote && <div className="bg-brand-light p-4"><h3 className="font-medium mb-2">Phản hồi từ AgriSage</h3><p className="whitespace-pre-wrap break-words">{request.resolutionNote}</p>{request.resolvedAt && <p className="text-xs mt-2">Giải quyết ngày {new Date(request.resolvedAt).toLocaleString('vi-VN')}</p>}</div>}
        </article>)}
      </div>}
      {data && <ContentPagination page={page} totalPages={data.totalPages} onChange={setPage} />}
    </div>
  </div>
}
