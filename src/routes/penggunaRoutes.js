const express = require('express');
const router = express.Router();
const multer = require('multer'); // Impor Multer
const path = require('path');
const penggunaController = require('../controller/penggunaController');
const { checkCreatePengguna, checkUpdatePengguna, validateIDPengguna } = require('../middleware/penggunaValidator');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

// ==========================================
// KONFIGURASI MULTER (PENYIMPANAN FOTO PROFIL)
// ==========================================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/profiles/');
    },
    filename: function (req, file, cb) {
        // Mengubah nama file menjadi unik (misal: profile-168123456.jpg)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// ==========================================
// 1. RUTE PELANGGAN (Wajib Login)
// ==========================================
router.get('/user', authenticateToken, penggunaController.getProfile);
router.put('/user', authenticateToken, upload.single('foto_profil'), checkUpdatePengguna, penggunaController.updateProfile);

// ==========================================
// 2. RUTE ADMIN
// ==========================================
router
.get('/', authenticateToken, requireRole('admin'), penggunaController.getAllPenggunas)
.post('/', authenticateToken, requireRole('admin'), checkCreatePengguna, penggunaController.createNewPengguna)
.put('/:idPengguna', authenticateToken, requireRole('admin'), validateIDPengguna, checkUpdatePengguna, penggunaController.updatePengguna) 
.delete('/:idPengguna', authenticateToken, requireRole('admin'), validateIDPengguna, penggunaController.deletePengguna);

module.exports = router;