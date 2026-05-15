const membershipController = require('../controllers/membershipController');
const express = require('express');
const router = express.Router();

router
.get('/', membershipController.getAllMemberships)
.post('/', membershipController.createNewMembership)
.put('/:idMembership', membershipController.updateMembership)
.delete('/:idMembership', membershipController.deleteMembership);

module.exports = router;