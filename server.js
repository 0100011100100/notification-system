const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const firebase = require('firebase');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Firebase configuration (without service account key)
const firebaseConfig = {
    apiKey: "AIzaSyAe0hXfAJ0ijKNiGgAVfv4zG1ngADF2E4c",
    authDomain: "chatapp-90c78.firebaseapp.com",
    projectId: "chatapp-90c78",
    storageBucket: "chatapp-90c78.appspot.com",
    messagingSenderId: "195015101932",
    appId: "1:195015101932:web:f352296f341c58458a84c9",
    databaseURL: "https://chatapp-90c78-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Routes
app.get('/', (req, res) => {
    res.send('Notification system is running');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
