// Import required modules
const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

// Initialize Express
const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Retrieve VAPID keys from environment variables
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

// Set VAPID details for web-push
webpush.setVapidDetails(
    'mailto:alsowebhook@gmail.com', // Replace with your contact email
    publicVapidKey,
    privateVapidKey
);

// In-memory storage for subscriptions (use a database in production)
const subscriptions = [];

// Endpoint to save subscriptions
app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);  // Add the new subscription to the list
    console.log('New subscription added:', subscription);
    res.status(201).json({});
});

// Endpoint to send notifications to all subscribed users
app.post('/sendNotification', (req, res) => {
    const { title, message } = req.body;
    const payload = JSON.stringify({ title, message });

    // Send notifications to each subscribed user
    subscriptions.forEach(subscription => {
        webpush.sendNotification(subscription, payload)
            .catch(err => console.error('Error sending notification:', err));
    });

    res.status(200).json({ message: 'Notifications sent!' });
});

// Serve the frontend page (if needed)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});