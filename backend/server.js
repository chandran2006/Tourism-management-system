const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { createTables } = require('./config/initDb');
const authRoutes = require('./routes/authRoutes');
const placeRoutes = require('./routes/placeRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Initialize database and start server
const PORT = process.env.PORT || 5000;

// Wait for database creation then initialize tables
setTimeout(() => {
  createTables().then(() => {
    app.listen(PORT, () => {
      console.log(`\n✅ Server running on http://localhost:${PORT}`);
      console.log(`✅ API available at http://localhost:${PORT}/api`);
      console.log(`✅ Health check: http://localhost:${PORT}/api/health\n`);
    });
  }).catch(err => {
    console.error('❌ Database initialization failed:', err.message);
    console.log('\n⚠️  Please ensure MySQL is running and credentials in .env are correct\n');
  });
}, 2000);
