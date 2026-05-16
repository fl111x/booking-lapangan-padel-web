const ulasanModel = require('../model/ulasanModel');

const getAllUlasans =  async (req, res) => {
    try{
        const [data] = await ulasanModel.getAllUlasans();
        res.json({
            success: true,
            message: 'get all ulasan',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        })
    }
};

const createNewUlasan = async (req, res) => {
    try {
        await ulasanModel.createNewUlasan(req.body);
        res.json({
            message: 'create new ulasan',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
};

const updateUlasan = async (req, res) => {
    const {idUlasan} = req.params;
    try {
        await ulasanModel.updateUlasan(idUlasan, req.body);
        res.json({
            success: true,
            message: 'ulasan updated successfully',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
};

const deleteUlasan = async (req, res) => {
    const {idUlasan} = req.params;
    try {
        await ulasanModel.deleteUlasan(idUlasan);
        res.json({
            success: true,
            message: 'ulasan deleted successfully',
            data:  idUlasan 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
};

module.exports = {
    getAllUlasans,
    createNewUlasan,
    updateUlasan,
    deleteUlasan
}