const V='sg-v1';
const ASSETS=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.origin!==location.origin)return; // api.github.com и прочее — мимо кэша
  if(e.request.mode==='navigate'||u.pathname.endsWith('index.html')||u.pathname.endsWith('/')){
    e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp));return r;})
      .catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
  }else{
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(rr=>{const cp=rr.clone();caches.open(V).then(c=>c.put(e.request,cp));return rr;})));
  }});
