const express = require('express');
const router = express.Router();
const gorController = require('../controller/gorController');
const gorValidator = require('../middleware/gorValidator');

router
.get('/', gorController.getAllGors)
.post('/', gorValidator.checkCreateGor, gorController.createNewGor)
.put('/:idGor', gorValidator.validateIDGor,gorValidator.checkCreateGor, gorController.updateGor)
.delete('/:idGor', gorValidator.validateIDGor, gorController.deleteGor);

module.exports = router;