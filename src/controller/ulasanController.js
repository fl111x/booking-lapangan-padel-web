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
    try {
        await ulasanModel.createNewUlasan(req.body);
        res.status(201).json({
            success: true,
            message: 'Ulasan dan rating berhasil dipublikasikan',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mempublikasikan ulasan baru',
            error: error.message
        });
    }
};

const updateUlasan = async (req, res) => {
    const { idUlasan } = req.params;
    try {
        await ulasanModel.updateUlasan(idUlasan, req.body);
        res.json({
            success: true,
            message: 'Ulasan berhasil diperbarui',
            data: {
                id_ulasan: idUlasan,
                ...req.body
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui ulasan',
            error: error.message
        });
    }
};

const deleteUlasan = async (req, res) => {
    const { idUlasan } = req.params;
    try {
        await ulasanModel.deleteUlasan(idUlasan);
        res.json({
            success: true,
            message: 'Ulasan berhasil dihapus dari sistem',
            data: idUlasan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus data ulasan',
            error: error.message
        });
    }
};

module.exports = {
    getAllUlasans,
    createNewUlasan,
    updateUlasan,
    deleteUlasan
};