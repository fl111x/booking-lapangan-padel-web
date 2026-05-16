const gorModel = require('../model/gor');

const getAllGors = async (req, res) => {
    try {
        const [data] = await gorModel.getAllGors();
        res.json({
            success: true,
            message: 'Berhasil mengambil seluruh data GOR',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data GOR',
            error: error.message
        });
    }
};

const createNewGor = async (req, res) => {
    try {
        await gorModel.createNewGor(req.body);
        res.status(201).json({
            success: true,
            message: 'GOR baru berhasil ditambahkan',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan GOR baru',
            error: error.message
        });
    }
};

const updateGor = async (req, res) => {
    const { idGor } = req.params;
    try {
        await gorModel.updateGor(idGor, req.body);
        res.json({
            success: true,
            message: 'Data GOR berhasil diperbarui',
            data: {
                id_gor: idGor,
                ...req.body
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui data GOR',
            error: error.message
        });
    }
};

const deleteGor = async (req, res) => {
    const { idGor } = req.params;
    try {
        await gorModel.deleteGor(idGor);
        res.json({
            success: true,
            message: 'Data GOR berhasil dihapus',
            data: idGor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus data GOR',
            error: error.message
        });
    }
};

module.exports = {
    getAllGors,
    createNewGor,
    updateGor,
    deleteGor
};