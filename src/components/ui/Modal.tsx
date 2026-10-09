import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import './modal.css'

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
 * Shared spacious layout: fixed header/footer, scrolling content, responsive width.
 */
export default function Modal({ title, icon, iconClassName = 'text-primary-dark', onClose, busy = false, children, footer }: ModalProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  const busyRef = useRef(busy)
  useEffect(() => {
    onCloseRef.current = onClose
    busyRef.current = busy
  }, [onClose, busy])

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const panel = panelRef.current
    document.body.style.overflow = 'hidden'
    // First field if there is one, otherwise the first control; the close button comes first in the DOM, so skip it.
    const items = panel ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)) : []
      ; (items.find((el) => el.matches('input, textarea, select')) ?? items[1] ?? items[0])?.focus()

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

  return createPortal(
    <div
      className="modal-overlay"
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
        className="modal-panel fade-swap"
      >
        <div className="modal-header flex items-center justify-between gap-4">
          <h2 id={titleId} className="flex items-center gap-2 text-lg font-medium text-text-primary">
            {icon && (
              <span className={`material-symbols-outlined ${iconClassName}`} style={{ fontSize: 24 }} aria-hidden="true">
                {icon}
              </span>
            )}
            {title}
          </h2>
          <button type="button" onClick={onClose} disabled={busy} aria-label="Đóng" className="modal-close focus-ring">
            <span className="material-symbols-outlined" style={{ fontSize: 24 }} aria-hidden="true">
              close
            </span>
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
