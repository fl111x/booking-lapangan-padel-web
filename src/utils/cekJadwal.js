const dbPool = require('../config/db');

/**
 * Memeriksa apakah ada reservasi yang bertabrakan di waktu yang sama
 * @param {number} id_lapangan 
 * @param {string} tanggal - Format: YYYY-MM-DD
 * @param {string} jam_mulai - Format: HH:MM:SS atau HH:MM
 * @param {number} durasi - Hitungan Jam
 * @returns {Promise<boolean>} - True jika bentrok, False jika aman
 */
const cekJadwal = async (id_lapangan, tanggal, jam_mulai, durasi) => {
    const SQL = `
        SELECT id_pemesanan FROM pemesanan
        WHERE id_lapangan = ? 
          AND tanggal = ? 
          AND status_pemesanan IN ('pending', 'dibayar', 'selesai')
          AND ? < ADDTIME(jam_mulai, SEC_TO_TIME(durasi * 3600))
          AND ADDTIME(?, SEC_TO_TIME(? * 3600)) > jam_mulai
        LIMIT 1
    `;
    
    const [rows] = await dbPool.execute(SQL, [id_lapangan, tanggal, jam_mulai, jam_mulai, durasi]);
    
    return rows.length > 0;
};

module.exports = cekJadwal;