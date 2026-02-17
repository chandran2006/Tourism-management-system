const axios = require('axios');
const db = require('../config/database');

// AI Chat Service - OpenAI GPT Integration
class AIChatService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
    this.model = 'gpt-4o-mini';
    this.maxTokens = 500;
    this.conversationCache = new Map(); // In-memory cache for conversation history
  }

  /**
   * Get conversation history for a user
   * @param {number} userId - User ID
   * @returns {Array} - Conversation history
   */
  async getConversationHistory(userId) {
    // Check cache first
    if (this.conversationCache.has(userId)) {
      return this.conversationCache.get(userId);
    }

    // Fetch from database
    const [rows] = await db.query(
      `SELECT role, content, created_at 
       FROM ChatHistory 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [userId]
    );

    const history = rows.reverse().map(row => ({
      role: row.role,
      content: row.content
    }));

    // Cache it
    this.conversationCache.set(userId, history);
    return history;
  }

  /**
   * Save message to conversation history
   * @param {number} userId - User ID
   * @param {string} role - 'user' or 'assistant'
   * @param {string} content - Message content
   */
  async saveMessage(userId, role, content) {
    await db.query(
      `INSERT INTO ChatHistory (user_id, role, content, created_at) 
       VALUES (?, ?, ?, NOW())`,
      [userId, role, content]
    );

    // Update cache
    let history = this.conversationCache.get(userId) || [];
    history.push({ role, content });
    
    // Keep only last 10 messages in cache
    if (history.length > 10) {
      history = history.slice(-10);
    }
    
    this.conversationCache.set(userId, history);
  }

  /**
   * Create system prompt for travel assistant
   * @returns {object} - System message object
   */
  getSystemPrompt() {
    return {
      role: 'system',
      content: `You are an expert AI travel assistant for a tourism app. Your responsibilities:
1. Answer travel-related queries (destinations, activities, weather, culture)
2. Suggest tourist places based on preferences (adventure, relaxation, cultural, nature)
3. Recommend hotels based on budget and location
4. Create and modify travel itineraries
5. Estimate trip budgets (accommodation, food, transport, activities)
6. Provide transport advice (flight, train, bus, cab options)
7. Give local tips (food, safety, best times to visit)

Always be helpful, concise, and friendly. When suggesting places or hotels, provide structured information.
For budget estimates, break down costs clearly. Keep responses under 150 words unless asked for details.`
    };
  }

  /**
   * Send message to OpenAI and get response
   * @param {number} userId - User ID
   * @param {string} userMessage - User's message
   * @returns {object} - AI response
   */
  async sendMessage(userId, userMessage) {
    try {
      // Validate API key
      if (!this.apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      // Get conversation history
      const history = await this.getConversationHistory(userId);

      // Build messages array
      const messages = [
        this.getSystemPrompt(),
        ...history,
        { role: 'user', content: userMessage }
      ];

      // Call OpenAI API
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: messages,
          max_tokens: this.maxTokens,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.5,
          presence_penalty: 0.3
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          timeout: 30000 // 30 seconds timeout
        }
      );

      const aiResponse = response.data.choices[0].message.content;

      // Save both messages to history
      await this.saveMessage(userId, 'user', userMessage);
      await this.saveMessage(userId, 'assistant', aiResponse);

      return {
        success: true,
        message: aiResponse,
        tokensUsed: response.data.usage.total_tokens,
        conversationId: history.length + 2
      };

    } catch (error) {
      console.error('AI Chat Service Error:', error.message);
      
      if (error.response?.status === 401) {
        throw new Error('Invalid OpenAI API key');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      }
      
      throw new Error('Failed to get AI response. Please try again.');
    }
  }

  /**
   * Get structured suggestions (places, hotels, itinerary)
   * @param {number} userId - User ID
   * @param {string} query - Query type (places, hotels, itinerary)
   * @param {object} params - Additional parameters
   * @returns {object} - Structured response
   */
  async getStructuredSuggestion(userId, query, params = {}) {
    const { destination, budget, duration, preferences } = params;

    let prompt = '';
    
    switch(query) {
      case 'places':
        prompt = `Suggest 5 tourist places in ${destination || 'popular destinations'}. 
                  Preferences: ${preferences || 'all types'}. 
                  Return as JSON array: [{"name": "", "description": "", "type": ""}]`;
        break;
        
      case 'hotels':
        prompt = `Suggest 5 hotels in ${destination} with budget ${budget || 'any'} per night.
                  Return as JSON array: [{"name": "", "pricePerNight": 0, "rating": 0, "amenities": []}]`;
        break;
        
      case 'itinerary':
        prompt = `Create a ${duration || '3'}-day itinerary for ${destination}.
                  Budget: ${budget || 'medium'}. Preferences: ${preferences || 'balanced'}.
                  Return as JSON: {"days": [{"day": 1, "activities": [], "meals": [], "accommodation": ""}]}`;
        break;
        
      case 'budget':
        prompt = `Estimate total budget for ${duration || '3'}-day trip to ${destination}.
                  Include accommodation, food, transport, and activities.
                  Return as JSON: {"total": 0, "breakdown": {"accommodation": 0, "food": 0, "transport": 0, "activities": 0}}`;
        break;
        
      case 'transport':
        prompt = `Suggest best transport options from ${params.from} to ${params.to}.
                  Budget: ${budget || 'any'}. Include flight, train, bus options with estimated costs.
                  Return as JSON array: [{"mode": "", "duration": "", "cost": 0, "frequency": ""}]`;
        break;
        
      default:
        prompt = query;
    }

    const response = await this.sendMessage(userId, prompt);
    
    // Try to parse JSON from response
    try {
      const jsonMatch = response.message.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        return {
          success: true,
          data: parsedData,
          raw: response.message,
          tokensUsed: response.tokensUsed
        };
      }
    } catch (e) {
      // If JSON parsing fails, return raw message
    }

    return {
      success: true,
      data: null,
      raw: response.message,
      tokensUsed: response.tokensUsed
    };
  }

  /**
   * Clear conversation history for a user
   * @param {number} userId - User ID
   */
  async clearHistory(userId) {
    await db.query('DELETE FROM ChatHistory WHERE user_id = ?', [userId]);
    this.conversationCache.delete(userId);
  }

  /**
   * Get chat statistics for a user
   * @param {number} userId - User ID
   * @returns {object} - Statistics
   */
  async getChatStats(userId) {
    const [rows] = await db.query(
      `SELECT 
        COUNT(*) as totalMessages,
        SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as userMessages,
        SUM(CASE WHEN role = 'assistant' THEN 1 ELSE 0 END) as botMessages,
        MIN(created_at) as firstChat,
        MAX(created_at) as lastChat
       FROM ChatHistory 
       WHERE user_id = ?`,
      [userId]
    );

    return rows[0];
  }
}

module.exports = new AIChatService();
