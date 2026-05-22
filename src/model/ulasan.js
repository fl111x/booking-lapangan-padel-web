const dbPool = require('../config/db');

const getAllUlasans = () => {
    // Menggunakan JOIN agar visual frontend bisa menampilkan nama pengulas dan nama GOR fisik
    const SQL = `SELECT u.id_ulasan, u.id_pengguna, p.nama AS nama_pengulas, 
                        u.id_gor, g.nama_gor, u.rating, u.komentar, u.created_at
                 FROM ulasan u
                 JOIN pengguna p ON u.id_pengguna = p.id_pengguna
                 JOIN gor g ON u.id_gor = g.id_gor
                 ORDER BY u.created_at DESC`;
    return dbPool.execute(SQL);
}

const getUlasanById = async (idUlasan) => {
    const SQL = 'SELECT * FROM ulasan WHERE id_ulasan = ? LIMIT 1';
    const [rows] = await dbPool.execute(SQL, [idUlasan]);
    return rows[0];
}

const createNewUlasan = (data) => {
    const { id_pengguna, id_gor, rating, komentar } = data;
    
    const SQL = `INSERT INTO ulasan (id_pengguna, id_gor, rating, komentar) 
                 VALUES (?, ?, ?, ?)`;
    return dbPool.execute(SQL, [id_pengguna, id_gor, rating, komentar || null]);
}

const updateUlasan = (idUlasan, data) => {
    const { id_gor, rating, komentar } = data; // Hapus id_pengguna dari destructuring
    
    const SQL = `UPDATE ulasan
                 SET id_gor = ?, rating = ?, komentar = ?
                 WHERE id_ulasan = ?`;
    return dbPool.execute(SQL, [id_gor, rating, komentar || null, idUlasan]);
}

const deleteUlasan = (idUlasan) => {
    const SQL = 'DELETE FROM ulasan WHERE id_ulasan = ?';
    return dbPool.execute(SQL, [idUlasan]);
}

const getUlasanByGorId = (idGor) => {
    const SQL = `SELECT u.id_ulasan, p.nama AS nama_pengulas, p.foto_profil, 
                        u.rating, u.komentar, u.created_at
                 FROM ulasan u
                 JOIN pengguna p ON u.id_pengguna = p.id_pengguna
                 WHERE u.id_gor = ?
                 ORDER BY u.created_at DESC`;
    return dbPool.execute(SQL, [idGor]);
}

module.exports = {
    getAllUlasans,
    getUlasanById,
    createNewUlasan,
    updateUlasan,
    deleteUlasan,
    getUlasanByGorId
};