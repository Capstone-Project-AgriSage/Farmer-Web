interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize: number
  onPageSizeChange: (size: number) => void
  pageSizeOptions: number[]
  itemLabel?: string
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions,
  itemLabel = 'sản phẩm',
}: PaginationProps) {
  return (
    <div className="mt-10 border border-brand-dark/10 bg-brand-light p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-xs text-brand-dark/55">
        <span>Hiển thị</span>
        <select
          className="text-xs text-brand-dark bg-brand-cream border border-brand-dark/15 px-2.5 py-1.5 focus:outline-none focus:border-brand-dark/40"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} {itemLabel} / trang
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          aria-label="Trang trước"
          className="w-8 h-8 border border-brand-dark/15 flex items-center justify-center text-brand-dark/50 hover:text-brand-dark hover:bg-brand-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-label={`Trang ${p}`}
            aria-current={p === currentPage ? 'page' : undefined}
            className={`w-8 h-8 text-xs flex items-center justify-center transition-colors ${
              p === currentPage
                ? 'bg-brand-dark text-white'
                : 'border border-brand-dark/15 text-brand-dark hover:bg-brand-cream'
            }`}
          >
            {p}
          </button>
        ))}
        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          aria-label="Trang sau"
          className="w-8 h-8 border border-brand-dark/15 flex items-center justify-center text-brand-dark hover:bg-brand-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </div>
    </div>
  )
}
