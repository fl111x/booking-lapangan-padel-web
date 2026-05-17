const express = require('express');
const router = express.Router();
const langgananController = require('../controller/langgananMembershipController');
const { checkCreateLangganan, validateIDLangganan } = require('../middleware/langgananMembershipValidator');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router
.get('/', authenticateToken, requireRole('admin'), langgananController.getAllLangganan)
.post('/', authenticateToken, checkCreateLangganan, langgananController.createNewLangganan)
.put('/:idLangganan', authenticateToken, requireRole('admin'), validateIDLangganan, checkCreateLangganan, langgananController.updateLangganan)
.delete('/:idLangganan', authenticateToken, requireRole('admin'), validateIDLangganan, langgananController.deleteLangganan);

module.exports = router;