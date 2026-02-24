const mysql = require('mysql2');
require('dotenv').config();

// First connection without database to create it
const createDbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

// Create database if it doesn't exist - Optimized
createDbConnection.query(
  `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`,
  (err) => {
    if (err && err.code !== 'ER_DB_CREATE_EXISTS') {
      console.error('Error creating database:', err);
    }
    createDbConnection.end();
  }
);

// Main connection pool - Optimized
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 20, // Increased from 10
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

const promisePool = pool.promise();

module.exports = promisePool;
