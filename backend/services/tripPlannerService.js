const db = require('../config/database');
const hotelService = require('./hotelService');
const transportService = require('./transportService');
const aiChatService = require('./aiChatService');

class TripPlannerService {
  /**
   * Create a comprehensive trip plan
   * @param {object} tripData - Trip details
   * @param {number} userId - User ID
   * @returns {object} - Complete trip plan
   */
  async createTripPlan(tripData, userId) {
    const { 
      tripName,
      destination, 
      startDate, 
      endDate, 
      plannedBudget,
      preferences,
      transportMode 
    } = tripData;

    // Calculate duration
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Save trip to database
    const [result] = await db.query(
      `INSERT INTO Trips 
       (user_id, trip_name, destination, start_date, end_date, planned_budget, 
        transport_mode, preferences, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'planned', NOW())`,
      [
        userId,
        tripName || `Trip to ${destination}`,
        destination,
        startDate,
        endDate,
        plannedBudget,
        transportMode || 'cab',
        JSON.stringify(preferences || {})
      ]
    );

    const tripId = result.insertId;

    return {
      id: tripId,
      trip_name: tripName || `Trip to ${destination}`,
      destination,
      start_date: startDate,
      end_date: endDate,
      planned_budget: plannedBudget,
      transport_mode: transportMode || 'cab',
      status: 'planned',
      created_at: new Date()
    };
  }

  /**
   * Get trip details with all associated data
   * @param {number} tripId - Trip ID
   * @param {number} userId - User ID
   * @returns {object} - Complete trip details
   */
  async getTripDetails(tripId, userId) {
    // Get trip basic info
    const [tripRows] = await db.query(
      `SELECT * FROM Trips WHERE id = ? AND user_id = ?`,
      [tripId, userId]
    );

    if (tripRows.length === 0) {
      return null;
    }

    const trip = tripRows[0];

    // Get associated hotels
    const [hotelRows] = await db.query(
      `SELECT h.*, th.check_in, th.check_out, th.rooms
       FROM TripHotels th
       JOIN Hotels h ON th.hotel_id = h.id
       WHERE th.trip_id = ?`,
      [tripId]
    );

    // Get expenses
    const [expenseRows] = await db.query(
      `SELECT * FROM TripExpenses WHERE trip_id = ? ORDER BY expense_date DESC`,
      [tripId]
    );

    // Calculate expense summary
    const [expenseSummary] = await db.query(
      `SELECT 
        SUM(amount) as totalExpense,
        category,
        SUM(amount) as categoryTotal,
        COUNT(*) as count
       FROM TripExpenses
       WHERE trip_id = ?
       GROUP BY category`,
      [tripId]
    );

    const totalSpent = expenseRows.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const remaining = parseFloat(trip.planned_budget) - totalSpent;

    return {
      ...trip,
      preferences: trip.preferences ? JSON.parse(trip.preferences) : {},
      hotels: hotelRows,
      expenses: expenseRows,
      expenseSummary: {
        total: totalSpent,
        remaining,
        percentageUsed: (totalSpent / parseFloat(trip.planned_budget)) * 100,
        byCategory: expenseSummary
      }
    };
  }

  /**
   * Generate complete trip budget breakdown
   * @param {number} tripId - Trip ID
   * @param {number} userId - User ID
   * @returns {object} - Detailed budget breakdown
   */
  async getTripBudget(tripId, userId) {
    const trip = await this.getTripDetails(tripId, userId);
    
    if (!trip) {
      throw new Error('Trip not found');
    }

    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Calculate planned vs actual
    const planned = {
      accommodation: parseFloat(trip.planned_budget) * 0.4,
      transport: parseFloat(trip.planned_budget) * 0.25,
      food: parseFloat(trip.planned_budget) * 0.25,
      activities: parseFloat(trip.planned_budget) * 0.10,
      total: parseFloat(trip.planned_budget)
    };

    const actual = {
      accommodation: 0,
      transport: 0,
      food: 0,
      activities: 0,
      total: trip.expenseSummary.total
    };

    // Map expenses to categories
    trip.expenses.forEach(expense => {
      const category = expense.category.toLowerCase();
      if (category === 'hotel') {
        actual.accommodation += parseFloat(expense.amount);
      } else if (category === 'transport') {
        actual.transport += parseFloat(expense.amount);
      } else if (category === 'food') {
        actual.food += parseFloat(expense.amount);
      } else {
        actual.activities += parseFloat(expense.amount);
      }
    });

    return {
      tripId,
      destination: trip.destination,
      duration,
      planned,
      actual,
      remaining: trip.expenseSummary.remaining,
      variance: {
        accommodation: actual.accommodation - planned.accommodation,
        transport: actual.transport - planned.transport,
        food: actual.food - planned.food,
        activities: actual.activities - planned.activities,
        total: actual.total - planned.total
      },
      recommendations: this.getBudgetRecommendations(planned, actual, trip.expenseSummary.remaining)
    };
  }

  /**
   * Get budget recommendations
   * @param {object} planned - Planned budget
   * @param {object} actual - Actual expenses
   * @param {number} remaining - Remaining budget
   * @returns {Array} - Recommendations
   */
  getBudgetRecommendations(planned, actual, remaining) {
    const recommendations = [];

    if (remaining < 0) {
      recommendations.push({
        type: 'warning',
        message: 'Budget exceeded! Consider reducing discretionary spending.',
        priority: 'high'
      });
    } else if (remaining < planned.total * 0.1) {
      recommendations.push({
        type: 'caution',
        message: 'Less than 10% budget remaining. Monitor expenses carefully.',
        priority: 'medium'
      });
    }

    // Check each category
    Object.keys(planned).forEach(category => {
      if (category !== 'total' && actual[category] > planned[category]) {
        const overspend = actual[category] - planned[category];
        const percentage = (overspend / planned[category]) * 100;
        
        recommendations.push({
          type: 'info',
          message: `${category.charAt(0).toUpperCase() + category.slice(1)} is ${percentage.toFixed(1)}% over budget.`,
          priority: 'low'
        });
      }
    });

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        message: 'Trip expenses are within budget. Great job!',
        priority: 'low'
      });
    }

    return recommendations;
  }

  /**
   * Update trip status
   * @param {number} tripId - Trip ID
   * @param {number} userId - User ID
   * @param {string} status - New status
   */
  async updateTripStatus(tripId, userId, status) {
    const validStatuses = ['planned', 'ongoing', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    await db.query(
      `UPDATE Trips SET status = ? WHERE id = ? AND user_id = ?`,
      [status, tripId, userId]
    );
  }

  /**
   * Get all trips for a user
   * @param {number} userId - User ID
   * @param {string} status - Optional status filter
   * @returns {Array} - List of trips
   */
  async getUserTrips(userId, status = null) {
    let query = 'SELECT * FROM Trips WHERE user_id = ?';
    const params = [userId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY start_date DESC';

    const [rows] = await db.query(query, params);
    
    return rows.map(trip => ({
      ...trip,
      preferences: trip.preferences ? JSON.parse(trip.preferences) : {}
    }));
  }

  /**
   * Delete a trip
   * @param {number} tripId - Trip ID
   * @param {number} userId - User ID
   */
  async deleteTrip(tripId, userId) {
    // Delete associated data first
    await db.query('DELETE FROM TripExpenses WHERE trip_id = ? AND user_id = ?', [tripId, userId]);
    await db.query('DELETE FROM TripHotels WHERE trip_id = ?', [tripId]);
    await db.query('DELETE FROM Trips WHERE id = ? AND user_id = ?', [tripId, userId]);
  }
}

module.exports = new TripPlannerService();
