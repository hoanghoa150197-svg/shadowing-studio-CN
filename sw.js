/* Chinese Shadowing Studio PWA - update VERSION on each release */
const VERSION = '2026.10.22.1';
const SHELL = 'zh-shadowing-shell-' + VERSION;
const RUNTIME = 'zh-shadowing-runtime-' + VERSION;
const APP = ['./', './index.html', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './pwa.js'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL).then(cache => cache.addAll(APP)));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith('zh-shadowing-') && key !== SHELL && key !== RUNTIME) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data && event.data.type === 'GET_VERSION') event.source?.postMessage({type:'VERSION',version:VERSION});
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return;
  if (url.origin === self.location.origin) {
    // Network first for HTML: new deployments are picked up; offline falls back to shell.
    if (req.mode === 'navigate') {
      event.respondWith((async () => {
        try {
          const res = await fetch(req);
          if (res.ok) { const cache = await caches.open(SHELL); await cache.put('./index.html', res.clone()); }
          return res;
        } catch (_) { return (await caches.match('./index.html')) || Response.error(); }
      })());
      return;
    }
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      const response = await fetch(req);
      if (response.ok) { const cache = await caches.open(RUNTIME); await cache.put(req,response.clone()); }
      return response;
    })());
    return;
  }
  // Third-party JS, model assets, and audio: cache only if actually requested and downloaded.
  // Cross-origin opaque responses may consume storage; browser quota still applies.
  if (!['cdn.jsdelivr.net','esm.sh','huggingface.co','cdn-lfs.huggingface.co','cas-bridge.xethub.hf.co','cas-server.xethub.hf.co'].includes(url.hostname)
      && !url.hostname.endsWith('.huggingface.co')) return;
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    const response = await fetch(req);
    if (response.ok || response.type === 'opaque') {
      try { const cache = await caches.open(RUNTIME); await cache.put(req,response.clone()); } catch (_) { /* quota exceeded */ }
    }
    return response;
  })());
});
