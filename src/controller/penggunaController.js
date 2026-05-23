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
        // 1. Ambil data user lama dari database
        const userLama = await penggunaModel.findPenggunaById(idPengguna);
        if (!userLama) {
            return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });
        }

        // 2. Cek apakah admin mengirimkan password baru
        let finalPassword = userLama.password;
        if (req.body.password) {
            const saltRounds = 10;
            finalPassword = await bcrypt.hash(req.body.password, saltRounds);
        }
        
        // 3. Gabungkan data lama dengan data baru
        const userData = {
            ...userLama,
            ...req.body,
            password: finalPassword
        };

        // 4. Update ke database
        await penggunaModel.updatePengguna(idPengguna, userData);
        
        res.json({
            success: true,
            message: 'Data pengguna berhasil diperbarui',
            data: {
                id_pengguna: idPengguna,
                nama: userData.nama,
                email: userData.email,
                role: userData.role
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

const getProfile = async (req, res) => {
    const idPengguna = req.user.id_pengguna;

    try {
        const profil = await penggunaModel.findPenggunaById(idPengguna);
        
        if (!profil) {
            return res.status(404).json({ success: false, message: 'Data profil tidak ditemukan' });
        }

        delete profil.password;

        res.json({
            success: true,
            message: 'Berhasil mengambil data profil kamu',
            data: profil
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil data profil', error: error.message });
    }
};

const updateProfile = async (req, res) => {
    // Mengambil ID secara rahasia dari hasil dekripsi Token JWT
    const idPengguna = req.user.id_pengguna;
    
    try {
        const userLama = await penggunaModel.findPenggunaById(idPengguna);

        let finalPassword = userLama.password;
        if (req.body.password) {
            const saltRounds = 10;
            finalPassword = await bcrypt.hash(req.body.password, saltRounds);
        }
        
        const userData = {
            ...userLama,
            ...req.body,
            password: finalPassword
        };

        // Jalankan pembaruan ke database MySQL menggunakan ID dari token
        await penggunaModel.updatePengguna(idPengguna, userData);
        
        res.json({
            success: true,
            message: 'Data profil kamu berhasil diperbarui!',
            data: {
                id_pengguna: idPengguna,
                nama: userData.nama,
                email: userData.email,
                nomor_telepon: userData.nomor_telepon
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal memperbarui profil', error: error.message });
    }
};

module.exports = {
    getAllPenggunas,
    createNewPengguna,
    updatePengguna,
    deletePengguna,
    getProfile,
    updateProfile
};