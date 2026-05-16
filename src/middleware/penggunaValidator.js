const checkCreatePengguna = (req, res, next) => {
  const data = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9+]{10,15}$/;

  // 1. Validasi Nama
  if (!data.nama) {
    return res.status(400).json({ field: 'nama', message: 'Nama pengguna wajib diisi' });
  } else if (typeof data.nama !== 'string' || data.nama.length < 3) {
    return res.status(400).json({ field: 'nama', message: 'Nama harus berupa teks minimal 3 karakter' });
  }

  // 2. Validasi Email
  if (!data.email) {
    return res.status(400).json({ field: 'email', message: 'Email wajib diisi' });
  } else if (!emailRegex.test(data.email)) {
    return res.status(400).json({ field: 'email', message: 'Format email tidak valid' });
  }

  // 3. Validasi Password
  if (!data.password) {
    return res.status(400).json({ field: 'password', message: 'Password wajib diisi' });
  } else if (data.password.length < 8) {
    return res.status(400).json({ field: 'password', message: 'Password minimal harus 8 karakter' });
  }

  // 4. Validasi Nomor Telepon
  if (!data.nomor_telepon) {
    return res.status(400).json({ field: 'nomor_telepon', message: 'Nomor telepon wajib diisi' });
  } else if (!phoneRegex.test(data.nomor_telepon)) {
    return res.status(400).json({ field: 'nomor_telepon', message: 'Format nomor telepon tidak valid (10-15 digit angka)' });
  }

  // 5. Validasi Role
  if (data.role && !['admin', 'pelanggan'].includes(data.role)) {
    return res.status(400).json({ field: 'role', message: 'Role harus berupa admin atau pelanggan' });
  }

  // 6. Validasi Foto Profil
  if (data.foto_profil && typeof data.foto_profil !== 'string') {
    return res.status(400).json({ field: 'foto_profil', message: 'Format foto_profil harus berupa string (URL/Path)' });
  }

  next();
};

const validateIDPengguna = (req, res, next) => {
  const idPengguna = req.params.idPengguna;
  if (!idPengguna || isNaN(idPengguna) || parseInt(idPengguna) <= 0) {
    return res.status(400).json({ field: 'idPengguna', message: 'ID Pengguna tidak valid' });
  }
  next();
};

module.exports = { checkCreatePengguna, validateIDPengguna };