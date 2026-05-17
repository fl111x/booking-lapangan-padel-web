const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const { checkCreatePengguna } = require('../middleware/penggunaValidator');

router.post('/register', checkCreatePengguna, authController.register);
router.post('/login', authController.login);

module.exports = router;