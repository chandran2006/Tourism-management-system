const expenseService = require('../services/expenseService');

/**
 * Create a new expense
 * POST /api/expenses
 */
exports.createExpense = async (req, res) => {
  try {
    const { tripId, category, amount, description, date } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!tripId || !category || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Trip ID, category, and amount are required'
      });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    // Validate category
    const validCategories = ['Food', 'Hotel', 'Transport', 'Entry', 'Shopping', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Category must be one of: ${validCategories.join(', ')}`
      });
    }

    const expense = await expenseService.createExpense({
      userId,
      tripId,
      category,
      amount,
      description: description || '',
      date: date || new Date().toISOString().split('T')[0]
    });

    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense
    });

  } catch (error) {
    console.error('Create Expense Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create expense'
    });
  }
};

/**
 * Get all expenses for the user
 * GET /api/expenses
 */
exports.getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tripId } = req.query;

    const expenses = await expenseService.getExpenses(userId, tripId);

    res.json({
      success: true,
      data: {
        expenses,
        count: expenses.length
      }
    });

  } catch (error) {
    console.error('Get Expenses Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve expenses'
    });
  }
};

/**
 * Get expense by ID
 * GET /api/expenses/:id
 */
exports.getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const expense = await expenseService.getExpenseById(id, userId);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.json({
      success: true,
      data: expense
    });

  } catch (error) {
    console.error('Get Expense Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve expense'
    });
  }
};

/**
 * Update an expense
 * PUT /api/expenses/:id
 */
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { category, amount, description, date } = req.body;

    // Validate amount if provided
    if (amount !== undefined && amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0'
      });
    }

    // Validate category if provided
    if (category) {
      const validCategories = ['Food', 'Hotel', 'Transport', 'Entry', 'Shopping', 'Other'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: `Category must be one of: ${validCategories.join(', ')}`
        });
      }
    }

    const expense = await expenseService.updateExpense(id, userId, {
      category,
      amount,
      description,
      date
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: expense
    });

  } catch (error) {
    console.error('Update Expense Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update expense'
    });
  }
};

/**
 * Delete an expense
 * DELETE /api/expenses/:id
 */
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await expenseService.deleteExpense(id, userId);

    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });

  } catch (error) {
    console.error('Delete Expense Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete expense'
    });
  }
};

/**
 * Get expense summary for a trip
 * GET /api/expenses/trip/:tripId/summary
 */
exports.getTripSummary = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    const summary = await expenseService.getTripExpenseSummary(tripId, userId);

    res.json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Get Trip Summary Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve expense summary'
    });
  }
};

/**
 * Get user expense statistics
 * GET /api/expenses/stats
 */
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await expenseService.getUserExpenseStats(userId);

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get User Stats Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics'
    });
  }
};

/**
 * Compare budget vs actual expenses
 * GET /api/expenses/trip/:tripId/compare
 */
exports.compareBudget = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user.id;

    const comparison = await expenseService.compareBudget(tripId, userId);

    res.json({
      success: true,
      data: comparison
    });

  } catch (error) {
    console.error('Compare Budget Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to compare budget'
    });
  }
};
