const checkCreatePembayaranMembership = (req, res, next) => {
  const data = req.body;

  // 1. Validasi id_langganan (Foreign Key)
  if (!data.id_langganan || isNaN(data.id_langganan)) {
    return res.status(400).json({ field: 'id_langganan', message: 'ID Langganan wajib diisi dan harus berupa angka' });
  }

  // 2. Validasi order_id
  if (!data.order_id) {
    return res.status(400).json({ field: 'order_id', message: 'Order ID invoice wajib diisi' });
  } else if (typeof data.order_id !== 'string' || data.order_id.length > 100) {
    return res.status(400).json({ field: 'order_id', message: 'Order ID harus berupa teks maksimal 100 karakter' });
  }

  // 3. Validasi jumlah_bayar
  if (data.jumlah_bayar === undefined || data.jumlah_bayar === null) {
    return res.status(400).json({ field: 'jumlah_bayar', message: 'Jumlah bayar wajib diisi' });
  } else if (isNaN(data.jumlah_bayar) || parseInt(data.jumlah_bayar) <= 0) {
    return res.status(400).json({ field: 'jumlah_bayar', message: 'Jumlah bayar harus berupa nominal angka positif' });
  }

  // 4. Validasi status_pembayaran_membership
  const validStatus = ['pending', 'berhasil', 'gagal', 'expired'];
  if (data.status_pembayaran_membership && !validStatus.includes(data.status_pembayaran_membership)) {
    return res.status(400).json({ 
      field: 'status_pembayaran_membership', 
      message: 'Status pembayaran harus berisi salah satu dari: pending, berhasil, gagal, atau expired' 
    });
  }

  next();
};

const validateIDPembayaranMembership = (req, res, next) => {
  const idPembayaran = req.params.idPembayaran;
  if (!idPembayaran || isNaN(idPembayaran) || parseInt(idPembayaran) <= 0) {
    return res.status(400).json({ field: 'idPembayaran', message: 'ID Pembayaran tidak valid' });
  }
  next();
};

module.exports = { checkCreatePembayaranMembership, validateIDPembayaranMembership };