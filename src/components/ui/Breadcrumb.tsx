import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  to?: string
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="w-full bg-surface-secondary border-b border-border-subtle py-3.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
          {items.map((item, index) => (
            <span key={item.label} className="flex items-center gap-2">
              {index > 0 && <span className="material-symbols-outlined text-[14px]">chevron_right</span>}
              {item.to ? (
                <Link className="hover:text-primary transition-colors flex items-center gap-1" to={item.to}>
                  {index === 0 && <span className="material-symbols-outlined text-[16px]">home</span>}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className="text-text-primary font-semibold">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  )
}
