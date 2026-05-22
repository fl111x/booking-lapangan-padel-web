const ulasanModel = require('../model/ulasan');

const getAllUlasans = async (req, res) => {
    try {
        const [data] = await ulasanModel.getAllUlasans();
        res.json({
            success: true,
            message: 'Berhasil mengambil seluruh data ulasan GOR',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data ulasan',
            error: error.message
        });
    }
};

const createNewUlasan = async (req, res) => {
    const id_pengguna = req.user.id_pengguna; 
    const { id_gor, rating, komentar } = req.body;

    try {
        const ulasanData = { id_pengguna, id_gor, rating, komentar };
        await ulasanModel.createNewUlasan(ulasanData);
        
        res.status(201).json({
            success: true,
            message: 'Ulasan dan rating berhasil dipublikasikan! Terima kasih atas feedback kamu.',
            data: ulasanData
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mempublikasikan ulasan baru', error: error.message });
    }
};

const updateUlasan = async (req, res) => {
    const { idUlasan } = req.params;
    const idPenggunaJWT = req.user.id_pengguna; // ID dari token
    const rolePengguna = req.user.role;

    try {
        // 1. Cek apakah ulasan tersebut ada
        const ulasanLama = await ulasanModel.getUlasanById(idUlasan);
        if (!ulasanLama) {
            return res.status(404).json({ success: false, message: 'Ulasan tidak ditemukan' });
        }

        // 2. Proteksi Akses: Hanya pemilik asli atau admin yang boleh mengedit
        if (ulasanLama.id_pengguna !== idPenggunaJWT && rolePengguna !== 'admin') {
            return res.status(403).json({ success: false, message: 'Akses ditolak! Kamu hanya bisa mengedit ulasan milikmu sendiri.' });
        }

        const ulasanDataUpdate = {
            ...ulasanLama,
            ...req.body
        };

        await ulasanModel.updateUlasan(idUlasan, req.body);
        
        res.json({
            success: true,
            message: 'Ulasan berhasil diperbarui',
            data: { id_ulasan: idUlasan, ...req.body }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal memperbarui ulasan', error: error.message });
    }
};

const deleteUlasan = async (req, res) => {
    const { idUlasan } = req.params;
    const idPenggunaJWT = req.user.id_pengguna;
    const rolePengguna = req.user.role;

    try {
        // 1. Cek keberadaan ulasan
        const ulasanLama = await ulasanModel.getUlasanById(idUlasan);
        if (!ulasanLama) {
            return res.status(404).json({ success: false, message: 'Ulasan tidak ditemukan' });
        }

        // 2. Proteksi Akses: Hanya pemilik asli atau admin yang boleh menghapus
        if (ulasanLama.id_pengguna !== idPenggunaJWT && rolePengguna !== 'admin') {
            return res.status(403).json({ success: false, message: 'Akses ditolak! Kamu hanya bisa menghapus ulasan milikmu sendiri.' });
        }

        await ulasanModel.deleteUlasan(idUlasan);
        
        res.json({
            success: true,
            message: 'Ulasan berhasil dihapus dari sistem',
            data: idUlasan
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menghapus data ulasan', error: error.message });
    }
};

const getUlasanSpesifikGor = async (req, res) => {
    const { idGor } = req.params;
    try {
        const [data] = await ulasanModel.getUlasanByGorId(idGor);
        res.json({
            success: true,
            message: `Berhasil mengambil ulasan untuk GOR ID ${idGor}`,
            data: data
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil ulasan spesifik', error: error.message });
    }
};

module.exports = {
    getAllUlasans,
    createNewUlasan,
    updateUlasan,
    deleteUlasan,
    getUlasanSpesifikGor
};