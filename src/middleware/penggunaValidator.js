const checkCreatePengguna = (req, res, next) => {
  const data = req.body;

  // Regex untuk validasi format email standar
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 1. Validasi Nama
  if (!data.nama) {
    res.status(400).json({ field: 'nama', message: 'Nama pengguna wajib diisi' });
    return;
  } else if (typeof data.nama !== 'string' || data.nama.length < 3) {
    res.status(400).json({ field: 'nama', message: 'Nama harus berupa teks minimal 3 karakter' });
    return;
  }

  // 2. Validasi Email
  if (!data.email) {
    res.status(400).json({ field: 'email', message: 'Email wajib diisi' });
    return;
  } else if (!emailRegex.test(data.email)) {
    res.status(400).json({ field: 'email', message: 'Format email tidak valid' });
    return;
  }

  // 3. Validasi Password
  if (!data.password) {
    res.status(400).json({ field: 'password', message: 'Password wajib diisi' });
    return;
  } else if (data.password.length < 8) {
    res.status(400).json({ field: 'password', message: 'Password minimal harus 8 karakter' });
    return;
  }

  // 4. Validasi Foto Profil
  if (data.foto_profil && typeof data.foto_profil !== 'string') {
    res.status(400).json({ field: 'foto_profil', message: 'Format foto_profil harus berupa string (URL/Path)' });
    return;
  }

  next();
};

const validateIDPengguna = (req, res, next) => {
  const idPengguna = req.params.idPengguna;
  if (!idPengguna || isNaN(idPengguna) || parseInt(idPengguna) <= 0) {
    res.status(400).json({ field: 'idPengguna', message: 'ID Pengguna tidak valid' });
    return;
  }
  next();
};

module.exports = { checkCreatePengguna, validateIDPengguna };