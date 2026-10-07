/** Placeholder with the same proportions as ProductCard, so the grid does not jump when the products arrive. */
export default function ProductSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-brand-dark/15 rounded-[var(--radius-surface)] overflow-hidden" aria-hidden="true">
      <div className="aspect-[4/3] bg-brand-dark/10 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-3.5 w-1/3 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
        <div className="h-5 w-4/5 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
        <div className="h-4 w-3/5 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
      </div>
      <div className="px-5 pb-5">
        <div className="flex items-center justify-between pt-4 mb-4 border-t border-brand-dark/10">
          <div className="h-6 w-24 bg-brand-dark/10 rounded-[var(--radius-surface)] animate-pulse" />
          <div className="w-11 h-11 rounded-full bg-brand-dark/10 animate-pulse" />
        </div>
        <div className="h-11 w-full rounded-full bg-brand-dark/10 animate-pulse" />
      </div>
    </div>
  )
}
