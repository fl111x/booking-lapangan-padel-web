const bcrypt = require('bcrypt');
const penggunaModel = require('../model/pengguna');

const getAllPenggunas = async (req, res) => {
    try {
        const [data] = await penggunaModel.getAllPenggunas();
        res.json({
            success: true,
            message: 'Berhasil mengambil seluruh data pengguna',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data pengguna',
            error: error.message
        });
    }
}

const createNewPengguna = async (req, res) => {
    try {
        const { password } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const userData = {
            ...req.body,
            password: hashedPassword
        };

        // Menggunakan userData yang sudah aman ter-hash
        await penggunaModel.createNewPengguna(userData);
        
        res.status(201).json({
            success: true,
            message: 'Pengguna baru berhasil didaftarkan',
            data: {
                nama: userData.nama,
                email: userData.email,
                role: userData.role || 'pelanggan'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mendaftarkan pengguna',
            error: error.message
        });
    }
}

const updatePengguna = async (req, res) => {
    const { idPengguna } = req.params;
    try {
        const { password } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const userData = {
            ...req.body,
            password: hashedPassword
        };

        // Menggunakan userData, bukan req.body plain text
        await penggunaModel.updatePengguna(idPengguna, userData);
        
        res.json({
            success: true,
            message: 'Data pengguna berhasil diperbarui',
            data: {
                id_pengguna: idPengguna,
                nama: userData.nama,
                email: userData.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui data pengguna',
            error: error.message
        });
    }
}

const deletePengguna = async (req, res) => {
    const { idPengguna } = req.params;
    try {
        await penggunaModel.deletePengguna(idPengguna);
        res.json({
            success: true,
            message: 'Akun pengguna berhasil dihapus',
            data: idPengguna
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus pengguna',
            error: error.message
        });
    }
};

module.exports = {
    getAllPenggunas,
    createNewPengguna,
    updatePengguna,
    deletePengguna
};