const checkCreatePembayaranPemesanan = (req, res, next) => {
  const data = req.body;

  // 1. Validasi (Foreign Key)
  if (!data.id_pemesanan || isNaN(data.id_pemesanan)) {
    return res.status(400).json({ field: 'id_pemesanan', message: 'ID Pemesanan wajib diisi dan harus berupa angka' });
  }

  // 2. Validasi order_id (ID Invoice khusus Midtrans)
  if (!data.order_id) {
    return res.status(400).json({ field: 'order_id', message: 'Order ID invoice sewa wajib diisi' });
  } else if (typeof data.order_id !== 'string' || data.order_id.length > 100) {
    return res.status(400).json({ field: 'order_id', message: 'Order ID harus berupa teks maksimal 100 karakter' });
  }

  // 3. Validasi jumlah_bayar
  if (data.jumlah_bayar === undefined || data.jumlah_bayar === null) {
    return res.status(400).json({ field: 'jumlah_bayar', message: 'Jumlah nominal pembayaran wajib diisi' });
  } else if (isNaN(data.jumlah_bayar) || parseInt(data.jumlah_bayar) <= 0) {
    return res.status(400).json({ field: 'jumlah_bayar', message: 'Jumlah bayar harus berupa nominal angka positif' });
  }

  // 4. Validasi status_pembayaran_pemesanan
  const validStatus = ['pending', 'berhasil', 'gagal', 'expired'];
  if (data.status_pembayaran_pemesanan && !validStatus.includes(data.status_pembayaran_pemesanan)) {
    return res.status(400).json({ 
      field: 'status_pembayaran_pemesanan', 
      message: 'Status transaksi pembayaran harus berisi salah satu dari: pending, berhasil, gagal, atau expired' 
    });
  }

  next();
};

const validateIDPembayaranPemesanan = (req, res, next) => {
  const idPembayaranPemesanan = req.params.idPembayaranPemesanan;
  if (!idPembayaranPemesanan || isNaN(idPembayaranPemesanan) || parseInt(idPembayaranPemesanan) <= 0) {
    return res.status(400).json({ field: 'idPembayaranPemesanan', message: 'ID Pembayaran Pemesanan tidak valid' });
  }
  next();
};

module.exports = { checkCreatePembayaranPemesanan, validateIDPembayaranPemesanan };