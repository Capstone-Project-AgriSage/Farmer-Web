import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  to?: string
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="w-full border-b border-brand-dark/10 py-3.5 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs text-brand-dark/50 tracking-wide"
        >
          {items.map((item, index) => (
            <span key={item.label} className="flex items-center gap-2">
              {index > 0 && <span className="text-brand-dark/30">/</span>}
              {item.to ? (
                <Link className="hover:text-brand-dark transition-colors" to={item.to}>
                  {item.label}
                </Link>
              ) : (
                <span className="text-brand-dark">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  )
}
