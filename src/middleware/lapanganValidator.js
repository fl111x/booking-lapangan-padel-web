const checkCreateLapangan = (req, res, next) => {
  const data = req.body;

  // 1. Validasi id_gor
  if (!data.id_gor) {
    return res.status(400).json({ field: 'id_gor', message: 'ID GOR wajib diisi' });
  } else if (isNaN(data.id_gor)) {
    return res.status(400).json({ field: 'id_gor', message: 'ID GOR harus berupa angka' });
  }

  // 2. Validasi nama_lapangan
  if (!data.nama_lapangan) {
    return res.status(400).json({ field: 'nama_lapangan', message: 'Nama lapangan wajib diisi' });
  } else if (typeof data.nama_lapangan !== 'string' || data.nama_lapangan.length < 3) {
    return res.status(400).json({ field: 'nama_lapangan', message: 'Nama lapangan minimal 3 karakter' });
  }

  // 3. Validasi tipe (Indoor / Outdoor)
  const validTypes = ['Indoor', 'Outdoor'];
  if (!data.tipe) {
    return res.status(400).json({ field: 'tipe', message: 'Tipe lapangan wajib diisi' });
  } else if (!validTypes.includes(data.tipe)) {
    return res.status(400).json({ field: 'tipe', message: 'Tipe harus berupa "Indoor" atau "Outdoor"' });
  }

  // 4. Validasi harga_per_jam
  if (!data.harga_per_jam) {
    return res.status(400).json({ field: 'harga_per_jam', message: 'Harga per jam wajib diisi' });
  } else if (isNaN(data.harga_per_jam) || data.harga_per_jam <= 0) {
    return res.status(400).json({ field: 'harga_per_jam', message: 'Harga harus berupa angka positif' });
  }

  // 5. Validasi status_lapangan
  if (data.status_lapangan && !['tersedia', 'perbaikan'].includes(data.status_lapangan)) {
    return res.status(400).json({ field: 'status_lapangan', message: 'Status lapangan harus berisi "tersedia" atau "perbaikan"' });
  }

  // 6. Validasi foto_lapangan
  if (data.foto_lapangan && typeof data.foto_lapangan !== 'string') {
    return res.status(400).json({ field: 'foto_lapangan', message: 'Format foto_lapangan harus berupa string (URL/Path)' });
  }

  next();
};

const validateIDLapangan = (req, res, next) => {
  const idLapangan = req.params.idLapangan;
  if (!idLapangan || isNaN(idLapangan) || parseInt(idLapangan) <= 0) {
    return res.status(400).json({ field: 'idLapangan', message: 'ID Lapangan tidak valid' });
  }
  next();
};

module.exports = { checkCreateLapangan, validateIDLapangan };