const dbPool = require('../config/db');

const getAllLapangan = () => {
    const SQL = 'SELECT id_lapangan, id_gor, nama_lapangan, tipe, harga_per_jam, status_lapangan, foto_lapangan FROM lapangan';
    return dbPool.execute(SQL);
}

const createNewLapangan = (data) => {
    const { id_gor, nama_lapangan, tipe, harga_per_jam, status_lapangan, foto_lapangan } = data;
    
    const SQL = `INSERT INTO lapangan (id_gor, nama_lapangan, tipe, harga_per_jam, status_lapangan, foto_lapangan) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
                 
    return dbPool.execute(SQL, [id_gor, nama_lapangan, tipe, harga_per_jam, status_lapangan || 'tersedia', foto_lapangan || null]);
}

const updateLapangan = (idLapangan, data) => {
    const { id_gor, nama_lapangan, tipe, harga_per_jam, status_lapangan, foto_lapangan } = data;
    
    const SQL = `UPDATE lapangan
                 SET id_gor = ?, nama_lapangan = ?, tipe = ?, harga_per_jam = ?, status_lapangan = ?, foto_lapangan = ?
                 WHERE id_lapangan = ?`;
                 
    return dbPool.execute(SQL, [id_gor, nama_lapangan, tipe, harga_per_jam, status_lapangan || 'tersedia', foto_lapangan || null, idLapangan]);
}

const deleteLapangan = (idLapangan) => {
    const SQL = 'DELETE FROM lapangan WHERE id_lapangan = ?';
    return dbPool.execute(SQL, [idLapangan]);
}

const getJadwalTerpesan = (idLapangan, tanggal) => {
    const SQL = `SELECT jam_mulai, durasi 
                 FROM pemesanan 
                 WHERE id_lapangan = ? 
                   AND tanggal = ? 
                   AND status_pemesanan IN ('pending', 'dibayar', 'selesai')`;
    return dbPool.execute(SQL, [idLapangan, tanggal]);
};

module.exports = {
    getAllLapangan,
    createNewLapangan,
    updateLapangan,
    deleteLapangan,
    getJadwalTerpesan
};