importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

const CACHE_NAME = "firstpwa-v1e";

if (workbox)
  console.log(`Workbox berhasil dimuat`);
else
  console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute([
  { url: '/index.html', revision: '1' },
  { url: '/nav.html', revision: '1' },
  { url: '/team.html', revision: '1' },
  { url: '/manifest.json', revision: '1' },
  { url: '/favicon.ico', revision: '1' },
  { url: '/css/materialize.min.css', revision: '1' },
  { url: '/js/materialize.min.js', revision: '1' },
  { url: '/js/script.js', revision: '1' },
], {
  ignoreUrlParametersMatching: [/.*/]
});

workbox.routing.registerRoute(
  ({ url }) => url.origin === 'https://api.football-data.org',
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'football-data'
  })
);

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

workbox.routing.registerRoute(
  new RegExp('/pages/'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'pages'
  })
);

workbox.routing.registerRoute(
  new RegExp('/images/.*\\.png'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'images'
  })
);

workbox.routing.registerRoute(
  new RegExp('/css/.*\\.css'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'css'
  })
);

workbox.routing.registerRoute(
  new RegExp('/js/.*\\.js'),
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'js'
  })
);

//Push Notification
self.addEventListener('push', event => {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  const options = {
    body: body,
    icon: 'images/icon-128x128.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});
