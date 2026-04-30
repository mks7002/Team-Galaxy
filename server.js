const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(express.json());

// Serving static files from the root directory
app.use(express.static(__dirname));

// Database Connection with improved error logging
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Test Database Connection immediately on startup
pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ Database connection failed:', err.stack);
    }
    console.log('✅ Connected to PostgreSQL successfully');
    release();
});

// Create Table if not exists
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS streamers (
                id SERIAL PRIMARY KEY,
                name TEXT,
                handle TEXT,
                email TEXT,
                phone TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ Database Table initialized");
    } catch (err) { 
        console.error("❌ DB Init Error:", err.message); 
    }
};
initDB();

// API: Register Streamer
app.post('/api/register', async (req, res) => {
    const { name, handle, email, phone } = req.body;
    try {
        await pool.query(
            'INSERT INTO streamers (name, handle, email, phone) VALUES ($1, $2, $3, $4)',
            [name, handle, email, phone]
        );
        res.status(200).json({ message: "Success" });
    } catch (err) {
        console.error("❌ Registration API Error:", err.message);
        res.status(500).json({ error: "Server Error", details: err.message });
    }
});

// API: Admin Login
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    }
    res.status(401).json({ error: "Invalid Credentials" });
});

// API: Get Data (Protected)
app.get('/api/admin/data', async (req, res) => {
    const token = req.headers.authorization;
    if (!token) return res.status(403).json({ error: "No token provided" });

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        const result = await pool.query('SELECT * FROM streamers ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(403).json({ error: "Unauthorized" });
    }
});

// FIXED: Improved Catch-all route
// We check for index.html first. If it's not found, we send a 404.
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send("Error 404: Frontend files (index.html) not found in the root directory.");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));