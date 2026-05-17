const express = require('express');
const router = express.Router();
const penggunaController = require('../controller/penggunaController');
const { checkCreatePengguna, validateIDPengguna } = require('../middleware/penggunaValidator');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router
.get('/', authenticateToken, requireRole('admin'), penggunaController.getAllPenggunas)
.post('/', authenticateToken, requireRole('admin'), checkCreatePengguna, penggunaController.createNewPengguna)
.put('/:idPengguna', authenticateToken, validateIDPengguna, checkCreatePengguna, penggunaController.updatePengguna)
.delete('/:idPengguna', authenticateToken, requireRole('admin'), validateIDPengguna, penggunaController.deletePengguna);

module.exports = router;