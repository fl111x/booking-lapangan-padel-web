const checkCreateMembership = (req, res, next) => {
  const data = req.body;

  // 1. Validasi nama_membership
  if (!data.nama_membership) {
    return res.status(400).json({ field: 'nama_membership', message: 'Nama paket membership wajib diisi' });
  } else if (typeof data.nama_membership !== 'string' || data.nama_membership.length < 3) {
    return res.status(400).json({ field: 'nama_membership', message: 'Nama paket harus berupa teks minimal 3 karakter' });
  }

  // 2. Validasi harga
  if (data.harga === undefined || data.harga === null) {
    return res.status(400).json({ field: 'harga', message: 'Harga paket wajib diisi' });
  } else if (isNaN(data.harga) || parseInt(data.harga) < 0) {
    return res.status(400).json({ field: 'harga', message: 'Harga harus berupa nominal angka positif' });
  }

  // 3. Validasi diskon
  if (data.diskon !== undefined && data.diskon !== null) {
    if (isNaN(data.diskon) || parseInt(data.diskon) < 0) {
      return res.status(400).json({ field: 'diskon', message: 'Potongan diskon harus berupa angka nominal positif' });
    }
  }

  // 4. Validasi durasi_hari (Sesuai skema database)
  if (!data.durasi_hari) {
    return res.status(400).json({ field: 'durasi_hari', message: 'Durasi aktif hari wajib diisi' });
  } else if (isNaN(data.durasi_hari) || parseInt(data.durasi_hari) <= 0) {
    return res.status(400).json({ field: 'durasi_hari', message: 'Durasi hari harus berupa angka bulat positif' });
  }

  next();
};

const validateIDMembership = (req, res, next) => {
  const idMembership = req.params.idMembership;
  if (!idMembership || isNaN(idMembership) || parseInt(idMembership) <= 0) {
    return res.status(400).json({ field: 'idMembership', message: 'ID Membership tidak valid' });
  }
  next();
};

module.exports = { checkCreateMembership, validateIDMembership };