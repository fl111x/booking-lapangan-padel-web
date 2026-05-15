const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

// routes
const gorRoutes = require('./routes/gorRoutes');
const penggunaRoutes = require('./routes/penggunaRoutes');
const lapanganRoutes = require('./routes/lapanganRoutes');
const pemesananRoutes = require('./routes/pemesananRoutes');
const ulasanRoutes = require('./routes/ulasanRoutes');
const membershipRoutes = require('./routes/membershipRoutes');

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});


app.use('/gor', gorRoutes);
app.use('/pengguna', penggunaRoutes);
app.use('/lapangan', lapanganRoutes);
app.use('/pemesanan', pemesananRoutes);
app.use('/ulasan', ulasanRoutes);
app.use('/membership', membershipRoutes);

