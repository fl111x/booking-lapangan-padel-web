const bcrypt = require('bcrypt');
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
        const { password } = req.body;
        
        // 1. Tentukan salt round (standarnya 10)
        const saltRounds = 10;
        
        // 2. Hash password-nya
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // 3. Ganti password plain text dengan yang sudah di-hash
        const userData = {
            ...req.body,
            password: hashedPassword
        };

        await penggunaModel.createNewPengguna(req.body);
        
        res.json({
            success: true,
            message: 'Pengguna created successfully',
            data: {
                nama: userData.nama,
                email: userData.email
            }
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
        const { password } = req.body;
        
        // 1. Tentukan salt round (standarnya 10)
        const saltRounds = 10;
        
        // 2. Hash password-nya
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // 3. Ganti password plain text dengan yang sudah di-hash
        const userData = {
            ...req.body,
            password: hashedPassword
        };

        await penggunaModel.updatePengguna(idPengguna, req.body);
        
        res.json({
            success: true,
            message: 'Pengguna updated successfully',
            data: {
                nama: userData.nama,
                email: userData.email
            }
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