const ws = new WebSocket(`ws://${window.location.host}`);

// Handle button click
document.getElementById('openTabsButton').addEventListener('click', () => {
    ws.send('open-tabs'); // Notify server
});

// Handle WebSocket messages
ws.onmessage = (event) => {
    if (event.data === 'open-tabs') {
        const urls = [
            'https://www.example.com',
            'https://www.google.com',
            'https://www.github.com'
        ];

        urls.forEach(url => {
            window.open(url, '_blank');
        });
    }
};
