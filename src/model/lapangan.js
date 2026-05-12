const dbPool = require('../config/db');

const getAllLapangan = () => {
    const SQL = 'SELECT * FROM lapangan';
    return dbPool.execute(SQL);
}

const createNewLapangan = (data) => {
    const {id_gor, nama_lapangan, tipe, harga_per_jam} = data;
    const SQL = `INSERT INTO lapangan (id_gor,nama_lapangan, tipe, harga_per_jam) 
                 VALUES ('${id_gor}', '${nama_lapangan}', '${tipe}', ${harga_per_jam})`;
    return dbPool.execute(SQL);
}

const updateLapangan = (idLapangan, data) => {
    const {id_gor, nama_lapangan, tipe, harga_per_jam} = data;
    const SQL = `UPDATE lapangan
                    SET id_gor = '${id_gor}', nama_lapangan = '${nama_lapangan}', tipe = '${tipe}', harga_per_jam = ${harga_per_jam}
                    WHERE id_lapangan = ${idLapangan}`;
    return dbPool.execute(SQL);
}

const deleteLapangan = (idLapangan) => {
    const SQL = `DELETE FROM lapangan WHERE id_lapangan = ${idLapangan}`;
    return dbPool.execute(SQL);
}

module.exports = {
    getAllLapangan,
    createNewLapangan,
    updateLapangan,
    deleteLapangan
}
