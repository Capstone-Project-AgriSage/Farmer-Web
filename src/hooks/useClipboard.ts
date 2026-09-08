import { useState } from 'react'

export function useClipboard<T extends string>(resetDelayMs = 1500) {
  const [copiedField, setCopiedField] = useState<T | null>(null)

  const copy = (field: T, value: string) => {
    const markCopied = () => {
      setCopiedField(field)
      setTimeout(() => setCopiedField((f) => (f === field ? null : f)), resetDelayMs)
    }

    const fallbackCopy = () => {
      const textarea = document.createElement('textarea')
      textarea.value = value
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      try {
        document.execCommand('copy')
        markCopied()
      } catch {
        // Clipboard access unavailable in this environment; ignore silently.
      }
      document.body.removeChild(textarea)
    }

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(value).then(markCopied, fallbackCopy)
    } else {
      fallbackCopy()
    }
  }

  return { copiedField, copy }
}
