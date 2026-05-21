const express = require('express');
const router = express.Router();
const langgananController = require('../controller/langgananMembershipController');
const { checkCreateLangganan, validateIDLangganan } = require('../middleware/langgananMembershipValidator');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

// RUTE PELANGGAN
router.get('/saya', authenticateToken, langgananController.getLanggananUser);
router.post('/', authenticateToken, checkCreateLangganan, langgananController.createNewLangganan);

// RUTE ADMIN (Akses seluruh data & manipulasi)
router.get('/', authenticateToken, requireRole('admin'), langgananController.getAllLangganan);
router.put('/:idLangganan', authenticateToken, requireRole('admin'), validateIDLangganan, checkCreateLangganan, langgananController.updateLangganan);
router.delete('/:idLangganan', authenticateToken, requireRole('admin'), validateIDLangganan, langgananController.deleteLangganan);

module.exports = router;