self.addEventListener('push', function(event) {
    let options = {
      body: event.data.text(),
      icon: '/assets/icons/icon-192x192.png',
      badge: '/assets/icons/icon-192x192.png'
    };
  
    event.waitUntil(
      self.registration.showNotification('New Notification', options)
    );
  });
  
  self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
      clients.openWindow('/')
    );
  });  