import { useCart } from '../../context/CartContext'

export default function Toast() {
  const { toastMessage } = useCart()

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-2 pointer-events-none"
    >
      {toastMessage && (
        <div className="toast-enter pointer-events-auto flex items-center gap-2.5 bg-brand-dark text-white text-sm px-4 py-3 rounded-full shadow-lg">
          <span className="material-symbols-outlined text-[18px] text-white/80">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
