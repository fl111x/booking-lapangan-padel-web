/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('pembayaran_pemesanan', (table) => {
    table.increments('id_pembayaran_pemesanan').primary();
    table.integer('id_pemesanan').unsigned().notNullable()
         .references('id_pemesanan').inTable('pemesanan')
         .onDelete('CASCADE');
    // Kolom Integrasi Midtrans
    table.string('order_id', 100).notNullable().unique();      // ID Invoice buatan kita
    table.string('transaction_id', 100).nullable();            // ID Transaksi dari Midtrans
    table.string('snap_token', 255).nullable();                // Token untuk memunculkan pop-up Snap
    table.string('payment_type', 50).nullable();                // Cth: gopay, qris, bca_va
    
    table.integer('jumlah_bayar').notNullable();
    // Status disesuaikan dengan lifecycle status Midtrans
    table.enum('status_pembayaran_pemesanan', ['pending', 'berhasil', 'gagal', 'expired']).defaultTo('pending');
    table.timestamp('tanggal_pembayaran').nullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('pembayaran_pemesanan');
};
