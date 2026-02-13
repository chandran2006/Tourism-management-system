const db = require('../config/database');

exports.addReview = async (req, res) => {
  try {
    const { placeId, rating, comment } = req.body;
    const userId = req.user.id;

    await db.query(
      'INSERT INTO reviews (userId, placeId, rating, comment) VALUES (?, ?, ?, ?)',
      [userId, placeId, rating, comment]
    );

    // Update place average rating
    const [avgResult] = await db.query(
      'SELECT AVG(rating) as avgRating FROM reviews WHERE placeId = ?',
      [placeId]
    );

    await db.query(
      'UPDATE tourist_places SET rating = ? WHERE id = ?',
      [avgResult[0].avgRating.toFixed(1), placeId]
    );

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getReviewsByPlace = async (req, res) => {
  try {
    const [reviews] = await db.query(
      'SELECT r.*, u.name as userName FROM reviews r JOIN users u ON r.userId = u.id WHERE r.placeId = ? ORDER BY r.created_at DESC',
      [req.params.placeId]
    );

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
