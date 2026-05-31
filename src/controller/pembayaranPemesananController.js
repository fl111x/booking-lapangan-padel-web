const pembayaranPemesananModel = require('../model/pembayaranPemesanan');
const pemesananModel = require('../model/pemesanan');
const notifikasiModel = require('../model/notifikasi');
const snap = require('../config/midtrans');
const dbPool = require('../config/db');
const { petakanStatusMidtrans } = require('../utils/midtransHelper');

// 1. LOGIKA UNTUK REQ SNAP TOKEN (CHECKOUT)
const requestSnapToken = async (req, res) => {
    const { id_pemesanan } = req.body;

    try {
        // Ambil data detail sewa beserta email pelanggan menggunakan JOIN SQL
        const [pemesananRaw] = await dbPool.execute(`
            SELECT p.total_harga, p.id_pengguna, usr.nama, usr.email, lap.nama_lapangan 
            FROM pemesanan p
            JOIN pengguna usr ON p.id_pengguna = usr.id_pengguna
            JOIN lapangan lap ON p.id_lapangan = lap.id_lapangan
            WHERE p.id_pemesanan = ? LIMIT 1
        `, [id_pemesanan]);

        if (pemesananRaw.length === 0) {
            return res.status(404).json({ success: false, message: 'Data reservasi pemesanan tidak ditemukan' });
        }

        const dataSewa = pemesananRaw[0];
        // Membuat Order ID unik gabungan ID Booking dan Timestamp mili-detik
        const orderId = `INV-PADEL-${id_pemesanan}-${Date.now()}`;

        // Payload standar wajib sesuai dokumentasi Midtrans API
        const transactionDetails = {
            transaction_details: {
                order_id: orderId,
                gross_amount: dataSewa.total_harga
            },
            customer_details: {
                first_name: dataSewa.nama,
                email: dataSewa.email
            },
            item_details: [{
                id: `LAP-${id_pemesanan}`,
                price: dataSewa.total_harga,
                quantity: 1,
                name: `Sewa ${dataSewa.nama_lapangan}`
            }],
            
            // 🔥 PERBAIKAN: Kembalikan callbacks, tapi arahkan ke halaman pembayaran!
            callbacks: {
                finish: "http://localhost:5173/pembayaran",
                error: "http://localhost:5173/pembayaran",
                pending: "http://localhost:5173/pembayaran"
            }
        };

        // Tembak API Midtrans untuk mendapatkan snap_token pop-up
        const transaction = await snap.createTransaction(transactionDetails);
        const snapToken = transaction.token;

        await pembayaranPemesananModel.createNewPembayaranPemesanan({
            id_pemesanan,
            order_id: orderId,
            snap_token: snapToken,
            jumlah_bayar: dataSewa.total_harga,
            status_pembayaran_pemesanan: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Snap Token berhasil diterbitkan',
            snap_token: snapToken,
            order_id: orderId,
            redirect_url: transaction.redirect_url
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal memproses checkout Midtrans', error: error.message });
    }
};

// 2. LOGIKA WEBHOOK NOTIFICATION CALLBACK (OTOMATIS DI-HIT OLEH SERVER MIDTRANS)
const handleMidtransWebhook = async (req, res) => {
    try {
        const notification = req.body;
        
        // Validasi signature key bawaan SDK Midtrans demi keamanan enkripsi data finansial
        const statusResponse = await snap.transaction.notification(notification);
        
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;
        const paymentType = statusResponse.payment_type;
        const transactionId = statusResponse.transaction_id;

        // Ambil data lokal pembayaran untuk mengetahui id_pemesanan terkait
        const [pembayaranLocal] = await pembayaranPemesananModel.getPembayaranByOrderId(orderId);
        if (pembayaranLocal.length === 0) {
            return res.status(404).json({ success: false, message: 'Order ID tidak dikenali oleh sistem GOR' });
        }

        const { id_pemesanan, jumlah_bayar } = pembayaranLocal[0];

        const { statusPembayaran, statusSistem } = petakanStatusMidtrans(transactionStatus, fraudStatus);

        // Terjemahkan status sistem khusus pemesanan lapangan
        const statusPemesanan = statusSistem === 'aktif_atau_dibayar' ? 'dibayar' : (statusSistem === 'batal' ? 'dibatalkan' : 'pending');

        // 1. Update status di tabel pembayaran_pemesanan
        await pembayaranPemesananModel.updateStatusPembayaranByOrderId(orderId, {
            transaction_id: transactionId,
            payment_type: paymentType,
            status_pembayaran_pemesanan: statusPembayaran,
            tanggal_pembayaran: statusPembayaran === 'berhasil' ? new Date() : null
        });

        // 2. Update status di tabel pemesanan lapangan utama
        await pemesananModel.updateStatusPemesanan(id_pemesanan, statusPemesanan);

        // 3. BONUS INTEGRASI: Jika pembayaran sukses, otomatis kirim pemberitahuan ke tabel notifikasi user
        if (statusPembayaran === 'berhasil') {
            const [booking] = await dbPool.execute('SELECT id_pengguna FROM pemesanan WHERE id_pemesanan = ? LIMIT 1', [id_pemesanan]);
            if (booking.length > 0) {
                await notifikasiModel.createNewNotifikasi({
                    id_pengguna: booking[0].id_pengguna,
                    judul: 'Pembayaran Lapangan Berhasil! 🎉',
                    pesan: `Hore! Pembayaran sewa lapanganmu untuk invoice ${orderId} sebesar Rp ${jumlah_bayar.toLocaleString('id-ID')} telah kami terima. Selamat bermain!`
                });
            }
        }

        // Midtrans wajib menerima respon balik status 200 OK agar mereka tidak mengirim webhook berulang-ulang
        res.status(200).json({ success: true, message: 'Webhook sukses direkonsiliasi' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal memproses webhook Midtrans', error: error.message });
    }
};

const getAllPembayaranPemesanan = async (req, res) => {
    try {
        const [data] = await pembayaranPemesananModel.getAllPembayaranPemesanan();
        res.json({
            success: true,
            message: 'Berhasil mengambil seluruh data log transaksi sewa lapangan',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data log transaksi pembayaran sewa',
            error: error.message
        });
    }
}

const createNewPembayaranPemesanan = async (req, res) => {
    try {
        await pembayaranPemesananModel.createNewPembayaranPemesanan(req.body);
        res.status(201).json({
            success: true,
            message: 'Invoice transaksi sewa lapangan berhasil diterbitkan',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal membuat invoice sewa lapangan',
            error: error.message
        });
    }
}

const updatePembayaranPemesanan = async (req, res) => {
    const { idPembayaranPemesanan } = req.params;
    try {
        await pembayaranPemesananModel.updatePembayaranPemesanan(idPembayaranPemesanan, req.body);
        res.json({
            success: true,
            message: 'Data rekonsiliasi pembayaran sewa berhasil diperbarui',
            data: {
                id_pembayaran_pemesanan: idPembayaranPemesanan,
                ...req.body
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui status transaksi pembayaran sewa',
            error: error.message
        });
    }
}

const deletePembayaranPemesanan = async (req, res) => {
    const { idPembayaranPemesanan } = req.params;
    try {
        await pembayaranPemesananModel.deletePembayaranPemesanan(idPembayaranPemesanan);
        res.json({
            success: true,
            message: 'Catatan finansial sewa lapangan berhasil dihapus',
            data: idPembayaranPemesanan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus catatan transaksi pembayaran sewa',
            error: error.message
        });
    }
}

module.exports = {
    requestSnapToken,
    handleMidtransWebhook,
    getAllPembayaranPemesanan,
    createNewPembayaranPemesanan,
    updatePembayaranPemesanan,
    deletePembayaranPemesanan
};