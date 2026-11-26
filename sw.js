// Meu Ano com Deus 2027 — funciona sem internet. Versão 202611251708
const CACHE='mlc-pt-202611251708';
const BASE=['./','index.html','manifest.webmanifest','icone-192.png','icone-512.png','icone-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(BASE)).then(()=>self.skipWaiting()));});
// apaga só os caches antigos DESTE idioma (os outros idiomas têm caches próprios)
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&(k.startsWith('mlc-pt-')||/^mlc-\d/.test(k))).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin===location.origin&&(['/en/','/es/','/it/','/regali/','/regalos/'].some(p=>u.pathname.startsWith(p))))return; // pasta de outro idioma: não mexe
  if(r.mode==='navigate'||u.pathname.endsWith('index.html')){
    // sempre tenta a versão nova (atualizações do mês); sem internet, usa a guardada
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put('index.html',c));return res;}).catch(()=>caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{
    if(res.ok&&(u.origin===location.origin||u.host.includes('fonts.g'))){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));}
    return res;})));
});
