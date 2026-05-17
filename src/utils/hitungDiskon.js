const dbPool = require('../config/db');

/**
 * Menghitung kalkulasi harga sewa dan potongan diskon berdasarkan status membership pengguna
 * @param {number} id_pengguna 
 * @param {number} id_lapangan 
 * @param {number} durasi 
 * @returns {Promise<object>} - Objek berisi potongan_diskon dan total_harga
 */
const hitungDiskon = async (id_pengguna, id_lapangan, durasi) => {
    // 1. Ambil tarif harga per jam asli milik lapangan
    const [lapangan] = await dbPool.execute(
        'SELECT harga_per_jam FROM lapangan WHERE id_lapangan = ? LIMIT 1', 
        [id_lapangan]
    );
    
    if (lapangan.length === 0) {
        throw new Error('Data lapangan tidak ditemukan di sistem.');
    }
    
    const hargaPerJam = lapangan[0].harga_per_jam;
    const hargaNormal = hargaPerJam * durasi;

    // 2. Cek apakah pengguna memiliki kontrak langganan membership yang AKTIF hari ini
    const [membership] = await dbPool.execute(`
        SELECT m.diskon 
        FROM langganan_membership lm
        JOIN membership m ON lm.id_membership = m.id_membership
        WHERE lm.id_pengguna = ? 
          AND lm.status_langganan = 'aktif'
          AND CURDATE() BETWEEN lm.tanggal_mulai AND lm.tanggal_berakhir
        LIMIT 1
    `, [id_pengguna]);

    let potonganDiskon = 0;
    
    // Jika user punya membership aktif, hitung potongan diskon
    if (membership.length > 0) {
        const diskonPersen = membership[0].diskon || 0;
        potonganDiskon = (diskonPersen / 100) * hargaNormal;
    }

    const totalHarga = hargaNormal - potonganDiskon;

    return {
        potongan_diskon: potonganDiskon,
        total_harga: totalHarga
    };
};

module.exports = hitungDiskon;