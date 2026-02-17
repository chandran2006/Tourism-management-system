# 🚀 Quick Start Guide - Travel Super App

## Complete Setup in 5 Minutes

### ✅ Prerequisites Check
```bash
# 1. Check Node.js (need v14+)
node --version

# 2. Check MySQL (need v8.0+)
mysql --version

# 3. Get OpenAI API Key
# Visit: https://platform.openai.com/api-keys
# Create a new secret key and save it
```

---

## 🎯 Setup Steps

### Step 1: Database Setup (2 minutes)

**Option A: Windows (Double-click)**
```
1. Double-click: create-database.bat
2. Enter MySQL root password when prompted
3. Wait for success message
```

**Option B: Manual MySQL Setup**
```bash
# Start MySQL
mysql -u root -p

# Create database
CREATE DATABASE smart_tourist_guide;
USE smart_tourist_guide;

# Exit MySQL
exit

# Import schema and data
mysql -u root -p smart_tourist_guide < backend/super_app_migration.sql
```

**Verify Database:**
```sql
mysql -u root -p smart_tourist_guide

SHOW TABLES;
-- Should show: ChatHistory, Hotels, TripExpenses, Trips, TripHotels, Users, Places, Favorites, Reviews, etc.

SELECT COUNT(*) FROM Hotels;
-- Should return: 18

exit
```

---

### Step 2: Backend Setup (1 minute)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
# Windows PowerShell:
Copy-Item .env.example .env

# Linux/Mac:
cp .env.example .env
```

**Edit `.env` file:**
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=smart_tourist_guide
DB_PORT=3306

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# OpenAI API
OPENAI_API_KEY=sk-your-actual-openai-api-key-here

# Server Configuration
PORT=5000
NODE_ENV=development
```

**Start Backend:**
```bash
npm start
```

**Expected Output:**
```
✅ Database connected successfully
🚀 Server is running on port 5000
🔌 All routes registered
```

**Test Backend:**
Open browser: http://localhost:5000/
Should see: `{"message":"Smart Tourist Guide API"}`

---

### Step 3: Frontend Setup (1 minute)

**Open NEW terminal (keep backend running!)**

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file (optional)
echo REACT_APP_API_URL=http://localhost:5000/api > .env

# Start frontend
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view smart-tourist-guide-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

**Browser Auto-Opens:** http://localhost:3000

---

## 🎉 Verify Everything Works

### Test Checklist

**1. Homepage (No Login Required)**
- [ ] Page loads with hero section
- [ ] Navigation bar visible
- [ ] Trending places displayed
- [ ] AI Chatbot icon visible (bottom-right)

**2. AI Chatbot**
- [ ] Click floating chat icon
- [ ] Type: "Suggest places in Goa"
- [ ] Get AI response (takes 2-5 seconds)
- [ ] Quick action buttons work

**3. Hotels Page**
- [ ] Navigate to "Hotels"
- [ ] See 18 hotel cards
- [ ] Filter by city (select "Mumbai")
- [ ] Should show 3 hotels
- [ ] Clear filters works

**4. Transport Calculator**
- [ ] Navigate to "Transport"
- [ ] From: Mumbai, To: Pune
- [ ] Select "Show All Options"
- [ ] Click "Calculate Route"
- [ ] See 5 transport options with costs

**5. User Registration & Login**
- [ ] Click "Login" button
- [ ] Click "Don't have an account? Register"
- [ ] Fill form:
  - Name: Test User
  - Email: test@example.com
  - Password: Test123!
  - Role: user
- [ ] Click "Register"
- [ ] Login with same credentials
- [ ] See "Welcome, Test User" in navbar

**6. Trip Planner (Login Required)**
- [ ] Navigate to "My Trips"
- [ ] Click "Create New Trip" tab
- [ ] Fill form:
  - Trip Name: Goa Vacation
  - Destination: Goa
  - Start Date: (future date)
  - End Date: (future date + 3 days)
  - Budget: 30000
  - Transport: cab
- [ ] Click "Create Trip"
- [ ] See success message
- [ ] View trip details

**7. Expense Tracker (within Trip)**
- [ ] Open any trip from "My Trips"
- [ ] Click "Add Expense" (if integrated)
- [ ] Or use API directly:
  ```javascript
  // In browser console
  fetch('http://localhost:5000/api/expenses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify({
      category: 'food',
      amount: 500,
      description: 'Lunch',
      expenseDate: '2024-06-01'
    })
  })
  ```

---

## 🔥 Common Startup Issues

### Issue 1: Database Connection Failed
```
Error: ER_ACCESS_DENIED_ERROR
```

