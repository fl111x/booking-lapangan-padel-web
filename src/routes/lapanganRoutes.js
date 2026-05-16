const express = require('express');
const router = express.Router();
const lapanganController = require('../controller/lapanganController');

const { checkCreateLapangan, validateIDLapangan } = require('../middleware/lapanganValidator');

router
.get('/', lapanganController.getAllLapangan)
.post('/', checkCreateLapangan, lapanganController.createNewLapangan)
.put('/:idLapangan', validateIDLapangan, checkCreateLapangan, lapanganController.updateLapangan)
.delete('/:idLapangan', validateIDLapangan, lapanganController.deleteLapangan);

module.exports = router;