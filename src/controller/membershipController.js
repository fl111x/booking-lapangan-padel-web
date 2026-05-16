const membershipModel = require('../models/membershipModel');

const getAllMemberships = async (req, res) => {
    try{
        const [data] = await membershipModel.getAllMemberships();
        res.json({
            success: true,
            message: 'get all membership',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        })
    }
};

const createNewMembership = async (req, res) => {
    try {
        await membershipModel.createNewMembership(req.body);
        res.json({
            message: 'create new membership',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
};

const updateMembership = async (req, res) => {
    const {idMembership} = req.params;
    try {
        await membershipModel.updateMembership(idMembership, req.body);
        res.json({
            success: true,
            message: 'membership updated successfully',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
};

const deleteMembership = async (req, res) => {
    const {idMembership} = req.params;
    try {
        await membershipModel.deleteMembership(idMembership);
        res.json({
            success: true,
            message: 'membership deleted successfully',
            data:  idMembership 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        });
    }
};

module.exports = {
    getAllMemberships,
    createNewMembership,
    updateMembership,
    deleteMembership
}