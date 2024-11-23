const express = require('express');
const app = express();
const firebase = require('firebase-admin');

// Initialize Firebase Admin SDK
firebase.initializeApp({
    credential: firebase.credential.cert(require('./serviceAccountKey.json')), 
    databaseURL: 'https://chatapp-90c78.firebaseio.com'
});

const db = firebase.database();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// Endpoint to fetch messages
app.get('/messages', (req, res) => {
    db.ref('messages').once('value', snapshot => {
        res.json(snapshot.val());
    });
});

// Endpoint to add new message
app.post('/messages', (req, res) => {
    const { username, message, profilePic } = req.body;
    db.ref('messages').push({
        username,
        message,
        profilePic,
        timestamp: new Date().toISOString()
    }).then(() => res.status(200).send('Message sent.'));
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});