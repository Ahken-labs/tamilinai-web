// Stores nothing, so the app always loads the latest site; only shows an offline page when there is no internet

const OFFLINE_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>You're offline | Inai</title>
<style>
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #F8F5F2; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; color: #222222; padding: 16px; box-sizing: border-box; text-align: center; }
  h1 { font-size: 22px; margin: 0 0 8px; }
  p { font-size: 15px; color: #6B6B6B; margin: 0 0 24px; line-height: 1.5; }
  button { background: #B31B38; color: #FFFFFF; border: 0; border-radius: 999px; padding: 12px 28px; font-size: 15px; font-weight: 600; cursor: pointer; }
</style>
</head>
<body>
  <div>
    <h1>You're offline</h1>
    <p>Check your internet connection and try again.</p>
    <button onclick="location.reload()">Try again</button>
  </div>
</body>
</html>`;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    // Preload lets the page request start while the worker wakes up, so pages are not slower
    if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  // Only page loads; images, scripts and API calls go straight to the network as normal
  if (event.request.mode !== "navigate") return;
  event.respondWith((async () => {
    try {
      const preloaded = await event.preloadResponse;
      if (preloaded) return preloaded;
      return await fetch(event.request);
    } catch {
      return new Response(OFFLINE_HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }
  })());
});
