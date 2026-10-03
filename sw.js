/* TITAN Diet — service worker
   Estrategia: network-first para el HTML (para que se actualice solo),
   cache-first para iconos y manifest. Los datos del usuario NUNCA pasan por aquí:
   viven en localStorage y no se envían a ningún sitio. */
const CACHE = "titan-diet-v9";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./base.js",
  "./recipes.js",
  "./state.js",
  "./recipesui.js",
  "./views.js",
  "./equipo.js",
  "./extras.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", e => {
  // cache:"reload" para no precargar copias viejas de la caché HTTP del navegador (GitHub Pages cachea ~10 min)
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, {cache: "reload"})))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  const isDoc = req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");

  if (isDoc) {
    e.respondWith(
      fetch(req)
        .then(res => {
          // solo se guarda una respuesta buena de la página principal (nunca un 404 de otra ruta)
          const p = url.pathname;
          if (res.ok && (p.endsWith("/") || p.endsWith("/index.html"))) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put("./index.html", copy));
          }
          return res;
        })
        .catch(() => caches.match("./index.html").then(r => r || caches.match("./")))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => hit))
  );
});
