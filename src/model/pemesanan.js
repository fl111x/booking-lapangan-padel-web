const dbPool = require('../config/db');

const getAllPemesanan = () => {
    const SQL = `SELECT id_pemesanan, id_pengguna, id_lapangan, tanggal, jam_mulai, 
                        durasi, potongan_diskon, total_harga, status_pemesanan, created_at, updated_at 
                 FROM pemesanan`;
    return dbPool.execute(SQL);
}

const createNewPemesanan = (data) => {
    const { id_pengguna, id_lapangan, tanggal, jam_mulai, durasi, potongan_diskon, total_harga, status_pemesanan } = data;
    
    const SQL = `INSERT INTO pemesanan (id_pengguna, id_lapangan, tanggal, jam_mulai, durasi, potongan_diskon, total_harga, status_pemesanan) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                 
    return dbPool.execute(SQL, [id_pengguna, id_lapangan, tanggal, jam_mulai, durasi, potongan_diskon || 0, total_harga, status_pemesanan || 'pending']);
}

const updatePemesanan = (idPemesanan, data) => {
    const { id_pengguna, id_lapangan, tanggal, jam_mulai, durasi, potongan_diskon, total_harga, status_pemesanan } = data;
    
    const SQL = `UPDATE pemesanan
                 SET id_pengguna = ?, id_lapangan = ?, tanggal = ?, jam_mulai = ?, durasi = ?, potongan_diskon = ?, total_harga = ?, status_pemesanan = ?
                 WHERE id_pemesanan = ?`;
                 
    return dbPool.execute(SQL, [id_pengguna, id_lapangan, tanggal, jam_mulai, durasi, potongan_diskon || 0, total_harga, status_pemesanan || 'pending', idPemesanan]);
}

const deletePemesanan = (idPemesanan) => {
    const SQL = 'DELETE FROM pemesanan WHERE id_pemesanan = ?';
    return dbPool.execute(SQL, [idPemesanan]);
}

const updateStatusPemesanan = (idPemesanan, statusPemesanan) => {
    const SQL = 'UPDATE pemesanan SET status_pemesanan = ? WHERE id_pemesanan = ?';
    return dbPool.execute(SQL, [statusPemesanan, idPemesanan]);
};

module.exports = {
    getAllPemesanan,
    createNewPemesanan,
    updatePemesanan,
    deletePemesanan,
    updateStatusPemesanan
};