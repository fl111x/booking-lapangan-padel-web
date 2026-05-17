const dbPool = require('../config/db');

const getAllLangganan = () => {
    // Menggunakan JOIN agar admin/sistem tahu nama user dan nama paket yang diambil
    const SQL = `SELECT lm.id_langganan, lm.id_pengguna, p.nama AS nama_pengguna, p.email,
                        lm.id_membership, m.nama_membership, lm.tanggal_mulai, lm.tanggal_berakhir, 
                        lm.status_langganan, lm.created_at
                 FROM langganan_membership lm
                 JOIN pengguna p ON lm.id_pengguna = p.id_pengguna
                 JOIN membership m ON lm.id_membership = m.id_membership`;
    return dbPool.execute(SQL);
}

const createNewLangganan = (data) => {
    const { id_pengguna, id_membership, tanggal_mulai, tanggal_berakhir, status_langganan } = data;
    
    const SQL = `INSERT INTO langganan_membership (id_pengguna, id_membership, tanggal_mulai, tanggal_berakhir, status_langganan) 
                 VALUES (?, ?, ?, ?, ?)`;
                 
    return dbPool.execute(SQL, [id_pengguna, id_membership, tanggal_mulai, tanggal_berakhir, status_langganan || 'pending']);
}

const updateLangganan = (idLangganan, data) => {
    const { id_pengguna, id_membership, tanggal_mulai, tanggal_berakhir, status_langganan } = data;
    
    const SQL = `UPDATE langganan_membership 
                 SET id_pengguna = ?, id_membership = ?, tanggal_mulai = ?, tanggal_berakhir = ?, status_langganan = ? 
                 WHERE id_langganan = ?`;
                 
    return dbPool.execute(SQL, [id_pengguna, id_membership, tanggal_mulai, tanggal_berakhir, status_langganan, idLangganan]);
}

const deleteLangganan = (idLangganan) => {
    const SQL = 'DELETE FROM langganan_membership WHERE id_langganan = ?';
    return dbPool.execute(SQL, [idLangganan]);
}

// Fungsi baru untuk mengaktifkan status kontrak langganan paket member (aktif / tidak aktif / pending)
const updateStatusLangganan = (idLangganan, statusLangganan) => {
    const SQL = 'UPDATE langganan_membership SET status_langganan = ? WHERE id_langganan = ?';
    return dbPool.execute(SQL, [statusLangganan, idLangganan]);
};

module.exports = {
    getAllLangganan,
    createNewLangganan,
    updateLangganan,
    deleteLangganan,
    updateStatusLangganan
};