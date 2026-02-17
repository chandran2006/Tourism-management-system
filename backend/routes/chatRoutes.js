const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Send message to AI chatbot
router.post('/', chatController.sendMessage);

// Get structured suggestions
router.post('/suggest', chatController.getStructuredSuggestion);

// Get conversation history
router.get('/history', chatController.getHistory);

// Clear conversation history
router.delete('/history', chatController.clearHistory);

// Get chat statistics
router.get('/stats', chatController.getChatStats);

module.exports = router;
