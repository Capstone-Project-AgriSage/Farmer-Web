import { useCart } from '../../context/CartContext'

export default function Toast() {
  const { toastMessage } = useCart()

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-2 pointer-events-none"
    >
      {toastMessage && (
        <div className="toast-enter pointer-events-auto flex items-center gap-2.5 bg-primary-dark text-white text-sm font-medium px-4 py-3 rounded-lg shadow-floating">
          <span className="material-symbols-outlined text-[20px] text-emerald-300">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
