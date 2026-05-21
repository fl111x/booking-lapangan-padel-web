const express = require('express');
const router = express.Router();
const pemesananController = require('../controller/pemesananController');
const { checkCreatePemesanan, validateIDPemesanan } = require('../middleware/pemesananValidator');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

// RUTE PELANGGAN
router.get('/saya', authenticateToken, pemesananController.getPemesananUser);
router.post('/', authenticateToken, checkCreatePemesanan, pemesananController.createNewPemesanan);

// RUTE ADMIN (Akses seluruh data & manipulasi)
router.get('/', authenticateToken, requireRole('admin'), pemesananController.getAllPemesanan); 
router.put('/:idPemesanan', authenticateToken, requireRole('admin'), validateIDPemesanan, checkCreatePemesanan, pemesananController.updatePemesanan);
router.delete('/:idPemesanan', authenticateToken, requireRole('admin'), validateIDPemesanan, pemesananController.deletePemesanan);

module.exports = router;