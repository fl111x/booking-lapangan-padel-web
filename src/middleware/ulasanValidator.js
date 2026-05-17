const checkCreateUlasan = (req, res, next) => {
  const data = req.body;

  // 1. Validasi Foreign Key
  if (!data.id_pengguna || isNaN(data.id_pengguna)) {
    return res.status(400).json({ field: 'id_pengguna', message: 'ID Pengguna wajib diisi dan harus berupa angka' });
  }
  if (!data.id_gor || isNaN(data.id_gor)) {
    return res.status(400).json({ field: 'id_gor', message: 'ID GOR wajib diisi dan harus berupa angka' });
  }

  // 2. Validasi rating
  if (data.rating === undefined || data.rating === null) {
    return res.status(400).json({ field: 'rating', message: 'Nilai rating wajib diisi' });
  } else if (isNaN(data.rating) || parseInt(data.rating) < 1 || parseInt(data.rating) > 5) {
    return res.status(400).json({ field: 'rating', message: 'Rating tidak valid! Hanya diperbolehkan angka 1 sampai 5' });
  }

  // 3. Validasi komentar
  if (data.komentar && typeof data.komentar !== 'string') {
    return res.status(400).json({ field: 'komentar', message: 'Format komentar harus berupa teks string' });
  }

  next();
};

const validateIDUlasan = (req, res, next) => {
  const idUlasan = req.params.idUlasan;
  if (!idUlasan || isNaN(idUlasan) || parseInt(idUlasan) <= 0) {
    return res.status(400).json({ field: 'idUlasan', message: 'ID Ulasan tidak valid' });
  }
  next();
};

module.exports = { checkCreateUlasan, validateIDUlasan };