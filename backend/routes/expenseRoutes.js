const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// CRUD operations
router.post('/', expenseController.createExpense);
router.get('/', expenseController.getExpenses);
router.get('/stats', expenseController.getUserStats);
router.get('/:id', expenseController.getExpenseById);
router.put('/:id', expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

// Trip-specific routes
router.get('/trip/:tripId/summary', expenseController.getTripSummary);
router.get('/trip/:tripId/compare', expenseController.compareBudget);

module.exports = router;
