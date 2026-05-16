const express = require('express');
const router = express.Router();
const pembayaranPemesananController = require('../controller/pembayaranPemesananController');

const { checkCreatePembayaranPemesanan, validateIDPembayaranPemesanan } = require('../middleware/pembayaranPemesananValidator');

router
.get('/', pembayaranPemesananController.getAllPembayaranPemesanan)
.post('/', checkCreatePembayaranPemesanan, pembayaranPemesananController.createNewPembayaranPemesanan)
.put('/:idPembayaranPemesanan', validateIDPembayaranPemesanan, checkCreatePembayaranPemesanan, pembayaranPemesananController.updatePembayaranPemesanan)
.delete('/:idPembayaranPemesanan', validateIDPembayaranPemesanan, pembayaranPemesananController.deletePembayaranPemesanan);

module.exports = router;