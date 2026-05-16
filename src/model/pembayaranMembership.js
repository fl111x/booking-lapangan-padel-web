const dbPool = require('../config/db');

const getAllPembayaran = () => {
    // Menggunakan JOIN agar admin bisa melacak siapa pengguna yang melakukan pembayaran ini
    const SQL = `SELECT pm.id_pembayaran, pm.id_langganan, p.nama AS nama_pengguna, p.email,
                        pm.order_id, pm.transaction_id, pm.snap_token, pm.payment_type, 
                        pm.jumlah_bayar, pm.status_pembayaran_membership, pm.tanggal_pembayaran, pm.created_at
                 FROM pembayaran_membership pm
                 JOIN langganan_membership lm ON pm.id_langganan = lm.id_langganan
                 JOIN pengguna p ON lm.id_pengguna = p.id_pengguna`;
    return dbPool.execute(SQL);
}

const createNewPembayaran = (data) => {
    const { id_langganan, order_id, snap_token, jumlah_bayar, status_pembayaran_membership } = data;
    
    const SQL = `INSERT INTO pembayaran_membership (id_langganan, order_id, snap_token, jumlah_bayar, status_pembayaran_membership) 
                 VALUES (?, ?, ?, ?, ?)`;
                 
    return dbPool.execute(SQL, [id_langganan, order_id, snap_token || null, jumlah_bayar, status_pembayaran_membership || 'pending']);
}

const updatePembayaran = (idPembayaran, data) => {
    const { transaction_id, payment_type, status_pembayaran_membership, tanggal_pembayaran } = data;
    
    const SQL = `UPDATE pembayaran_membership 
                 SET transaction_id = ?, payment_type = ?, status_pembayaran_membership = ?, tanggal_pembayaran = ? 
                 WHERE id_pembayaran = ?`;
                 
    return dbPool.execute(SQL, [transaction_id || null, payment_type || null, status_pembayaran_membership, tanggal_pembayaran || null, idPembayaran]);
}

const deletePembayaran = (idPembayaran) => {
    const SQL = 'DELETE FROM pembayaran_membership WHERE id_pembayaran = ?';
    return dbPool.execute(SQL, [idPembayaran]);
}

module.exports = {
    getAllPembayaran,
    createNewPembayaran,
    updatePembayaran,
    deletePembayaran
};