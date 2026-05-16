const checkCreateNotifikasi = (req, res, next) => {
  const data = req.body;

  // 1. Validasi id_pengguna (Foreign Key)
  if (!data.id_pengguna || isNaN(data.id_pengguna)) {
    return res.status(400).json({ field: 'id_pengguna', message: 'ID Pengguna wajib diisi dan harus berupa angka' });
  }

  // 2. Validasi judul
  if (!data.judul) {
    return res.status(400).json({ field: 'judul', message: 'Judul notifikasi wajib diisi' });
  } else if (typeof data.judul !== 'string' || data.judul.length < 3) {
    return res.status(400).json({ field: 'judul', message: 'Judul harus berupa teks minimal 3 karakter' });
  }

  // 3. Validasi pesan
  if (!data.pesan) {
    return res.status(400).json({ field: 'pesan', message: 'Isi pesan notifikasi wajib diisi' });
  } else if (typeof data.pesan !== 'string' || data.pesan.length < 5) {
    return res.status(400).json({ field: 'pesan', message: 'Isi pesan harus berupa teks minimal 5 karakter' });
  }

  // 4. Validasi is_read
  if (data.is_read !== undefined && typeof data.is_read !== 'boolean' && data.is_read !== 0 && data.is_read !== 1) {
    return res.status(400).json({ field: 'is_read', message: 'Format status is_read harus berupa boolean (true/false)' });
  }

  next();
};

const validateIDNotifikasi = (req, res, next) => {
  const idNotifikasi = req.params.idNotifikasi;
  if (!idNotifikasi || isNaN(idNotifikasi) || parseInt(idNotifikasi) <= 0) {
    return res.status(400).json({ field: 'idNotifikasi', message: 'ID Notifikasi tidak valid' });
  }
  next();
};

module.exports = { checkCreateNotifikasi, validateIDNotifikasi };