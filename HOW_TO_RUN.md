# 🚀 HOW TO RUN THE PROJECT

## ⚡ Quick Start (3 Steps)

### Step 1: Ensure MySQL is Running
- Open MySQL (XAMPP, MySQL Workbench, or MySQL service)
- Make sure it's running on localhost:3306

### Step 2: Run the Project
**Double-click this file:**
```
RUN_PROJECT.bat
```

This will:
✅ Create database automatically
✅ Start backend server (Port 5000)
✅ Start frontend server (Port 3000)
✅ Open browser automatically

### Step 3: Use the Application
- Browser opens at: http://localhost:3000
- Register a new user
- Start exploring!

---

## 📋 What Happens When You Run

1. **Backend starts** → Creates database & tables → Loads sample data
2. **Frontend starts** → Opens in browser → Ready to use!

---

## ✅ System Check

Before running, verify:
- [x] MySQL is installed and running
- [x] Node.js is installed
- [x] npm install completed (already done)
- [x] .env file has correct MySQL password

---

## 🔧 If Something Goes Wrong

### Backend won't start?
- Check MySQL is running
- Verify password in `backend/.env`
- Port 5000 should be free

### Frontend won't start?
- Wait for backend to fully start first
- Port 3000 should be free
- Try: `cd frontend && npm start`

### Database error?
- Ensure MySQL service is running
- Check credentials in `backend/.env`

---

## 🌐 URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

---

## 👤 Create Admin User (Optional)

After registering, run in MySQL:
```sql
USE tourist_guide_db;
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

Then login again to access Admin Dashboard!

---

## 🎯 Features to Test

✅ Browse tourist places
✅ Search and filter
✅ View on map
✅ Add to favorites
✅ Write reviews
✅ Generate travel itinerary
✅ Admin dashboard (if admin)
✅ Dark mode toggle

---

**That's it! Enjoy exploring! 🌍✈️**
