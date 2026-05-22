const checkCreatePemesanan = (req, res, next) => {
  const data = req.body;
  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;

  // 1. Validasi Foreign Keys
  if (!data.id_lapangan || isNaN(data.id_lapangan)) {
    return res.status(400).json({ field: 'id_lapangan', message: 'ID Lapangan wajib diisi dan harus berupa angka' });
  }

  // 2. Validasi Tanggal
  if (!data.tanggal) {
    return res.status(400).json({ field: 'tanggal', message: 'Tanggal pemesanan wajib diisi' });
  } else if (!dateRegex.test(data.tanggal)) {
    return res.status(400).json({ field: 'tanggal', message: 'Format tanggal tidak valid (Gunakan YYYY-MM-DD)' });
  }

  // 3. Validasi Jam Mulai
  if (!data.jam_mulai) {
    return res.status(400).json({ field: 'jam_mulai', message: 'Jam mulai wajib diisi' });
  } else if (!timeRegex.test(data.jam_mulai)) {
    return res.status(400).json({ field: 'jam_mulai', message: 'Format jam tidak valid (Gunakan HH:MM)' });
  }

  // 4. Validasi Durasi
  if (!data.durasi || isNaN(data.durasi) || parseInt(data.durasi) <= 0) {
    return res.status(400).json({ field: 'durasi', message: 'Durasi sewa harus berupa angka positif' });
  }

  // 5. Validasi status_pemesanan
  const validStatus = ['pending', 'dibayar', 'dibatalkan', 'expired', 'selesai'];
  if (data.status_pemesanan && !validStatus.includes(data.status_pemesanan)) {
    return res.status(400).json({ field: 'status_pemesanan', message: 'Status harus berisi salah satu dari: pending, dibayar, dibatalkan, expired, selesai' });
  }

  next();
};

const validateIDPemesanan = (req, res, next) => {
  const idPemesanan = req.params.idPemesanan;
  if (!idPemesanan || isNaN(idPemesanan) || parseInt(idPemesanan) <= 0) {
    return res.status(400).json({ field: 'idPemesanan', message: 'ID Pemesanan tidak valid' });
  }

  next();
};

module.exports = { checkCreatePemesanan, validateIDPemesanan };