// Meu Ano com Deus 2027 — funciona sem internet. Versão 202611251520
const CACHE='mlc-202611251520';
const BASE=['./','index.html','manifest.webmanifest','icone-192.png','icone-512.png','icone-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(BASE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(r.mode==='navigate'||u.pathname.endsWith('index.html')){
    // sempre tenta a versão nova (atualizações do mês); sem internet, usa a guardada
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put('index.html',c));return res;}).catch(()=>caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{
    if(res.ok&&(u.origin===location.origin||u.host.includes('fonts.g'))){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));}
    return res;})));
});
