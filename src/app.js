const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

// routes
const gorRoutes = require('./routes/gorRoutes');
const penggunaRoutes = require('./routes/penggunaRoutes');
const lapanganRoutes = require('./routes/lapanganRoutes');
const pemesananRoutes = require('./routes/pemesananRoutes');
const ulasanRoutes = require('./routes/ulasanRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const langgananMembershipRoutes = require('./routes/langgananMembershipRoutes');
const pembayaranMembershipRoutes = require('./routes/pembayaranMembershipRoutes');
const notifikasiRoutes = require('./routes/notifikasiRoutes');
const pembayaranPemesananRoutes = require('./routes/pembayaranPemesananRoutes');

app.use('/gor', gorRoutes);
app.use('/pengguna', penggunaRoutes);
app.use('/lapangan', lapanganRoutes);
app.use('/pemesanan', pemesananRoutes);
app.use('/ulasan', ulasanRoutes);
app.use('/membership', membershipRoutes);
app.use('/langganan-membership', langgananMembershipRoutes);
app.use('/pembayaran-membership', pembayaranMembershipRoutes);
app.use('/pembayaran-pemesanan', pembayaranPemesananRoutes);
app.use('/notifikasi', notifikasiRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});