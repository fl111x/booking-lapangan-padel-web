const cron = require('node-cron');
const dbPool = require('../config/db');
const notifikasiModel = require('../model/notifikasi');
const generateAiNotification = require('./generateAiNotification');

// Jadwal: Setiap Hari Minggu jam 08:00 Pagi (0 8 * * 0)
// Jika ingin tes setiap menit untuk melihat hasilnya sekarang, ganti ke: "* * * * *"
cron.schedule('0 9 * * 0', async () => {

    try {
        // Cari pelanggan yang TIDAK memesan lapangan dalam 7 hari terakhir
        const [inactiveUsers] = await dbPool.execute(`
            SELECT id_pengguna, nama 
            FROM pengguna 
            WHERE role = 'pelanggan' 
            AND id_pengguna NOT IN (
                SELECT DISTINCT id_pengguna 
                FROM pemesanan 
                WHERE tanggal >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            )
        `);

        if (inactiveUsers.length === 0) {
            return;
        }

        // Looping untuk mengirim notifikasi ke masing-masing orang
        for (const user of inactiveUsers) {
            try {
                // Suruh AI membuatkan sindiran
                const kontenAi = await generateAiNotification('pengingat_main', user.nama);
                
                // Simpan ke database kotak masuk mereka
                await notifikasiModel.createNewNotifikasi({
                    id_pengguna: user.id_pengguna,
                    judul: kontenAi.judul,
                    pesan: kontenAi.pesan
                });
                
                // JEDA 10 DETIK (Wajib! Agar server Google Gemini gratisan tidak kepanasan / Error 503)
                await new Promise(resolve => setTimeout(resolve, 10000));

            } catch (err) {
                console.error(`Gagal mengirim notif ke ${user.nama}:`, err.message);
            }
        }

    } catch (error) {
        console.error('Terjadi kesalahan pada sistem Cron Job AI:', error);
    }
});

module.exports = cron;