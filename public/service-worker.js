self.addEventListener('push', (event) => {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
        body: data.message,
        icon: '/icon.png'  // Optional: You can add a custom icon for the notification
    });
});