const pembayaranModel = require('../model/pembayaranMembership');

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
    deletePembayaran
};