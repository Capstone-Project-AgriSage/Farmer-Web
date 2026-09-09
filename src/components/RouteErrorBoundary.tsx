import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'

export default function RouteErrorBoundary() {
  const error = useRouteError()
  const isResponse = isRouteErrorResponse(error)

  const title = isResponse ? `Lỗi ${error.status}` : 'Đã có lỗi xảy ra'
  const message = isResponse
    ? error.statusText || 'Không thể tải nội dung trang này.'
    : error instanceof Error
      ? error.message
      : 'Trang gặp sự cố ngoài ý muốn. Bà con thử tải lại hoặc quay về trang chủ nhé.'

  if (import.meta.env.DEV) {
    console.error(error)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 sm:py-28 text-center">
      <span className="material-symbols-outlined text-status-error text-6xl">error</span>
      <h1 className="text-xl sm:text-2xl font-bold text-text-primary mt-3">{title}</h1>
      <p className="text-sm text-text-secondary mt-2 leading-relaxed">{message}</p>
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        <Link
          to="/"
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg shadow-sm transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">home</span>
          <span>Về trang chủ</span>
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 border border-primary text-primary hover:bg-primary-light text-sm font-semibold rounded-lg transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          <span>Tải lại trang</span>
        </button>
      </div>
    </div>
  )
}
