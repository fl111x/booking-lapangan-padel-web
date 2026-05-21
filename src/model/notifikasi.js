const dbPool = require('../config/db');

const getAllNotifikasi = () => {
    // Menggunakan JOIN agar sistem tahu notifikasi ini ditujukan untuk siapa
    const SQL = `SELECT n.id_notifikasi, n.id_pengguna, p.nama AS nama_pengguna, p.email,
                        n.judul, n.pesan, n.is_read, n.created_at
                 FROM notifikasi n
                 JOIN pengguna p ON n.id_pengguna = p.id_pengguna
                 ORDER BY n.created_at DESC`;
    return dbPool.execute(SQL);
}

const createNewNotifikasi = (data) => {
    const { id_pengguna, judul, pesan } = data;
    
    const SQL = `INSERT INTO notifikasi (id_pengguna, judul, pesan) 
                 VALUES (?, ?, ?)`;
                 
    return dbPool.execute(SQL, [id_pengguna, judul, pesan]);
}

const updateNotifikasi = (idNotifikasi, data) => {
    const { judul, pesan, is_read } = data;
    
    const SQL = `UPDATE notifikasi 
                 SET judul = ?, pesan = ?, is_read = ? 
                 WHERE id_notifikasi = ?`;
                 
    return dbPool.execute(SQL, [judul, pesan, is_read !== undefined ? is_read : false, idNotifikasi]);
}

const deleteNotifikasi = (idNotifikasi) => {
    const SQL = 'DELETE FROM notifikasi WHERE id_notifikasi = ?';
    return dbPool.execute(SQL, [idNotifikasi]);
}

const getNotifikasiByUserId = (idPengguna) => {
    const SQL = `SELECT id_notifikasi, judul, pesan, is_read, created_at 
                 FROM notifikasi 
                 WHERE id_pengguna = ? 
                 ORDER BY created_at DESC`;
    return dbPool.execute(SQL, [idPengguna]);
};

module.exports = {
    getAllNotifikasi,
    createNewNotifikasi,
    updateNotifikasi,
    deleteNotifikasi,
    getNotifikasiByUserId
};