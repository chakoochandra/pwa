let webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BPHDqkoVnnnvs91dAuqZBSqw9jlvNeLQuO8-WhIgTruJfNRrIrdnsBtNvdqT6ACh-1ZHmNuGpYVElMhD3HlGAGg",
    "privateKey": "pxRyv8jOcKwUF7DIbsxKi5DY_nCJi-fWMaNxfyQ-EFA"
};

webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
const pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/cGP2lkdHbmo:APA91bF71iZZ32SQDKqGOfv_sugDQ6KTs9sDZcWA6kzdsHvuM2h-xnkqS7CGl7aRqxE30zzGYKYHjhQMlD6rnxqV2OGb2AjRzQeVUzxC-rDW99vInzLAeDAqaNk9__VSRuKjHnuW4geV",
    "keys": {
        "p256dh": "BCjqFcaHV24w62N/U5eDb4Gtz0d2IOEBPmXBokvhcwGIKULuDwawxuxjBuykFDl2VFnBSeNs/59Ki7leo43P+jE=",
        "auth": "TLj7Q8NTbf7zrHRY9k8iTA=="
    }
};
const payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

const options = {
    gcmAPIKey: '842439279291',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);
