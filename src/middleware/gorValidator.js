// Fungsi ini hanya bertugas mengecek data dan mengembalikan daftar error
const checkCreateGor = (req, res, next) => {
  const data = req.body;
  const errors = [];

  // Regex untuk format waktu (HH:MM atau HH:MM:SS)
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;

  // 1. Validasi nama_gor (VARCHAR)
  if (!data.nama_gor) {
    res.status(400).json({ field: 'nama_gor', message: 'Nama GOR wajib diisi' });
    return;
  } else if (typeof data.nama_gor !== 'string' || data.nama_gor.length < 3) {
    res.status(400).json({ field: 'nama_gor', message: 'Nama GOR harus berupa teks minimal 3 karakter' });
    return;
  }

  // 2. Validasi alamat (TEXT)
  if (!data.alamat) {
    res.status(400).json({ field: 'alamat', message: 'Alamat GOR wajib diisi' });
    return;
  } else if (typeof data.alamat !== 'string' || data.alamat.length < 10) {
    res.status(400).json({ field: 'alamat', message: 'Alamat GOR harus berupa teks dan minimal 10 karakter' });
    return;
  }

  // 3. Validasi jam_buka (TIME)
  if (!data.jam_buka) {
    res.status(400).json({ field: 'jam_buka', message: 'Jam buka wajib diisi' });
    return;
  } else if (!timeRegex.test(data.jam_buka)) {
    res.status(400).json({ field: 'jam_buka', message: 'Format jam_buka tidak valid (Gunakan format HH:MM atau HH:MM:SS)' });
    return;
  }

  // 4. Validasi jam_tutup (TIME)
  if (!data.jam_tutup) {
    res.status(400).json({ field: 'jam_tutup', message: 'Jam tutup wajib diisi' });
    return;
  } else if (!timeRegex.test(data.jam_tutup)) {
    res.status(400).json({ field: 'jam_tutup', message: 'Format jam_tutup tidak valid (Gunakan format HH:MM atau HH:MM:SS)' });
    return;
  }

  // 5. Validasi status (ENUM)
  if (!data.status) {
    res.status(400).json({ field: 'status', message: 'Status GOR wajib diisi' });
    return;
  } else if (data.status !== 'buka' && data.status !== 'tutup') {
    res.status(400).json({ field: 'status', message: 'Status hanya boleh berisi "buka" atau "tutup"' });
    return;
  }

  next();
};

validateIDGor = (req, res, next) => {
  const idGor = req.params.idGor;
  if (!idGor || isNaN(idGor) || parseInt(idGor) <= 0) {
    res.status(400).json({ field: 'idGor', message: 'ID GOR tidak valid' });
    return;
  }
  
  next();
};

module.exports = { checkCreateGor, validateIDGor };