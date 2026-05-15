const checkCreateLapangan = (req, res, next) => {
  const data = req.body;

  // 1. Validasi id_gor
  if (!data.id_gor) {
    res.status(400).json({ field: 'id_gor', message: 'ID GOR wajib diisi' });
    return;
  } else if (isNaN(data.id_gor)) {
    res.status(400).json({ field: 'id_gor', message: 'ID GOR harus berupa angka' });
    return;
  }

  // 2. Validasi nama_lapangan
  if (!data.nama_lapangan) {
    res.status(400).json({ field: 'nama_lapangan', message: 'Nama lapangan wajib diisi' });
    return;
  } else if (typeof data.nama_lapangan !== 'string' || data.nama_lapangan.length < 3) {
    res.status(400).json({ field: 'nama_lapangan', message: 'Nama lapangan minimal 3 karakter' });
    return;
  }

  // 3. Validasi tipe (Misal: Indoor / Outdoor)
  const validTypes = ['Indoor', 'Outdoor'];
  if (!data.tipe) {
    res.status(400).json({ field: 'tipe', message: 'Tipe lapangan wajib diisi' });
    return;
  } else if (!validTypes.includes(data.tipe)) {
    res.status(400).json({ field: 'tipe', message: 'Tipe harus berupa "Indoor" atau "Outdoor"' });
    return;
  }

  // 4. Validasi harga_per_jam
  if (!data.harga_per_jam) {
    res.status(400).json({ field: 'harga_per_jam', message: 'Harga per jam wajib diisi' });
    return;
  } else if (isNaN(data.harga_per_jam) || data.harga_per_jam <= 0) {
    res.status(400).json({ field: 'harga_per_jam', message: 'Harga harus berupa angka positif' });
    return;
  }

  next();
};

validateIDLapangan = (req, res, next) => {
  const idLapangan = req.params.idLapangan;
  if (!idLapangan || isNaN(idLapangan) || parseInt(idLapangan) <= 0) {
    res.status(400).json({ field: 'idLapangan', message: 'ID Lapangan tidak valid' });
    return;
  }
  
  next();
};

module.exports = { checkCreateLapangan, validateIDLapangan };