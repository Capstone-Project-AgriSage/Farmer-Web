import { useEffect, useId, useRef, type ReactNode } from 'react'

interface ModalProps {
  title: string
  /** Material Symbols name shown before the title. */
  icon?: string
  iconClassName?: string
  onClose: () => void
  /** While true the close button, Esc and the backdrop do nothing (a request is in flight). */
  busy?: boolean
  children: ReactNode
  footer?: ReactNode
}

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Dialog with Esc to close, Tab kept inside, focus moved in on open and returned on close, and page scrolling locked.
 * Corners 8px, one light shadow, no blur.
 */
export default function Modal({ title, icon, iconClassName = 'text-primary-dark', onClose, busy = false, children, footer }: ModalProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const busyRef = useRef(busy)
  busyRef.current = busy

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const panel = panelRef.current
    document.body.style.overflow = 'hidden'
    // First field if there is one, otherwise the first control; the close button comes first in the DOM, so skip it.
    const items = panel ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)) : []
    ;(items.find((el) => el.matches('input, textarea, select')) ?? items[1] ?? items[0])?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busyRef.current) {
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab' || !panel) return
      const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
      opener?.focus()
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[70] bg-brand-dark/50 flex items-center justify-center p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-lenis-prevent
        className="fade-swap bg-brand-cream border border-brand-dark/15 rounded-[var(--radius-modal)] shadow-[0_8px_24px_rgb(0,0,0,0.12)] w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-brand-dark/15">
          <h2 id={titleId} className="flex items-center gap-2 text-lg font-medium text-text-primary">
            {icon && (
              <span className={`material-symbols-outlined ${iconClassName}`} style={{ fontSize: 24 }} aria-hidden="true">
                {icon}
              </span>
            )}
            {title}
          </h2>
          <button type="button" onClick={onClose} disabled={busy} aria-label="Đóng" className="focus-ring w-11 h-11 -mr-2 flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-40">
            <span className="material-symbols-outlined" style={{ fontSize: 24 }} aria-hidden="true">
              close
            </span>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-brand-dark/15 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  )
}
