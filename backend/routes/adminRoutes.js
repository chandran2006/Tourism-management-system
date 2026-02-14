const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Admin Registration (public with secret key)
router.post('/register', adminController.registerAdmin);

// Protected Admin Routes
router.get('/dashboard', authMiddleware, adminMiddleware, adminController.getDashboardStats);
router.get('/users', authMiddleware, adminMiddleware, adminController.getAllUsers);
router.delete('/user/:id', authMiddleware, adminMiddleware, adminController.deleteUser);
router.put('/user/:id/role', authMiddleware, adminMiddleware, adminController.changeUserRole);
router.put('/user/:id/status', authMiddleware, adminMiddleware, adminController.toggleUserStatus);
router.get('/analytics', authMiddleware, adminMiddleware, adminController.getAnalytics);
router.get('/reviews', authMiddleware, adminMiddleware, adminController.getAllReviews);
router.delete('/review/:id', authMiddleware, adminMiddleware, adminController.deleteReview);
router.get('/audit-logs', authMiddleware, adminMiddleware, adminController.getAuditLogs);
router.get('/trip-plans', authMiddleware, adminMiddleware, adminController.getTripPlans);

module.exports = router;
