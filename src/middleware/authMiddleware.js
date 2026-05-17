const jwt = require('jsonwebtoken');

/**
 * Middleware untuk memastikan pengguna sudah login (Autentikasi Token)
 */
const authenticateToken = (req, res, next) => {
    // Mengambil token dari header 'Authorization' (Format: Bearer <token>)
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Akses ditolak! Kamu wajib login terlebih dahulu'
        });
    }

    try {
        // Verifikasi token JWT menggunakan secret key yang sama dengan authController
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'KUNCI_RAHASIA_BACKEND');
        
        // Simpan data dekripsi token (id_pengguna & role) ke dalam objek req.user agar bisa dibaca rute berikutnya
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Token tidak valid atau sudah kedaluwarsa! Silakan login ulang'
        });
    }
};

/**
 * Middleware untuk membatasi hak akses berdasarkan Role (Otorisasi)
 * @param {string} allowedRole - Role yang diperbolehkan
 */
const requireRole = (allowedRole) => {
    return (req, res, next) => {
        // req.user didapatkan dari middleware authenticateToken di atas
        if (!req.user || req.user.role !== allowedRole) {
            return res.status(403).json({
                success: false,
                message: `Akses ditolak! Halaman ini khusus untuk tingkat hak akses: ${allowedRole}`
            });
        }
        next();
    };
};

module.exports = { authenticateToken, requireRole };