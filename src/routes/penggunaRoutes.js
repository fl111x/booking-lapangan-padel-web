const express = require('express');
const router = express.Router();
const penggunaController = require('../controller/penggunaController');

router
.get('/', penggunaController.getAllPenggunas)
.post('/', penggunaController.createNewPengguna)
.put('/:idPengguna', penggunaController.updatePengguna)
.delete('/:idPengguna', penggunaController.deletePengguna);

module.exports = router;