const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const { createTables } = require('./config/initDb');
const authRoutes = require('./routes/authRoutes');
const placeRoutes = require('./routes/placeRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatRoutes = require('./routes/chatRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const transportRoutes = require('./routes/transportRoutes');
const tripPlannerRoutes = require('./routes/tripPlannerRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST']
  }
});

// Make io accessible to routes
app.set('io', io);

// Middleware - Optimized
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression for faster responses (install with: npm install compression)
// const compression = require('compression');
// app.use(compression());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Travel Super App Routes
app.use('/api/chat', chatRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/trips', tripPlannerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Get active users (for admin)
app.get('/api/admin/active-users', (req, res) => {
  // This will be handled by adminRoutes
  res.json({ message: 'Use /api/admin/users endpoint' });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('✅ Admin connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('❌ Admin disconnected:', socket.id);
  });
});

// Initialize database and start server
const PORT = process.env.PORT || 5000;

// Optimized: Remove delay, initialize immediately
createTables().then(() => {
  server.listen(PORT, () => {
    console.log(`\n✅ Server running on http://localhost:${PORT}`);
    console.log(`✅ API available at http://localhost:${PORT}/api`);
    console.log(`✅ Socket.io ready for real-time updates`);
    console.log(`✅ Health check: http://localhost:${PORT}/api/health\n`);
  });
}).catch(err => {
  console.error('❌ Database initialization failed:', err.message);
  console.log('\n⚠️  Please ensure MySQL is running and credentials in .env are correct\n');
  process.exit(1);
});
