/**
 * Menerjemahkan status transaksi dari webhook Midtrans ke dalam status database lokal Padoel
 * @param {string} transactionStatus 
 * @param {string} fraudStatus 
 * @returns {object} - Berisi statusPembayaran dan statusSistem
 */
const petakanStatusMidtrans = (transactionStatus, fraudStatus) => {
    let statusPembayaran = 'pending';
    let statusSistem = 'pending'; // Bisa bermakna status_pemesanan atau status_langganan

    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
        if (fraudStatus === 'accept' || !fraudStatus) {
            statusPembayaran = 'berhasil';
            statusSistem = 'aktif_atau_dibayar';
        }
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny') {
        statusPembayaran = 'gagal';
        statusSistem = 'batal';
    } else if (transactionStatus === 'expire') {
        statusPembayaran = 'expired';
        statusSistem = 'batal';
    }

    return { statusPembayaran, statusSistem };
};

module.exports = { petakanStatusMidtrans };