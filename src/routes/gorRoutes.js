const express = require('express');
const router = express.Router();
const gorController = require('../controller/gorController');
const gorValidator = require('../middleware/gorValidator');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// ==========================================
// 1. KONFIGURASI MULTER UNTUK UPLOAD FOTO
// ==========================================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/gor/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'gor-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// ==========================================
// 2. JEMBATAN (BRIDGE) UNTUK VALIDATOR LAMA
// ==========================================
const adaptFotoGor = (req, res, next) => {
    if (req.file) {
        // PERBAIKAN: Tambahkan "/uploads/" agar regex validator menganggapnya sebagai "URL/Path"
        req.body.foto_gor = '/uploads/gor/' + req.file.filename;
    } else {
        // Hapus jika kosong agar tidak memicu error format
        delete req.body.foto_gor;
    }
    next();
};

// ==========================================
// 3. RUTE GOR
// ==========================================
router
.get('/', gorController.getAllGors)

.post('/', authenticateToken, requireRole('admin'), upload.single('foto_gor'), adaptFotoGor, gorValidator.checkCreateGor, gorController.createNewGor)

.put('/:idGor', authenticateToken, requireRole('admin'), upload.single('foto_gor'), adaptFotoGor, gorValidator.validateIDGor, gorValidator.checkCreateGor, gorController.updateGor)

.delete('/:idGor', authenticateToken, requireRole('admin'), gorValidator.validateIDGor, gorController.deleteGor);

module.exports = router;