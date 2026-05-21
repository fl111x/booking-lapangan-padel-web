const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Menghasilkan konten notifikasi interaktif ala Duolingo menggunakan Gemini AI
 * @param {string} tipe - Kategori notifikasi ('pengingat_main', 'sukses_bayar', 'membership_aktif')
 * @param {string} namaUser - Nama pelanggan penerima notifikasi
 * @returns {Promise<object>} - Objek berisi properti judul dan pesan
 */
const generateAiNotification = async (tipe, namaUser) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        // Jika API Key belum dikonfigurasi, jalankan fitur fallback otomatis tanpa crash
        if (!apiKey) {
            return {
                judul: "Pemberitahuan Padoel 🎾",
                pesan: `Halo ${namaUser}, ada pembaruan info terbaru di akunmu.`
            };
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Kamu adalah sistem push notification otomatis untuk aplikasi booking lapangan olahraga padel bernama "Padoel". 
        Tugasmu adalah membuat judul dan isi pesan notifikasi yang sangat menarik, interaktif, penuh humor, kasual, dan sedikit menyindir/pasif-agresif secara ramah mirip dengan gaya khas Duolingo.
        Gunakan Bahasa Indonesia santai anak muda (gunakan kata seperti: kok, nih, lho, yuk). Jangan terlalu kaku.

        Variabel Konteks:
        - Nama Pelanggan: ${namaUser}
        - Jenis Aktivitas: ${tipe}

        Pilihan Instruksi Berdasarkan Jenis Aktivitas:
        1. jika tipe adalah 'pengingat_main': buat pesan sindiran halus karena sudah lama tidak mem-booking lapangan padel.
        2. jika tipe adalah 'sukses_bayar': buat ucapan selamat karena booking lapangan sukses, tapi tantang dia agar tidak telat datang latihan.
        3. jika tipe adalah 'membership_aktif': buat kalimat selamat karena sudah menjadi member raja/ratu padel, ingatkan hak diskonnya jangan dianggurin.

        Wajib mengembalikan respons MURNI langsung berupa objek JSON (tanpa bungkusan teks lain, tanpa markdown \`\`\`json) dengan format struktur berikut:
        {
          "judul": "Teks Judul Menarik Di Sini",
          "pesan": "Teks Isi Pesan Kreatif Di Sini"
        }`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();
        
        // Antisipasi jika AI bandel menyertakan format markdown backtick
        const cleanJsonString = responseText.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanJsonString);

    } catch (error) {
        console.error("Gagal memproses Gemini AI Notif:", error.message);
        return {
            judul: "Padoel kangen kamu nih! 🥺",
            pesan: `Halo ${namaUser}, yuk buka aplikasi dan pesan lapangan padelmu sebelum kehabisan slot harian!`
        };
    }
};

module.exports = generateAiNotification;