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

// One-time payment migration: switch checkout from Cashfree to Razorpay + COD
// (Cashfree remains available in code and can be re-enabled from Admin > Settings once real keys are added)
if (localStorage.getItem('vf_payment_version') !== '2') {
  const savedSettings = localStorage.getItem('vf_settings');
  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings);
      parsed.isCashfreeEnabled = false;
      parsed.isRazorpayEnabled = true;
      localStorage.setItem('vf_settings', JSON.stringify(parsed));
    } catch {}
  }
  localStorage.setItem('vf_payment_version', '2');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
