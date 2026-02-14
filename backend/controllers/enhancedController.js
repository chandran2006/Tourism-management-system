const db = require('../config/database');
const axios = require('axios');

// Get trending places (top-rated and most reviewed)
exports.getTrendingPlaces = async (req, res) => {
  try {
    const [places] = await db.query(`
      SELECT tp.*, COUNT(r.id) as review_count 
      FROM tourist_places tp 
      LEFT JOIN reviews r ON tp.id = r.placeId 
      GROUP BY tp.id 
      ORDER BY tp.rating DESC, review_count DESC 
      LIMIT 6
    `);
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get nearby places based on coordinates
exports.getNearbyPlaces = async (req, res) => {
  try {
    const { latitude, longitude, placeId } = req.query;
    const [places] = await db.query(`
      SELECT *, 
      (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * 
      cos(radians(longitude) - radians(?)) + sin(radians(?)) * 
      sin(radians(latitude)))) AS distance 
      FROM tourist_places 
      WHERE id != ? 
      HAVING distance < 100 
      ORDER BY distance 
      LIMIT 3
    `, [latitude, longitude, latitude, placeId]);
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get weather information (using OpenWeatherMap API)
exports.getWeather = async (req, res) => {
  try {
    const { city } = req.query;
    const apiKey = process.env.WEATHER_API_KEY || 'demo'; // Add your API key
    
    // Mock weather data if no API key
    if (apiKey === 'demo') {
      return res.json({
        temp: Math.floor(Math.random() * 15) + 20,
        description: 'Clear sky',
        humidity: Math.floor(Math.random() * 30) + 50,
        icon: '01d'
      });
    }
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    
    res.json({
      temp: Math.round(response.data.main.temp),
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      icon: response.data.weather[0].icon
    });
  } catch (error) {
    res.json({ temp: 25, description: 'Pleasant', humidity: 60, icon: '01d' });
  }
};

// Calculate travel budget
exports.calculateBudget = async (req, res) => {
  try {
    const { places, travelType, duration } = req.body;
    
    const costs = {
      budget: { perDay: 1500, transport: 500 },
      moderate: { perDay: 3000, transport: 1500 },
      luxury: { perDay: 6000, transport: 3000 }
    };
    
    const selected = costs[travelType] || costs.moderate;
    const accommodation = selected.perDay * duration;
    const transport = selected.transport * places;
    const food = 500 * duration;
    const activities = 1000 * places;
    const total = accommodation + transport + food + activities;
    
    res.json({
      breakdown: { accommodation, transport, food, activities },
      total,
      perPerson: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Save travel plan
exports.saveTravelPlan = async (req, res) => {
  try {
    const { userId, planName, city, duration, places, budget } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO saved_plans (userId, planName, city, duration, places, budget) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, planName, city, duration, JSON.stringify(places), budget]
    );
    
    res.status(201).json({ message: 'Plan saved successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get saved travel plans
exports.getSavedPlans = async (req, res) => {
  try {
    const userId = req.user.id;
    const [plans] = await db.query(
      'SELECT * FROM saved_plans WHERE userId = ? ORDER BY created_at DESC',
      [userId]
    );
    
    plans.forEach(plan => {
      plan.places = JSON.parse(plan.places);
    });
    
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete saved plan
exports.deleteSavedPlan = async (req, res) => {
  try {
    await db.query('DELETE FROM saved_plans WHERE id = ? AND userId = ?', 
      [req.params.id, req.user.id]);
    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
