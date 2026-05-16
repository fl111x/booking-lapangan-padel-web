const dbPool = require('../config/db');

const getAllPembayaranPemesanan = () => {
    // Menggunakan JOIN agar admin bisa melihat nama pengguna dan nama lapangan yang disewa
    const SQL = `SELECT pp.id_pembayaran_pemesanan, pp.id_pemesanan, p.tanggal, p.jam_mulai,
                        usr.nama AS nama_pelanggan, lap.nama_lapangan, pp.order_id, 
                        pp.transaction_id, pp.snap_token, pp.payment_type, pp.jumlah_bayar, 
                        pp.status_pembayaran_pemesanan, pp.tanggal_pembayaran, pp.created_at
                 FROM pembayaran_pemesanan pp
                 JOIN pemesanan p ON pp.id_pemesanan = p.id_pemesanan
                 JOIN pengguna usr ON p.id_pengguna = usr.id_pengguna
                 JOIN lapangan lap ON p.id_lapangan = lap.id_lapangan`;
    return dbPool.execute(SQL);
}

const createNewPembayaranPemesanan = (data) => {
    const { id_pemesanan, order_id, snap_token, jumlah_bayar, status_pembayaran_pemesanan } = data;
    
    const SQL = `INSERT INTO pembayaran_pemesanan (id_pemesanan, order_id, snap_token, jumlah_bayar, status_pembayaran_pemesanan) 
                 VALUES (?, ?, ?, ?, ?)`;
                 
    return dbPool.execute(SQL, [id_pemesanan, order_id, snap_token || null, jumlah_bayar, status_pembayaran_pemesanan || 'pending']);
}

const updatePembayaranPemesanan = (idPembayaranPemesanan, data) => {
    const { transaction_id, payment_type, status_pembayaran_pemesanan, tanggal_pembayaran } = data;
    
    const SQL = `UPDATE pembayaran_pemesanan 
                 SET transaction_id = ?, payment_type = ?, status_pembayaran_pemesanan = ?, tanggal_pembayaran = ? 
                 WHERE id_pembayaran_pemesanan = ?`;
                 
    return dbPool.execute(SQL, [transaction_id || null, payment_type || null, status_pembayaran_pemesanan, tanggal_pembayaran || null, idPembayaranPemesanan]);
}

const deletePembayaranPemesanan = (idPembayaranPemesanan) => {
    const SQL = 'DELETE FROM pembayaran_pemesanan WHERE id_pembayaran_pemesanan = ?';
    return dbPool.execute(SQL, [idPembayaranPemesanan]);
}

module.exports = {
    getAllPembayaranPemesanan,
    createNewPembayaranPemesanan,
    updatePembayaranPemesanan,
    deletePembayaranPemesanan
};