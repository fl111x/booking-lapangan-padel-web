const express = require('express');
const router = express.Router();
const pembayaranController = require('../controller/pembayaranMembershipController');
const { validateIDPembayaranMembership } = require('../middleware/pembayaranMembershipValidator');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, requireRole('admin'), pembayaranController.getAllPembayaran);
router.delete('/:idPembayaran', authenticateToken, requireRole('admin'), validateIDPembayaranMembership, pembayaranController.deletePembayaran);

// ==========================================
// ENDPOINT INTEGRASI MIDTRANS CHECKOUT MEMBER
// ==========================================

// 1. Ditembak front-end saat pengguna mengklik tombol "Beli Paket Member"
router.post('/checkout', authenticateToken, pembayaranController.requestSnapTokenMembership);

// 2. Di-hit otomatis oleh Server Midtrans Sandbox (Jangan gunakan middleware validator!)
router.post('/webhook', pembayaranController.handleMidtransWebhookMembership);

module.exports = router;