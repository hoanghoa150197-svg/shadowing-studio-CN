(() => {
  'use strict';
  if (!('serviceWorker' in navigator)) return;
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    location.reload();
  });
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js', {scope:'./',updateViaCache:'none'});
      const bar = document.getElementById('pwaUpdateBar');
      const show = () => { if (reg.waiting && navigator.serviceWorker.controller) bar.classList.remove('hide'); };
      document.getElementById('pwaApplyUpdate').addEventListener('click', () => {
        reg.waiting?.postMessage({type:'SKIP_WAITING'});
      });
      if (reg.waiting) show();
      reg.addEventListener('updatefound', () => {
        const worker = reg.installing;
        worker?.addEventListener('statechange', () => { if (worker.state === 'installed') show(); });
      });
      if (navigator.storage?.persist) navigator.storage.persist().catch(() => {});
      document.addEventListener('visibilitychange', () => { if (!document.hidden && navigator.onLine) reg.update().catch(() => {}); });
      if (navigator.onLine) reg.update().catch(() => {});
    } catch (err) { console.warn('PWA registration failed:', err); }
  });
})();
