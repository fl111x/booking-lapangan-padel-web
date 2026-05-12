const penggunaModel = require('../model/pengguna');

const getAllPenggunas =  async (req, res) => {
    try{
        const [data] = await penggunaModel.getAllPenggunas();
        res.json({
            success: true,
            message: 'get all pengguna',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
}

const createNewPengguna = async (req, res) => {
    try {
        await penggunaModel.createNewPengguna(req.body);
        res.json({
            success: true,
            message: 'Pengguna created successfully',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
}

const updatePengguna = async (req, res) => {
    const {idPengguna} = req.params;
    try {
        await penggunaModel.updatePengguna(idPengguna, req.body);
        res.json({
            success: true,
            message: 'Pengguna updated successfully',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
}

const deletePengguna = async (req, res) => {
    const {idPengguna} = req.params;
    try {
        await penggunaModel.deletePengguna(idPengguna);
        res.json({
            success: true,
            message: 'Pengguna deleted successfully',
            data: idPengguna 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
};

module.exports = {
    getAllPenggunas,
    createNewPengguna,
    updatePengguna,
    deletePengguna
}