self.addEventListener('push', (event) => {
    const options = {
      body: event.data.text(),
      icon: '/icon.png',
      badge: '/badge.png',
    };
  
    event.waitUntil(
      self.registration.showNotification('New Notification', options)
    );
  });
  
  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
      clients.openWindow('http://localhost:8080')
    );
  });  