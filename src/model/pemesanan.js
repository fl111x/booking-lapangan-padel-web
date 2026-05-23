const dbPool = require('../config/db');

const getAllPemesanan = () => {
    // Kita gunakan JOIN agar nama pengguna dan nama lapangan ikut terbawa ke frontend
    const SQL = `SELECT p.id_pemesanan, p.id_pengguna, u.nama AS nama_pengguna, 
                        p.id_lapangan, l.nama_lapangan, p.tanggal, p.jam_mulai, 
                        p.durasi, p.potongan_diskon, p.total_harga, p.status_pemesanan, p.created_at
                 FROM pemesanan p
                 JOIN pengguna u ON p.id_pengguna = u.id_pengguna
                 JOIN lapangan l ON p.id_lapangan = l.id_lapangan
                 ORDER BY p.tanggal DESC, p.jam_mulai DESC`;
    return dbPool.execute(SQL);
}

const createNewPemesanan = (data) => {
    const { id_pengguna, id_lapangan, tanggal, jam_mulai, durasi, potongan_diskon, total_harga, status_pemesanan } = data;
    
    const SQL = `INSERT INTO pemesanan (id_pengguna, id_lapangan, tanggal, jam_mulai, durasi, potongan_diskon, total_harga, status_pemesanan) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                 
    return dbPool.execute(SQL, [
        id_pengguna,
        id_lapangan,
        tanggal,
        jam_mulai,
        durasi,
        potongan_diskon ?? 0,
        total_harga ?? 0,
        status_pemesanan ?? 'pending'
    ]);
}

const updatePemesanan = (idPemesanan, data) => {
    const { id_pengguna, id_lapangan, tanggal, jam_mulai, durasi, potongan_diskon, total_harga, status_pemesanan } = data;
    
    const SQL = `UPDATE pemesanan
                 SET id_pengguna = ?, id_lapangan = ?, tanggal = ?, jam_mulai = ?, durasi = ?, potongan_diskon = ?, total_harga = ?, status_pemesanan = ?
                 WHERE id_pemesanan = ?`;
                 
    return dbPool.execute(SQL, [
        id_pengguna,
        id_lapangan,
        tanggal,
        jam_mulai,
        durasi,
        potongan_diskon ?? 0,
        total_harga ?? 0,
        status_pemesanan ?? 'pending',
        idPemesanan
    ]);
}

const deletePemesanan = (idPemesanan) => {
    const SQL = 'DELETE FROM pemesanan WHERE id_pemesanan = ?';
    return dbPool.execute(SQL, [idPemesanan]);
}

const updateStatusPemesanan = (idPemesanan, statusPemesanan) => {
    const SQL = 'UPDATE pemesanan SET status_pemesanan = ? WHERE id_pemesanan = ?';
    return dbPool.execute(SQL, [statusPemesanan, idPemesanan]);
};

const getPemesananByUserId = (idPengguna) => {
    const SQL = `SELECT p.id_pemesanan, p.id_lapangan, l.nama_lapangan, p.tanggal, p.jam_mulai, 
                        p.durasi, p.potongan_diskon, p.total_harga, p.status_pemesanan, p.created_at
                 FROM pemesanan p
                 JOIN lapangan l ON p.id_lapangan = l.id_lapangan
                 WHERE p.id_pengguna = ? 
                 ORDER BY p.tanggal DESC, p.jam_mulai DESC`;
    return dbPool.execute(SQL, [idPengguna]);
};

const getLaporanPendapatanBulanan = () => {
    const SQL = `
        SELECT 
            g.id_gor,
            g.nama_gor,
            YEAR(p.tanggal) AS tahun,
            MONTH(p.tanggal) AS bulan,
            SUM(p.total_harga) AS total_pendapatan,
            COUNT(p.id_pemesanan) AS jumlah_pesanan
        FROM pemesanan p
        JOIN lapangan l ON p.id_lapangan = l.id_lapangan
        JOIN gor g ON l.id_gor = g.id_gor
        WHERE p.status_pemesanan IN ('dibayar', 'selesai')
        GROUP BY g.id_gor, YEAR(p.tanggal), MONTH(p.tanggal)
        ORDER BY tahun DESC, bulan DESC, g.nama_gor ASC
    `;
    return dbPool.execute(SQL);
};

module.exports = {
    getAllPemesanan,
    createNewPemesanan,
    updatePemesanan,
    deletePemesanan,
    updateStatusPemesanan,
    getPemesananByUserId,
    getLaporanPendapatanBulanan
};