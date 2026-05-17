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


const findPenggunaByEmail = (email, callback) => {
  const query = `
    SELECT * FROM pengguna
    WHERE email = ?
  `;

  db.query(query, [email], callback);
};


module.exports = {
    getAllPenggunas,
    createNewPengguna,
    updatePengguna,
    deletePengguna,
    findPenggunaByEmail
}
