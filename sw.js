var CACHE_NAME = 'my-site-mas2';
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
  '/assets/images/nav_my_shopping_list.png'
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

  var cacheWhitelist = ['my-site-mas2'];

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