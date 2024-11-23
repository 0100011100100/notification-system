const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const fs = require('fs');

const app = express();
const port = 3001;  // Updated port to avoid conflict

// VAPID keys (update with your generated keys)
const publicKey = 'BGLwbzz_qBlUqsEis2xT67hoGW2TQxuuN6UPZjWzRlV76oLSF6YAvB2CM9w2JQuDVb0Tu6JfZvVvmpDq0nM9Y_4';
const privateKey = 'oGv-7xJ63OpthC4IYU_Q_HH7DepSmtAveYxFi7CzgkY';

// Configure webpush with VAPID keys
webpush.setVapidDetails(
    'mailto:alsowebhook@gmail.com',  // Email for subscription notifications
    publicKey,
    privateKey
);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Serve the index.html when the user visits the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle the subscription request from the client
app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    console.log('User subscribed:', subscription);

    // Save the subscription in a file (could be a database in production)
    fs.readFile('subscriptions.json', (err, data) => {
        let subscriptions = [];
        if (err) {
            console.error(err);
        } else {
            subscriptions = JSON.parse(data);
        }

        subscriptions.push(subscription);

        fs.writeFile('subscriptions.json', JSON.stringify(subscriptions), (err) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            } else {
                res.status(201).send('Subscription added');
            }
        });
    });
});

// Send notifications to all subscribed users
app.post('/send-notification', (req, res) => {
    const { message } = req.body;

    fs.readFile('subscriptions.json', (err, data) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
            return;
        }

        const subscriptions = JSON.parse(data);

        const payload = JSON.stringify({ message });

        // Send notifications to each subscriber
        subscriptions.forEach(subscription => {
            webpush.sendNotification(subscription, payload)
                .then(response => {
                    console.log('Notification sent', response);
                })
                .catch(err => {
                    console.error('Error sending notification', err);
                });
        });

        res.status(200).json({ message: 'Notification sent to all subscribers' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});