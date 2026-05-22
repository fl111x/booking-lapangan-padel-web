const express = require('express');
const router = express.Router();
const ulasanController = require('../controller/ulasanController');
const { checkCreateUlasan, validateIDUlasan } = require('../middleware/ulasanValidator');
const { authenticateToken } = require('../middleware/authMiddleware');

router
.get('/', ulasanController.getAllUlasans)
.get('/gor/:idGor', ulasanController.getUlasanSpesifikGor)
.post('/', authenticateToken, checkCreateUlasan, ulasanController.createNewUlasan)
.put('/:idUlasan', authenticateToken, validateIDUlasan, checkCreateUlasan, ulasanController.updateUlasan)
.delete('/:idUlasan', authenticateToken, validateIDUlasan, ulasanController.deleteUlasan);

module.exports = router;