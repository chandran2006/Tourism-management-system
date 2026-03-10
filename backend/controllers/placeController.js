const db = require('../config/database');

// Input validation helper
const validateLimit = (limit) => {
  const parsed = parseInt(limit);
  return isNaN(parsed) || parsed < 1 ? 100 : Math.min(parsed, 500);
};

exports.getAllPlaces = async (req, res) => {
  try {
    const { category, location, search, limit = 100 } = req.query;
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

    query += ' ORDER BY rating DESC LIMIT ?';
    params.push(validateLimit(limit));

    const [places] = await db.query(query, params);
    res.json(places);
  } catch (error) {
    console.error('Get all places error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPlaceById = async (req, res) => {
  try {
    const placeId = parseInt(req.params.id);
    
    if (isNaN(placeId)) {
      return res.status(400).json({ message: 'Invalid place ID' });
    }
    
    // Execute all queries in parallel
    const [[places], [reviews]] = await Promise.all([
      db.query('SELECT * FROM tourist_places WHERE id = ?', [placeId]),
      db.query(
        'SELECT r.*, u.name as userName FROM reviews r JOIN users u ON r.userId = u.id WHERE r.placeId = ? ORDER BY r.created_at DESC LIMIT 20',
        [placeId]
      )
    ]);

    if (places.length === 0) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // Get suggested next destination if exists
    let nextPlace = null;
    if (places[0].nextSuggestion) {
      const [next] = await db.query(
        'SELECT id, name, imageUrl, category, location FROM tourist_places WHERE id = ?', 
        [places[0].nextSuggestion]
      );
      nextPlace = next[0] || null;
    }

    res.json({ ...places[0], reviews, nextPlace });
  } catch (error) {
    console.error('Get place by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getPlacesByCategory = async (req, res) => {
  try {
    const validCategories = ['Nature', 'Temple', 'Beach', 'Food', 'Adventure', 'Heritage'];
    const category = req.params.category;
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const [places] = await db.query(
      'SELECT * FROM tourist_places WHERE category = ? ORDER BY rating DESC',
      [category]
    );
    res.json(places);
  } catch (error) {
    console.error('Get places by category error:', error);
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

    const interests = users[0].interests.split(',').filter(i => i.trim());
    if (interests.length === 0) {
      const [places] = await db.query('SELECT * FROM tourist_places ORDER BY rating DESC LIMIT 10');
      return res.json(places);
    }

    const placeholders = interests.map(() => '?').join(',');
    const [places] = await db.query(
      `SELECT * FROM tourist_places WHERE category IN (${placeholders}) ORDER BY rating DESC LIMIT 10`,
      interests
    );

    res.json(places);
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createPlace = async (req, res) => {
  try {
    const { name, description, category, location, imageUrl, latitude, longitude, bestTime, visitDuration, crowdLevel, travelTips, nearbyFood, nextSuggestion } = req.body;

    // Input validation
    if (!name || !description || !category || !location) {
      return res.status(400).json({ message: 'Required fields: name, description, category, location' });
    }

    const [result] = await db.query(
      'INSERT INTO tourist_places (name, description, category, location, imageUrl, latitude, longitude, bestTime, visitDuration, crowdLevel, travelTips, nearbyFood, nextSuggestion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, category, location, imageUrl || null, latitude || null, longitude || null, bestTime || null, visitDuration || null, crowdLevel || null, travelTips || null, nearbyFood || null, nextSuggestion || null]
    );

    res.status(201).json({ message: 'Place created successfully', id: result.insertId });
  } catch (error) {
    console.error('Create place error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updatePlace = async (req, res) => {
  try {
    const placeId = parseInt(req.params.id);
    
    if (isNaN(placeId)) {
      return res.status(400).json({ message: 'Invalid place ID' });
    }

    const { name, description, category, location, imageUrl, latitude, longitude, bestTime, visitDuration, crowdLevel, travelTips, nearbyFood, nextSuggestion } = req.body;

    // Check if place exists
    const [existing] = await db.query('SELECT id FROM tourist_places WHERE id = ?', [placeId]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Place not found' });
    }

    await db.query(
      'UPDATE tourist_places SET name = ?, description = ?, category = ?, location = ?, imageUrl = ?, latitude = ?, longitude = ?, bestTime = ?, visitDuration = ?, crowdLevel = ?, travelTips = ?, nearbyFood = ?, nextSuggestion = ? WHERE id = ?',
      [name, description, category, location, imageUrl, latitude, longitude, bestTime, visitDuration, crowdLevel, travelTips, nearbyFood, nextSuggestion, placeId]
    );

    res.json({ message: 'Place updated successfully' });
  } catch (error) {
    console.error('Update place error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deletePlace = async (req, res) => {
  try {
    const placeId = parseInt(req.params.id);
    
    if (isNaN(placeId)) {
      return res.status(400).json({ message: 'Invalid place ID' });
    }

    const [result] = await db.query('DELETE FROM tourist_places WHERE id = ?', [placeId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    console.error('Delete place error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.generateItinerary = async (req, res) => {
  try {
    const { city, duration } = req.body;
    
    if (!city || !duration) {
      return res.status(400).json({ message: 'City and duration are required' });
    }

    const durationNum = parseInt(duration);
    if (isNaN(durationNum) || durationNum < 1 || durationNum > 30) {
      return res.status(400).json({ message: 'Duration must be between 1 and 30 days' });
    }
    
    const [places] = await db.query(
      'SELECT * FROM tourist_places WHERE location LIKE ? ORDER BY rating DESC LIMIT ?',
      [`%${city}%`, durationNum * 3]
    );

    if (places.length === 0) {
      return res.status(404).json({ message: 'No places found for this city' });
    }

    const itinerary = [];
    for (let day = 1; day <= durationNum; day++) {
      const dayPlaces = places.slice((day - 1) * 3, day * 3);
      itinerary.push({
        day,
        places: dayPlaces,
        activities: dayPlaces.map(p => `Visit ${p.name}`)
      });
    }

    res.json({ city, duration: durationNum, itinerary });
  } catch (error) {
    console.error('Generate itinerary error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.generateTimeline = async (req, res) => {
  try {
    const { city, duration } = req.body;
    
    if (!city || !duration) {
      return res.status(400).json({ message: 'City and duration are required' });
    }

    const durationNum = parseInt(duration);
    if (isNaN(durationNum) || durationNum < 1 || durationNum > 30) {
      return res.status(400).json({ message: 'Duration must be between 1 and 30 days' });
    }
    
    const [places] = await db.query(
      'SELECT * FROM tourist_places WHERE location LIKE ? ORDER BY rating DESC LIMIT ?',
      [`%${city}%`, durationNum * 4]
    );

    if (places.length === 0) {
      return res.json({ city, duration: durationNum, timeline: [] });
    }

    const timeline = [];
    const timeSlots = durationNum === 1 
      ? ['09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM']
      : ['09:00 AM', '11:30 AM', '02:00 PM', '05:00 PM', '09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM'];
    
    const dayLabels = durationNum === 1 ? ['Day 1'] : ['Day 1', 'Day 1', 'Day 1', 'Day 1', 'Day 2', 'Day 2', 'Day 2', 'Day 2'];

    places.forEach((place, index) => {
      if (index < timeSlots.length) {
        timeline.push({
          time: timeSlots[index],
          day: dayLabels[index],
          place: {
            id: place.id,
            name: place.name,
            description: place.description,
            imageUrl: place.imageUrl,
            category: place.category,
            visitDuration: place.visitDuration || '2 hours',
            travelTips: place.travelTips
          }
        });
      }
    });

    res.json({ city, duration: durationNum, timeline });
  } catch (error) {
    console.error('Generate timeline error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
