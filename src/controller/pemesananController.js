const pemesananModel = require('../model/pemesanan');

const getAllPemesanan = async (req, res) => {
    try {
        const [data] = await pemesananModel.getAllPemesanan();
        res.json({
            success: true,
            message: 'Berhasil mengambil seluruh data pemesanan',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data pemesanan',
            error: error.message
        });
    }
}

const createNewPemesanan = async (req, res) => {
    try {
        await pemesananModel.createNewPemesanan(req.body);
        res.status(201).json({
            success: true,
            message: 'Pemesanan baru berhasil dibuat',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal membuat pemesanan baru',
            error: error.message
        });
    }
}

const updatePemesanan = async (req, res) => {
    const { idPemesanan } = req.params;
    try {
        await pemesananModel.updatePemesanan(idPemesanan, req.body);
        res.json({
            success: true,
            message: 'Data pemesanan berhasil diperbarui',
            data: {
                id_pemesanan: idPemesanan,
                ...req.body
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui data pemesanan',
            error: error.message
        });
    }
}

const deletePemesanan = async (req, res) => {
    const { idPemesanan } = req.params;
    try {
        await pemesananModel.deletePemesanan(idPemesanan);
        res.json({
            success: true,
            message: 'Pemesanan berhasil dihapus',
            data: idPemesanan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus data pemesanan',
            error: error.message
        });
    }
}

module.exports = {
    getAllPemesanan,
    createNewPemesanan,
    updatePemesanan,
    deletePemesanan
};