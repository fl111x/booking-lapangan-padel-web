const dbPool = require('../config/db');

const getAllMemberships = () => {
    const SQL = 'SELECT id_membership, nama_membership, harga, diskon, durasi_hari FROM membership';
    return dbPool.execute(SQL);
}

const createNewMembership = (data) => {
    const { nama_membership, harga, diskon, durasi_hari } = data;
    
    const SQL = `INSERT INTO membership (nama_membership, harga, diskon, durasi_hari) 
                 VALUES (?, ?, ?, ?)`;
                 
    return dbPool.execute(SQL, [nama_membership, harga, diskon || 0, durasi_hari]);
}

const updateMembership = (idMembership, data) => {
    const { nama_membership, harga, diskon, durasi_hari } = data;
    
    const SQL = `UPDATE membership 
                 SET nama_membership = ?, harga = ?, diskon = ?, durasi_hari = ? 
                 WHERE id_membership = ?`;
                 
    return dbPool.execute(SQL, [nama_membership, harga, diskon || 0, durasi_hari, idMembership]);
}

const deleteMembership = (idMembership) => {
    const SQL = 'DELETE FROM membership WHERE id_membership = ?';
    return dbPool.execute(SQL, [idMembership]);
}

module.exports = {
    getAllMemberships,
    createNewMembership,
    updateMembership,
    deleteMembership
};