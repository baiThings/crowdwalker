if('serviceWorker' in navigator){
    try {
      navigator.serviceWorker.register('serviceWorker.js');
      console.log("Service Worker Registered");
    } catch (error) {
      console.log("Service Worker Registration Failed");
    }
  }

  const staticAssets=[
    './',
    './public/style.css',
    './src/index.js',
    './src/map.js',
    './index.html',
    './src/parsing.js',
    './src/store.js',
    './src/form.js',
    './src/localStorage.js',
    './src/formData.js',
    './src/resource.js',
    './src/file.js',
    './src/component.js',
    './resoucre/sj3.csv',
    './resoucre/dongToJson.json',
    './resource/toiletData.json',
    './resource/marker_green.png',
    './resource/marker_red.png',
    './resoucre/marker_grey.png',
    './resouce/marker_yellow.png',
];

self.addEventListener('install', async event=>{
    const cache = await caches.open('static-cache');
    cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);

    if(url.origin === location.url){
        event.respondWith(cacheFirst(req));
    } else {
        event.respondWith(newtorkFirst(req));
    }
});

async function cacheFirst(req){
    const cachedResponse = caches.match(req);
    return cachedResponse || fetch(req);
}

async function newtorkFirst(req){
    const cache = await caches.open('dynamic-cache');

    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (error) {
        return await cache.match(req);
    }
}