**Fix:**
1. Check MySQL is running
2. Verify password in `backend/.env`
3. Test connection:
   ```bash
   mysql -u root -p
   # Enter your password
   ```

### Issue 2: Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Fix:**
```bash
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Linux/Mac:
lsof -ti:5000 | xargs kill -9
```

### Issue 3: OpenAI API Error
```
Error: 401 Unauthorized
```

**Fix:**
1. Verify `OPENAI_API_KEY` in `backend/.env`
2. Check key at: https://platform.openai.com/api-keys
3. Ensure billing is set up
4. Test key:
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer sk-your-key"
   ```

### Issue 4: Frontend Shows Blank Page
```
Blank white screen
```

**Fix:**
1. Check browser console (F12)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Restart frontend:
   ```bash
   # Stop (Ctrl+C) then:
   npm start
   ```

### Issue 5: Hotels Not Loading
```
0 hotels found
```

**Fix:**
```bash
# Re-run migration
mysql -u root -p smart_tourist_guide < backend/super_app_migration.sql

# Verify sample data
mysql -u root -p
USE smart_tourist_guide;
SELECT COUNT(*) FROM Hotels;  -- Should be 18
SELECT * FROM Hotels LIMIT 3;
```

---

## 📁 Project Structure Overview

```
miniproject/
├── backend/
│   ├── server.js              # Main server file
│   ├── .env                   # Environment config (create this)
│   ├── super_app_migration.sql # Database schema
│   ├── config/
│   │   └── database.js        # DB connection
│   ├── controllers/           # Request handlers
│   │   ├── authController.js
│   │   ├── chatController.js  # AI chatbot
│   │   ├── expenseController.js
│   │   ├── hotelController.js
│   │   ├── transportController.js
│   │   └── tripPlannerController.js
│   ├── services/              # Business logic
│   │   ├── aiChatService.js   # OpenAI integration
│   │   ├── expenseService.js
│   │   ├── hotelService.js
│   │   ├── transportService.js
│   │   └── tripPlannerService.js
│   ├── routes/                # API routes
│   │   ├── chatRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── hotelRoutes.js
│   │   ├── transportRoutes.js
│   │   └── tripPlannerRoutes.js
│   └── middleware/
│       ├── auth.js            # JWT verification
│       └── validation.js      # Input validation
│
├── frontend/
│   ├── src/
│   │   ├── App.js             # Main React component
│   │   ├── components/
│   │   │   ├── Navbar.js      # Navigation
│   │   │   ├── AIChatbot.js   # 🤖 AI chat interface
│   │   │   ├── ExpenseTracker.js # 💰 Expense manager
│   │   │   └── TransportCalculator.js # 🚗 Transport tool
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Hotels.js      # 🏨 Hotel browsing
│   │   │   ├── TripPlanner.js # 🗺️ Trip management
│   │   │   ├── Auth.js        # Login/Register
│   │   │   └── ...
│   │   └── context/
│   │       ├── AuthContext.js  # Auth state
│   │       └── LanguageContext.js
│   └── package.json
│
├── TRAVEL_SUPER_APP_GUIDE.md  # 📚 Complete documentation
├── SUPER_APP_SETUP.md         # 🔧 Setup instructions
└── README.md                  # Project overview
```

---

## 🎯 What You Can Do Now

### Without Login
✅ Browse tourist places  
✅ Search and filter hotels  
✅ Calculate transport costs  
✅ Chat with AI travel assistant  
✅ Explore destinations  

### With Login (User Account)
✅ All above features +  
✅ Create trip plans  
✅ Get AI-generated itineraries  
✅ Track expenses by trip  
✅ Save favorite places  
✅ View trip history  
✅ Budget management  

### With Admin Login
✅ All user features +  
✅ Manage hotels (CRUD)  
✅ View admin dashboard  
✅ Manage users  
✅ View analytics  

---

## 🌐 Access URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React app |
| Backend API | http://localhost:5000/api | REST API |
| API Health | http://localhost:5000 | API status |
| Swagger Docs | Not configured | (can add later) |

---

## 📊 Sample Data Included

### Hotels (18 total)
- **Mumbai:** The Taj Mahal Palace, Hotel Marine Plaza, Hotel Suba Palace
- **Delhi:** The Imperial, Hotel Crown Plaza, Hotel Ajanta
- **Bangalore:** The Leela Palace, Hotel Brigade, Treebo Trend
- **Goa:** Taj Exotica, Seashell Suites, Pousada by the Beach
- **Jaipur:** Rambagh Palace, ITC Rajputana, Alsisar Haveli
- **Chennai:** The Park, Hotel Savera, Deccan Plaza

### Pre-configured Routes
- Mumbai ↔ Pune: 150 km
- Delhi ↔ Jaipur: 280 km
- Bangalore ↔ Chennai: 350 km
- Mumbai ↔ Delhi: 1400 km
- And more...

---

## 🔑 Test Credentials

### Regular User
Create your own via registration form

### Admin User
```
Email: admin@smarttourist.com
Password: Admin123!
```
*(Create via `/admin-register` if not exists)*

---

## 📱 Using the Application

### Creating Your First Trip

**Step 1: Login**
```
1. Click "Login" in navbar
2. Login or register new account
```

**Step 2: Navigate to Trips**
```
Click "My Trips" in navbar
```

**Step 3: Create Trip**
```
1. Click "Create New Trip" tab
2. Fill details:
   - Trip Name: "Goa Beach Vacation"
   - Destination: "Goa"
   - Start: Tomorrow's date
   - End: Start + 4 days
   - Budget: ₹40000
   - Transport: cab
