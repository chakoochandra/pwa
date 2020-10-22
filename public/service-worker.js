// importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');
importScripts('/js/workbox/workbox-sw.js');

if (workbox)
	console.log(`Workbox berhasil dimuat`);
else
	console.log(`Workbox gagal dimuat`);

const CACHE_NAME = 'firstpwa-v1b';

workbox.precaching.precacheAndRoute([
	{ url: '/index.html', revision: '1' },
	{ url: '/nav.html', revision: '1' },
	{ url: '/css/materialize.min.css', revision: '1' },
	{ url: '/js/materialize.min.js', revision: '1' },
	{ url: '/js/script.js', revision: '1' },
]);

workbox.routing.registerRoute(
	new RegExp('/pages/'),
	workbox.strategies.staleWhileRevalidate({
		cacheName: 'pages'
	})
);

var urlsToCache = [
	'/',
	'/css/bootstrap.min.css',
	'/css/style.css',
	'/css/responsive.css',
	'/css/jquery.mCustomScrollbar.min.css',
	'/js/jquery.min.js',
	'/js/popper.min.js',
	'/js/bootstrap.bundle.min.js',
	'/js/jquery-3.0.0.min.js',
	'/js/plugin.js',
	'/js/jquery.mCustomScrollbar.concat.min.js',
	'/js/custom.js'
];

// self.addEventListener('install', function (event) {
// 	event.waitUntil(
// 		caches.open(CACHE_NAME)
// 			.then(function (cache) {
// 				return cache.addAll(urlsToCache);
// 			})
// 	);
// })

// self.addEventListener('activate', function (event) {
// 	event.waitUntil(
// 		caches.keys()
// 			.then(function (cacheNames) {
// 				return Promise.all(
// 					cacheNames.map(function (cacheName) {
// 						if (cacheName != CACHE_NAME) {
// 							console.log("ServiceWorker: cache " + cacheName + " dihapus");
// 							return caches.delete(cacheName);
// 						}
// 					})
// 				);
// 			})
// 	);
// })

// self.addEventListener('fetch', function (event) {
// 	event.respondWith(
// 		caches.match(event.request, { cacheName: CACHE_NAME })
// 			.then(function (response) {
// 				if (response) {
// 					console.log("ServiceWorker: Gunakan aset dari cache: ", response.url);
// 					return response;
// 				}

// 				console.log("ServiceWorker: Memuat aset dari server: ", event.request.url);
// 				return fetch(event.request);
// 			})
// 	);
// });

