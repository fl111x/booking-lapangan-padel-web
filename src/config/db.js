const mysql = require('mysql2/promise');

const dbPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_booking_padel',
});

module.exports = dbPool;