const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const { checkCreatePengguna } = require('../middleware/penggunaValidator');

// Rute Autentikasi Dasar
router.post('/register', checkCreatePengguna, authController.register);
router.post('/login', authController.login);

// Rute Lupa Password (Baru)
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;