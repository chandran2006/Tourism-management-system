const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, reviewController.addReview);
router.get('/:placeId', reviewController.getReviewsByPlace);

module.exports = router;
