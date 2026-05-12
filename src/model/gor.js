const dbPool = require('../config/db');

const getAllGors = () => {
  const SQL = 'SELECT * FROM gor';
  
  return dbPool.execute(SQL);
};

const createNewGor = (data) => {
  const {nama_gor,alamat,jam_buka,jam_tutup,status} = data;
  const SQL = `INSERT INTO gor (nama_gor, alamat, jam_buka, jam_tutup, status)
               VALUES ('${nama_gor}', '${alamat}', '${jam_buka}', '${jam_tutup}', '${status}')`;

  return dbPool.execute(SQL);
};

const updateGor = (idGor, data) => {
  const {nama_gor,alamat,jam_buka,jam_tutup,status} = data;
  const SQL = `UPDATE gor 
        SET nama_gor = '${nama_gor}', alamat = '${alamat}', jam_buka = '${jam_buka}', jam_tutup = '${jam_tutup}', status = '${status}' 
        WHERE id_gor = ${idGor}`;
  return dbPool.execute(SQL);
}

const deleteGor = (idGor) => {
  const SQL = `DELETE FROM gor WHERE id_gor = ${idGor}`;
  return dbPool.execute(SQL);
}

module.exports = {
  getAllGors,
  createNewGor,
  updateGor,
  deleteGor
};