const midtransClient = require('midtrans-client');

// Inisialisasi Snap client menggunakan variabel lingkungan (.env)
const snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.MIDTRANS_SERVER_KEY || 'Mid-server-bjfhnSfF9klgZNb8rX0Wc0X6',
    clientKey: process.env.MIDTRANS_CLIENT_KEY || 'Mid-client-p8EQ_-j9GYNyouFo'
});

module.exports = snap;