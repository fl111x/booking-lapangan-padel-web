const checkCreateLangganan = (req, res, next) => {
  const data = req.body;

  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

  // 1. Validasi id_pengguna
  if (!data.id_pengguna || isNaN(data.id_pengguna)) {
    return res.status(400).json({ field: 'id_pengguna', message: 'ID Pengguna wajib diisi dan harus berupa angka' });
  }

  // 2. Validasi id_membership
  if (!data.id_membership || isNaN(data.id_membership)) {
    return res.status(400).json({ field: 'id_membership', message: 'ID Membership wajib diisi dan harus berupa angka' });
  }

  // 3. Validasi tanggal_mulai
  if (!data.tanggal_mulai) {
    return res.status(400).json({ field: 'tanggal_mulai', message: 'Tanggal mulai langganan wajib diisi' });
  } else if (!dateRegex.test(data.tanggal_mulai)) {
    return res.status(400).json({ field: 'tanggal_mulai', message: 'Format tanggal_mulai tidak valid (Gunakan YYYY-MM-DD)' });
  }

  // 4. Validasi tanggal_berakhir
  if (!data.tanggal_berakhir) {
    return res.status(400).json({ field: 'tanggal_berakhir', message: 'Tanggal berakhir langganan wajib diisi' });
  } else if (!dateRegex.test(data.tanggal_berakhir)) {
    return res.status(400).json({ field: 'tanggal_berakhir', message: 'Format tanggal_berakhir tidak valid (Gunakan YYYY-MM-DD)' });
  }

  // 5. Validasi status_langganan
  const validStatus = ['aktif', 'tidak aktif', 'pending'];
  if (data.status_langganan && !validStatus.includes(data.status_langganan)) {
    return res.status(400).json({ field: 'status_langganan', message: 'Status harus berisi salah satu dari: aktif, tidak aktif, atau pending' });
  }

  next();
};

const validateIDLangganan = (req, res, next) => {
  const idLangganan = req.params.idLangganan;
  if (!idLangganan || isNaN(idLangganan) || parseInt(idLangganan) <= 0) {
    return res.status(400).json({ field: 'idLangganan', message: 'ID Langganan tidak valid' });
  }
  next();
};

module.exports = { checkCreateLangganan, validateIDLangganan };