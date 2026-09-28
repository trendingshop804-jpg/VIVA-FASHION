import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/common/ErrorBoundary'

// One-time migration: clear stale cached data when the storefront design changes
if (localStorage.getItem('vf_design_version') !== '3') {
  ['vf_products', 'vf_cms_draft_config', 'vf_cms_published_config'].forEach((key) =>
    localStorage.removeItem(key)
  );
  localStorage.setItem('vf_design_version', '3');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
