// Offline helper: keeps a copy of the app's own files on the phone so it opens without internet.
// It never sends your tasks anywhere. It only stores this app's code files,
// plus one tiny note saying which mascot you picked (so the home screen icon can match it).
const CACHE = 'little-tasks-v4';
const SETTINGS = 'little-tasks-settings';
const FILES = ['./', 'index.html', 'style.css', 'app.js', 'manifest.json', 'icons/icon-192.png', 'icons/apple-touch-icon.png'];
const MASCOTS = ['sprout', 'iris', 'momo', 'potato', 'penguin', 'sloth', 'ghost', 'cloud', 'moon', 'dragon', 'frog', 'plant'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== SETTINGS).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// The page tells us which mascot is chosen. Saved on the phone only.
self.addEventListener('message', (e) => {
  const d = e.data || {};
  if (d.type === 'mascot' && MASCOTS.includes(d.id)) {
    e.waitUntil(caches.open(SETTINGS).then((c) => c.put('mascot', new Response(d.id))));
  }
});

async function chosenMascot() {
  try {
    const r = await (await caches.open(SETTINGS)).match('mascot');
    const id = r && (await r.text());
    return MASCOTS.includes(id) ? id : 'sprout';
  } catch (e) { return 'sprout'; }
}

// Serve the app's manifest with icons that match the chosen mascot.
// Chrome reads this when it checks for app updates, and then updates the home screen icon.
async function manifestFor(request) {
  let res;
  try { res = await fetch(request); (await caches.open(CACHE)).put(request, res.clone()); }
  catch (e) { res = await caches.match(request, { ignoreSearch: true }); }
  if (!res) return Response.error();
  const m = await res.json();
  const id = await chosenMascot();
  m.icons = [
    { src: `icons/m/${id}-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: `icons/m/${id}-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: `icons/m/${id}-maskable.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' }
  ];
  return new Response(JSON.stringify(m), { headers: { 'Content-Type': 'application/manifest+json' } });
}

// Network first (so updates arrive), fall back to the saved copy when offline.
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.pathname.endsWith('/manifest.json')) { e.respondWith(manifestFor(e.request)); return; }
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('index.html')))
  );
});
