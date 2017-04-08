var CACHE_NAME = 'fergg1';
var urlsToCache = [
  '/',
  '/assets/images/add_product.png',
  '/assets/images/btn-footer-facebook.png',
  '/assets/images/btn-footer-mail.png',
  '/assets/images/btn-footer-twitter.png',
  '/assets/images/button_article_in_basket.png',
  '/assets/images/button_article_not_in_basket.png',
  '/assets/images/button_remove_from_catalog.png',
  '/assets/images/button_remove_from_shopping_list.png',
  '/assets/images/delete_button.png',
  '/assets/images/edit-button.png',
  '/assets/images/logo_fergg_100px.jpg',
  '/assets/images/nav_clear_shopping_list.png',
  '/assets/images/nav_create_new_shopping_list.png',
  '/assets/images/nav_delete-shopping_list.png',
  '/assets/images/nav_edit_shopping_list.png',
  '/assets/images/nav_help.png',
  '/assets/images/nav_manage_catalog.png',
  '/assets/images/nav_mark_shopping_as_finished.png',
  '/assets/images/nav_my_shopping_list.png',
  '/0.db48daa1158fbc19dc7a.chunk.js',
  '/1.7e05341eb6c6a4ea273b.chunk.js',
  '/2.020f1754399ee2548c5d.chunk.js',
  '/3.8217ad434aca7ad22d0a.chunk.js',
  '/4.91b70492c391e3764665.chunk.js',
  '/5.449beac1210a15616628.chunk.js',
  '/6.0f142da0b82623d1576c.chunk.js',
  '/7.95ba602cdee8f3f44196.chunk.js',
  '/8.5ffcad1d2dd47ab0c2ca.chunk.js',
  '/9.f0a83b0637eca5661750.chunk.js',
  '/favicon.ico',
  '/inline.7ee39d86eef106286507.bundle.js',
  '/main.ef7ab008a3a3ef57a2ae.bundle.js',
  '/polyfills.1e07d94a71911e748dfd.bundle.js',
  '/styles.37fde8e21b8068798d06.bundle.css',
  '/vendor.e7c1a03f5f4fc1c877da.bundle.js',
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {

  var cacheWhitelist = ['fergg1'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});