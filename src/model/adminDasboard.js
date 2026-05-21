const dbPool = require('../config/db');

const getDashboardStats = async () => {
    // Siapkan kueri untuk menghitung rekapitulasi data GOR
    const queryPengguna = 'SELECT COUNT(id_pengguna) AS total_pelanggan FROM pengguna WHERE role = "pelanggan"';
    const queryLapangan = 'SELECT COUNT(id_lapangan) AS total_lapangan FROM lapangan';
    const queryMemberAktif = 'SELECT COUNT(id_langganan) AS total_member_aktif FROM langganan_membership WHERE status_langganan = "aktif"';
    
    // Hitung total pendapatan dari sewa lapangan (yang sudah dibayar/selesai)
    const queryPendapatanSewa = 'SELECT COUNT(id_pemesanan) AS total_pemesanan, IFNULL(SUM(total_harga), 0) AS total_uang_sewa FROM pemesanan WHERE status_pemesanan IN ("dibayar", "selesai")';
    
    // Hitung total pendapatan dari penjualan paket membership (yang berhasil)
    const queryPendapatanMembership = 'SELECT IFNULL(SUM(jumlah_bayar), 0) AS total_uang_member FROM pembayaran_membership WHERE status_pembayaran_membership = "berhasil"';

    // Eksekusi semua kueri secara paralel agar performa server tetap ngebut
    const [
        [[pengguna]], 
        [[lapangan]], 
        [[memberAktif]], 
        [[sewa]], 
        [[membership]]
    ] = await Promise.all([
        dbPool.execute(queryPengguna),
        dbPool.execute(queryLapangan),
        dbPool.execute(queryMemberAktif),
        dbPool.execute(queryPendapatanSewa),
        dbPool.execute(queryPendapatanMembership)
    ]);

    // Konversi hasil string dari MySQL menjadi angka (Number) dan jumlahkan total omzet
    const omzetSewa = parseInt(sewa.total_uang_sewa);
    const omzetMember = parseInt(membership.total_uang_member);

    return {
        total_pelanggan: pengguna.total_pelanggan,
        total_member_aktif: memberAktif.total_member_aktif,
        total_lapangan: lapangan.total_lapangan,
        total_transaksi_sewa: sewa.total_pemesanan,
        rincian_pendapatan: {
            pendapatan_sewa_lapangan: omzetSewa,
            pendapatan_paket_membership: omzetMember,
            total_omzet_keseluruhan: omzetSewa + omzetMember
        }
    };
};

module.exports = { getDashboardStats };