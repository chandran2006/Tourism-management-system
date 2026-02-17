const db = require('../config/database');

class ExpenseService {
  /**
   * Create a new expense
   * @param {object} expenseData - Expense details
   * @returns {object} - Created expense
   */
  async createExpense(expenseData) {
    const { userId, tripId, category, amount, description, date } = expenseData;

    const [result] = await db.query(
      `INSERT INTO TripExpenses (user_id, trip_id, category, amount, description, expense_date, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [userId, tripId, category, amount, description, date]
    );

    return {
      id: result.insertId,
      ...expenseData
    };
  }

  /**
   * Get all expenses for a user
   * @param {number} userId - User ID
   * @param {number} tripId - Optional trip ID filter
   * @returns {Array} - List of expenses
   */
  async getExpenses(userId, tripId = null) {
    let query = `
      SELECT e.*, t.trip_name, t.destination
      FROM TripExpenses e
      LEFT JOIN Trips t ON e.trip_id = t.id
      WHERE e.user_id = ?
    `;
    const params = [userId];

    if (tripId) {
      query += ' AND e.trip_id = ?';
      params.push(tripId);
    }

    query += ' ORDER BY e.expense_date DESC, e.created_at DESC';

    const [rows] = await db.query(query, params);
    return rows;
  }

  /**
   * Get expense by ID
   * @param {number} expenseId - Expense ID
   * @param {number} userId - User ID
   * @returns {object} - Expense details
   */
  async getExpenseById(expenseId, userId) {
    const [rows] = await db.query(
      `SELECT e.*, t.trip_name, t.destination
       FROM TripExpenses e
       LEFT JOIN Trips t ON e.trip_id = t.id
       WHERE e.id = ? AND e.user_id = ?`,
      [expenseId, userId]
    );

    return rows[0] || null;
  }

  /**
   * Update an expense
   * @param {number} expenseId - Expense ID
   * @param {number} userId - User ID
   * @param {object} updateData - Updated expense data
   * @returns {object} - Updated expense
   */
  async updateExpense(expenseId, userId, updateData) {
    const { category, amount, description, date } = updateData;

    await db.query(
      `UPDATE TripExpenses 
       SET category = ?, amount = ?, description = ?, expense_date = ?
       WHERE id = ? AND user_id = ?`,
      [category, amount, description, date, expenseId, userId]
    );

    return this.getExpenseById(expenseId, userId);
  }

  /**
   * Delete an expense
   * @param {number} expenseId - Expense ID
   * @param {number} userId - User ID
   */
  async deleteExpense(expenseId, userId) {
    await db.query(
      'DELETE FROM TripExpenses WHERE id = ? AND user_id = ?',
      [expenseId, userId]
    );
  }

  /**
   * Get expense summary for a trip
   * @param {number} tripId - Trip ID
   * @param {number} userId - User ID
   * @returns {object} - Expense summary with category breakdown
   */
  async getTripExpenseSummary(tripId, userId) {
    // Get total expenses by category
    const [categoryBreakdown] = await db.query(
      `SELECT 
        category,
        SUM(amount) as total,
        COUNT(*) as count
       FROM TripExpenses
       WHERE trip_id = ? AND user_id = ?
       GROUP BY category`,
      [tripId, userId]
    );

    // Get total expense
    const [totalRow] = await db.query(
      `SELECT SUM(amount) as totalExpense, COUNT(*) as totalTransactions
       FROM TripExpenses
       WHERE trip_id = ? AND user_id = ?`,
      [tripId, userId]
    );

    // Get trip budget
    const [tripRow] = await db.query(
      'SELECT planned_budget, trip_name, destination FROM Trips WHERE id = ? AND user_id = ?',
      [tripId, userId]
    );

    const trip = tripRow[0] || {};
    const totalExpense = totalRow[0].totalExpense || 0;
    const plannedBudget = trip.planned_budget || 0;
    const remaining = plannedBudget - totalExpense;
    const percentageUsed = plannedBudget > 0 ? (totalExpense / plannedBudget) * 100 : 0;

    return {
      tripId,
      tripName: trip.trip_name,
      destination: trip.destination,
      plannedBudget,
      totalExpense,
      remaining,
      percentageUsed: Math.round(percentageUsed * 100) / 100,
      isOverBudget: totalExpense > plannedBudget,
      categoryBreakdown,
      totalTransactions: totalRow[0].totalTransactions || 0
    };
  }

  /**
   * Get expense statistics for a user across all trips
   * @param {number} userId - User ID
   * @returns {object} - Overall expense statistics
   */
  async getUserExpenseStats(userId) {
    const [stats] = await db.query(
      `SELECT 
        COUNT(DISTINCT trip_id) as totalTrips,
        SUM(amount) as totalSpent,
        AVG(amount) as avgExpense,
        COUNT(*) as totalTransactions,
        MAX(amount) as maxExpense,
        MIN(amount) as minExpense
       FROM TripExpenses
       WHERE user_id = ?`,
      [userId]
    );

    const [categoryStats] = await db.query(
      `SELECT 
        category,
        SUM(amount) as total,
        COUNT(*) as count
       FROM TripExpenses
       WHERE user_id = ?
       GROUP BY category
       ORDER BY total DESC`,
      [userId]
    );

    const [monthlyStats] = await db.query(
      `SELECT 
        DATE_FORMAT(expense_date, '%Y-%m') as month,
        SUM(amount) as total,
        COUNT(*) as count
       FROM TripExpenses
       WHERE user_id = ? AND expense_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY month
       ORDER BY month DESC`,
      [userId]
    );

    return {
      overview: stats[0],
      byCategory: categoryStats,
      byMonth: monthlyStats
    };
  }

  /**
   * Compare actual expenses with planned budget
   * @param {number} tripId - Trip ID
   * @param {number} userId - User ID
   * @returns {object} - Comparison data
   */
  async compareBudget(tripId, userId) {
    const summary = await this.getTripExpenseSummary(tripId, userId);

    const warnings = [];
    if (summary.isOverBudget) {
      warnings.push({
        type: 'over_budget',
        message: `You have exceeded your budget by ₹${Math.abs(summary.remaining).toFixed(2)}`,
        severity: 'high'
      });
    } else if (summary.percentageUsed >= 90) {
      warnings.push({
        type: 'near_budget',
        message: `You have used ${summary.percentageUsed.toFixed(1)}% of your budget`,
        severity: 'medium'
      });
    }

    // Check if any category is unusually high
    summary.categoryBreakdown.forEach(cat => {
      const categoryPercent = (cat.total / summary.totalExpense) * 100;
      if (categoryPercent > 50) {
        warnings.push({
          type: 'category_high',
          message: `${cat.category} expenses are unusually high (${categoryPercent.toFixed(1)}%)`,
          severity: 'low'
        });
      }
    });

    return {
      ...summary,
      warnings,
      recommendation: this.getBudgetRecommendation(summary)
    };
  }

  /**
   * Get budget recommendations
   * @param {object} summary - Expense summary
   * @returns {string} - Recommendation text
   */
  getBudgetRecommendation(summary) {
    if (summary.isOverBudget) {
      return 'Consider reducing expenses in high-spending categories or increasing your budget.';
    } else if (summary.percentageUsed >= 90) {
      return 'You are close to your budget limit. Monitor spending carefully for the rest of the trip.';
    } else if (summary.percentageUsed < 50) {
      return 'You are well within your budget. You have room for additional activities or upgrades.';
    } else {
      return 'Your spending is on track. Continue monitoring to stay within budget.';
    }
  }
}

module.exports = new ExpenseService();
