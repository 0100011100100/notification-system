const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// VAPID keys (use the ones you generated)
const publicVapidKey = 'BGLwbzz_qBlUqsEis2xT67hoGW2TQxuuN6UPZjWzRlV76oLSF6YAvB2CM9w2JQuDVb0Tu6JfZvVvmpDq0nM9Y_4';
const privateVapidKey = 'oGv-7xJ63OpthC4IYU_Q_HH7DepSmtAveYxFi7CzgkY';

// Set VAPID keys for web-push
webpush.setVapidDetails('mailto:alsowebhook@gmail.com', publicVapidKey, privateVapidKey);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Store subscriptions
let subscriptions = [];

// Subscribe endpoint
app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
});

// Send notification endpoint
app.post('/send-notification', (req, res) => {
  const { message } = req.body;

  const payload = JSON.stringify({ title: 'New Notification', message });

  // Send a notification to all subscriptions
  Promise.all(subscriptions.map(sub => 
    webpush.sendNotification(sub, payload)
  ))
    .then(() => res.status(200).json({ message: 'Notification sent successfully' }))
    .catch(err => {
      console.error('Error sending notification:', err);
      res.status(500).json({ error: 'Error sending notification' });
    });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});