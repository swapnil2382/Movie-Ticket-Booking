// server.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const bcrypt = require('bcrypt'); // For hashing passwords
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Register a new user
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password

    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], function (err) {
        if (err) {
            return res.status(400).send('User already exists');
        }
        res.status(201).send('User registered');
    });
});

// Login user
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        if (!row || !bcrypt.compareSync(password, row.password)) {
            return res.status(401).send('Invalid username or password');
        }
        res.send('Login successful');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
