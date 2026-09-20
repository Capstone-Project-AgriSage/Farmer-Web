import Spinner from './ui/Spinner'

export default function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center py-24 bg-brand-cream">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="h-8 w-8 text-brand-dark" />
        <span className="text-sm text-brand-dark/50 tracking-wide">Đang tải...</span>
      </div>
    </div>
  )
}
