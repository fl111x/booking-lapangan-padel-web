const pembayaranModel = require('../model/pembayaranMembership');
const langgananModel = require('../model/langgananMembership');
const notifikasiModel = require('../model/notifikasi');
const snap = require('../config/midtrans');
const dbPool = require('../config/db');
const { petakanStatusMidtrans } = require('../utils/midtransHelper');

// 1. LOGIKA SNAP TOKEN CHECKOUT MEMBERSHIP
const requestSnapTokenMembership = async (req, res) => {
    const { id_langganan } = req.body;

    try {
        // Ambil data detail harga membership dan profil pengguna menggunakan JOIN multi-tabel
        const [langgananRaw] = await dbPool.execute(`
            SELECT lm.id_pengguna, usr.nama, usr.email, m.nama_membership, m.harga, m.diskon
            FROM langganan_membership lm
            JOIN pengguna usr ON lm.id_pengguna = usr.id_pengguna
            JOIN membership m ON lm.id_membership = m.id_membership
            WHERE lm.id_langganan = ? LIMIT 1
        `, [id_langganan]);

        if (langgananRaw.length === 0) {
            return res.status(404).json({ success: false, message: 'Data pendaftaran langganan tidak ditemukan' });
        }

        const dataMember = langgananRaw[0];
        
        // Hitung nominal harga bersih setelah potongan diskon paket (jika ada)
        const nominalAwal = dataMember.harga;
        const diskonPersen = dataMember.diskon ? dataMember.diskon : 0;
        const potonganHarga = (diskonPersen / 100) * nominalAwal;
        const totalBayar = nominalAwal - potonganHarga;

        // Bikin Order ID unik untuk invoice transaksi membership
        const orderId = `INV-MEMBER-${id_langganan}-${Date.now()}`;

        // Payload transaksi Midtrans Snap API
        const transactionDetails = {
            transaction_details: {
                order_id: orderId,
                gross_amount: totalBayar
            },
            customer_details: {
                first_name: dataMember.nama,
                email: dataMember.email
            },
            item_details: [{
                id: `MBR-${id_langganan}`,
                price: totalBayar,
                quantity: 1,
                name: `Paket Membership: ${dataMember.nama_membership}`
            }]
        };

        // Mintakan token pop-up transaksi ke server Midtrans
        const transaction = await snap.createTransaction(transactionDetails);
        const snapToken = transaction.token;

        // Catat entri awal log kas pembayaran ke database dengan status pending
        await pembayaranModel.createNewPembayaran({
            id_langganan,
            order_id: orderId,
            snap_token: snapToken,
            jumlah_bayar: totalBayar,
            status_pembayaran_membership: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Snap Token transaksi membership berhasil diterbitkan',
            snap_token: snapToken,
            order_id: orderId,
            redirect_url: transaction.redirect_url
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal memproses checkout membership', error: error.message });
    }
};

// 2. LOGIKA WEBHOOK NOTIFICATION CALLBACK KHUSUS FINANSIAL MEMBERSHIP
const handleMidtransWebhookMembership = async (req, res) => {
    try {
        const notification = req.body;
        const statusResponse = await snap.transaction.notification(notification);
        
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;
        const paymentType = statusResponse.payment_type;
        const transactionId = statusResponse.transaction_id;

        // Ambil data log lokal berdasarkan Order ID invoice
        const [pembayaranLocal] = await pembayaranModel.getPembayaranByOrderId(orderId);
        if (pembayaranLocal.length === 0) {
            return res.status(404).json({ success: false, message: 'Order ID transaksi member tidak dikenali' });
        }

        const { id_langganan, jumlah_bayar } = pembayaranLocal[0];

        const { statusPembayaran, statusSistem } = petakanStatusMidtrans(transaction_status, fraud_status);

        // Terjemahkan status khusus akun langganan membership
        const statusLangganan = statusSistem === 'aktif_atau_dibayar' ? 'aktif' : (statusSistem === 'batal' ? 'tidak aktif' : 'pending');

        // A. Update status di tabel pembayaran_membership
        await pembayaranModel.updateStatusPembayaranByOrderId(orderId, {
            transaction_id: transactionId,
            payment_type: paymentType,
            status_pembayaran_membership: statusPembayaran,
            tanggal_pembayaran: statusPembayaran === 'berhasil' ? new Date() : null
        });

        // B. Update status di tabel kontrak utama langganan_membership
        await langgananModel.updateStatusLangganan(id_langganan, statusLangganan);

        // C. Kirim Notifikasi Otomatis jika langganan berhasil aktif
        if (statusPembayaran === 'berhasil') {
            const [kontrak] = await dbPool.execute('SELECT id_pengguna FROM langganan_membership WHERE id_langganan = ? LIMIT 1', [id_langganan]);
            if (kontrak.length > 0) {
                await notifikasiModel.createNewNotifikasi({
                    id_pengguna: kontrak[0].id_pengguna,
                    judul: 'Membership Kamu Sudah Aktif! 👑',
                    pesan: `Selamat! Pembayaran untuk paket membership dengan invoice ${orderId} senilai Rp ${jumlah_bayar.toLocaleString('id-ID')} telah sukses. Kamu kini resmi menjadi member dan berhak mendapatkan diskon potongan harga sewa lapangan!`
                });
            }
        }

        res.status(200).json({ success: true, message: 'Webhook transaksi member berhasil diproses' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal memproses webhook membership', error: error.message });
    }
};

const getAllPembayaran = async (req, res) => {
    try {
        const [data] = await pembayaranModel.getAllPembayaran();
        res.json({
            success: true,
            message: 'Berhasil mengambil seluruh riwayat transaksi pembayaran membership',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data transaksi pembayaran',
            error: error.message
        });
    }
}

const createNewPembayaran = async (req, res) => {
    try {
        await pembayaranModel.createNewPembayaran(req.body);
        res.status(201).json({
            success: true,
            message: 'Invoice pembayaran membership berhasil dicatat',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mencatat transaksi pembayaran baru',
            error: error.message
        });
    }
}

const updatePembayaran = async (req, res) => {
    const { idPembayaran } = req.params;
    try {
        await pembayaranModel.updatePembayaran(idPembayaran, req.body);
        res.json({
            success: true,
            message: 'Data rekonsiliasi pembayaran berhasil diperbarui',
            data: {
                id_pembayaran: idPembayaran,
                ...req.body
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui data transaksi pembayaran',
            error: error.message
        });
    }
}

const deletePembayaran = async (req, res) => {
    const { idPembayaran } = req.params;
    try {
        await pembayaranModel.deletePembayaran(idPembayaran);
        res.json({
            success: true,
            message: 'Catatan finansial transaksi berhasil dihapus',
            data: idPembayaran
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus catatan transaksi pembayaran',
            error: error.message
        });
    }
}

module.exports = {
    getAllPembayaran,
    createNewPembayaran,
    updatePembayaran,
    deletePembayaran,
    requestSnapTokenMembership,
    handleMidtransWebhookMembership
};