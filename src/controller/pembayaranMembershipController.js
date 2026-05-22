const pembayaranModel = require('../model/pembayaranMembership');
const langgananModel = require('../model/langgananMembership');
const notifikasiModel = require('../model/notifikasi');
const snap = require('../config/midtrans');
const dbPool = require('../config/db');
const { petakanStatusMidtrans } = require('../utils/midtransHelper');

const requestSnapTokenMembership = async (req, res) => {
    // id_membership (ID Paket)
    const { id_membership } = req.body;
    const id_pengguna = req.user.id_pengguna;

    try {
        // 1. Ambil data paket membership untuk menghitung harga
        const [paket] = await dbPool.execute('SELECT * FROM membership WHERE id_membership = ?', [id_membership]);
        if (paket.length === 0) return res.status(404).json({ success: false, message: 'Paket membership tidak ditemukan' });
        
        const dataPaket = paket[0];
        // Hitung total bayar setelah diskon
        const totalBayar = dataPaket.harga - ((dataPaket.diskon / 100) * dataPaket.harga);

        // 2. Buat "Pending Subscription"
        const [langganan] = await langgananModel.createNewLangganan({
            id_pengguna: id_pengguna,
            id_membership: id_membership,
            tanggal_mulai: null, 
            tanggal_berakhir: null, 
            status_langganan: 'pending'
        });
        const id_langganan = langganan.insertId;

        // 3. Buat Invoice "Pending Payment" di tabel pembayaran_membership
        const orderId = `INV-MBR-${id_langganan}-${Date.now()}`;
        await pembayaranModel.createNewPembayaran({
            id_langganan: id_langganan,
            order_id: orderId,
            jumlah_bayar: totalBayar,
            status_pembayaran_membership: 'pending'
        });

        // 4. Generate Snap Token Midtrans
        const transaction = await snap.createTransaction({
            transaction_details: { order_id: orderId, gross_amount: totalBayar },
            customer_details: { first_name: req.user.nama, email: req.user.email },
            item_details: [{ id: `MBR-${id_membership}`, price: totalBayar, quantity: 1, name: dataPaket.nama_membership }]
        });

        res.status(201).json({ success: true, snap_token: transaction.token, redirect_url: transaction.redirect_url });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal checkout paket membership', error: error.message });
    }
};

const handleMidtransWebhookMembership = async (req, res) => {
    try {
        const notification = req.body;
        const statusResponse = await snap.transaction.notification(notification);
        
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;
        const paymentType = statusResponse.payment_type;
        const transactionId = statusResponse.transaction_id;

        // Ambil data log lokal
        const [pembayaranLocal] = await pembayaranModel.getPembayaranByOrderId(orderId);
        if (pembayaranLocal.length === 0) {
            return res.status(404).json({ success: false, message: 'Order ID transaksi member tidak dikenali' });
        }

        const { id_langganan, jumlah_bayar } = pembayaranLocal[0];
        const { statusPembayaran, statusSistem } = petakanStatusMidtrans(transactionStatus, fraudStatus);

        // A. Update status di tabel pembayaran_membership
        await pembayaranModel.updateStatusPembayaranByOrderId(orderId, {
            transaction_id: transactionId,
            payment_type: paymentType,
            status_pembayaran_membership: statusPembayaran,
            tanggal_pembayaran: statusPembayaran === 'berhasil' ? new Date() : null
        });

        // B. Update status & aktivasi tanggal di tabel langganan_membership
        if (statusPembayaran === 'berhasil') {
            // Ambil durasi hari dari master paket
            const [paketData] = await dbPool.execute(`
                SELECT m.durasi_hari FROM langganan_membership lm
                JOIN membership m ON lm.id_membership = m.id_membership
                WHERE lm.id_langganan = ?`, [id_langganan]
            );

            const durasiHari = paketData[0].durasi_hari || 30;
            const tglMulai = new Date();
            const tglBerakhir = new Date();
            tglBerakhir.setDate(tglMulai.getDate() + durasiHari);

            // Update ke aktif dan kunci tanggalnya
            await dbPool.execute(
                `UPDATE langganan_membership 
                 SET status_langganan = ?, tanggal_mulai = ?, tanggal_berakhir = ? 
                 WHERE id_langganan = ?`,
                ['aktif', tglMulai, tglBerakhir, id_langganan]
            );

            // C. Kirim Notifikasi Otomatis
            const [kontrak] = await dbPool.execute('SELECT id_pengguna FROM langganan_membership WHERE id_langganan = ? LIMIT 1', [id_langganan]);
            if (kontrak.length > 0) {
                await notifikasiModel.createNewNotifikasi({
                    id_pengguna: kontrak[0].id_pengguna,
                    judul: 'Membership Kamu Sudah Aktif! 👑',
                    pesan: `Selamat! Pembayaran untuk paket membership dengan invoice ${orderId} senilai Rp ${jumlah_bayar.toLocaleString('id-ID')} telah sukses. Masa aktif langgananmu berlaku hingga ${tglBerakhir.toLocaleDateString('id-ID')}.`
                });
            }
        } else {
            // Jika status gagal/pending/batal, hanya update status langganan tanpa ubah tanggal
            const statusLangganan = statusSistem === 'batal' ? 'tidak aktif' : 'pending';
            await langgananModel.updateStatusLangganan(id_langganan, statusLangganan);
        }

        res.status(200).json({ success: true, message: 'Webhook transaksi member berhasil diproses' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal memproses webhook membership', error: error.message });
    }
};

const getAllPembayaran = async (req, res) => {
    try {
        const [data] = await pembayaranModel.getAllPembayaran();
        res.json({ success: true, message: 'Berhasil mengambil seluruh riwayat transaksi pembayaran membership', data: data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data transaksi pembayaran', error: error.message });
    }
}

const createNewPembayaran = async (req, res) => {
    try {
        await pembayaranModel.createNewPembayaran(req.body);
        res.status(201).json({ success: true, message: 'Invoice pembayaran membership berhasil dicatat', data: req.body });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mencatat transaksi pembayaran baru', error: error.message });
    }
}

const updatePembayaran = async (req, res) => {
    const { idPembayaran } = req.params;
    try {
        await pembayaranModel.updatePembayaran(idPembayaran, req.body);
        res.json({ success: true, message: 'Data rekonsiliasi pembayaran berhasil diperbarui', data: { id_pembayaran: idPembayaran, ...req.body } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal memperbarui data transaksi pembayaran', error: error.message });
    }
}

const deletePembayaran = async (req, res) => {
    const { idPembayaran } = req.params;
    try {
        await pembayaranModel.deletePembayaran(idPembayaran);
        res.json({ success: true, message: 'Catatan finansial transaksi berhasil dihapus', data: idPembayaran });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menghapus catatan transaksi pembayaran', error: error.message });
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