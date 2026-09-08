import { useEffect } from 'react'

const SITE_NAME = 'AgriSage'

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Nông nghiệp số & Chẩn đoán AI`
  }, [title])
}
