-- Quick Admin User Creation Script
-- Use this if admin registration is not working

USE tourist_guide_db;

-- Check if admin already exists
SELECT id, name, email, role FROM users WHERE role = 'admin';

-- Option 1: Update existing user to admin
-- Replace 'your@email.com' with your actual email
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';

-- Option 2: Create new admin user
-- Password is 'admin123' (hashed with bcrypt)
INSERT INTO users (name, email, password, role, interests) 
VALUES (
  'Admin User',
  'admin@test.com',
  '$2a$10$rOZJQKJQKJQKJQKJQKJQKeuqVqVqVqVqVqVqVqVqVqVqVqVqVqVqV',
  'admin',
  'Nature,Heritage'
);

-- Note: The password hash above is a placeholder
-- To get a real hash, use the admin registration form with secret key: RPHM
-- Or use this Node.js command:
-- node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(hash => console.log(hash));"

-- Verify admin user created
SELECT id, name, email, role, created_at FROM users WHERE role = 'admin';

-- Check all users
SELECT id, name, email, role FROM users;
