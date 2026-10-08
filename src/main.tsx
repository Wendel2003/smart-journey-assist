import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {registerSW} from 'virtual:pwa-register';

// Auto-register and update Service Worker for offline tour operation
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('[PWA] New version available, updating service worker...');
    updateSW(true);
  },
  onOfflineReady() {
    console.log('[PWA] Essential tour assets and itinerary ready for offline use.');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
