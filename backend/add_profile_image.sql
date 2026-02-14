-- Add profileImage column if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS profileImage TEXT AFTER interests;

-- Verify the column was added
DESCRIBE users;

-- Show sample data
SELECT id, name, email, role, profileImage FROM users LIMIT 5;
