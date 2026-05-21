const express = require('express');
const router = express.Router();
const penggunaController = require('../controller/penggunaController');
const { checkCreatePengguna, validateIDPengguna } = require('../middleware/penggunaValidator');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

// ==========================================
// 1. RUTE PELANGGAN (Wajib Login)
// ==========================================
router.get('/profile', authenticateToken, penggunaController.getProfile);
router.put('/profile', authenticateToken, checkCreatePengguna, penggunaController.updateProfile);

// ==========================================
// 2. RUTE ADMIN (Wajib Login + Role Admin)
// ==========================================
router
.get('/', authenticateToken, requireRole('admin'), penggunaController.getAllPenggunas)
.post('/', authenticateToken, requireRole('admin'), checkCreatePengguna, penggunaController.createNewPengguna)
.put('/:idPengguna', authenticateToken, requireRole('admin'), validateIDPengguna, checkCreatePengguna, penggunaController.updatePengguna) 
.delete('/:idPengguna', authenticateToken, requireRole('admin'), validateIDPengguna, penggunaController.deletePengguna);

module.exports = router;