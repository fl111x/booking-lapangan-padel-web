const dbPool = require('../config/db');

const getAllGors = () => {
  const SQL = 'SELECT id_gor, nama_gor, alamat, jam_buka, jam_tutup, status_gor, foto_gor FROM gor';
  return dbPool.execute(SQL);
};

const createNewGor = (data) => {
  const { nama_gor, alamat, jam_buka, jam_tutup, status_gor, foto_gor } = data;
  
  const SQL = `INSERT INTO gor (nama_gor, alamat, jam_buka, jam_tutup, status_gor, foto_gor)
               VALUES (?, ?, ?, ?, ?, ?)`;

  return dbPool.execute(SQL, [nama_gor, alamat, jam_buka, jam_tutup, status_gor || 'buka', foto_gor || null]);
};

const updateGor = (idGor, data) => {
  const { nama_gor, alamat, jam_buka, jam_tutup, status_gor, foto_gor } = data;
  
  const SQL = `UPDATE gor 
               SET nama_gor = ?, alamat = ?, jam_buka = ?, jam_tutup = ?, status_gor = ?, foto_gor = ? 
               WHERE id_gor = ?`;
               
  return dbPool.execute(SQL, [nama_gor, alamat, jam_buka, jam_tutup, status_gor || 'buka', foto_gor || null, idGor]);
};

const deleteGor = (idGor) => {
  const SQL = 'DELETE FROM gor WHERE id_gor = ?';
  return dbPool.execute(SQL, [idGor]);
};

module.exports = {
  getAllGors,
  createNewGor,
  updateGor,
  deleteGor
};