// server.js - Adapted from Week 5 Slides [cite: 1361-1423]
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json()); // Allows us to read JSON from requests

// A simple file to act as our "Database"
const USERS_FILE = './users.json';

// Helper function to read users from the file
const getUsers = () => {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
};

// Helper function to save users to the file
const saveUsers = (data) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
};

// --- 1. REGISTER ROUTE ---
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const users = getUsers();

        // Check if user already exists
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ error: "User already exists!" });
        }

        // Hash the password (Security Best Practice)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const newUser = { id: Date.now(), name, email, password: hashedPassword };
        users.push(newUser);
        saveUsers(users);

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Error registering user" });
    }
});

// --- 2. LOGIN ROUTE (Generates JWT) ---
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = getUsers();
        const user = users.find(u => u.email === email);

        if (!user) return res.status(400).json({ error: "User not found" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        // Generate Token [cite: 1399]
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login Successful", token: token });
    } catch (err) {
        res.status(500).json({ error: "Error logging in" });
    }
});

// --- 3. PROTECTED ROUTE (Requires Token) ---
const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>
    if (!token) return res.status(401).json({ error: "Access Denied" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid Token" });
        req.user = user;
        next();
    });
};

app.get('/profile', authenticate, (req, res) => {
    res.json({ message: `Welcome back, ${req.user.email}. This is private data.` });
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));