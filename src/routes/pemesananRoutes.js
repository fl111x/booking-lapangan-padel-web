const express = require('express');
const router = express.Router();
const pemesananController = require('../controller/pemesananController');

const { checkCreatePemesanan, validateIDPemesanan } = require('../middleware/pemesananValidator');

router
.get('/', pemesananController.getAllPemesanan)
.post('/', checkCreatePemesanan, pemesananController.createNewPemesanan)
.put('/:idPemesanan', validateIDPemesanan, checkCreatePemesanan, pemesananController.updatePemesanan)
.delete('/:idPemesanan', validateIDPemesanan, pemesananController.deletePemesanan);

module.exports = router;