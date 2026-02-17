# Travel Super App - Installation & Setup Guide

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **MySQL** (v8.0 or higher)
- **OpenAI API Key** (for AI chatbot)

## 🚀 Quick Start

### 1. Database Setup

```bash
# Start MySQL service
# Windows:
net start MySQL80

# Create database and run migration
mysql -u root -p < backend/super_app_migration.sql
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env and add your credentials:
# - DB_PASSWORD=your_mysql_password
# - OPENAI_API_KEY=your_openai_api_key
# - JWT_SECRET=your_secure_random_string

# Start backend server
npm start
# Or for development with auto-reload:
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (if needed)
echo REACT_APP_API_URL=http://localhost:5000/api > .env

# Start frontend
npm start
```

Frontend will run on `http://localhost:3000`

## 📦 Dependencies Installed

### Backend
- `express` - Web framework
- `mysql2` - MySQL client
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `axios` - HTTP client for OpenAI API
- `dotenv` - Environment variables
- `cors` - CORS middleware
- `socket.io` - Real-time communication

### Frontend
- `react` - UI library
- `axios` - HTTP client
- `react-router-dom` - Routing

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mini
JWT_SECRET=your_jwt_secret_min_32_chars
OPENAI_API_KEY=sk-your-openai-api-key
ADMIN_SECRET_KEY=RPHM
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🎯 Available API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### AI Chatbot
- `POST /api/chat` - Send message to AI
- `POST /api/chat/suggest` - Get structured suggestions
- `GET /api/chat/history` - Get chat history
- `DELETE /api/chat/history` - Clear chat history

### Expense Tracker
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses/:id` - Get expense by ID
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/trip/:tripId/summary` - Get trip summary
- `GET /api/expenses/trip/:tripId/compare` - Compare budget

### Hotels
- `GET /api/hotels` - Get all hotels with filters
- `GET /api/hotels/:id` - Get hotel by ID
- `GET /api/hotels/city/:city` - Get hotels by city
- `GET /api/hotels/search` - Search hotels
- `POST /api/hotels/recommendations` - Get recommendations

### Transport
- `POST /api/transport/calculate` - Calculate transport cost
- `POST /api/transport/options` - Get all transport options
- `POST /api/transport/best` - Get best transport option
- `POST /api/transport/recommendations` - Get recommendations

### Trip Planner
- `POST /api/trips` - Create trip plan
- `GET /api/trips` - Get all trips
- `GET /api/trips/:id` - Get trip details
- `GET /api/trips/:id/budget` - Get trip budget breakdown

## 🎨 Key Features Implemented

### 1. AI Travel Chatbot
- OpenAI GPT-4o-mini integration
- Conversation history
- Structured suggestions for places, hotels, itineraries
- Budget estimation
- Transport advice

### 2. Expense Tracker
- CRUD operations for expenses
- Category-wise breakdown
- Budget vs actual comparison
- Real-time warnings for overspending
- Visual pie chart representation

### 3. Hotel Module
- Comprehensive hotel database
- Advanced filtering (price, rating, location)
- Search functionality
- City-wise statistics
- Recommendations based on budget

### 4. Transport Module
- Distance calculation
- Cost estimation for multiple modes
- Travel time estimation
- Best transport suggestions
- Multi-destination trip cost calculator

### 5. Trip Planner
- Integrated trip planning
- AI-generated itineraries
- Hotel recommendations
- Transport cost estimation
- Complete budget breakdown
- Expense tracking integration

## 🔧 Troubleshooting

### Database Connection Error
```bash
# Check MySQL is running
# Update DB credentials in backend/.env
# Ensure database 'mini' exists
```

### OpenAI API Error
```bash
# Verify OPENAI_API_KEY in .env
# Check API key is valid and has credits
```

### Port Already in Use
```bash
# Change PORT in backend/.env
# Update REACT_APP_API_URL in frontend/.env
```

## 📝 Sample Data

The migration SQL includes sample hotels in major Indian cities:
- Mumbai, Delhi, Bangalore, Goa, Jaipur, Chennai

You can add more using the admin endpoints or directly via SQL.

## 🚀 Production Deployment

1. Set `NODE_ENV=production` in backend/.env
2. Change `JWT_SECRET` to a strong random string
3. Update database credentials
4. Build frontend: `npm run build`
5. Serve frontend build with nginx or serve
6. Use PM2 or similar for backend process management

## 📚 API Documentation

For detailed API documentation, refer to:
- Swagger/OpenAPI docs (if configured)
- Postman collection (available in `/docs` folder)
- API_REFERENCE.md file

## 🤝 Support

For issues or questions:
1. Check the logs in terminal
2. Verify all environment variables
3. Ensure all dependencies are installed
4. Check MySQL service is running

## 🎉 You're All Set!

Your Travel Super App is ready. Access it at `http://localhost:3000`

Default features:
- ✅ User authentication
- ✅ AI-powered travel chatbot
- ✅ Expense tracking and budgeting
- ✅ Hotel search and recommendations
- ✅ Transport cost estimation
- ✅ Integrated trip planning
