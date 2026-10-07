const CACHE='omr-app-v8';
const ASSETS=['./','./index.html','./manifest.webmanifest','./lib/xlsx.full.min.js','./lib/jspdf.umd.min.js','./img/logo.js',
 './icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png',
 ...[400,500,600,700].flatMap(w=>['arabic','latin'].map(s=>`./fonts/readex-pro-${s}-${w}-normal.woff2`))];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  if(req.mode==='navigate'){
    e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp));return r;}).catch(()=>caches.match('./index.html')));return;}
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{if(r.ok&&new URL(req.url).origin===location.origin){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp));}return r;})));
});
