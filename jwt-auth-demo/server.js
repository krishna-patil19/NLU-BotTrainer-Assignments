// server.js - Debugged & Fixed
require('dotenv').config(); // Loads .env file
const express = require('express');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const USERS_FILE = './users.json';
// Use the secret from .env, fallback to a warning string if missing (for debugging)
const JWT_SECRET = process.env.JWT_SECRET; 

if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in .env file.");
    process.exit(1);
}

// Helper function to read users
const getUsers = () => {
    if (!fs.existsSync(USERS_FILE)) return [];
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf-8');
        return data ? JSON.parse(data) : [];
    } catch (err) {
        return [];
    }
};

// Helper function to save users
const saveUsers = (data) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
};

// --- 1. REGISTER ROUTE ---
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // FIX: Basic Validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Please provide name, email, and password." });
        }

        const users = getUsers();

        if (users.find(u => u.email === email)) {
            return res.status(400).json({ error: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { id: Date.now(), name, email, password: hashedPassword };
        
        users.push(newUser);
        saveUsers(users);

        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error registering user" });
    }
});

// --- 2. LOGIN ROUTE ---
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // FIX: Basic Validation
        if (!email || !password) {
            return res.status(400).json({ error: "Please provide email and password." });
        }

        const users = getUsers();
        const user = users.find(u => u.email === email);

        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        // FIX: Use process.env.JWT_SECRET instead of hardcoded string
        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            JWT_SECRET, 
            { expiresIn: "1h" }
        );

        res.json({ message: "Login Successful", token: token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error logging in" });
    }
});

// --- 3. PROTECTED ROUTE ---
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) return res.status(401).json({ error: "Access Denied" });

    // FIX: Use process.env.JWT_SECRET
    jwt.verify(token, JWT_SECRET, (err, user) => {
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