// Service Worker for push notifications
declare const self: ServiceWorkerGlobalScope;

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event: PushEvent) => {
  if (event.data) {
    const data = event.data.json();
    const options: NotificationOptions = {
      body: data.body || 'New notification',
      icon: '/logo.png',
      badge: '/badge.png',
      tag: data.tag || 'notification',
      requireInteraction: false,
    };

    event.waitUntil(self.registration.showNotification(data.title || 'Notification', options));
  }
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return (client as WindowClient).focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});
