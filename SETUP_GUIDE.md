# Quick Setup Guide

## Step-by-Step Installation

### 1. Install MySQL
- Download and install MySQL from https://dev.mysql.com/downloads/
- Remember your root password

### 2. Create Database
Open MySQL Command Line or MySQL Workbench and run:
```sql
CREATE DATABASE tourist_guide_db;
```

### 3. Configure Backend
Navigate to `backend` folder and create/edit `.env` file:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=tourist_guide_db
JWT_SECRET=my_secret_key_12345
```

### 4. Install Backend Dependencies
```bash
cd backend
npm install
```

### 5. Start Backend Server
```bash
npm start
```
You should see:
- "Database tables created successfully"
- "Sample data inserted successfully"
- "Server running on port 5000"

### 6. Install Frontend Dependencies
Open a NEW terminal:
```bash
cd frontend
npm install
```

### 7. Start Frontend
```bash
npm start
```
Browser will automatically open at http://localhost:3000

## First Time Usage

### Register a User
1. Click "Login" in navbar
2. Click "Register"
3. Fill in details and select interests
4. Click "Register"

### Create Admin User
After registering, open MySQL and run:
```sql
USE tourist_guide_db;
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

Now login again to access Admin Dashboard!

## Testing the Application

### Test User Features:
1. Browse places on Home page
2. Use Explore page with filters
3. Click on a place to see details
4. Add places to favorites
5. Write reviews
6. Use Travel Planner

### Test Admin Features:
1. Login as admin
2. Go to Admin Dashboard
3. Add a new tourist place
4. Edit existing places
5. Delete places

## Common Issues

### Backend won't start
- Check if MySQL is running
- Verify database credentials in .env
- Make sure port 5000 is not in use

### Frontend won't start
- Make sure backend is running first
- Check if port 3000 is available
- Clear npm cache: `npm cache clean --force`

### Database connection error
- Verify MySQL service is running
- Check username/password in .env
- Ensure database 'tourist_guide_db' exists

## Default Sample Data

The system includes 20 pre-loaded tourist places:
- Taj Mahal, Goa Beaches, Manali, Golden Temple
- Kerala Backwaters, Jaipur City Palace, Rishikesh
- Mumbai Street Food, Varanasi Ghats, Andaman Islands
- And 10 more amazing destinations!

## Features to Test

✅ User Registration & Login
✅ Browse Tourist Places
✅ Search & Filter Places
✅ View Place Details with Map
✅ Add Reviews & Ratings
✅ Save Favorites
✅ Generate Travel Itinerary
✅ Admin CRUD Operations
✅ Dark Mode Toggle
✅ Responsive Design

## Need Help?

Check the main README.md for detailed documentation!

Happy Exploring! 🌍✈️
