const db = require('../config/database');

exports.getAllPlaces = async (req, res) => {
  try {
    const { category, location, search } = req.query;
    let query = 'SELECT * FROM tourist_places WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (location) {
      query += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY rating DESC';

    const [places] = await db.query(query, params);
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPlaceById = async (req, res) => {
  try {
    const [places] = await db.query('SELECT * FROM tourist_places WHERE id = ?', [req.params.id]);
    if (places.length === 0) {
      return res.status(404).json({ message: 'Place not found' });
    }

    const [reviews] = await db.query(
      'SELECT r.*, u.name as userName FROM reviews r JOIN users u ON r.userId = u.id WHERE r.placeId = ? ORDER BY r.created_at DESC',
      [req.params.id]
    );

    res.json({ ...places[0], reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPlacesByCategory = async (req, res) => {
  try {
    const [places] = await db.query(
      'SELECT * FROM tourist_places WHERE category = ? ORDER BY rating DESC',
      [req.params.category]
    );
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const [users] = await db.query('SELECT interests FROM users WHERE id = ?', [userId]);
    
    if (users.length === 0 || !users[0].interests) {
      const [places] = await db.query('SELECT * FROM tourist_places ORDER BY rating DESC LIMIT 10');
      return res.json(places);
    }

    const interests = users[0].interests.split(',');
    const placeholders = interests.map(() => '?').join(',');
    const [places] = await db.query(
      `SELECT * FROM tourist_places WHERE category IN (${placeholders}) ORDER BY rating DESC LIMIT 10`,
      interests
    );

    res.json(places);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createPlace = async (req, res) => {
  try {
    const { name, description, category, location, imageUrl, latitude, longitude } = req.body;

    const [result] = await db.query(
      'INSERT INTO tourist_places (name, description, category, location, imageUrl, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, category, location, imageUrl, latitude, longitude]
    );

    res.status(201).json({ message: 'Place created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updatePlace = async (req, res) => {
  try {
    const { name, description, category, location, imageUrl, latitude, longitude } = req.body;

    await db.query(
      'UPDATE tourist_places SET name = ?, description = ?, category = ?, location = ?, imageUrl = ?, latitude = ?, longitude = ? WHERE id = ?',
      [name, description, category, location, imageUrl, latitude, longitude, req.params.id]
    );

    res.json({ message: 'Place updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deletePlace = async (req, res) => {
  try {
    await db.query('DELETE FROM tourist_places WHERE id = ?', [req.params.id]);
    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.generateItinerary = async (req, res) => {
  try {
    const { city, duration } = req.body;
    
    const [places] = await db.query(
      'SELECT * FROM tourist_places WHERE location LIKE ? ORDER BY rating DESC LIMIT ?',
      [`%${city}%`, duration * 3]
    );

    const itinerary = [];
    for (let day = 1; day <= duration; day++) {
      const dayPlaces = places.slice((day - 1) * 3, day * 3);
      itinerary.push({
        day,
        places: dayPlaces,
        activities: dayPlaces.map(p => `Visit ${p.name}`)
      });
    }

    res.json({ city, duration, itinerary });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
