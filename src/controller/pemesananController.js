const pemesananModel = require('../model/pemesanan');
const cekJadwal = require('../utils/cekJadwal');
const hitungDiskon = require('../utils/hitungDiskon');

const getAllPemesanan = async (req, res) => {
    try {
        const [data] = await pemesananModel.getAllPemesanan();
        res.json({
            success: true,
            message: 'Berhasil mengambil seluruh data pemesanan',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data pemesanan',
            error: error.message
        });
    }
}

const createNewPemesanan = async (req, res) => {
    // 1. Ambil id_pengguna dari Token Login (bukan dari ketikan Postman)
    const id_pengguna = req.user.id_pengguna; 
    
    // 2. Ambil data sisanya dari Postman
    const { id_lapangan, tanggal, jam_mulai, durasi } = req.body;
    
    try {
        // Cek apakah jadwal bentrok
        const isBentrok = await cekJadwal(id_lapangan, tanggal, jam_mulai, durasi);
        if (isBentrok) {
            return res.status(400).json({
                success: false,
                field: 'jam_mulai',
                message: 'Gor/Lapangan sudah dibooking pada jam tersebut. Silakan pilih waktu atau lapangan lain.'
            });
        }

        // Kalkulasi diskon (id_pengguna kini sudah pasti ada isinya dari token)
        const kalkulasiHarga = await hitungDiskon(id_pengguna, id_lapangan, durasi);

        // Satukan semua data sebelum dikirim ke MySQL
        const pemesananData = {
            id_pengguna: id_pengguna, // Memasukkan ID dari token ke data yang akan disimpan
            id_lapangan,
            tanggal,
            jam_mulai,
            durasi,
            potongan_diskon: kalkulasiHarga.potongan_diskon,
            total_harga: kalkulasiHarga.total_harga,
            status_pemesanan: 'pending'
        };

        // Kirim ke database
        await pemesananModel.createNewPemesanan(pemesananData);
        
        res.status(201).json({
            success: true,
            message: 'Pemesanan lapangan berhasil dipesan dan dikunci!',
            data: pemesananData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal memproses pemesanan lapangan baru',
            error: error.message
        });
    }
}

const updatePemesanan = async (req, res) => {
    const { idPemesanan } = req.params;
    try {
        await pemesananModel.updatePemesanan(idPemesanan, req.body);
        res.json({
            success: true,
            message: 'Data pemesanan berhasil diperbarui',
            data: {
                id_pemesanan: idPemesanan,
                ...req.body
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui data pemesanan',
            error: error.message
        });
    }
}

const deletePemesanan = async (req, res) => {
    const { idPemesanan } = req.params;
    try {
        await pemesananModel.deletePemesanan(idPemesanan);
        res.json({
            success: true,
            message: 'Pemesanan berhasil dihapus',
            data: idPemesanan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus data pemesanan',
            error: error.message
        });
    }
}

const getPemesananUser = async (req, res) => {
    const idPengguna = req.user.id_pengguna; // Diambil dari JWT, bukan dari URL
    
    try {
        const [data] = await pemesananModel.getPemesananByUserId(idPengguna);
        res.json({
            success: true,
            message: 'Berhasil mengambil riwayat pemesanan lapangan kamu',
            data: data
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil riwayat pemesanan', error: error.message });
    }
};

module.exports = {
    getAllPemesanan,
    createNewPemesanan,
    updatePemesanan,
    deletePemesanan,
    getPemesananUser
};