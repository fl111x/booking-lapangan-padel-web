const { GoogleGenerativeAI } = require('@google/generative-ai');

const generateAiNotification = async (tipe, namaUser) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return {
                judul: "Pemberitahuan Padoel 🎾",
                pesan: `Halo ${namaUser}, ada pembaruan info terbaru di akunmu.`
            };
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash", 
            generationConfig: {
                responseMimeType: "application/json", 
            }
        });

        const prompt = `Kamu adalah asisten push notification otomatis untuk aplikasi booking lapangan olahraga padel bernama "Padoel". 
        Tugasmu adalah membuat judul dan isi pesan notifikasi yang sangat menarik, interaktif, lucu, kasual, dan sedikit menyindir secara ramah ala anak muda gaul (gunakan kata: kok, nih, lho, yuk).
        
        Konteks:
        - Nama Pelanggan: ${namaUser}
        - Jenis Aktivitas: ${tipe}

        Instruksi berdasarkan Jenis Aktivitas:
        1. Jika 'pengingat_main': buat sindiran halus bin lucu karena dia sudah lama tidak sewa lapangan padel.
        2. Jika 'sukses_bayar': ucapkan selamat karena sewa lapangan sukses, dan beri sedikit ancaman candaan agar dia tidak datang telat.
        3. Jika 'membership_aktif': sapa dia sebagai member VIP eksklusif, ingatkan jangan sampai diskon besarnya mubazir.

        KEMBALIKAN HANYA OBJEK JSON DENGAN STRUKTUR INI (Tanpa teks tambahan apapun):
        {
          "judul": "Teks Judul Di Sini",
          "pesan": "Teks Isi Pesan Di Sini"
        }`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        return JSON.parse(responseText);

    } catch (error) {
        console.error("Gagal memproses Gemini AI:", error.message);
        return {
            judul: "Padoel kangen kamu nih! 🥺",
            pesan: `Halo ${namaUser}, yuk buka aplikasi dan pesan lapangan padelmu sebelum kehabisan slot harian!`
        };
    }
};

module.exports = generateAiNotification;