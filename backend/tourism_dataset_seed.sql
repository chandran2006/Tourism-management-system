-- ============================================
-- COMPREHENSIVE INDIA TOURISM DATABASE
-- Smart Tourist Guide System
-- ============================================

-- Enhanced tourist_places table structure
CREATE TABLE IF NOT EXISTS tourist_places_enhanced (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  category ENUM('Temple', 'Monument', 'Beach', 'Wildlife', 'Hill Station', 'Historical', 'UNESCO', 'Cultural', 'Adventure', 'Nature', 'Food', 'Heritage') NOT NULL,
  shortDescription TEXT,
  detailedDescription TEXT,
  
  -- Location
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  googleMapsLink TEXT,
  
  -- History
  historicalBackground TEXT,
  culturalImportance TEXT,
  architecturalStyle VARCHAR(100),
  unescoStatus BOOLEAN DEFAULT FALSE,
  
  -- Visitor Info
  openingHours VARCHAR(100),
  entryFeeIndian DECIMAL(10, 2),
  entryFeeForeigner DECIMAL(10, 2),
  bestVisitingTime VARCHAR(100),
  bestSeason VARCHAR(100),
  visitDuration VARCHAR(50),
  crowdLevel ENUM('Low', 'Medium', 'High'),
  
  -- Travel
  nearestAirport VARCHAR(100),
  nearestRailway VARCHAR(100),
  distanceFromCity VARCHAR(50),
  transportOptions TEXT,
  
  -- Facilities
  guidesAvailable BOOLEAN DEFAULT TRUE,
  parkingAvailable BOOLEAN DEFAULT TRUE,
  foodNearby TEXT,
  accessibility TEXT,
  
  -- Nearby
  nearbyAttractions TEXT,
  
  -- Tips
  dressCode TEXT,
  safetyTips TEXT,
  photographyRules TEXT,
  travelTips TEXT,
  
  -- Budget
  avgVisitCost DECIMAL(10, 2),
  foodEstimate DECIMAL(10, 2),
  transportEstimate DECIMAL(10, 2),
  
  -- Weather
  avgTemperature VARCHAR(50),
  
  -- Metrics
  rating DECIMAL(2, 1) DEFAULT 4.0,
  popularityScore INT DEFAULT 50,
  trending BOOLEAN DEFAULT FALSE,
  
  -- Images
  thumbnailUrl TEXT,
  imageUrl TEXT,
  galleryImages JSON,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_state (state),
  INDEX idx_city (city),
  INDEX idx_category (category),
  INDEX idx_rating (rating),
  INDEX idx_popularity (popularityScore)
);

-- ============================================
-- RAJASTHAN - The Land of Kings
-- ============================================

INSERT INTO tourist_places_enhanced VALUES
(NULL, 'Amber Fort', 'Jaipur', 'Rajasthan', 'Heritage', 
'Majestic hilltop fort with stunning architecture', 
'Amber Fort, also known as Amer Fort, is a magnificent fort located in Amer, Rajasthan. Built in 1592 by Raja Man Singh I, this UNESCO World Heritage site showcases a perfect blend of Hindu and Mughal architecture. The fort is known for its artistic style, large ramparts, series of gates and cobbled paths.',
'Devisinghpura, Amer, Jaipur, Rajasthan 302001', 26.9855, 75.8513, 'https://maps.google.com/?q=26.9855,75.8513',
'Built by Raja Man Singh I in 1592, Amber Fort served as the main residence of the Rajput Maharajas. The fort was expanded by successive rulers and represents the glory of Rajput architecture.',
'Symbol of Rajput valor and architectural brilliance. The fort showcases the rich cultural heritage of Rajasthan.',
'Rajput-Mughal fusion architecture', TRUE,
'8:00 AM - 5:30 PM', 100.00, 500.00, 'Morning (8-11 AM) or Evening (4-6 PM)', 'October to March', '2-3 hours', 'High',
'Jaipur International Airport (25 km)', 'Jaipur Junction (11 km)', '11 km', 'Taxi, Auto-rickshaw, Bus, Elephant ride available',
TRUE, TRUE, 'LMB, Peacock Rooftop Restaurant, 1135 AD', 'Wheelchair accessible with assistance',
'Jaigarh Fort (2 km), Jal Mahal (9 km), City Palace (11 km), Hawa Mahal (12 km), Nahargarh Fort (8 km)',
'Modest clothing recommended. Comfortable walking shoes essential.', 'Beware of monkeys. Stay hydrated. Avoid visiting during peak afternoon heat.', 'Photography allowed. Extra charges for professional cameras.', 'Book tickets online to avoid queues. Visit early morning for best light and fewer crowds. Sound and light show in evening is spectacular.',
500.00, 300.00, 200.00, '15-35°C (varies by season)',
4.7, 95, TRUE,
'https://images.unsplash.com/photo-1599661046289-e31897846e41', 'https://images.unsplash.com/photo-1599661046289-e31897846e41',
'["https://images.unsplash.com/photo-1599661046289-e31897846e41", "https://images.unsplash.com/photo-1609920658906-8223bd289001", "https://images.unsplash.com/photo-1582510003544-4d00b7f74220"]',
NOW(), NOW()),

