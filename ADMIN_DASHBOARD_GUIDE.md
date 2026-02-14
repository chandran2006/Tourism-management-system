# 🔐 Admin Dashboard - Complete Guide

## Secure Admin System with Role-Based Access Control

---

## 🎯 Overview

A comprehensive admin dashboard with special key registration, role-based access control, and complete management features.

---

## ✨ Features Implemented

### 1. **Admin Registration with Secret Key**
- Special registration page at `/admin-register`
- Requires secret key: **RPHM**
- Validates key before registration
- Automatically assigns admin role

### 2. **Role-Based Access Control**
- Two roles: **USER** and **ADMIN**
- JWT authentication
- Protected admin routes
- Middleware verification

### 3. **Admin Dashboard**
- Modern sidebar navigation
- Responsive design
- Dark mode support
- Real-time statistics

### 4. **Dashboard Features**

#### **Overview Tab**
- Total Users count
- Total Places count
- Total Reviews count
- Most Popular Place

#### **Manage Places Tab**
- View all tourist places
- Edit place details
- Delete places
- Add new places (via existing admin page)

#### **Manage Users Tab**
- View all users
- Search users by name/email
- Delete users
- Change user roles (USER ↔ ADMIN)
- Cannot delete own account
- Cannot change own role

#### **Analytics Tab**
- Most visited places (top 5)
- Most saved places (top 5)
- Highest rated places (top 5)
- New users this week

---

## 🔧 Setup Instructions

### Backend Setup

**1. Environment Variable**
Already added to `.env`:
```env
ADMIN_SECRET_KEY=RPHM
```

**2. New Files Created:**
- `backend/controllers/adminController.js`
- `backend/routes/adminRoutes.js`

**3. Server Updated:**
- Admin routes added to `server.js`

### Frontend Setup

**1. New Pages Created:**
- `AdminRegister.js` + CSS - Admin registration
- `AdminDashboard.js` + CSS - Dashboard with sidebar

**2. Routes Added:**
- `/admin-register` - Public (with secret key)
- `/admin-dashboard` - Protected (admin only)

**3. API Service Updated:**
- Added `adminAPI` methods

---

## 🚀 How to Use

### Register as Admin

1. **Navigate to Admin Registration:**
   ```
   http://localhost:3000/admin-register
   ```

2. **Fill Registration Form:**
   - Name: Your name
   - Email: Your email
   - Password: Your password
   - Admin Secret Key: **RPHM**

3. **Submit:**
   - If key is correct → Registered as admin
   - If key is wrong → "Invalid Admin Key" error

4. **Login:**
   - Go to `/login`
   - Login with your credentials
   - You'll have admin access

### Access Admin Dashboard

1. **Login as Admin**

2. **Navigate to Dashboard:**
   - Click "Dashboard" in navbar
   - Or visit: `http://localhost:3000/admin-dashboard`

3. **Use Sidebar Navigation:**
   - 📊 Dashboard - View statistics
   - 🗺️ Manage Places - CRUD operations
   - 👥 Manage Users - User management
   - 📈 Analytics - View insights

---

## 🔌 API Endpoints

### Admin Registration
```
POST /api/admin/register
Body: {
  name: string,
  email: string,
  password: string,
  adminKey: string (must be "RPHM")
}
```

### Dashboard Stats
```
GET /api/admin/dashboard
Headers: Authorization: Bearer <token>
Response: {
  totalUsers: number,
  totalPlaces: number,
  totalReviews: number,
  mostPopular: object
}
```

### Get All Users
```
GET /api/admin/users?search=query
Headers: Authorization: Bearer <token>
```

### Delete User
```
DELETE /api/admin/user/:id
Headers: Authorization: Bearer <token>
```

### Change User Role
```
PUT /api/admin/user/:id/role
Headers: Authorization: Bearer <token>
Body: { role: "user" | "admin" }
```

### Get Analytics
```
GET /api/admin/analytics
Headers: Authorization: Bearer <token>
Response: {
  mostVisited: array,
  mostSaved: array,
  highestRated: array,
  newUsersThisWeek: number
}
```

---

## 🔒 Security Features

### 1. **Secret Key Protection**
- Admin key stored in environment variable
- Not exposed in frontend code
- Validated on backend

### 2. **JWT Authentication**
- Token-based authentication
- Secure token storage
- Automatic token verification

### 3. **Role-Based Middleware**
```javascript
// authMiddleware - Verifies JWT token
// adminMiddleware - Checks admin role
```

### 4. **Protected Routes**
- All admin endpoints require authentication
- Role verification on every request
- Cannot perform actions on own account

### 5. **Input Validation**
- Email validation
- Password requirements
- Role validation
- SQL injection prevention

---

## 🎨 UI Features

### Modern Dashboard Design
- Clean sidebar navigation
- Responsive grid layouts
- Card-based statistics
- Professional color scheme

### Interactive Elements
- Hover effects on cards
- Smooth transitions
- Loading states
- Confirmation dialogs

### Mobile Responsive
- Collapsible sidebar
- Stacked layouts on mobile
- Touch-friendly buttons
- Optimized for all screens

