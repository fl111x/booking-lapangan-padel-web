const bcrypt = require('bcrypt'); // Disamakan menggunakan library bcrypt utama
const jwt = require('jsonwebtoken');
const penggunaModel = require('../model/pengguna');

// LOGIKA REGISTER AKUN PELANGGAN
const register = async (req, res) => {
    try {
        const { nama, email, password, nomor_telepon } = req.body;

        // 1. Cek apakah alamat email sudah pernah terdaftar di sistem
        const userExist = await penggunaModel.findPenggunaByEmail(email);
        if (userExist) {
            return res.status(400).json({
                success: false,
                message: 'Alamat email tersebut sudah terdaftar'
            });
        }

        // 2. Mengamankan password lewat teknik hashing
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. Masukkan data bersih ke dalam MySQL pengguna
        await penggunaModel.createNewPengguna({
            nama,
            email,
            password: hashedPassword,
            nomor_telepon,
            role: 'pelanggan',
            foto_profil: null
        });

        res.status(201).json({
            success: true,
            message: 'Selamat! Akun pelanggan baru berhasil didaftarkan'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal memproses pendaftaran akun',
            error: error.message
        });
    }
};

// LOGIKA LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Cari user berdasarkan email inputan
        const user = await penggunaModel.findPenggunaByEmail(email);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Gagal login! Alamat email tidak ditemukan'
            });
        }

        // 2. Komparasi kecocokan password enkripsi database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Gagal login! Password yang kamu masukkan salah'
            });
        }

        // 3. Generate token JWT dengan klausa ID id_pengguna
        const token = jwt.sign(
            { id_pengguna: user.id_pengguna, role: user.role },
            process.env.JWT_SECRET || 'KUNCI_RAHASIA_BACKEND',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
            message: 'Login sukses! Selamat datang kembali',
            token: token,
            user: {
                id_pengguna: user.id_pengguna,
                nama: user.nama,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan sistem saat memproses login',
            error: error.message
        });
    }
};

module.exports = { register, login };