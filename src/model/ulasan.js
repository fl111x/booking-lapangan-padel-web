const dbPool = require('../config/db');

const getAllUlasans =  () => {
    const SQL = 'SELECT * FROM ulasan';
    return dbPool.execute(SQL);
}

const createNewUlasan = (data) => {
    const {id_pengguna, id_gor, rating, komentar} = data;
    const SQL = `INSERT INTO ulasan (id_pengguna, id_gor, rating, komentar) 
                 VALUES (${id_pengguna}, ${id_gor}, ${rating}, '${komentar}')`;
    return dbPool.execute(SQL);
}

const updateUlasan = (idUlasan, data) => {
    const {id_pengguna, id_gor, rating, komentar} = data;
    const SQL = `UPDATE ulasan
                    SET id_pengguna = ${id_pengguna}, id_gor = ${id_gor}, rating = ${rating}, komentar = '${komentar}'
                    WHERE id_ulasan = ${idUlasan}`;
    return dbPool.execute(SQL);
}

const deleteUlasan = (idUlasan) => {
    const SQL = `DELETE FROM ulasan WHERE id_ulasan = ${idUlasan}`;
    return dbPool.execute(SQL);
}

module.exports = {
    getAllUlasans,
    createNewUlasan,
    updateUlasan,
    deleteUlasan
}