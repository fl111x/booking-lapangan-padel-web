const express = require('express');
const router = express.Router();
const notifikasiController = require('../controller/notifikasiController');
const { checkCreateNotifikasi, validateIDNotifikasi } = require('../middleware/notifikasiValidator');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router
.get('/', authenticateToken, notifikasiController.getAllNotifikasi)
.post('/', authenticateToken, requireRole('admin'), checkCreateNotifikasi, notifikasiController.createNewNotifikasi)
.put('/:idNotifikasi', authenticateToken, validateIDNotifikasi, checkCreateNotifikasi, notifikasiController.updateNotifikasi)
.delete('/:idNotifikasi', authenticateToken, requireRole('admin'), validateIDNotifikasi, notifikasiController.deleteNotifikasi);

module.exports = router;