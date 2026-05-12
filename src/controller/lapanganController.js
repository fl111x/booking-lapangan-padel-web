const lapanganModel = require('../model/lapangan');

const getAllLapangan = async (req, res) => {
    try {
        const [data] = await lapanganModel.getAllLapangan();
        res.json({
            success: true,
            message: 'get all lapangan',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
}

const createNewLapangan = async (req, res) => {
    try {
        await lapanganModel.createNewLapangan(req.body);
        res.json({
            success: true,
            message: 'Lapangan created successfully',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
}

const updateLapangan = async (req, res) => {
    const {idLapangan} = req.params;
    try {
        await lapanganModel.updateLapangan(idLapangan, req.body);
        res.json({
            success: true,
            message: 'Lapangan updated successfully',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
}

const deleteLapangan = async (req, res) => {
    const {idLapangan} = req.params;
    try {
        await lapanganModel.deleteLapangan(idLapangan);
        res.json({
            success: true,
            message: 'Lapangan deleted successfully',
            data: idLapangan 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
}

module.exports = {
    getAllLapangan,
    createNewLapangan,
    updateLapangan,
    deleteLapangan
}