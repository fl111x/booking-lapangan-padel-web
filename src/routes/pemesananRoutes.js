const express = require('express');
const router = express.Router();
const pemesananController = require('../controller/pemesananController');
const { checkCreatePemesanan, validateIDPemesanan } = require('../middleware/pemesananValidator');
const { authenticateToken } = require('../middleware/authMiddleware');

router
.get('/', authenticateToken, pemesananController.getAllPemesanan)
.post('/', authenticateToken, checkCreatePemesanan, pemesananController.createNewPemesanan)
.put('/:idPemesanan', authenticateToken, validateIDPemesanan, checkCreatePemesanan, pemesananController.updatePemesanan)
.delete('/:idPemesanan', authenticateToken, validateIDPemesanan, pemesananController.deletePemesanan);

module.exports = router;