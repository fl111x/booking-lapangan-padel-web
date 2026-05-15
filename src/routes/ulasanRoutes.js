const ulasanController = require('../controllers/ulasanController');
const express = require('express');
const router = express.Router();

router
.get('/', ulasanController.getAllUlasans)
.post('/', ulasanController.createNewUlasan)
.put('/:idUlasan', ulasanController.updateUlasan)
.delete('/:idUlasan', ulasanController.deleteUlasan);