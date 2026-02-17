-- ============================================
-- Travel Super App - Database Migration SQL
-- ============================================

-- 1. Chat History Table
CREATE TABLE IF NOT EXISTS ChatHistory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  role ENUM('user', 'assistant', 'system') NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_date (user_id, created_at),
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Trip Expenses Table
CREATE TABLE IF NOT EXISTS TripExpenses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  trip_id INT,
  category ENUM('Food', 'Hotel', 'Transport', 'Entry', 'Shopping', 'Other') NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255),
  expense_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_trip (user_id, trip_id),
  INDEX idx_category (category),
  INDEX idx_date (expense_date),
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Hotels Table
CREATE TABLE IF NOT EXISTS Hotels (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  rating DECIMAL(3, 2) DEFAULT 0.0,
  amenities JSON,
  distance_from_center DECIMAL(5, 2) COMMENT 'Distance in km',
  image_url VARCHAR(500),
  address TEXT,
  phone VARCHAR(20),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_city (city),
  INDEX idx_price (price_per_night),
  INDEX idx_rating (rating),
  FULLTEXT idx_search (name, city, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Trips Table
CREATE TABLE IF NOT EXISTS Trips (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  trip_name VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  planned_budget DECIMAL(10, 2) NOT NULL,
  transport_mode ENUM('cab', 'bus', 'train', 'flight', 'auto') DEFAULT 'cab',
  preferences JSON,
  status ENUM('planned', 'ongoing', 'completed', 'cancelled') DEFAULT 'planned',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_status (user_id, status),
  INDEX idx_dates (start_date, end_date),
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Trip Hotels (Many-to-Many relationship)
CREATE TABLE IF NOT EXISTS TripHotels (
  id INT PRIMARY KEY AUTO_INCREMENT,
  trip_id INT NOT NULL,
  hotel_id INT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  rooms INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_trip (trip_id),
  INDEX idx_hotel (hotel_id),
  FOREIGN KEY (trip_id) REFERENCES Trips(id) ON DELETE CASCADE,
  FOREIGN KEY (hotel_id) REFERENCES Hotels(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add trip_id foreign key to TripExpenses if Trips table exists
ALTER TABLE TripExpenses 
ADD CONSTRAINT fk_trip_expenses_trip 
FOREIGN KEY (trip_id) REFERENCES Trips(id) ON DELETE CASCADE;

-- ============================================
-- Sample Data for Hotels
-- ============================================

INSERT INTO Hotels (name, city, price_per_night, rating, amenities, distance_from_center, image_url, address, phone, description) VALUES
-- Mumbai Hotels
('The Taj Mahal Palace', 'Mumbai', 15000, 4.8, '["WiFi", "Pool", "Spa", "Restaurant", "Room Service", "Gym"]', 2.5, 'https://images.unsplash.com/photo-1566073771259-6a8506099945', 'Apollo Bunder, Colaba', '+91-22-66653366', 'Luxury heritage hotel with stunning sea views'),
('Hotel Marine Plaza', 'Mumbai', 5000, 4.2, '["WiFi", "Restaurant", "Room Service", "AC"]', 3.0, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', 'Marine Drive', '+91-22-22851212', 'Comfortable hotel on Marine Drive'),
('Treebo Trend', 'Mumbai', 2000, 3.8, '["WiFi", "AC", "Breakfast"]', 5.0, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d', 'Andheri East', '+91-22-40001234', 'Budget-friendly hotel in Andheri'),

-- Delhi Hotels
('The Leela Palace', 'Delhi', 18000, 4.9, '["WiFi", "Pool", "Spa", "Restaurant", "Room Service", "Gym", "Bar"]', 8.0, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', 'Chanakyapuri', '+91-11-39331234', 'Ultra-luxury hotel with world-class amenities'),
('Hotel Surya', 'Delhi', 3500, 4.0, '["WiFi", "Restaurant", "AC", "Parking"]', 2.0, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa', 'Mahipalpur', '+91-11-26781234', 'Convenient hotel near airport'),
('FabHotel Prime', 'Delhi', 1800, 3.5, '["WiFi", "AC", "Breakfast"]', 6.0, 'https://images.unsplash.com/photo-1590490360182-c33d57733427', 'Karol Bagh', '+91-11-45671234', 'Affordable stay in central Delhi'),

-- Bangalore Hotels
('ITC Gardenia', 'Bangalore', 12000, 4.7, '["WiFi", "Pool", "Spa", "Restaurant", "Gym", "Business Center"]', 4.0, 'https://images.unsplash.com/photo-1549294413-26f195200c16', 'Residency Road', '+91-80-41121212', 'Premium business hotel'),
('The Oberoi', 'Bangalore', 16000, 4.9, '["WiFi", "Pool", "Spa", "Restaurant", "Room Service", "Gym"]', 3.5, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', 'MG Road', '+91-80-25585858', 'Luxury hotel in the heart of the city'),
('Zostel', 'Bangalore', 800, 3.9, '["WiFi", "Common Kitchen", "Lounge"]', 7.0, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5', 'Koramangala', '+91-80-67891234', 'Trendy hostel for backpackers'),

-- Goa Hotels
('Taj Exotica', 'Goa', 14000, 4.8, '["WiFi", "Beach Access", "Pool", "Spa", "Restaurant", "Water Sports"]', 15.0, 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7', 'Benaulim', '+91-832-6683333', 'Beachfront luxury resort'),
('Novotel Goa', 'Goa', 6000, 4.3, '["WiFi", "Pool", "Restaurant", "Beach Access"]', 20.0, 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9', 'Candolim', '+91-832-6645678', 'Modern resort near the beach'),
('Backpacker Panda', 'Goa', 600, 3.7, '["WiFi", "Beach Access", "Common Kitchen"]', 12.0, 'https://images.unsplash.com/photo-1566195992011-5f6b21e539aa', 'Anjuna', '+91-832-2234567', 'Budget hostel near Anjuna Beach'),

-- Jaipur Hotels
('Rambagh Palace', 'Jaipur', 20000, 4.9, '["WiFi", "Pool", "Spa", "Restaurant", "Heritage Property", "Gym"]', 5.0, 'https://images.unsplash.com/photo-1560067174-cb6685c87696', 'Bhawani Singh Road', '+91-141-2211919', 'Royal palace turned luxury hotel'),
('Hotel Pearl Palace', 'Jaipur', 2500, 4.1, '["WiFi", "Restaurant", "Rooftop", "AC"]', 2.0, 'https://images.unsplash.com/photo-1596436889106-be35e843f974', 'Hari Kishan Somani Marg', '+91-141-2373700', 'Charming heritage hotel'),
('Zostel Jaipur', 'Jaipur', 700, 3.8, '["WiFi", "Common Area", "Cafe"]', 4.0, 'https://images.unsplash.com/photo-1587985064135-0366536eab42', 'MI Road', '+91-141-4567890', 'Social hostel for travelers'),

-- Chennai Hotels
('ITC Grand Chola', 'Chennai', 13000, 4.8, '["WiFi", "Pool", "Spa", "Multiple Restaurants", "Gym", "Business Center"]', 15.0, 'https://images.unsplash.com/photo-1551918120-9739cb430c6d', 'Guindy', '+91-44-22200000', 'Grand luxury hotel'),
('Hotel Savera', 'Chennai', 4000, 4.0, '["WiFi", "Restaurant", "AC", "Room Service"]', 5.0, 'https://images.unsplash.com/photo-1590490360182-c33d57733427', 'Dr Radhakrishnan Salai', '+91-44-28111111', 'Comfortable city hotel'),
('Backpackers Inn', 'Chennai', 900, 3.6, '["WiFi", "AC", "Common Area"]', 8.0, 'https://images.unsplash.com/photo-1563911892437-1feda0179e1b', 'Nungambakkam', '+91-44-45670000', 'Budget accommodation');

-- ============================================
-- Performance Optimizations
-- ============================================

-- Add indexes for better query performance
CREATE INDEX idx_hotels_city_price ON Hotels(city, price_per_night);
CREATE INDEX idx_hotels_city_rating ON Hotels(city, rating);
CREATE INDEX idx_expenses_user_date ON TripExpenses(user_id, expense_date);
CREATE INDEX idx_trips_user_dates ON Trips(user_id, start_date, end_date);

-- ============================================
-- Views for Common Queries
-- ============================================

-- View for trip summary
CREATE OR REPLACE VIEW TripSummary AS
SELECT 
  t.id as trip_id,
  t.user_id,
  t.trip_name,
  t.destination,
  t.start_date,
  t.end_date,
  t.planned_budget,
  t.status,
  COALESCE(SUM(e.amount), 0) as total_spent,
  t.planned_budget - COALESCE(SUM(e.amount), 0) as remaining_budget,
  COUNT(DISTINCT e.id) as expense_count,
  COUNT(DISTINCT th.hotel_id) as hotel_count
FROM Trips t
LEFT JOIN TripExpenses e ON t.id = e.trip_id
LEFT JOIN TripHotels th ON t.id = th.trip_id
GROUP BY t.id;

-- View for expense statistics
CREATE OR REPLACE VIEW ExpenseStatistics AS
SELECT 
  user_id,
  category,
  COUNT(*) as transaction_count,
  SUM(amount) as total_amount,
  AVG(amount) as avg_amount,
  MIN(amount) as min_amount,
  MAX(amount) as max_amount,
  YEAR(expense_date) as year,
  MONTH(expense_date) as month
FROM TripExpenses
GROUP BY user_id, category, year, month;

-- ============================================
-- Stored Procedures
-- ============================================

DELIMITER //

-- Procedure to calculate trip budget variance
CREATE PROCEDURE IF NOT EXISTS CalculateTripBudgetVariance(IN p_trip_id INT)
BEGIN
  SELECT 
    t.id,
    t.trip_name,
    t.planned_budget,
    COALESCE(SUM(e.amount), 0) as actual_spent,
    t.planned_budget - COALESCE(SUM(e.amount), 0) as variance,
    CASE 
      WHEN COALESCE(SUM(e.amount), 0) > t.planned_budget THEN 'Over Budget'
      WHEN COALESCE(SUM(e.amount), 0) > t.planned_budget * 0.9 THEN 'Near Budget'
      ELSE 'Within Budget'
    END as status
  FROM Trips t
  LEFT JOIN TripExpenses e ON t.id = e.trip_id
  WHERE t.id = p_trip_id
  GROUP BY t.id;
END //

DELIMITER ;

-- ============================================
-- Triggers
-- ============================================

DELIMITER //

-- Trigger to validate expense amount
CREATE TRIGGER IF NOT EXISTS before_expense_insert 
BEFORE INSERT ON TripExpenses
FOR EACH ROW
BEGIN
  IF NEW.amount <= 0 THEN
    SIGNAL SQLSTATE '45000' 
    SET MESSAGE_TEXT = 'Expense amount must be greater than 0';
  END IF;
END //

-- Trigger to validate trip dates
CREATE TRIGGER IF NOT EXISTS before_trip_insert 
BEFORE INSERT ON Trips
FOR EACH ROW
BEGIN
  IF NEW.end_date <= NEW.start_date THEN
    SIGNAL SQLSTATE '45000' 
    SET MESSAGE_TEXT = 'End date must be after start date';
  END IF;
  IF NEW.planned_budget <= 0 THEN
    SIGNAL SQLSTATE '45000' 
    SET MESSAGE_TEXT = 'Planned budget must be greater than 0';
  END IF;
END //

DELIMITER ;

-- ============================================
-- Success Message
-- ============================================

SELECT 'Travel Super App database migration completed successfully!' as message;
