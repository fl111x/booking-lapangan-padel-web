const express = require('express');
const router = express.Router();
const gorController = require('../controller/gorController');
const gorValidator = require('../middleware/gorValidator');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router
.get('/', gorController.getAllGors)
.post('/', authenticateToken, requireRole('admin'), gorValidator.checkCreateGor, gorController.createNewGor)
.put('/:idGor', authenticateToken, requireRole('admin'), gorValidator.validateIDGor, gorValidator.checkCreateGor, gorController.updateGor)
.delete('/:idGor', authenticateToken, requireRole('admin'), gorValidator.validateIDGor, gorController.deleteGor);

module.exports = router;