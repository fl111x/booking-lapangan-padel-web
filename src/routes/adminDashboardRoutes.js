const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controller/adminDashboardController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.get('/stats', authenticateToken, requireRole('admin'), adminDashboardController.getDashboardStats);

module.exports = router;