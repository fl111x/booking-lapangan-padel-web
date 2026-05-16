const express = require('express');
const router = express.Router();
const pembayaranController = require('../controller/pembayaranMembershipController');

const { checkCreatePembayaranMembership, validateIDPembayaranMembership } = require('../middleware/pembayaranMembershipValidator');

router
.get('/', pembayaranController.getAllPembayaran)
.post('/', checkCreatePembayaranMembership, pembayaranController.createNewPembayaran)
.put('/:idPembayaran', validateIDPembayaranMembership, checkCreatePembayaranMembership, pembayaranController.updatePembayaran)
.delete('/:idPembayaran', validateIDPembayaranMembership, pembayaranController.deletePembayaran);

module.exports = router;