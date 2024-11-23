const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express app
const app = express();

// Serve static files (e.g., for the service worker)
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Your VAPID keys
const publicVapidKey = 'BGLwbzz_qBlUqsEis2xT67hoGW2TQxuuN6UPZjWzRlV76oLSF6YAvB2CM9w2JQuDVb0Tu6JfZvVvmpDq0nM9Y_4';
const privateVapidKey = 'oGv-7xJ63OpthC4IYU_Q_HH7DepSmtAveYxFi7CzgkY';

// Set VAPID details
webPush.setVapidDetails(
    'mailto:alsowebhook@gmail.com',
    publicVapidKey,
    privateVapidKey
);

// In-memory store for subscriptions
let subscriptions = [];

// Endpoint to handle subscription
app.post('/subscribe', (req, res) => {
    const subscription = req.body;

    // Save the subscription to the list (In production, use a database)
    subscriptions.push(subscription);
    console.log('New subscription:', subscription);

    res.status(201).json({ message: 'Subscription added successfully' });
});

// Endpoint to handle sending notifications
app.post('/send-notification', (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const payload = JSON.stringify({ body: message });

    const promises = subscriptions.map(subscription => {
        return webPush.sendNotification(subscription, payload)
            .catch(error => {
                console.error('Error sending notification', error);
            });
    });

    // Wait for all notifications to be sent
    Promise.all(promises).then(() => {
        res.status(200).json({ message: 'Notification sent to all subscribers' });
    }).catch(err => {
        res.status(500).json({ error: 'Failed to send notifications' });
    });
});

// Serve the frontend HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});