const express = require('express');
const router = express.Router();
const lapanganController = require('../controller/lapanganController');

router
.get('/', lapanganController.getAllLapangan)
.post('/', lapanganController.createNewLapangan)
.put('/:idLapangan', lapanganController.updateLapangan)
.delete('/:idLapangan', lapanganController.deleteLapangan);

module.exports = router;