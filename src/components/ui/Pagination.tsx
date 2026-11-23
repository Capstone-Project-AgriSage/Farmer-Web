interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
  className?: string
}

/** Keep the first/last pages and nearby pages visible, filling single-page gaps. */
function pageNumbers(current: number, total: number): (number | null)[] {
  const wanted = new Set([1, total, current - 1, current, current + 1])
  const pages = [...wanted].filter(page => page >= 1 && page <= total).sort((a, b) => a - b)
  const result: (number | null)[] = []
  pages.forEach((page, index) => {
    if (index > 0 && page - pages[index - 1] === 2) result.push(page - 1)
    else if (index > 0 && page - pages[index - 1] > 2) result.push(null)
    result.push(page)
  })
  return result
}

const buttonClass = (active: boolean) =>
  `focus-ring w-9 h-9 sm:w-11 sm:h-11 shrink-0 flex items-center justify-center rounded-full text-[15px] transition-colors duration-[var(--dur-micro)] ${
    active ? 'bg-brand-dark text-white' : 'border border-brand-dark/25 text-text-primary hover:border-brand-dark/60'
  }`

export default function Pagination({ page, totalPages, onChange, className = '' }: PaginationProps) {
  if (totalPages <= 1) return null
  const currentPage = Math.max(1, Math.min(page, totalPages))
  return (
    <nav aria-label="Phân trang" className={`flex justify-center items-center gap-px sm:gap-2 flex-wrap ${className}`}>
      <button type="button" onClick={() => onChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} aria-label="Trang trước" className={`${buttonClass(false)} disabled:opacity-35 disabled:cursor-not-allowed`}>
        <span className="material-symbols-outlined" style={{ fontSize: 22 }} aria-hidden="true">chevron_left</span>
      </button>
      {pageNumbers(currentPage, totalPages).map((item, index) => item === null ? (
        <span key={`gap-${index}`} className="w-3 sm:w-8 shrink-0 text-center text-text-secondary" aria-hidden="true">…</span>
      ) : (
        <button key={item} type="button" onClick={() => onChange(item)} aria-label={`Trang ${item}`} aria-current={currentPage === item ? 'page' : undefined} className={buttonClass(currentPage === item)}>{item}</button>
      ))}
      <button type="button" onClick={() => onChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} aria-label="Trang sau" className={`${buttonClass(false)} disabled:opacity-35 disabled:cursor-not-allowed`}>
        <span className="material-symbols-outlined" style={{ fontSize: 22 }} aria-hidden="true">chevron_right</span>
      </button>
    </nav>
  )
}
