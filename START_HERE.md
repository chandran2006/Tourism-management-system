# Quick Start Instructions

## Prerequisites Check
✅ Node.js installed
✅ MySQL installed and running
✅ Dependencies installed (npm install completed)

## Database Setup (IMPORTANT - Do this first!)

1. Open MySQL Command Line or MySQL Workbench
2. Run this command:
   ```sql
   CREATE DATABASE IF NOT EXISTS tourist_guide_db;
   ```

3. Verify database exists:
   ```sql
   SHOW DATABASES;
   ```

## Running the Application

### Option 1: Run Both Servers (Recommended)
Double-click: `start-all.bat`

This will open 2 terminal windows:
- Backend Server (Port 5000)
- Frontend Server (Port 3000)

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Wait for: "Server running on port 5000"

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Browser opens at: http://localhost:3000

## First Time Setup

1. **Register a User:**
   - Click "Login" → "Register"
   - Fill in details and select interests
   - Click "Register"

2. **Create Admin User (Optional):**
   - Open MySQL and run:
   ```sql
   USE tourist_guide_db;
   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
   ```
   - Login again to access Admin Dashboard

## Troubleshooting

### Backend won't start?
- Check if MySQL is running
- Verify database 'tourist_guide_db' exists
- Check .env file has correct MySQL password

### Frontend won't start?
- Make sure backend is running first
- Check if port 3000 is available
- Try: npm cache clean --force

### Database connection error?
- Verify MySQL service is running
- Check credentials in backend/.env
- Ensure database exists

## URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

## Sample Data
The backend automatically creates:
- 4 database tables
- 20 sample tourist places
- All categories populated

Enjoy exploring! 🚀
