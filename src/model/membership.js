const dbPool = require('../config/db');

const getAllMemberships =  () => {
    const SQL = 'SELECT * FROM membership';
    return dbPool.execute(SQL);
}

const createNewMembership = (data) => {
    const {nama_membership, harga, diskon} = data;
    const SQL = `INSERT INTO membership (nama_membership, harga, diskon) 
                 VALUES ('${nama_membership}', ${harga}, ${diskon})`;
    return dbPool.execute(SQL);
}

const updateMembership = (idMembership, data) => {
    const {nama_membership, harga, diskon} = data;
    const SQL = `UPDATE membership 
                 SET nama_membership = '${nama_membership}', harga = ${harga}, diskon = ${diskon} 
                 WHERE idMembership = ${idMembership}`;
    return dbPool.execute(SQL);
}

const deleteMembership = (idMembership) => {
    const SQL = `DELETE FROM membership WHERE idMembership = ${idMembership}`;
    return dbPool.execute(SQL);
}

module.exports = {
    getAllMemberships,
    createNewMembership,
    updateMembership,
    deleteMembership
}