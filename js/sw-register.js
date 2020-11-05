// Periksa dukungan ServiceWorker
if ("serviceWorker" in navigator) {
    registerServiceWorker();
} else {
    console.log("ServiceWorker belum didukung browser ini.");
}

// Periksa fitur Notification API
if ("Notification" in window) {
    requestPermission();
} else {
    console.error("Browser tidak mendukung notifikasi.");
}

// Periksa PushManager
navigator.serviceWorker.ready.then(() => {
    if (('PushManager' in window)) {
        subscribePushManager();
    }
});

// Subscribe Push Manager
function subscribePushManager() {
    return navigator.serviceWorker.getRegistration().then(function (registration) {
        if (registration != undefined) {
            registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array('BPHDqkoVnnnvs91dAuqZBSqw9jlvNeLQuO8-WhIgTruJfNRrIrdnsBtNvdqT6ACh-1ZHmNuGpYVElMhD3HlGAGg')
            }).then(function (subscribe) {
                console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
                console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                    null, new Uint8Array(subscribe.getKey('p256dh')))));
                console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
                    null, new Uint8Array(subscribe.getKey('auth')))));
            }).catch(function (e) {
                console.error('Tidak dapat melakukan subscribe ', e.message);
            });
        }
    });
}

// Register service worker
function registerServiceWorker() {
    return navigator.serviceWorker
        .register('service-worker.js')
        .then(function (registration) {
            console.log('Registrasi service worker berhasil...');
            return registration;
        })
        .catch(function (err) {
            console.error('Registrasi service worker gagal.', err);
        });
}

// Meminta ijin menggunakan Notification API
function requestPermission() {
    Notification.requestPermission().then(function (result) {
        if (result === "denied") {
            console.log("Fitur notifikasi tidak diijinkan.");
            return;
        } else if (result === "default") {
            console.error("Pengguna menutup kotak dialog permintaan ijin.");
            return;
        }
        console.log("Fitur notifikasi diijinkan.");
    });
}

// convert plain text menjadi Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function showNotifikasiBadge() {
    const title = 'Notifikasi dengan Badge';
    const options = {
        'body': 'Ini adalah konten notifikasi dengan gambar badge.',
        'badge': 'images/icon-128x128.png',
        'icon': 'images/icon-128x128.png',
        // 'tag': 'message-group-1'
    };
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(function (registration) {
            registration.showNotification(title, options);
        });
    } else {
        console.error('Fitur notifikasi tidak diijinkan.');
    }
}