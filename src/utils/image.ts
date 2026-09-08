import type { SyntheticEvent } from 'react'

const PLACEHOLDER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#F5FBF4" />
  <g fill="none" stroke="#B0BEB3" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
    <rect x="40" y="55" width="120" height="90" rx="8" />
    <circle cx="72" cy="85" r="10" />
    <path d="M40 130 L80 100 L110 122 L140 95 L160 115" />
  </g>
</svg>
`.trim()

export const PRODUCT_IMAGE_FALLBACK = `data:image/svg+xml;utf8,${encodeURIComponent(PLACEHOLDER_SVG)}`

export function handleImageError(e: SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget
  if (img.src === PRODUCT_IMAGE_FALLBACK) return
  img.onerror = null
  img.src = PRODUCT_IMAGE_FALLBACK
}
