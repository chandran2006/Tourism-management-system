-- Run this in MySQL to fix database
USE mini;

-- Add profileImage column if missing
ALTER TABLE users ADD COLUMN IF NOT EXISTS profileImage TEXT AFTER interests;

-- Verify structure
DESCRIBE users;

-- Check if places have images
SELECT id, name, imageUrl FROM tourist_places LIMIT 3;

-- If no places exist, restart backend server to auto-populate
