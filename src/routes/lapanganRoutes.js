const express = require('express');
const router = express.Router();
const lapanganController = require('../controller/lapanganController');
const { checkCreateLapangan, validateIDLapangan } = require('../middleware/lapanganValidator');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

// RUTE PUBLIK
router.get('/cek-ketersediaan', lapanganController.cekKetersediaan);
router.get('/', lapanganController.getAllLapangan);

// RUTE ADMIN (Akses memanipulasi data fasilitas lapangan GOR)
router.post('/', authenticateToken, requireRole('admin'), checkCreateLapangan, lapanganController.createNewLapangan);
router.put('/:idLapangan', authenticateToken, requireRole('admin'), validateIDLapangan, checkCreateLapangan, lapanganController.updateLapangan);
router.delete('/:idLapangan', authenticateToken, requireRole('admin'), validateIDLapangan, lapanganController.deleteLapangan);

module.exports = router;