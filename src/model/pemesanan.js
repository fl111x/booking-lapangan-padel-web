const dbPool = require('../config/db');

const getAllPemesanan = () => {
    const SQL = 'SELECT * FROM pemesanan';
    return dbPool.execute(SQL);
}

const createNewPemesanan = (data) => {
    const {id_user, id_lapangan, tanggal_pemesanan, jam_mulai, jam_selesai} = data;
    const SQL = `INSERT INTO pemesanan (id_user, id_lapangan, tanggal_pemesanan, jam_mulai, jam_selesai) 
                 VALUES (${id_user}, ${id_lapangan}, ${tanggal_pemesanan}, ${jam_mulai}, ${jam_selesai})`;
    return dbPool.execute(SQL);
}

const updatePemesanan = (idPemesanan, data) => {
    const {id_user, id_lapangan, tanggal_pemesanan, jam_mulai, jam_selesai} = data;
    const SQL = `UPDATE pemesanan
                 SET id_user = ${id_user}, id_lapangan = ${id_lapangan}, tanggal_pemesanan = ${tanggal_pemesanan}, 
                 jam_mulai = ${jam_mulai}, jam_selesai = ${jam_selesai}
                 WHERE id_pemesanan = ${idPemesanan}`;
    return dbPool.execute(SQL);
}

const deletePemesanan = (idPemesanan) => {
    const SQL = `DELETE FROM pemesanan WHERE id_pemesanan = ${idPemesanan}`;
    return dbPool.execute(SQL);
}

module.exports = {
    getAllPemesanan,
    createNewPemesanan,
    updatePemesanan,
    deletePemesanan
}