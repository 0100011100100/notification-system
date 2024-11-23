const express = require('express');
const webPush = require('web-push');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// VAPID Keys - Replace these with your own VAPID keys
const publicVapidKey = 'BGLwbzz_qBlUqsEis2xT67hoGW2TQxuuN6UPZjWzRlV76oLSF6YAvB2CM9w2JQuDVb0Tu6JfZvVvmpDq0nM9Y_4';
const privateVapidKey = 'oGv-7xJ63OpthC4IYU_Q_HH7DepSmtAveYxFi7CzgkY';

// Store subscriptions (in-memory for simplicity, use a database in production)
let subscriptions = [];

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to receive subscription data from the client
app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    console.log('New subscription:', subscription);
    res.status(201).json({});
});

// Endpoint to send push notifications to all subscribers
app.post('/send-notification', (req, res) => {
    const { message } = req.body;
    
    // Send notification to all subscriptions
    const payload = JSON.stringify({
        title: 'New Notification',
        body: message,
    });

    const options = {
        vapidDetails: {
            subject: 'mailto:alsowebhook@gmail.com',
            publicKey: publicVapidKey,
            privateKey: privateVapidKey,
        },
        TTL: 60,
    };

    // Send to all subscriptions
    Promise.all(subscriptions.map(subscription => {
        return webPush.sendNotification(subscription, payload, options);
    }))
    .then(() => res.status(200).json({ message: 'Notification sent to all subscribers!' }))
    .catch(err => {
        console.error('Error sending notification', err);
        res.status(500).json({ error: 'Failed to send notifications' });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});