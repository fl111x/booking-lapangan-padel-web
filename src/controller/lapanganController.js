const lapanganModel = require('../model/lapangan');

const getAllLapangan = async (req, res) => {
    try {
        const [data] = await lapanganModel.getAllLapangan();
        res.json({
            success: true,
            message: 'Berhasil mengambil seluruh data lapangan',
            data: data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data lapangan',
            error: error.message
        });
    }
}

const createNewLapangan = async (req, res) => {
    try {
        await lapanganModel.createNewLapangan(req.body);
        res.status(201).json({
            success: true,
            message: 'Lapangan baru berhasil ditambahkan',
            data: req.body
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menambahkan lapangan baru',
            error: error.message
        });
    }
}

const updateLapangan = async (req, res) => {
    const { idLapangan } = req.params;
    try {
        await lapanganModel.updateLapangan(idLapangan, req.body);
        res.json({
            success: true,
            message: 'Data lapangan berhasil diperbarui',
            data: {
                id_lapangan: idLapangan,
                ...req.body
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui data lapangan',
            error: error.message
        });
    }
}

const deleteLapangan = async (req, res) => {
    const { idLapangan } = req.params;
    try {
        await lapanganModel.deleteLapangan(idLapangan);
        res.json({
            success: true,
            message: 'Data lapangan berhasil dihapus',
            data: idLapangan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus data lapangan',
            error: error.message
        });
    }
}

const cekKetersediaan = async (req, res) => {
    // Mengambil parameter dari Query String URL (contoh: ?id_lapangan=1&tanggal=2026-05-20)
    const { id_lapangan, tanggal } = req.query;

    if (!id_lapangan || !tanggal) {
        return res.status(400).json({ 
            success: false, 
            message: 'Parameter URL id_lapangan dan tanggal wajib disertakan' 
        });
    }

    try {
        const [bookings] = await lapanganModel.getJadwalTerpesan(id_lapangan, tanggal);
        
        // Mengolah data array menjadi daftar jam yang sudah dipakai agar frontend mudah memblokirnya
        let jamTerpakai = [];
        
        bookings.forEach(booking => {
            // Asumsi booking.jam_mulai dari MySQL bertipe string 'HH:MM:SS' (contoh: '14:00:00')
            const jamAwal = parseInt(booking.jam_mulai.split(':')[0]);
            
            // Lakukan perulangan untuk mengeblok jam sebanyak jumlah durasi (misal main 2 jam)
            for (let i = 0; i < booking.durasi; i++) {
                const blockedHour = `${String(jamAwal + i).padStart(2, '0')}:00`;
                jamTerpakai.push(blockedHour);
            }
        });

        res.json({
            success: true,
            message: `Berhasil mengecek ketersediaan jadwal untuk tanggal ${tanggal}`,
            data: {
                id_lapangan: parseInt(id_lapangan),
                tanggal: tanggal,
                jam_terpakai: jamTerpakai // Hasilnya cth: ["14:00", "15:00"]
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Gagal mengecek ketersediaan lapangan', 
            error: error.message 
        });
    }
};

module.exports = {
    getAllLapangan,
    createNewLapangan,
    updateLapangan,
    deleteLapangan,
    cekKetersediaan
};