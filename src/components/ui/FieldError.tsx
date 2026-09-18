export default function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-[11px] text-status-error mt-1">{message}</p>
}
