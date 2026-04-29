const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
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
    } catch (err) { console.error("DB Init Error:", err); }
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
        res.status(500).json({ error: "Server Error" });
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
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        const result = await pool.query('SELECT * FROM streamers ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(403).json({ error: "Unauthorized" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));