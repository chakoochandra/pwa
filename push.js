var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BPHDqkoVnnnvs91dAuqZBSqw9jlvNeLQuO8-WhIgTruJfNRrIrdnsBtNvdqT6ACh-1ZHmNuGpYVElMhD3HlGAGg",
    "privateKey": "pxRyv8jOcKwUF7DIbsxKi5DY_nCJi-fWMaNxfyQ-EFA"
};

webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/d7wBsy9HMsI:APA91bHfDFMAXUQacW4R2bykjS8HakyzpXf2WAEDTPzDOd5lsWFdzL0iN_6tcvaF0pyDMJyWOyB1BxvMd__nKYuD3fhzRguwu8C8IuOSXEujDpOw7iDmFp5mYrijzo2eXPMel_1GHAJn",
    "keys": {
        "p256dh": "BBeNWzzYoZY1X5iOl1XnR9yTXxnwNH4UFpnV6o+7rqPK5LSthCAaMLTAtrzKoGA812u0KhesP0k0dlIp4lrT+WA=",
        "auth": "fWCXKtdyA8BGVNdkRYJuRQ=="
    }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

var options = {
    gcmAPIKey: '842439279291',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);
