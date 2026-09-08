import Spinner from './ui/Spinner'

export default function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="h-8 w-8 text-primary" />
        <span className="text-sm text-text-muted">Đang tải...</span>
      </div>
    </div>
  )
}
