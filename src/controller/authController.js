const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
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
                role: user.role,
                foto_profil: user.foto_profil
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

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await penggunaModel.findPenggunaByEmail(email);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Email tidak terdaftar di sistem Padoel.' });
        }

        // Buat Token Khusus Reset Password (Hanya berlaku 15 Menit!)
        const resetToken = jwt.sign(
            { id_pengguna: user.id_pengguna }, 
            process.env.JWT_SECRET || 'KUNCI_RAHASIA_BACKEND', 
            { expiresIn: '15m' }
        );

        // Konfigurasi SMTP Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // URL ini nantinya akan mengarah ke halaman Frontend kamu (React/Vue/HTML)
        const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: `"Padoel Admin" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Permintaan Reset Password Akun Padoel',
            html: `
                <h3>Halo, ${user.nama}!</h3>
                <p>Kami menerima permintaan untuk mereset password akun GOR Padoel kamu.</p>
                <p>Silakan klik tautan di bawah ini untuk membuat password baru. Tautan ini hanya berlaku selama <b>15 Menit</b>.</p>
                <a href="${resetLink}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password Saya</a>
                <p>Jika kamu tidak pernah meminta reset password, abaikan saja email ini.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ 
            success: true, 
            message: 'Tautan reset password berhasil dikirim ke email kamu.' 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengirim email reset password', error: error.message });
    }
};

// B. Mengeksekusi Pembaruan Password Baru
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ success: false, message: 'Token dan password baru wajib disertakan.' });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({ success: false, message: 'Password baru minimal harus 8 karakter.' });
    }

    try {
        // Verifikasi apakah token valid dan belum expired (15 menit)
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'KUNCI_RAHASIA_BACKEND');
        
        // Ambil data profil utuh berdasarkan ID dari dalam token
        const user = await penggunaModel.findPenggunaById(decoded.id_pengguna);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
        }

        // Hash password baru
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Pertahankan data lama, cukup timpa password-nya saja
        const updatedData = { ...user, password: hashedPassword };

        // Eksekusi pembaruan ke MySQL
        await penggunaModel.updatePengguna(decoded.id_pengguna, updatedData);

        res.status(200).json({ 
            success: true, 
            message: 'Password berhasil diperbarui! Silakan login menggunakan password baru kamu.' 
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: 'Token reset password sudah kedaluwarsa. Silakan ajukan ulang.' });
        }
        res.status(500).json({ success: false, message: 'Gagal mereset password', error: error.message });
    }
};

module.exports = { register, login, forgotPassword, resetPassword };