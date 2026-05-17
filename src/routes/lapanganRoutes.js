const express = require('express');
const router = express.Router();
const lapanganController = require('../controller/lapanganController');
const { checkCreateLapangan, validateIDLapangan } = require('../middleware/lapanganValidator');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router
.get('/', lapanganController.getAllLapangan)
.post('/', authenticateToken, requireRole('admin'), checkCreateLapangan, lapanganController.createNewLapangan)
.put('/:idLapangan', authenticateToken, requireRole('admin'), validateIDLapangan, checkCreateLapangan, lapanganController.updateLapangan)
.delete('/:idLapangan', authenticateToken, requireRole('admin'), validateIDLapangan, lapanganController.deleteLapangan);

module.exports = router;