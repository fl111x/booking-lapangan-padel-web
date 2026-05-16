const express = require('express');
const router = express.Router();
const ulasanController = require('../controller/ulasanController');

const { checkCreateUlasan, validateIDUlasan } = require('../middleware/ulasanValidator');

router
.get('/', ulasanController.getAllUlasans)
.post('/', checkCreateUlasan, ulasanController.createNewUlasan)
.put('/:idUlasan', validateIDUlasan, checkCreateUlasan, ulasanController.updateUlasan)
.delete('/:idUlasan', validateIDUlasan, ulasanController.deleteUlasan);

module.exports = router;