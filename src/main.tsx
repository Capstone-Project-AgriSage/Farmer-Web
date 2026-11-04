import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource/be-vietnam-pro/800.css'
import './index.css'
import App from './App.tsx'
import { installLookupCacheInvalidation } from './api/lookupCache'

const disposeLookupCache = installLookupCacheInvalidation()
import.meta.hot?.dispose(disposeLookupCache)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
