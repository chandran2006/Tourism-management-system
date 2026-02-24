const db = require('../config/database');

// Optimized: Parallel execution for review submission
exports.addReview = async (req, res) => {
  try {
    const { placeId, rating, comment } = req.body;
    const userId = req.user.id;

    // Insert review and calculate average in parallel
    const [insertResult, [avgResult]] = await Promise.all([
      db.query(
        'INSERT INTO reviews (userId, placeId, rating, comment) VALUES (?, ?, ?, ?)',
        [userId, placeId, rating, comment]
      ),
      db.query(
        'SELECT AVG(rating) as avgRating, COUNT(*) as totalReviews FROM reviews WHERE placeId = ?',
        [placeId]
      )
    ]);

    // Update place rating
    const newAvgRating = ((avgResult[0].avgRating * avgResult[0].totalReviews + rating) / (avgResult[0].totalReviews + 1)).toFixed(1);
    
    await db.query(
      'UPDATE tourist_places SET rating = ? WHERE id = ?',
      [newAvgRating, placeId]
    );

    res.status(201).json({ message: 'Review added successfully', rating: newAvgRating });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Optimized: Added LIMIT for better performance
exports.getReviewsByPlace = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const [reviews] = await db.query(
      'SELECT r.*, u.name as userName FROM reviews r JOIN users u ON r.userId = u.id WHERE r.placeId = ? ORDER BY r.created_at DESC LIMIT ?',
      [req.params.placeId, parseInt(limit)]
    );

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
