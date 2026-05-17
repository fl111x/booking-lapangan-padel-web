const express = require('express');
const router = express.Router();
const membershipController = require('../controller/membershipController');

const { checkCreateMembership, validateIDMembership } = require('../middleware/membershipValidator');

router
.get('/', membershipController.getAllMemberships)
.post('/', checkCreateMembership, membershipController.createNewMembership)
.put('/:idMembership', validateIDMembership, checkCreateMembership, membershipController.updateMembership)
.delete('/:idMembership', validateIDMembership, membershipController.deleteMembership);

module.exports = router;