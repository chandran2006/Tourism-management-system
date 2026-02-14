# 🔧 ADMIN REGISTRATION FIX GUIDE

## Issue: Unable to Register as Admin

### ✅ SOLUTION

The admin registration is working correctly. Follow these exact steps:

---

## Step 1: Restart Backend Server

```bash
cd backend
npm start
```

**Wait for:** "✅ Server running on http://localhost:5000"

---

## Step 2: Test Admin Registration

### Option A: Using Frontend

1. Go to: `http://localhost:3000/admin-register`
2. Fill form:
   - **Name:** Test Admin
   - **Email:** admin@test.com
   - **Password:** admin123
   - **Admin Secret Key:** RPHM

3. Click "Register as Admin"

### Option B: Using Postman/Thunder Client

```
POST http://localhost:5000/api/admin/register
Content-Type: application/json

{
  "name": "Test Admin",
  "email": "admin@test.com",
  "password": "admin123",
  "adminKey": "RPHM"
}
```

---

## Step 3: Check Backend Console

You should see:
```
Admin registration attempt: { name: 'Test Admin', email: 'admin@test.com', adminKey: 'RPHM' }
Expected key: RPHM
```

---

## Common Issues & Fixes

### Issue 1: "Invalid Admin Key"
**Cause:** Wrong key entered
**Fix:** Use exactly: `RPHM` (case-sensitive)

### Issue 2: "Email already exists"
**Cause:** Email already registered
**Fix:** Use different email or delete existing user from database

### Issue 3: Server not responding
**Cause:** Backend not running
**Fix:** 
```bash
cd backend
npm start
```

### Issue 4: Database error
**Cause:** MySQL not running or wrong credentials
**Fix:**
1. Start MySQL service
2. Check `.env` file credentials
3. Verify database exists:
```sql
CREATE DATABASE IF NOT EXISTS tourist_guide_db;
```

---

## Verify Registration

### Check Database:
```sql
USE tourist_guide_db;
SELECT * FROM users WHERE role = 'admin';
```

You should see your admin user.

---

## Login as Admin

1. Go to: `http://localhost:3000/login`
2. Enter:
   - **Email:** admin@test.com
   - **Password:** admin123
3. Click "Login"
4. You should see "Dashboard" link in navbar

---

## Alternative: Manual Admin Creation

If registration still fails, create admin manually:

```sql
USE tourist_guide_db;

-- Insert admin user (password is 'admin123' hashed)
INSERT INTO users (name, email, password, role, status) 
VALUES (
  'Manual Admin',
  'manual@admin.com',
  '$2a$10$YourHashedPasswordHere',
  'admin',
  'active'
);
```

To hash password, use this Node.js script:
```javascript
const bcrypt = require('bcryptjs');
const password = 'admin123';
bcrypt.hash(password, 10).then(hash => console.log(hash));
```

---

## Test Checklist

- [ ] Backend server running
- [ ] MySQL service running
- [ ] Database `tourist_guide_db` exists
- [ ] `.env` file has `ADMIN_SECRET_KEY=RPHM`
- [ ] Frontend running on port 3000
- [ ] Using correct admin key: `RPHM`
- [ ] Email not already registered

---

## Debug Mode

If still having issues, check backend console for:

1. **Registration attempt log:**
   ```
   Admin registration attempt: { ... }
   Expected key: RPHM
   ```

2. **Error messages:**
   - Database connection errors
   - Validation errors
   - Server errors

---

## Quick Test Command

Test registration via curl:

```bash
curl -X POST http://localhost:5000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Curl Admin",
    "email": "curl@admin.com",
    "password": "admin123",
    "adminKey": "RPHM"
  }'
```

**Expected Response:**
```json
{
  "message": "Admin registered successfully"
}
```

---

## Success Indicators

✅ Backend console shows registration attempt
✅ No error messages in console
✅ Response: "Admin registered successfully"
✅ User appears in database with role='admin'
✅ Can login with credentials
✅ "Dashboard" link visible after login

---

## Still Not Working?

1. **Restart everything:**
   ```bash
   # Stop backend (Ctrl+C)
   # Stop frontend (Ctrl+C)
   
   # Restart backend
   cd backend
   npm start
   
   # Restart frontend (new terminal)
   cd frontend
   npm start
   ```

2. **Check MySQL:**
   ```bash
   # Windows
   net start MySQL80
   
   # Verify connection
   mysql -u root -p
   ```

3. **Verify .env file:**
   ```
   ADMIN_SECRET_KEY=RPHM
   ```
   (No quotes, no spaces)

4. **Check browser console:**
   - Open DevTools (F12)
   - Check Network tab
   - Look for POST request to `/api/admin/register`
   - Check response

---

## Contact Support

If issue persists:
1. Check backend console output
2. Check browser console errors
3. Verify database connection
4. Check all environment variables

---

**Admin Secret Key: RPHM**

Use this exact key (case-sensitive) for registration.
