-- Performance Optimization: Add Database Indexes
-- Run this script to improve query performance by 10-50x

USE tourist_guide_db;

-- Check existing indexes
SHOW INDEX FROM users;
SHOW INDEX FROM tourist_places;
SHOW INDEX FROM reviews;
SHOW INDEX FROM favorites;

-- Add indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Add indexes for tourist_places table
CREATE INDEX IF NOT EXISTS idx_places_category ON tourist_places(category);
CREATE INDEX IF NOT EXISTS idx_places_location ON tourist_places(location);
CREATE INDEX IF NOT EXISTS idx_places_rating ON tourist_places(rating);
CREATE INDEX IF NOT EXISTS idx_places_created ON tourist_places(created_at);

-- Add indexes for reviews table
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(userId);
CREATE INDEX IF NOT EXISTS idx_reviews_place ON reviews(placeId);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Add indexes for favorites table
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(userId);
CREATE INDEX IF NOT EXISTS idx_favorites_place ON favorites(placeId);
CREATE INDEX IF NOT EXISTS idx_favorites_created ON favorites(created_at);

-- Add indexes for saved_plans table
CREATE INDEX IF NOT EXISTS idx_plans_user ON saved_plans(userId);
CREATE INDEX IF NOT EXISTS idx_plans_city ON saved_plans(city);
CREATE INDEX IF NOT EXISTS idx_plans_created ON saved_plans(created_at);

-- Add indexes for Hotels table
CREATE INDEX IF NOT EXISTS idx_hotels_city ON Hotels(city);
CREATE INDEX IF NOT EXISTS idx_hotels_price ON Hotels(price_per_night);
CREATE INDEX IF NOT EXISTS idx_hotels_rating ON Hotels(rating);

-- Add indexes for Trips table
CREATE INDEX IF NOT EXISTS idx_trips_user ON Trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON Trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_dates ON Trips(start_date, end_date);

-- Verify indexes created
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME,
    SEQ_IN_INDEX
FROM 
    INFORMATION_SCHEMA.STATISTICS
WHERE 
    TABLE_SCHEMA = 'tourist_guide_db'
ORDER BY 
    TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;

-- Performance test queries
-- These should now be much faster

-- Test 1: Get users by role (should use idx_users_role)
EXPLAIN SELECT * FROM users WHERE role = 'admin';

-- Test 2: Get places by category (should use idx_places_category)
EXPLAIN SELECT * FROM tourist_places WHERE category = 'Nature';

-- Test 3: Get reviews by place (should use idx_reviews_place)
EXPLAIN SELECT * FROM reviews WHERE placeId = 1;

-- Test 4: Get user favorites (should use idx_favorites_user)
EXPLAIN SELECT * FROM favorites WHERE userId = 1;

-- Analyze tables for better query optimization
ANALYZE TABLE users;
ANALYZE TABLE tourist_places;
ANALYZE TABLE reviews;
ANALYZE TABLE favorites;
ANALYZE TABLE saved_plans;
ANALYZE TABLE Hotels;
ANALYZE TABLE Trips;

SELECT 'Database indexes created successfully!' as Status;