(NULL, 'City Palace Jaipur', 'Jaipur', 'Rajasthan', 'Heritage',
'Royal palace complex in the heart of Pink City',
'The City Palace, Jaipur was established at the same time as the city of Jaipur, by Maharaja Sawai Jai Singh II. It is a remarkable blend of Rajasthani and Mughal architecture. The palace complex has several buildings, courtyards, galleries, restaurants and offices of the Museum Trust.',
'Tulsi Marg, Gangori Bazaar, J.D.A. Market, Pink City, Jaipur, Rajasthan 302002', 26.9258, 75.8237, 'https://maps.google.com/?q=26.9258,75.8237',
'Built between 1729-1732 by Maharaja Sawai Jai Singh II, the founder of Jaipur. The palace has been the seat of the Jaipur royal family.',
'Houses museums displaying royal costumes, weapons, manuscripts and miniature paintings. Represents the grandeur of Rajput royalty.',
'Rajput-Mughal architecture', FALSE,
'9:30 AM - 5:00 PM', 200.00, 700.00, 'Morning (9:30-12 PM)', 'October to March', '2-3 hours', 'High',
'Jaipur International Airport (13 km)', 'Jaipur Junction (3 km)', '3 km', 'Taxi, Auto-rickshaw, Bus',
TRUE, TRUE, 'Peacock Rooftop, LMB, Tapri Central', 'Partially wheelchair accessible',
'Hawa Mahal (500m), Jantar Mantar (1 km), Albert Hall Museum (2 km), Jal Mahal (6 km)',
'Modest clothing preferred. Remove shoes at certain sections.', 'Keep valuables safe. Stay with group.', 'Photography allowed in most areas. Video camera charges extra.', 'Hire audio guide for detailed history. Visit Chandra Mahal for royal experience.',
400.00, 250.00, 150.00, '15-35°C',
4.6, 92, TRUE,
'https://images.unsplash.com/photo-1599661046289-e31897846e41', 'https://images.unsplash.com/photo-1599661046289-e31897846e41',
'["https://images.unsplash.com/photo-1599661046289-e31897846e41", "https://images.unsplash.com/photo-1609920658906-8223bd289001"]',
NOW(), NOW()),

(NULL, 'Hawa Mahal', 'Jaipur', 'Rajasthan', 'Heritage',
'Iconic Palace of Winds with 953 windows',
'Hawa Mahal is a palace in Jaipur, India. Built from red and pink sandstone, it is on the edge of the City Palace. Its unique five-storey exterior resembles a honeycomb with 953 small windows called jharokhas decorated with intricate latticework.',
'Hawa Mahal Rd, Badi Choupad, J.D.A. Market, Pink City, Jaipur, Rajasthan 302002', 26.9239, 75.8267, 'https://maps.google.com/?q=26.9239,75.8267',
'Built in 1799 by Maharaja Sawai Pratap Singh. Designed to allow royal ladies to observe street festivals while unseen from outside.',
'Iconic symbol of Jaipur. Represents the purdah system and architectural innovation of Rajput era.',
'Rajput architecture with Islamic influences', FALSE,
'9:00 AM - 5:00 PM', 50.00, 200.00, 'Morning (9-11 AM) for best photography', 'October to March', '1 hour', 'High',
'Jaipur International Airport (12 km)', 'Jaipur Junction (3 km)', '3 km', 'Taxi, Auto-rickshaw, Walking from City Palace',
TRUE, TRUE, 'LMB, Tapri Central, Rawat Mishthan Bhandar', 'Limited wheelchair access',
'City Palace (500m), Jantar Mantar (1 km), Johari Bazaar (200m)',
'Casual clothing acceptable.', 'Crowded area, watch for pickpockets.', 'Best photographed from outside. Interior photography allowed.', 'Visit early morning for best light. View from Wind View Cafe across street for iconic photo.',
200.00, 150.00, 100.00, '15-35°C',
4.5, 90, TRUE,
'https://images.unsplash.com/photo-1599661046289-e31897846e41', 'https://images.unsplash.com/photo-1599661046289-e31897846e41',
'["https://images.unsplash.com/photo-1599661046289-e31897846e41"]',
NOW(), NOW());

-- Continue with more Rajasthan destinations...
-- (Due to response size limits, this is a template structure)
