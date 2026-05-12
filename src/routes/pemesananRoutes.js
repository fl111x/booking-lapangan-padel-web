const express = require('express');
const router = express.Router();
const pemesananController = require('../controller/pemesananController');

router
.get('/', pemesananController.getAllPemesanan)
.post('/', pemesananController.createNewPemesanan)
.put('/:idPemesanan', pemesananController.updatePemesanan)
.delete('/:idPemesanan', pemesananController.deletePemesanan);

module.exports = router;