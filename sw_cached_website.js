const cacheName = 'v1';

//Installing Service Worker
self.addEventListener('install', (e)=> {
    console.log("Service Woker: Installed");

/*    e.waitUntil(
        caches
        .open(cacheName)
        .then(cache => {
            console.log("Service Worker: Caching Files");
            cache.addAll(cacheAssets);
        })
        .then(()=> 
            self.skipWaiting
        )
    );*/
})

//Call Activate Event
self.addEventListener('activate', (e)=> {
    console.log("Service Woker: Activated");
    // Remove unwanted caches
    e.waitUntil( 
        caches.keys().then(cacheNames =>{
            console.log("Clearing Old cache!")

            return Promise.all(
            
            cacheNames.map(cache => {
                console.log("cachenames",cache);
                if(cache !==cacheName){
                    console.log("Deleting cache : ",this.cache);
                    return caches.delete(cache);
                }
            })
            
        );
    }
    )
    
);
})

/*
self.addEventListener('fetch',e =>{
    console.log("Service Worker: Fetching");
//want to cache first response, and then when the app is offline, want to return response from the cache.
    e.respondWith(
//Caching

        fetch(e.request).then( response => {
            const respClone = response.clone();
            caches.open(cacheName).then(cache => {
                cache.put(e.request, respClone).then(()=>{
                    console.log("Inserted response to cache.")
                });
            })

            return response;
        }).catch(()=>{
            console.log("Response from Service Worker.");
            caches.match(e.request).then( resp => resp);
        }
        )
    );
   
 
})*/

// Call Fetch Event
self.addEventListener('fetch', e => {
    console.log('Service Worker: Fetching');
    e.respondWith(
      fetch(e.request)
        .then(res => {
          // Make copy/clone of response
          const resClone = res.clone();
          // Open cahce
          caches.open(cacheName).then(cache => {
            // Add response to cache
            cache.put(e.request, resClone).then(n=>{
                console.log("Successfully put in cache.")
            })
            .catch(err => {
                console.log(`Error occured while putting response in cache: ${err}`)
            });
          });
          return res;
        })
        .catch(err => caches.match(e.request).then(res => {
            console.log("Returning from cache");
            return res}))
    );
  });