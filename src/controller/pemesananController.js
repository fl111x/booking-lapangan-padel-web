const pemesananModel = require('../model/pemesanan');

const getAllPemesanan =  async (req, res) => {
    try{
        const [data] = await pemesananModel.getAllPemesanan();
        res.json({
            success: true,
            message: 'get all pemesanan',
            data: data
        });
    }catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
}

const createNewPemesanan = async (req, res) => {
    try {
        await pemesananModel.createNewPemesanan(req.body);
        res.json({
            success: true,
            message: 'Pemesanan created successfully',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
}

const updatePemesanan = async (req, res) => {
    const {idPemesanan} = req.params;
    try {
        await pemesananModel.updatePemesanan(idPemesanan, req.body);
        res.json({
            success: true,
            message: 'Pemesanan updated successfully',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
}

const deletePemesanan = async (req, res) => {
    const {idPemesanan} = req.params;
    try{
        await pemesananModel.deletePemesanan(idPemesanan);
        res.json({
            success: true,
            message: 'Pemesanan deleted successfully',
            data: idPemesanan 
        });
    }catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
}

module.exports = {
    getAllPemesanan,
    createNewPemesanan,
    updatePemesanan,
    deletePemesanan
}