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
    <div className="max-w-2xl mx-auto px-6 py-20 sm:py-28 text-center bg-brand-cream">
      <p className="text-xs tracking-[0.25em] uppercase text-brand-dark/50 mb-4">Sự cố</p>
      <h1 className="text-2xl sm:text-3xl text-brand-dark tracking-tight font-helvetica-neue">{title}</h1>
      <p className="text-sm text-brand-dark/60 mt-3 leading-relaxed">{message}</p>
      <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
        <Link
          to="/"
          className="px-6 py-3 bg-brand-dark hover:bg-brand-green text-white text-sm tracking-wide uppercase rounded-full transition-colors"
        >
          Về trang chủ
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 border border-brand-dark/25 text-brand-dark hover:bg-brand-light text-sm tracking-wide uppercase rounded-full transition-colors"
        >
          Tải lại trang
        </button>
      </div>
    </div>
  )
}
