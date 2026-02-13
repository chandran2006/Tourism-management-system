const db = require('../config/database');

exports.addFavorite = async (req, res) => {
  try {
    const { placeId } = req.body;
    const userId = req.user.id;

    await db.query(
      'INSERT INTO favorites (userId, placeId) VALUES (?, ?)',
      [userId, placeId]
    );

    res.status(201).json({ message: 'Added to favorites' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Already in favorites' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const [favorites] = await db.query(
      'SELECT tp.* FROM tourist_places tp JOIN favorites f ON tp.id = f.placeId WHERE f.userId = ?',
      [userId]
    );

    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { placeId } = req.params;

    await db.query('DELETE FROM favorites WHERE userId = ? AND placeId = ?', [userId, placeId]);

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
