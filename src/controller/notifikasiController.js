const notifikasiModel = require('../model/notifikasi');
const dbPool = require('../config/db');
const generateAiNotification = require('../utils/generateAiNotification');

const getAllNotifikasi = async (req, res) => {
    try {
        const [data] = await notifikasiModel.getAllNotifikasi();
        res.json({
            success: true,
            message: 'Berhasil mengambil seluruh daftar data notifikasi',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data notifikasi',
            error: error.message
        });
    }
}

const getNotifikasiUser = async (req, res) => {
    try {
        const idPengguna = req.user.id_pengguna; 
        const [data] = await notifikasiModel.getNotifikasiByUserId(idPengguna);
        
        // sistem otomatis mengubah status semua pesan menjadi terbaca di database!
        if (req.query.markRead === 'true') {
            await notifikasiModel.markAllAsReadByUser(idPengguna);
        }

        res.json({
            success: true,
            message: 'Berhasil mengambil kotak masuk notifikasi pribadi kamu',
            data: data
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil notifikasi', error: error.message });
    }
};

const createNewNotifikasi = async (req, res) => {
    const { id_pengguna, tipe } = req.body; // Menerima tipe seperti: 'pengingat_main', 'sukses_bayar', 'membership_aktif'

    try {
        // Ambil nama pengguna untuk disetor sebagai variabel sapaan AI
        const [userRaw] = await dbPool.execute('SELECT nama FROM pengguna WHERE id_pengguna = ? LIMIT 1', [id_pengguna]);
        if (userRaw.length === 0) {
            return res.status(404).json({ success: false, message: 'ID Pengguna tidak terdaftar di sistem' });
        }
        
        const namaUser = userRaw[0].nama;

        // Tembak helper utilitas untuk meminta teks kreatif dari Gemini AI
        const kontenAi = await generateAiNotification(tipe || 'pengingat_main', namaUser);

        // Simpan hasil teks kreasi AI langsung ke database MySQL
        await notifikasiModel.createNewNotifikasi({
            id_pengguna,
            judul: kontenAi.judul,
            pesan: kontenAi.pesan
        });

        res.status(201).json({
            success: true,
            message: 'Notifikasi AI berhasil diterbitkan!',
            data: { id_pengguna, ...kontenAi }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal memproses notifikasi AI baru', error: error.message });
    }
};

const updateNotifikasi = async (req, res) => {
    const { idNotifikasi } = req.params;
    try {
        await notifikasiModel.updateNotifikasi(idNotifikasi, req.body);
        res.json({
            success: true,
            message: 'Data/Status baca notifikasi berhasil diperbarui',
            data: {
                id_notifikasi: idNotifikasi,
                ...req.body
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui data notifikasi',
            error: error.message
        });
    }
}

const deleteNotifikasi = async (req, res) => {
    const { idNotifikasi } = req.params;
    try {
        await notifikasiModel.deleteNotifikasi(idNotifikasi);
        res.json({
            success: true,
            message: 'Notifikasi berhasil dihapus dari database',
            data: idNotifikasi
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus data notifikasi',
            error: error.message
        });
    }
}

module.exports = {
    getAllNotifikasi,
    createNewNotifikasi,
    updateNotifikasi,
    deleteNotifikasi,
    getNotifikasiUser
};