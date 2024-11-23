const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');

// Initialize the app
const app = express();
const port = 8080;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// VAPID Keys (replace with your own generated keys)
const publicKey = 'BN0HFyIuQIRGL0z77fuxu5FoOt21UoQ5Ub0rP6Xxwbk3BjuKdj18FwC_fBHnOGbib5Tiwqq73r47hu2iKGq6PVo';
const privateKey = 'tsGtUtcR0ngu0PJX0J7e3h1EbUXXWveNI0qOjIV1SZk';

// Set VAPID details
webpush.setVapidDetails(
  'mailto:your-email@example.com', // Replace with your contact email
  publicKey,
  privateKey
);

// Array to store subscriptions (in-memory storage for now)
let subscriptions = [];

// Serve the public key to clients
app.get('/public-key', (req, res) => {
  res.send({ publicKey });
});

// Endpoint to add new subscription
app.post('/subscribe', (req, res) => {
  const subscription = req.body;

  // Add the new subscription to the array
  subscriptions.push(subscription);
  console.log('New subscription added:', subscription);

  res.status(201).json({});
});

// Endpoint to send notifications to all subscribers
app.post('/send-notification', (req, res) => {
  const notificationPayload = req.body;

  // Loop through all subscriptions and send the notification
  const promises = subscriptions.map((subscription) => {
    return webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
      .catch(err => {
        console.error('Error sending notification:', err);
      });
  });

  // Wait for all notifications to be sent
  Promise.all(promises).then(() => {
    res.status(200).send('Notifications sent!');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});