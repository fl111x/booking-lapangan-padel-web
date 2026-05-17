const express = require('express');
const router = express.Router();
const membershipController = require('../controller/membershipController');
const { checkCreateMembership, validateIDMembership } = require('../middleware/membershipValidator');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router
.get('/', membershipController.getAllMemberships)
.post('/', authenticateToken, requireRole('admin'), checkCreateMembership, membershipController.createNewMembership)
.put('/:idMembership', authenticateToken, requireRole('admin'), validateIDMembership, checkCreateMembership, membershipController.updateMembership)
.delete('/:idMembership', authenticateToken, requireRole('admin'), validateIDMembership, membershipController.deleteMembership);

module.exports = router;