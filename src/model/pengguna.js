const dbPool = require('../config/db');

const getAllPenggunas = () => {
    const SQL = 'SELECT id_pengguna, nama, email, nomor_telepon, role, foto_profil, created_at, updated_at FROM pengguna';
    return dbPool.execute(SQL);
}

const createNewPengguna = (data) => {
    const { nama, email, password, nomor_telepon, role, foto_profil } = data;
    
    const SQL = `INSERT INTO pengguna (nama, email, password, nomor_telepon, role, foto_profil) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
                 
    return dbPool.execute(SQL, [nama, email, password, nomor_telepon, role || 'pelanggan', foto_profil || null]);
}

const updatePengguna = (idPengguna, data) => {
    const { nama, email, password, nomor_telepon, role, foto_profil } = data;
    
    const SQL = `UPDATE pengguna 
                 SET nama = ?, email = ?, password = ?, nomor_telepon = ?, role = ?, foto_profil = ? 
                 WHERE id_pengguna = ?`;
                 
    return dbPool.execute(SQL, [nama, email, password, nomor_telepon, role || 'pelanggan', foto_profil || null, idPengguna]);
}

const deletePengguna = (idPengguna) => {
    const SQL = 'DELETE FROM pengguna WHERE id_pengguna = ?';
    return dbPool.execute(SQL, [idPengguna]);
}


const findPenggunaByEmail = async (email) => {
    const SQL = 'SELECT * FROM pengguna WHERE email = ? LIMIT 1';
    const [rows] = await dbPool.execute(SQL, [email]);
    return rows[0];
};

const findPenggunaById = async (idPengguna) => {
    const SQL = 'SELECT id_pengguna, nama, email, nomor_telepon, role, foto_profil, created_at, updated_at FROM pengguna WHERE id_pengguna = ? LIMIT 1';
    const [rows] = await dbPool.execute(SQL, [idPengguna]);
    return rows[0];
};

module.exports = {
    getAllPenggunas,
    createNewPengguna,
    updatePengguna,
    deletePengguna,
    findPenggunaByEmail,
    findPenggunaById
}
