const dbPool = require('../config/db');

const getAllPenggunas =  () => {
    const SQL = 'SELECT * FROM pengguna';
    return dbPool.execute(SQL);
}

const createNewPengguna = (data) => {
    const {nama, email, password, foto_profil} = data;
    const SQL = `INSERT INTO pengguna (nama, email, password, foto_profil) 
                 VALUES ('${nama}', '${email}', '${password}', '${foto_profil}')`;
    return dbPool.execute(SQL);
}

const updatePengguna = (idPengguna, data) => {
    const {nama, email, password, foto_profil} = data;
    const SQL = `UPDATE pengguna 
                 SET nama = '${nama}', email = '${email}', password = '${password}', foto_profil = '${foto_profil}' 
                 WHERE id_pengguna = ${idPengguna}`;
    return dbPool.execute(SQL);
}

const deletePengguna = (idPengguna) => {
    const SQL = `DELETE FROM pengguna WHERE id_pengguna = ${idPengguna}`;
    return dbPool.execute(SQL);
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