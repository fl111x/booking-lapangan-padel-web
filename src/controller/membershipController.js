const membershipModel = require('../model/membership');

const getAllMemberships = async (req, res) => {
    try {
        const [data] = await membershipModel.getAllMemberships();
        res.json({
            success: true,
            message: 'Berhasil mengambil seluruh daftar paket membership',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data paket membership',
            error: error.message
        });
    }
};

const createNewMembership = async (req, res) => {
    try {
        await membershipModel.createNewMembership(req.body);
        res.status(201).json({
            success: true,
            message: 'Paket membership baru berhasil ditambahkan',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan paket membership',
            error: error.message
        });
    }
};

const updateMembership = async (req, res) => {
    const { idMembership } = req.params;
    try {
        await membershipModel.updateMembership(idMembership, req.body);
        res.json({
            success: true,
            message: 'Data paket membership berhasil diperbarui',
            data: {
                id_membership: idMembership,
                ...req.body
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui data paket membership',
            error: error.message
        });
    }
};

const deleteMembership = async (req, res) => {
    const { idMembership } = req.params;
    try {
        await membershipModel.deleteMembership(idMembership);
        res.json({
            success: true,
            message: 'Paket membership berhasil dihapus',
            data: idMembership
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus paket membership',
            error: error.message
        });
    }
};

module.exports = {
    getAllMemberships,
    createNewMembership,
    updateMembership,
    deleteMembership
};