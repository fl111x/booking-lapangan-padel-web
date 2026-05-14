const checkCreatePemesanan = (req, res, next) => {
  const data = req.body;

  // Regex untuk format tanggal (YYYY-MM-DD)
  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  // Regex untuk format waktu (HH:MM atau HH:MM:SS)
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;

  // 1. Validasi ID Pengguna & ID Lapangan (Foreign Keys)
  if (!data.id_pengguna || isNaN(data.id_pengguna)) {
    res.status(400).json({ field: 'id_pengguna', message: 'ID Pengguna harus berupa angka' });
    return;
  }
  if (!data.id_lapangan || isNaN(data.id_lapangan)) {
    res.status(400).json({ field: 'id_lapangan', message: 'ID Lapangan harus berupa angka' });
    return;
  }

  // 2. Validasi Tanggal
  if (!data.tanggal) {
    res.status(400).json({ field: 'tanggal', message: 'Tanggal pemesanan wajib diisi' });
    return;
  } else if (!dateRegex.test(data.tanggal)) {
    res.status(400).json({ field: 'tanggal', message: 'Format tanggal tidak valid (Gunakan YYYY-MM-DD)' });
    return;
  }

  // 3. Validasi Jam Mulai
  if (!data.jam_mulai) {
    res.status(400).json({ field: 'jam_mulai', message: 'Jam mulai wajib diisi' });
    return;
  } else if (!timeRegex.test(data.jam_mulai)) {
    res.status(400).json({ field: 'jam_mulai', message: 'Format jam tidak valid (Gunakan HH:MM)' });
    return;
  }

  // 4. Validasi Durasi (Biasanya dalam hitungan jam)
  if (!data.durasi || isNaN(data.durasi) || data.durasi <= 0) {
    res.status(400).json({ field: 'durasi', message: 'Durasi harus berupa angka positif' });
    return;
  }

  // 5. Validasi Total Harga
  if (!data.total_harga || isNaN(data.total_harga) || data.total_harga < 0) {
    res.status(400).json({ field: 'total_harga', message: 'Total harga harus berupa angka' });
    return;
  }

  // 6. Validasi Status (Contoh: pending, lunas, batal)
  const validStatus = ['pending', 'lunas', 'batal'];
  if (!data.status) {
    res.status(400).json({ field: 'status', message: 'Status pemesanan wajib diisi' });
    return;
  } else if (!validStatus.includes(data.status)) {
    res.status(400).json({ field: 'status', message: 'Status harus berisi "pending", "lunas", atau "batal"' });
    return;
  }

  next();
};

const validateIDPemesanan = (req, res, next) => {
  const idPemesanan = req.params.idPemesanan;
  if (!idPemesanan || isNaN(idPemesanan) || parseInt(idPemesanan) <= 0) {
    res.status(400).json({ field: 'idPemesanan', message: 'ID Pemesanan tidak valid' });
    return;
  }

  next();
};

module.exports = { checkCreatePemesanan, validateIDPemesanan };