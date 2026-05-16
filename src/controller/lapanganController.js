const lapanganModel = require('../model/lapangan');

const getAllLapangan = async (req, res) => {
    try {
        const [data] = await lapanganModel.getAllLapangan();
        res.json({
            success: true,
            message: 'Berhasil mengambil seluruh data lapangan',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data lapangan',
            error: error.message
        });
    }
}

const createNewLapangan = async (req, res) => {
    try {
        await lapanganModel.createNewLapangan(req.body);
        res.status(201).json({
            success: true,
            message: 'Lapangan baru berhasil ditambahkan',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan lapangan baru',
            error: error.message
        });
    }
}

const updateLapangan = async (req, res) => {
    const { idLapangan } = req.params;
    try {
        await lapanganModel.updateLapangan(idLapangan, req.body);
        res.json({
            success: true,
            message: 'Data lapangan berhasil diperbarui',
            data: {
                id_lapangan: idLapangan,
                ...req.body
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui data lapangan',
            error: error.message
        });
    }
}

const deleteLapangan = async (req, res) => {
    const { idLapangan } = req.params;
    try {
        await lapanganModel.deleteLapangan(idLapangan);
        res.json({
            success: true,
            message: 'Data lapangan berhasil dihapus',
            data: idLapangan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus data lapangan',
            error: error.message
        });
    }
}

module.exports = {
    getAllLapangan,
    createNewLapangan,
    updateLapangan,
    deleteLapangan
};