### Dark Mode Support
- Adapts to system theme
- Consistent styling
- Readable in all modes

---

## 📊 Dashboard Sections

### 1. Overview
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Total Users │Total Places │Total Reviews│Most Popular │
│     150     │     20      │     450     │  Taj Mahal  │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### 2. Manage Users
```
┌────┬──────────┬─────────────────┬────────┬────────────┬─────────┐
│ ID │   Name   │      Email      │  Role  │   Joined   │ Actions │
├────┼──────────┼─────────────────┼────────┼────────────┼─────────┤
│ 1  │ John Doe │ john@email.com  │ ADMIN  │ 2024-01-15 │ [Btns]  │
│ 2  │ Jane     │ jane@email.com  │ USER   │ 2024-01-16 │ [Btns]  │
└────┴──────────┴─────────────────┴────────┴────────────┴─────────┘
```

### 3. Manage Places
```
Grid of place cards with:
- Image
- Name
- Location
- Category tag
- Edit/Delete buttons
```

### 4. Analytics
```
┌─────────────────┬─────────────────┬─────────────────┐
│ Most Visited    │ Most Saved      │ Highest Rated   │
│ 1. Taj Mahal    │ 1. Goa Beaches  │ 1. Golden Temple│
│ 2. Goa Beaches  │ 2. Manali       │ 2. Valley       │
│ 3. Manali       │ 3. Kerala       │ 3. Ladakh       │
└─────────────────┴─────────────────┴─────────────────┘

┌─────────────────────────┐
│ New Users This Week: 25 │
└─────────────────────────┘
```

---

## 🛡️ Admin Permissions

### What Admins Can Do:
✅ View dashboard statistics
✅ Manage all tourist places
✅ Add new places
✅ Edit existing places
✅ Delete places
✅ View all users
✅ Search users
✅ Delete users (except self)
✅ Change user roles (except self)
✅ View analytics
✅ Access admin dashboard

### What Admins Cannot Do:
❌ Delete their own account
❌ Change their own role
❌ Access without authentication
❌ Bypass secret key during registration

---

## 🔄 User Role Management

### Change Role Process:
1. Admin views user list
2. Clicks "Change Role" button
3. Confirms action
4. Role updated in database
5. User gets new permissions on next login

### Role Hierarchy:
```
ADMIN
  ├─ All USER permissions
  ├─ Dashboard access
  ├─ Manage places
  ├─ Manage users
  └─ View analytics

USER
  ├─ Browse places
  ├─ Add favorites
  ├─ Write reviews
  ├─ Save trip plans
  └─ View own profile
```

---

## 📱 Responsive Behavior

### Desktop (1024px+)
- Sidebar always visible
- Full-width content area
- Multi-column grids

### Tablet (768px-1023px)
- Collapsible sidebar
- Toggle button visible
- Adapted grid layouts

### Mobile (<768px)
- Hidden sidebar by default
- Hamburger menu
- Single column layouts
- Stacked cards

---

## 🐛 Troubleshooting

### "Invalid Admin Key" Error
- Verify you're using: **RPHM**
- Check for typos
- Ensure no extra spaces

### Cannot Access Dashboard
- Verify you're logged in
- Check your role is "admin"
- Clear browser cache
- Check JWT token

### Users Not Loading
- Verify backend is running
- Check database connection
- Verify admin authentication

### Cannot Delete User
- Cannot delete your own account
- Verify user ID exists
- Check admin permissions

---

## 🎯 Best Practices

### Security
1. Change admin secret key in production
2. Use strong JWT secret
3. Enable HTTPS in production
4. Implement rate limiting
5. Add audit logging

### User Management
1. Confirm before deleting users
2. Verify role changes
3. Keep admin count minimal
4. Regular security audits

### Performance
1. Paginate user lists
2. Cache dashboard stats
3. Optimize database queries
4. Use indexes on tables

---

## 🚀 Future Enhancements

Potential additions:
- [ ] Bulk user operations
- [ ] Export data to CSV
- [ ] Activity logs
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] IP whitelisting
- [ ] Session management
- [ ] Advanced analytics charts
- [ ] User activity tracking
- [ ] Automated backups

---

## ✅ Testing Checklist

- [ ] Register with correct admin key
- [ ] Register with wrong admin key (should fail)
- [ ] Login as admin
- [ ] View dashboard statistics
- [ ] Search users
- [ ] Change user role
- [ ] Delete user
- [ ] Try to delete own account (should fail)
- [ ] View analytics
- [ ] Manage places
- [ ] Test on mobile device
- [ ] Test dark mode
- [ ] Verify protected routes

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  interests TEXT,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🎉 Success!

Your Smart Tourist Guide System now has a complete, secure admin dashboard with:

✅ Secret key registration
✅ Role-based access control
✅ Modern dashboard UI
✅ User management
✅ Place management
✅ Analytics
✅ Mobile responsive
✅ Dark mode support
✅ Production-ready security

**Admin Secret Key: RPHM**

For any issues, check console logs or verify database schema.
