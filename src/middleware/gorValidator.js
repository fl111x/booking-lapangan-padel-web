const checkCreateGor = (req, res, next) => {
  const data = req.body;

  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;

  // 1. Validasi nama_gor
  if (!data.nama_gor) {
    return res.status(400).json({ field: 'nama_gor', message: 'Nama GOR wajib diisi' });
  } else if (typeof data.nama_gor !== 'string' || data.nama_gor.length < 3) {
    return res.status(400).json({ field: 'nama_gor', message: 'Nama GOR harus berupa teks minimal 3 karakter' });
  }

  // 2. Validasi alamat
  if (!data.alamat) {
    return res.status(400).json({ field: 'alamat', message: 'Alamat GOR wajib diisi' });
  } else if (typeof data.alamat !== 'string' || data.alamat.length < 10) {
    return res.status(400).json({ field: 'alamat', message: 'Alamat GOR harus berupa teks dan minimal 10 karakter' });
  }

  // 3. Validasi jam_buka
  if (!data.jam_buka) {
    return res.status(400).json({ field: 'jam_buka', message: 'Jam buka wajib diisi' });
  } else if (!timeRegex.test(data.jam_buka)) {
    return res.status(400).json({ field: 'jam_buka', message: 'Format jam_buka tidak valid (Gunakan format HH:MM atau HH:MM:SS)' });
  }

  // 4. Validasi jam_tutup
  if (!data.jam_tutup) {
    return res.status(400).json({ field: 'jam_tutup', message: 'Jam tutup wajib diisi' });
  } else if (!timeRegex.test(data.jam_tutup)) {
    return res.status(400).json({ field: 'jam_tutup', message: 'Format jam_tutup tidak valid (Gunakan format HH:MM atau HH:MM:SS)' });
  }

  // 5. Validasi status_gor
  if (data.status_gor && !['buka', 'tutup'].includes(data.status_gor)) {
    return res.status(400).json({ field: 'status_gor', message: 'Status hanya boleh berisi "buka" atau "tutup"' });
  }

  // 6. Validasi foto_gor
  if (data.foto_gor && typeof data.foto_gor !== 'string') {
    return res.status(400).json({ field: 'foto_gor', message: 'Format foto_gor harus berupa string (URL/Path)' });
  }

  next();
};

const validateIDGor = (req, res, next) => {
  const idGor = req.params.idGor;
  if (!idGor || isNaN(idGor) || parseInt(idGor) <= 0) {
    return res.status(400).json({ field: 'idGor', message: 'ID GOR tidak valid' });
  }
  next();
};

module.exports = { checkCreateGor, validateIDGor };