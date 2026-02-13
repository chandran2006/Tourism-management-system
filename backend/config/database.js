const mysql = require('mysql2');
require('dotenv').config();

// First connection without database to create it
const createDbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

// Create database if it doesn't exist
createDbConnection.query(
  `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`,
  (err) => {
    if (err) console.error('Error creating database:', err);
    else console.log('Database ready');
    createDbConnection.end();
  }
);

// Main connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

module.exports = promisePool;
