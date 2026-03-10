const mysql = require('mysql2');
require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// First connection without database to create it
const createDbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

// Create database if it doesn't exist
createDbConnection.query(
  `CREATE DATABASE IF NOT EXISTS ${mysql.escapeId(process.env.DB_NAME)}`,
  (err) => {
    if (err && err.code !== 'ER_DB_CREATE_EXISTS') {
      console.error('Error creating database:', err);
    }
    createDbConnection.end();
  }
);

// Main connection pool with optimized settings
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  multipleStatements: false, // Security: Prevent SQL injection via multiple statements
  charset: 'utf8mb4' // Support for emojis and special characters
});

const promisePool = pool.promise();

// Test connection
promisePool.query('SELECT 1')
  .then(() => console.log('✅ Database connection established'))
  .catch(err => console.error('❌ Database connection failed:', err.message));

module.exports = promisePool;
