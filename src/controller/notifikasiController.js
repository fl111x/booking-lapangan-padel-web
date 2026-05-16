const notifikasiModel = require('../model/notifikasi');

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

const createNewNotifikasi = async (req, res) => {
    try {
        await notifikasiModel.createNewNotifikasi(req.body);
        res.status(201).json({
            success: true,
            message: 'Notifikasi baru berhasil dikirim/dicatat',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal memproses pengiriman notifikasi baru',
            error: error.message
        });
    }
}

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
    deleteNotifikasi
};