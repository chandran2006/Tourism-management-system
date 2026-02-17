const db = require('../config/database');

class HotelService {
  /**
   * Get all hotels with filters
   * @param {object} filters - Filter parameters
   * @returns {Array} - List of hotels
   */
  async getHotels(filters = {}) {
    const { city, minPrice, maxPrice, minRating, sortBy, search } = filters;
    
    let query = 'SELECT * FROM Hotels WHERE 1=1';
    const params = [];

    // Apply filters
    if (city) {
      query += ' AND LOWER(city) = LOWER(?)';
      params.push(city);
    }

    if (minPrice) {
      query += ' AND price_per_night >= ?';
      params.push(minPrice);
    }

    if (maxPrice) {
      query += ' AND price_per_night <= ?';
      params.push(maxPrice);
    }

    if (minRating) {
      query += ' AND rating >= ?';
      params.push(minRating);
    }

    if (search) {
      query += ' AND (LOWER(name) LIKE LOWER(?) OR LOWER(city) LIKE LOWER(?))';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Apply sorting
    switch(sortBy) {
      case 'price_asc':
        query += ' ORDER BY price_per_night ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY price_per_night DESC';
        break;
      case 'rating_desc':
        query += ' ORDER BY rating DESC';
        break;
      case 'rating_asc':
        query += ' ORDER BY rating ASC';
        break;
      case 'distance':
        query += ' ORDER BY distance_from_center ASC';
        break;
      default:
        query += ' ORDER BY rating DESC, price_per_night ASC';
    }

    const [rows] = await db.query(query, params);
    return rows;
  }

  /**
   * Get hotel by ID
   * @param {number} hotelId - Hotel ID
   * @returns {object} - Hotel details
   */
  async getHotelById(hotelId) {
    const [rows] = await db.query(
      'SELECT * FROM Hotels WHERE id = ?',
      [hotelId]
    );

    if (rows.length === 0) {
      return null;
    }

    const hotel = rows[0];
    
    // Parse amenities if stored as JSON string
    if (hotel.amenities && typeof hotel.amenities === 'string') {
      try {
        hotel.amenities = JSON.parse(hotel.amenities);
      } catch (e) {
        hotel.amenities = [];
      }
    }

    return hotel;
  }

  /**
   * Get hotels by city
   * @param {string} city - City name
   * @param {object} options - Additional options
   * @returns {Array} - List of hotels in the city
   */
  async getHotelsByCity(city, options = {}) {
    return this.getHotels({ city, ...options });
  }

  /**
   * Search hotels
   * @param {string} searchTerm - Search term
   * @param {object} filters - Additional filters
   * @returns {Array} - Matching hotels
   */
  async searchHotels(searchTerm, filters = {}) {
    return this.getHotels({ search: searchTerm, ...filters });
  }

  /**
   * Get unique cities with hotels
   * @returns {Array} - List of cities
   */
  async getCities() {
    const [rows] = await db.query(
      `SELECT DISTINCT city, COUNT(*) as hotel_count 
       FROM Hotels 
       GROUP BY city 
       ORDER BY city ASC`
    );

    return rows;
  }

  /**
   * Get hotel statistics for a city
   * @param {string} city - City name
   * @returns {object} - Statistics
   */
  async getCityStats(city) {
    const [stats] = await db.query(
      `SELECT 
        COUNT(*) as total_hotels,
        AVG(price_per_night) as avg_price,
        MIN(price_per_night) as min_price,
        MAX(price_per_night) as max_price,
        AVG(rating) as avg_rating
       FROM Hotels 
       WHERE LOWER(city) = LOWER(?)`,
      [city]
    );

    const [priceRanges] = await db.query(
      `SELECT 
        SUM(CASE WHEN price_per_night < 1000 THEN 1 ELSE 0 END) as budget,
        SUM(CASE WHEN price_per_night BETWEEN 1000 AND 3000 THEN 1 ELSE 0 END) as mid_range,
        SUM(CASE WHEN price_per_night > 3000 THEN 1 ELSE 0 END) as luxury
       FROM Hotels 
       WHERE LOWER(city) = LOWER(?)`,
      [city]
    );

    return {
      ...stats[0],
      price_ranges: priceRanges[0]
    };
  }

  /**
   * Get featured/recommended hotels
   * @param {number} limit - Number of hotels to return
   * @returns {Array} - Featured hotels
   */
  async getFeaturedHotels(limit = 10) {
    const [rows] = await db.query(
      `SELECT * FROM Hotels 
       WHERE rating >= 4.0 
       ORDER BY rating DESC, price_per_night ASC 
       LIMIT ?`,
      [limit]
    );

    return rows;
  }

  /**
   * Get hotel recommendations based on budget
   * @param {string} city - City name
   * @param {number} budget - Budget per night
   * @param {number} rating - Minimum rating
   * @returns {Array} - Recommended hotels
   */
  async getRecommendations(city, budget, rating = 3.0) {
    const [rows] = await db.query(
      `SELECT * FROM Hotels 
       WHERE LOWER(city) = LOWER(?) 
       AND price_per_night <= ? 
       AND rating >= ?
       ORDER BY rating DESC, price_per_night ASC 
       LIMIT 10`,
      [city, budget, rating]
    );

    return rows;
  }

  /**
   * Create a new hotel (admin only)
   * @param {object} hotelData - Hotel details
   * @returns {object} - Created hotel
   */
  async createHotel(hotelData) {
    const { 
      name, 
      city, 
      pricePerNight, 
      rating, 
      amenities, 
      distanceFromCenter, 
      imageUrl,
      address,
      phone,
      description 
    } = hotelData;

    // Convert amenities array to JSON string
    const amenitiesJson = Array.isArray(amenities) ? JSON.stringify(amenities) : '[]';

    const [result] = await db.query(
      `INSERT INTO Hotels 
       (name, city, price_per_night, rating, amenities, distance_from_center, image_url, address, phone, description, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [name, city, pricePerNight, rating, amenitiesJson, distanceFromCenter, imageUrl, address, phone, description]
    );

    return {
      id: result.insertId,
      ...hotelData
    };
  }

  /**
   * Update hotel details (admin only)
   * @param {number} hotelId - Hotel ID
   * @param {object} updateData - Updated hotel data
   * @returns {object} - Updated hotel
   */
  async updateHotel(hotelId, updateData) {
    const { 
      name, 
      city, 
      pricePerNight, 
      rating, 
      amenities, 
      distanceFromCenter, 
      imageUrl,
      address,
      phone,
      description 
    } = updateData;

    const amenitiesJson = Array.isArray(amenities) ? JSON.stringify(amenities) : amenities;

    await db.query(
      `UPDATE Hotels 
       SET name = ?, city = ?, price_per_night = ?, rating = ?, amenities = ?, 
           distance_from_center = ?, image_url = ?, address = ?, phone = ?, description = ?
       WHERE id = ?`,
      [name, city, pricePerNight, rating, amenitiesJson, distanceFromCenter, imageUrl, address, phone, description, hotelId]
    );

    return this.getHotelById(hotelId);
  }

  /**
   * Delete hotel (admin only)
   * @param {number} hotelId - Hotel ID
   */
  async deleteHotel(hotelId) {
    await db.query('DELETE FROM Hotels WHERE id = ?', [hotelId]);
  }

  /**
   * Get price range for filters
   * @param {string} city - Optional city filter
   * @returns {object} - Min and max prices
   */
  async getPriceRange(city = null) {
    let query = 'SELECT MIN(price_per_night) as min, MAX(price_per_night) as max FROM Hotels';
    const params = [];

    if (city) {
      query += ' WHERE LOWER(city) = LOWER(?)';
      params.push(city);
    }

    const [rows] = await db.query(query, params);
    return rows[0];
  }
}

module.exports = new HotelService();
