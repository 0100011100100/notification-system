self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    
    const options = {
        body: data.body,
        icon: 'icon.png',
        badge: 'badge.png',
        actions: [
            {
                action: 'reply',
                title: 'Reply',
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Message from Website', options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    // Open the web page when notification is clicked
    event.waitUntil(
        clients.openWindow('/').then(windowClient => {
            if (windowClient) {
                windowClient.postMessage({
                    type: 'notification-click',
                    message: event.notification.body
                });
            }
        })
    );
});

self.addEventListener('message', event => {
    if (event.data && event.data.type === 'notification-click') {
        // Handle the reply or further action if needed
        console.log('Notification clicked, message:', event.data.message);
    }
});