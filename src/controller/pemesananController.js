const pemesananModel = require('../model/pemesanan');
const cekJadwal = require('../utils/cekJadwal');
const hitungDiskon = require('../utils/hitungDiskon');
const dbPool = require('../config/db');

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
    // 1. Ambil id_pengguna dari Token Login
    const id_pengguna = req.user.id_pengguna; 
    
    // 2. Ambil data sisanya dari Postman/Frontend
    const { id_lapangan, tanggal, jam_mulai, durasi } = req.body;
    
    try {
        // CEK STATUS GOR DULU SEBELUM HAL LAIN
        const [gorStatusCheck] = await dbPool.execute(`
            SELECT g.status_gor, g.nama_gor 
            FROM lapangan l 
            JOIN gor g ON l.id_gor = g.id_gor 
            WHERE l.id_lapangan = ? LIMIT 1
        `, [id_lapangan]);

        if (gorStatusCheck.length > 0 && gorStatusCheck[0].status_gor === 'tutup') {
            return res.status(403).json({
                success: false,
                message: `Pemesanan ditolak. Cabang ${gorStatusCheck[0].nama_gor} sedang tutup sementara/libur.`
            });
        }

        // Cek apakah jadwal bentrok
        const isBentrok = await cekJadwal(id_lapangan, tanggal, jam_mulai, durasi);
        if (isBentrok) {
            return res.status(400).json({
                success: false,
                field: 'jam_mulai',
                message: 'Gor/Lapangan sudah dibooking pada jam tersebut. Silakan pilih waktu atau lapangan lain.'
            });
        }

        // Kalkulasi diskon
        const kalkulasiHarga = await hitungDiskon(id_pengguna, id_lapangan, durasi);

        // Satukan semua data sebelum dikirim ke MySQL
        const pemesananData = {
            id_pengguna: id_pengguna,
            id_lapangan,
            tanggal,
            jam_mulai,
            durasi,
            potongan_diskon: kalkulasiHarga.potongan_diskon,
            total_harga: kalkulasiHarga.total_harga,
            status_pemesanan: 'pending'
        };

        // Kirim ke database dan TANGKAP HASILNYA
        const [result] = await pemesananModel.createNewPemesanan(pemesananData);
        
        pemesananData.id_pemesanan = result.insertId;
        
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

const getLaporanBulanan = async (req, res) => {
    try {
        const [data] = await pemesananModel.getLaporanPendapatanBulanan(); 
        
        res.json({
            success: true,
            message: 'Berhasil mengambil laporan pendapatan bulanan per GOR',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil laporan pendapatan bulanan',
            error: error.message
        });
    }
};

const batalPemesananOlehUser = async (req, res) => {
    const { idPemesanan } = req.params;
    const id_pengguna = req.user.id_pengguna;

    try {
        // LANGKAH 1: Hapus log pembayaran di tabel anak terlebih dahulu (Mencegah Error Foreign Key Constraint)
        await dbPool.execute('DELETE FROM pembayaran_pemesanan WHERE id_pemesanan = ?', [idPemesanan]);

        // LANGKAH 2: Hapus data pesanan utama (Hanya jika statusnya masih pending dan milik user yang sedang login)
        const SQL = `DELETE FROM pemesanan WHERE id_pemesanan = ? AND id_pengguna = ? AND status_pemesanan = 'pending'`;
        const [result] = await dbPool.execute(SQL, [idPemesanan, id_pengguna]);

        if (result.affectedRows === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Pesanan tidak dapat dibatalkan atau sudah diproses.' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Pesanan berhasil dibatalkan dan slot jadwal dilepas kembali.' 
        });
    } catch (error) {
        console.error("Error Batal Pesanan:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Gagal memproses pembatalan pesanan', 
            error: error.message 
        });
    }
};

module.exports = {
    getAllPemesanan,
    createNewPemesanan,
    updatePemesanan,
    deletePemesanan,
    getPemesananUser,
    getLaporanBulanan,
    batalPemesananOlehUser
};