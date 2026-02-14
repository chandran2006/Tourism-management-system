const db = require('./database');

const createTables = async () => {
  try {
    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        interests TEXT,
        profileImage TEXT,
        role ENUM('user', 'admin', 'super_admin') DEFAULT 'user',
        status ENUM('active', 'disabled') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tourist Places table
    await db.query(`
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
      )
    `);

    // Favorites table
    await db.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        placeId INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (placeId) REFERENCES tourist_places(id) ON DELETE CASCADE,
        UNIQUE KEY unique_favorite (userId, placeId)
      )
    `);

    // Reviews table
    await db.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        placeId INT NOT NULL,
        rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (placeId) REFERENCES tourist_places(id) ON DELETE CASCADE
      )
    `);

    // Saved Plans table
    await db.query(`
      CREATE TABLE IF NOT EXISTS saved_plans (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        planName VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        duration INT NOT NULL,
        places JSON,
        budget DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Audit Logs table
    await db.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        adminId INT NOT NULL,
        action VARCHAR(255) NOT NULL,
        target VARCHAR(255),
        details TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (adminId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('Database tables created successfully');
    await insertSampleData();
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

const insertSampleData = async () => {
  try {
    // Check if data already exists
    const [places] = await db.query('SELECT COUNT(*) as count FROM tourist_places');
    if (places[0].count > 0) {
      console.log('Sample data already exists');
      return;
    }

    // Insert sample tourist places
    const samplePlaces = [
      ['Taj Mahal', 'Iconic white marble mausoleum, symbol of love', 'Heritage', 'Agra, Uttar Pradesh', 4.8, 'https://images.unsplash.com/photo-1564507592333-c60657eea523', 27.1751, 78.0421, 'October to March', '2-3 hours', 'High', 'Arrive early morning to avoid crowds. Closed on Fridays. Wear comfortable shoes.', 'Pinch of Spice, Joney\'s Place, Dasaprakash', 6],
      ['Goa Beaches', 'Beautiful beaches with water sports and nightlife', 'Beach', 'Goa', 4.6, 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2', 15.2993, 74.1240, 'November to February', 'Full day', 'Medium', 'Try water sports at Baga Beach. Visit beach shacks for fresh seafood. Rent a scooter for easy travel.', 'Fisherman\'s Wharf, Thalassa, Britto\'s', 3],
      ['Manali', 'Scenic hill station with adventure activities', 'Adventure', 'Himachal Pradesh', 4.7, 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23', 32.2396, 77.1887, 'March to June, October to February', '3-4 days', 'High', 'Book hotels in advance during peak season. Try paragliding at Solang Valley. Carry warm clothes.', 'Johnson\'s Cafe, Cafe 1947, The Lazy Dog', 7],
      ['Golden Temple', 'Sacred Sikh shrine with stunning architecture', 'Temple', 'Amritsar, Punjab', 4.9, 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d', 31.6200, 74.8765, 'Year-round, best October to March', '2-3 hours', 'High', 'Cover your head and remove shoes. Free community meal (langar) available. Visit at night for beautiful lighting.', 'Langar at Temple, Kesar Da Dhaba, Bharawan Da Dhaba', 9],
      ['Kerala Backwaters', 'Serene network of lagoons and lakes', 'Nature', 'Kerala', 4.7, 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944', 9.4981, 76.3388, 'September to March', '1-2 days', 'Low', 'Book houseboat in advance. Try traditional Kerala cuisine. Best experienced with overnight stay.', 'Thaff Restaurant, Coconut Lagoon, Lime Tree', 15],
      ['Jaipur City Palace', 'Royal palace with museums and courtyards', 'Heritage', 'Jaipur, Rajasthan', 4.5, 'https://images.unsplash.com/photo-1599661046289-e31897846e41', 26.9258, 75.8237, 'October to March', '2-3 hours', 'Medium', 'Hire a guide for detailed history. Photography allowed. Combine with Hawa Mahal visit.', 'LMB, Peacock Rooftop, Tapri Central', 18],
      ['Rishikesh', 'Yoga capital with river rafting and temples', 'Adventure', 'Uttarakhand', 4.6, 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23', 30.0869, 78.2676, 'September to November, March to May', '2-3 days', 'Medium', 'Try river rafting in Ganges. Attend Ganga Aarti at evening. Alcohol and non-veg not allowed in many areas.', 'Chotiwala, Little Buddha Cafe, Beatles Cafe', 11],
      ['Mumbai Street Food', 'Famous for vada pav, pav bhaji, and more', 'Food', 'Mumbai, Maharashtra', 4.4, 'https://images.unsplash.com/photo-1601050690597-df0568f70950', 19.0760, 72.8777, 'Year-round, best November to February', '3-4 hours', 'High', 'Try vada pav, pav bhaji, bhel puri. Visit Juhu Beach and Mohammed Ali Road. Carry cash.', 'Sardar Pav Bhaji, Bademiya, Britannia & Co', 10],
      ['Varanasi Ghats', 'Ancient spiritual city on Ganges river', 'Temple', 'Varanasi, Uttar Pradesh', 4.7, 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc', 25.3176, 82.9739, 'October to March', '2 days', 'High', 'Witness Ganga Aarti at Dashashwamedh Ghat. Take boat ride at sunrise. Respect local customs.', 'Kashi Chat Bhandar, Blue Lassi, Deena Chat Bhandar', 4],
      ['Andaman Islands', 'Pristine beaches and coral reefs', 'Beach', 'Andaman and Nicobar', 4.8, 'https://images.unsplash.com/photo-1559827260-dc66d52bef19', 11.7401, 92.6586, 'October to May', '5-7 days', 'Low', 'Book permits in advance. Try scuba diving at Havelock. Carry sufficient cash as ATMs are limited.', 'Anju Coco Resto, Full Moon Cafe, SeaShell', 2],
      ['Valley of Flowers', 'UNESCO site with alpine flowers', 'Nature', 'Uttarakhand', 4.9, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', 30.7268, 79.6005, 'July to September', '2-3 days', 'Low', 'Trek requires moderate fitness. Carry rain gear. Best time is mid-July to mid-August for flowers.', 'Local dhabas in Ghangaria, GMVN Guest House', 7],
      ['Mysore Palace', 'Indo-Saracenic palace with grand architecture', 'Heritage', 'Mysore, Karnataka', 4.6, 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220', 12.3051, 76.6551, 'October to February', '2 hours', 'High', 'Visit on Sunday evening for illumination. Audio guide available. Photography not allowed inside.', 'RRR Restaurant, Vinayaka Mylari, Hotel Hanumanthu', 17],
      ['Ladakh', 'High altitude desert with monasteries', 'Adventure', 'Ladakh', 4.9, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', 34.1526, 77.5771, 'May to September', '7-10 days', 'Medium', 'Acclimatize for 2 days. Carry altitude sickness medicine. Roads open only in summer. Book permits for restricted areas.', 'Tibetan Kitchen, Gesmo Restaurant, Bon Appetit', 19],
      ['Meenakshi Temple', 'Ancient temple with colorful gopurams', 'Temple', 'Madurai, Tamil Nadu', 4.7, 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220', 9.9195, 78.1193, 'October to March', '2-3 hours', 'High', 'Dress modestly. Remove footwear. Visit during evening aarti. Hire guide for temple history.', 'Murugan Idli Shop, Kumar Mess, Konar Mess', 5],
      ['Darjeeling Tea Gardens', 'Scenic tea plantations with mountain views', 'Nature', 'Darjeeling, West Bengal', 4.5, 'https://images.unsplash.com/photo-1563789031959-4c02bcb41319', 27.0410, 88.2663, 'March to May, October to November', '2-3 days', 'Medium', 'Take toy train ride. Visit tea estates for tasting. Carry warm clothes. Watch sunrise at Tiger Hill.', 'Glenary\'s, Keventers, Sonam\'s Kitchen', 16],
      ['Hampi Ruins', 'Ancient city with temple ruins', 'Heritage', 'Karnataka', 4.8, 'https://images.unsplash.com/photo-1609920658906-8223bd289001', 15.3350, 76.4600, 'October to February', '2 days', 'Low', 'Rent bicycle or scooter. Start early to avoid heat. Carry water. Visit Virupaksha Temple and Vittala Temple.', 'Mango Tree, Laughing Buddha, Gopi Guest House', 12],
      ['Coorg', 'Coffee plantations and waterfalls', 'Nature', 'Karnataka', 4.6, 'https://images.unsplash.com/photo-1563789031959-4c02bcb41319', 12.3375, 75.8069, 'October to March', '2-3 days', 'Low', 'Visit coffee plantations. Try Coorg cuisine. Trek to Abbey Falls. Carry rain gear during monsoon.', 'Coorg Cuisine, Raintree, East End Hotel', 12],
      ['Udaipur Lake Palace', 'Floating palace on Lake Pichola', 'Heritage', 'Udaipur, Rajasthan', 4.7, 'https://images.unsplash.com/photo-1599661046289-e31897846e41', 24.5760, 73.6822, 'September to March', '3-4 hours', 'Medium', 'Take boat ride on Lake Pichola. Visit City Palace. Best views at sunset. Book hotels with lake view.', 'Ambrai, Upre, Jagat Niwas Palace', 6],
      ['Spiti Valley', 'Remote Himalayan valley with monasteries', 'Adventure', 'Himachal Pradesh', 4.8, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', 32.2465, 78.0413, 'May to October', '7-8 days', 'Low', 'Roads open only in summer. Carry cash and medicines. Limited connectivity. Acclimatize properly. Visit Key Monastery.', 'Sol Cafe, Cafe Zomsa, Norling Restaurant', 13],
      ['Kolkata Food Tour', 'Famous for rosogolla, kathi rolls, biryani', 'Food', 'Kolkata, West Bengal', 4.5, 'https://images.unsplash.com/photo-1601050690597-df0568f70950', 22.5726, 88.3639, 'October to March', '4-5 hours', 'High', 'Try street food at Park Street. Visit Flurys for breakfast. Must try: kathi rolls, rosogolla, mishti doi.', 'Peter Cat, Arsalan, Flurys', 8]
    ];

    for (const place of samplePlaces) {
      await db.query(
        'INSERT INTO tourist_places (name, description, category, location, rating, imageUrl, latitude, longitude, bestTime, visitDuration, crowdLevel, travelTips, nearbyFood, nextSuggestion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        place
      );
    }

    console.log('Sample data inserted successfully');
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
};

module.exports = { createTables };
