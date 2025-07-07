const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'shoes_phones_shop',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function connect() {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to database');
        connection.release();
        return true;
    } catch (error) {
        console.error('Error connecting to database:', error);
        throw error;
    }
}

async function query(sql, params) {
    try {
        const [rows] = await pool.execute(sql, params);
        return rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

module.exports = {
    connect,
    query
};