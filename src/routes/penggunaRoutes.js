const express = require('express');
const router = express.Router();
const penggunaController = require('../controller/penggunaController');

const { checkCreatePengguna, validateIDPengguna } = require('../middleware/penggunaValidator');

router
.get('/', penggunaController.getAllPenggunas)
.post('/', checkCreatePengguna, penggunaController.createNewPengguna)
.put('/:idPengguna', validateIDPengguna, checkCreatePengguna, penggunaController.updatePengguna)
.delete('/:idPengguna', validateIDPengguna, penggunaController.deletePengguna);

module.exports = router;