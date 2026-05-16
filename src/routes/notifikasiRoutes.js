const express = require('express');
const router = express.Router();
const notifikasiController = require('../controller/notifikasiController');

const { checkCreateNotifikasi, validateIDNotifikasi } = require('../middleware/notifikasiValidator');

router
.get('/', notifikasiController.getAllNotifikasi)
.post('/', checkCreateNotifikasi, notifikasiController.createNewNotifikasi)
.put('/:idNotifikasi', validateIDNotifikasi, checkCreateNotifikasi, notifikasiController.updateNotifikasi)
.delete('/:idNotifikasi', validateIDNotifikasi, notifikasiController.deleteNotifikasi);

module.exports = router;