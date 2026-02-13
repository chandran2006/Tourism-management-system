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
        role ENUM('user', 'admin') DEFAULT 'user',
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
      ['Taj Mahal', 'Iconic white marble mausoleum, symbol of love', 'Heritage', 'Agra, Uttar Pradesh', 4.8, 'https://images.unsplash.com/photo-1564507592333-c60657eea523', 27.1751, 78.0421],
      ['Goa Beaches', 'Beautiful beaches with water sports and nightlife', 'Beach', 'Goa', 4.6, 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2', 15.2993, 74.1240],
      ['Manali', 'Scenic hill station with adventure activities', 'Adventure', 'Himachal Pradesh', 4.7, 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23', 32.2396, 77.1887],
      ['Golden Temple', 'Sacred Sikh shrine with stunning architecture', 'Temple', 'Amritsar, Punjab', 4.9, 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d', 31.6200, 74.8765],
      ['Kerala Backwaters', 'Serene network of lagoons and lakes', 'Nature', 'Kerala', 4.7, 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944', 9.4981, 76.3388],
      ['Jaipur City Palace', 'Royal palace with museums and courtyards', 'Heritage', 'Jaipur, Rajasthan', 4.5, 'https://images.unsplash.com/photo-1599661046289-e31897846e41', 26.9258, 75.8237],
      ['Rishikesh', 'Yoga capital with river rafting and temples', 'Adventure', 'Uttarakhand', 4.6, 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23', 30.0869, 78.2676],
      ['Mumbai Street Food', 'Famous for vada pav, pav bhaji, and more', 'Food', 'Mumbai, Maharashtra', 4.4, 'https://images.unsplash.com/photo-1601050690597-df0568f70950', 19.0760, 72.8777],
      ['Varanasi Ghats', 'Ancient spiritual city on Ganges river', 'Temple', 'Varanasi, Uttar Pradesh', 4.7, 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc', 25.3176, 82.9739],
      ['Andaman Islands', 'Pristine beaches and coral reefs', 'Beach', 'Andaman and Nicobar', 4.8, 'https://images.unsplash.com/photo-1559827260-dc66d52bef19', 11.7401, 92.6586],
      ['Valley of Flowers', 'UNESCO site with alpine flowers', 'Nature', 'Uttarakhand', 4.9, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', 30.7268, 79.6005],
      ['Mysore Palace', 'Indo-Saracenic palace with grand architecture', 'Heritage', 'Mysore, Karnataka', 4.6, 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220', 12.3051, 76.6551],
      ['Ladakh', 'High altitude desert with monasteries', 'Adventure', 'Ladakh', 4.9, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', 34.1526, 77.5771],
      ['Meenakshi Temple', 'Ancient temple with colorful gopurams', 'Temple', 'Madurai, Tamil Nadu', 4.7, 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220', 9.9195, 78.1193],
      ['Darjeeling Tea Gardens', 'Scenic tea plantations with mountain views', 'Nature', 'Darjeeling, West Bengal', 4.5, 'https://images.unsplash.com/photo-1563789031959-4c02bcb41319', 27.0410, 88.2663],
      ['Hampi Ruins', 'Ancient city with temple ruins', 'Heritage', 'Karnataka', 4.8, 'https://images.unsplash.com/photo-1609920658906-8223bd289001', 15.3350, 76.4600],
      ['Coorg', 'Coffee plantations and waterfalls', 'Nature', 'Karnataka', 4.6, 'https://images.unsplash.com/photo-1563789031959-4c02bcb41319', 12.3375, 75.8069],
      ['Udaipur Lake Palace', 'Floating palace on Lake Pichola', 'Heritage', 'Udaipur, Rajasthan', 4.7, 'https://images.unsplash.com/photo-1599661046289-e31897846e41', 24.5760, 73.6822],
      ['Spiti Valley', 'Remote Himalayan valley with monasteries', 'Adventure', 'Himachal Pradesh', 4.8, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', 32.2465, 78.0413],
      ['Kolkata Food Tour', 'Famous for rosogolla, kathi rolls, biryani', 'Food', 'Kolkata, West Bengal', 4.5, 'https://images.unsplash.com/photo-1601050690597-df0568f70950', 22.5726, 88.3639]
    ];

    for (const place of samplePlaces) {
      await db.query(
        'INSERT INTO tourist_places (name, description, category, location, rating, imageUrl, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        place
      );
    }

    console.log('Sample data inserted successfully');
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
};

module.exports = { createTables };
