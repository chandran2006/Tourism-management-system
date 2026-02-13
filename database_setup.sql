-- Smart Tourist Guide Database Setup Script
-- Run this script in MySQL to set up the database

-- Create database
CREATE DATABASE IF NOT EXISTS tourist_guide_db;
USE tourist_guide_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  interests TEXT,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tourist_places table
CREATE TABLE IF NOT EXISTS tourist_places (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  location VARCHAR(255),
  rating DECIMAL(2,1) DEFAULT 0,
  imageUrl TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  placeId INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (placeId) REFERENCES tourist_places(id) ON DELETE CASCADE,
  UNIQUE KEY unique_favorite (userId, placeId)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  placeId INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (placeId) REFERENCES tourist_places(id) ON DELETE CASCADE
);

-- Insert admin user (password: admin123)
INSERT INTO users (name, email, password, role, interests) 
VALUES ('Admin User', 'admin@tourist.com', '$2a$10$rKvVLz5VQxZ5kGJxH5qYXeYGYvYvYvYvYvYvYvYvYvYvYvYvYvY', 'admin', 'Nature,Heritage,Adventure');

-- Note: The password hash above is a placeholder. 
-- After first backend run, you can create an admin user through registration 
-- and manually update the role to 'admin' in the database:
-- UPDATE users SET role = 'admin' WHERE email = 'your@email.com';

SELECT 'Database setup completed successfully!' as message;
