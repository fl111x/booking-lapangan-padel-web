const dbPool = require('../config/db');

const getAllPemesanan = () => {
    const SQL = 'SELECT * FROM pemesanan';
    return dbPool.execute(SQL);
}

const createNewPemesanan = (data) => {
    const {id_pengguna, id_lapangan, tanggal, jam_mulai, durasi, total_harga, status} = data;
    const SQL = `INSERT INTO pemesanan (id_pengguna, id_lapangan, tanggal, jam_mulai, durasi, total_harga, status) 
                 VALUES ('${id_pengguna}', '${id_lapangan}', '${tanggal}', '${jam_mulai}', '${durasi}', '${total_harga}', '${status}')`;
    return dbPool.execute(SQL);
}

const updatePemesanan = (idPemesanan, data) => {
    const {id_pengguna, id_lapangan, tanggal, jam_mulai, durasi, total_harga, status} = data;
    const SQL = `UPDATE pemesanan
                 SET id_pengguna = ${id_pengguna}, id_lapangan = ${id_lapangan}, tanggal = ${tanggal}, 
                 jam_mulai = ${jam_mulai}, durasi = ${durasi}, total_harga = ${total_harga}, status = ${status}
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