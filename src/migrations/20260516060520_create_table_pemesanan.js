/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('pemesanan', (table) => {
    table.increments('id_pemesanan').primary();
    table.integer('id_pengguna').unsigned().notNullable()
         .references('id_pengguna').inTable('pengguna')
         .onDelete('CASCADE');
    table.integer('id_lapangan').unsigned().notNullable()
         .references('id_lapangan').inTable('lapangan')
         .onDelete('CASCADE');
    table.date('tanggal').notNullable();
    table.time('jam_mulai').notNullable();
    table.integer('durasi').notNullable();
    table.integer('potongan_diskon').defaultTo(0);
    table.integer('total_harga').notNullable();
    table.enum('status_pemesanan', ['pending', 'dibayar', 'dibatalkan', 'expired', 'selesai']).defaultTo('pending');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('pemesanan');
};