3. Click "Create Trip"
```

**Step 4: View AI Itinerary**
```
- System automatically generates day-wise plan
- Recommends hotels based on budget
- Calculates transport costs
- Shows budget breakdown
```

**Step 5: Track Expenses**
```
Use API or add expense tracking UI:
- Category: Food
- Amount: ₹1500
- Description: "Dinner at beach restaurant"
- Date: Trip date
```

---

## 🛠️ Development Tips

### Hot Reload Setup
Both frontend and backend support hot reloading:

**Backend:**
```bash
cd backend
npm install -g nodemon
nodemon server.js
```

**Frontend:**
Already enabled with `react-scripts`

### Debugging

**Backend Logs:**
```javascript
// Check console for:
✅ Database connected successfully
✅ Server is running on port 5000
❌ Error messages with stack traces
```

**Frontend Logs:**
```javascript
// Press F12 > Console
// Check for:
✅ Successful API calls
❌ Network errors
❌ React warnings
```

### Database Queries
```bash
# Monitor queries in real-time
mysql -u root -p smart_tourist_guide

SHOW PROCESSLIST;
SELECT * FROM ChatHistory ORDER BY created_at DESC LIMIT 5;
SELECT * FROM TripExpenses;
SELECT * FROM Trips;
```

---

## 🎨 Customization

### Change AI Model
Edit `backend/services/aiChatService.js`:
```javascript
model: 'gpt-4',  // Change from gpt-4o-mini
max_tokens: 1000  // Increase from 500
```

### Add New Hotel
```bash
mysql -u root -p smart_tourist_guide

INSERT INTO Hotels (name, city, price_per_night, rating, amenities, address, phone)
VALUES (
  'Your Hotel Name',
  'Mumbai',
  3000.00,
  4.2,
  '["WiFi", "AC", "Pool"]',
  '123 Hotel Street',
  '+91-1234567890'
);
```

### Modify Transport Rates
Edit `backend/services/transportService.js`:
```javascript
cab: {
  costPerKm: 15,  // Change from 12
  baseFare: 60    // Change from 50
}
```

---

## 📞 Support & Documentation

| Resource | Location |
|----------|----------|
| Complete Guide | `TRAVEL_SUPER_APP_GUIDE.md` |
| Setup Instructions | `SUPER_APP_SETUP.md` |
| Database Schema | `backend/super_app_migration.sql` |
| API Endpoints | See TRAVEL_SUPER_APP_GUIDE.md |
| Troubleshooting | Both guide files |

---

## ✅ Final Checklist

Before using the app, ensure:

- [x] MySQL running
- [x] Database `smart_tourist_guide` created
- [x] Migration script executed (18 hotels loaded)
- [x] Backend `.env` configured
- [x] Backend running on port 5000
- [x] Frontend running on port 3000
- [x] OpenAI API key valid (test chatbot)
- [x] User account created
- [x] All pages accessible

---

## 🚀 You're All Set!

Your Travel Super App is ready with:
- ✅ AI Travel Assistant
- ✅ Hotel Search & Booking
- ✅ Transport Calculator
- ✅ Trip Planner
- ✅ Expense Tracker
- ✅ Budget Management
- ✅ User Authentication
- ✅ Admin Dashboard

**Start exploring at:** http://localhost:3000

**Happy Traveling! 🌍✈️**

---

## 🔄 Restart Commands

**Stop Everything:**
```bash
# Terminal 1 (Backend): Ctrl+C
# Terminal 2 (Frontend): Ctrl+C
```

**Start Everything:**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

---

**Need Help?** Check `TRAVEL_SUPER_APP_GUIDE.md` for detailed documentation.
