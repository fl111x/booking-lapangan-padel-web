const pembayaranPemesananModel = require('../model/pembayaranPemesanan');

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
    getAllPembayaranPemesanan,
    createNewPembayaranPemesanan,
    updatePembayaranPemesanan,
    deletePembayaranPemesanan
};