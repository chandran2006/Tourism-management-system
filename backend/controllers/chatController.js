const aiChatService = require('../services/aiChatService');

/**
 * Send a message to AI chatbot
 * POST /api/chat
 */
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty'
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Message too long. Please keep it under 1000 characters.'
      });
    }

    const response = await aiChatService.sendMessage(userId, message);

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Chat Controller Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to process chat message'
    });
  }
};

/**
 * Get structured suggestions (places, hotels, itinerary, etc.)
 * POST /api/chat/suggest
 */
exports.getStructuredSuggestion = async (req, res) => {
  try {
    const { query, params } = req.body;
    const userId = req.user.id;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query type is required'
      });
    }

    const validQueries = ['places', 'hotels', 'itinerary', 'budget', 'transport'];
    if (!validQueries.includes(query)) {
      return res.status(400).json({
        success: false,
        message: `Invalid query type. Must be one of: ${validQueries.join(', ')}`
      });
    }

    const response = await aiChatService.getStructuredSuggestion(userId, query, params);

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Structured Suggestion Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get suggestions'
    });
  }
};

/**
 * Get conversation history
 * GET /api/chat/history
 */
exports.getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await aiChatService.getConversationHistory(userId);

    res.json({
      success: true,
      data: {
        messages: history,
        count: history.length
      }
    });

  } catch (error) {
    console.error('Get History Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chat history'
    });
  }
};

/**
 * Clear conversation history
 * DELETE /api/chat/history
 */
exports.clearHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    await aiChatService.clearHistory(userId);

    res.json({
      success: true,
      message: 'Chat history cleared successfully'
    });

  } catch (error) {
    console.error('Clear History Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to clear chat history'
    });
  }
};

/**
 * Get chat statistics
 * GET /api/chat/stats
 */
exports.getChatStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await aiChatService.getChatStats(userId);

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get Chat Stats Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chat statistics'
    });
  }
};
