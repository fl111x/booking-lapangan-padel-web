const express = require('express');
const router = express.Router();
const pembayaranPemesananController = require('../controller/pembayaranPemesananController');
const { validateIDPembayaranPemesanan } = require('../middleware/pembayaranPemesananValidator');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, requireRole('admin'), pembayaranPemesananController.getAllPembayaranPemesanan);
router.delete('/:idPembayaranPemesanan', authenticateToken, requireRole('admin'), validateIDPembayaranPemesanan, pembayaranPemesananController.deletePembayaranPemesanan);

// ==========================================
// ENDPOINT INTI INTEGRASI MIDTRANS SMASH
// ==========================================

// 1. Endpoint dipanggil Front-End untuk mengambil Token Pop-Up Pembayaran
router.post('/checkout', authenticateToken, pembayaranPemesananController.requestSnapToken);

// 2. Endpoint dipanggil Otomatis oleh Server Midtrans (Jangan diberi middleware validator!)
router.post('/webhook', pembayaranPemesananController.handleMidtransWebhook);

module.exports = router;