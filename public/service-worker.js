self.addEventListener('push', (event) => {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
        body: data.message,
        icon: 'https://cdn.creazilla.com/icons/3247957/notification-icon-md.png'  // Replace with the path to your notification icon
    });
});