const express = require('express');
const router = express.Router();
const notifikasiController = require('../controller/notifikasiController');
const { checkCreateNotifikasi, validateIDNotifikasi } = require('../middleware/notifikasiValidator');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.get('/saya', authenticateToken, notifikasiController.getNotifikasiUser);
router.get('/', authenticateToken, requireRole('admin'), notifikasiController.getAllNotifikasi);
router.post('/', authenticateToken, requireRole('admin'), notifikasiController.createNewNotifikasi);
router.put('/:idNotifikasi', authenticateToken, validateIDNotifikasi, notifikasiController.updateNotifikasi);
router.delete('/:idNotifikasi', authenticateToken, requireRole('admin'), validateIDNotifikasi, notifikasiController.deleteNotifikasi);

module.exports = router;